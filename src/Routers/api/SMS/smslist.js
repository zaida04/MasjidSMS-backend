const { check, validationResult } = require('express-validator'); //validate input
var { Router } = require('express'); //grab the router class from express
var smslist = Router({ mergeParams: true }); //Router
var { opendb } = require('../functions/opendb.js');
var { apicatcher } = require('../functions/apierrorcatcher.js');
var { retrieveuser } = require('../functions/userfunctions/retrieveuser.js');
var twilio = require('twilio');
var accountSid = 'AC323dabc9bdd9c14b457a32a4d1e6313c'; // Your Account SID from www.twilio.com/console
var authToken = 'your_auth_token';  

smslist.post('/test', (req, res) => {
    var db = opendb("smslists");
    db.all(req.body.query, (err, row) => {
        res.json({
            "result": row
        })
    })
});

smslist.post('/:name/sendText', [check("message").notEmpty(), check('token').notEmpty()], (req, res, next) => {
    apicatcher(validationResult, req);
    var dbuser = opendb('user')
    retrieveuser(dbuser, undefined, req.body.token).then(u => {
        if (u.isMod()) {
            var db = opendb("smslist");
            db.get("SELECT DISTINCT * FROM smslist WHERE name=?", req.params.name, (err, row) => {
                if (!row) {
                    throw new Error("There are no SMSLists with that name");
                } else {
                    db.all("SELECT DISTINCT * FROM smsuserlist WHERE name=?", req.params.name, (err, row) => {
                        if (!row) {
                            throw new Error("There are no users within that SMSList");
                        } else {
                            row.forEach(e => {

                            })
                            //go through all people and send sms
                        }
                    })
                }
            })
        } else {
            throw new Error("You do not have the permissions to do this action");
        }
    }).catch(e => { next(e) })
});

smslist.post('/create', [check('tablename').notEmpty()], (req, res, next) => {
    apicatcher(validationResult, req);
    var db = opendb("smslists");
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS smslist(name TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS smsuserlist(id TEXT, list TEXT)");
        db.get("SELECT * FROM smslist WHERE name=?", req.body.tablename, (err, row) => {
            if (row) {
                next(new Error("That SMSList already exists!"));
            } else {
                db.run("INSERT INTO smslist(name) VALUES(?)", req.body.tablename, (err, row) => {
                    if (err) {
                        next(new Error("Error inserting into SMSList: " + err));
                    } else {
                        res.json({
                            "result": "List successfully created"
                        });

                    }
                });
            }
            db.close();
        })
    })

});
smslist.post('/:name/add', [check('id').notEmpty().isNumeric()], (req, res, next) => {
    apicatcher(validationResult, req);
    var dbusers = opendb("user");
    var db = opendb("smslists");
    db.serialize(() => {
        db.get('SELECT name FROM smslist WHERE name=?', req.params.name, (err, row) => {
            if (row) {
                retrieveuser(dbusers, req.body.id).then(u => {
                    db.get('SELECT * FROM smsuserlist WHERE id=?', req.body.id, (err, row) => {
                        if (row) {
                            return next(new Error("This user is already in the SMSList"));
                        } else {
                            db.run("INSERT INTO smsuserlist(id, list) VALUES(?, ?)", [req.body.id, req.params.name], (err, row) => {
                                if (err) {
                                    return next(new Error("There was an error inserting the user into the SMSList"));
                                } else {
                                    res.json({
                                        "result": "User has been added to the SMSList"
                                    });
                                }
                            })
                        }
                    })
                }).catch(e => { return next(e) })
            } else {
                return next(new Error("That SMSList does not exist"));
            }
        });
        //rework to have it check if table exists first, then check if user exists, then check if user is in the table, then put the user in

    })

})
module.exports = smslist;
