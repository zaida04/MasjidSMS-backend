const { check, validationResult } = require('express-validator'); //validate input
var { Router } = require('express'); //grab the router class from express
var smslist = Router({ mergeParams: true }); //Router
var { opendb } = require('../functions/opendb.js');
var { apicatcher } = require('../functions/apierrorcatcher.js');
var { retrieveuser } = require('../functions/userfunctions/retrieveuser.js');
const { numberreal, numbertrial, accountSidtrial, twilio_tokentrial, accountSidreal, twilio_tokenreal } = require('../../../twilio_credentials.json')
var client = require('twilio')(accountSidreal, twilio_tokenreal);

smslist.post('/test', (req, res) => {
    var db = opendb("smslists");
    db.all(req.body.query, (err, row) => {
        res.json({
            "result": row
        })
    })
});

/**
 * @api {post} /api/sms/smslist/create
 * @apiVersion 1.0.0
 * @apiName Create a SMSList
 * @apiGroup SMSlist
 *
 * @apiParam {string} tablename The name for the smslist to be created
 * @apiParam {string} token Used to authenticate the user sending has perms to do this
 *
 * @apiSuccess (Success 201) {json} response A response
 */
smslist.post('/create', [check('tablename').notEmpty(), check('token').notEmpty().isString()], (req, res, next) => {
    apicatcher(validationResult, req);
    var db = opendb("smslists");
    var dbuser = opendb("user");
    retrieveuser(dbuser, undefined, req.body.token).then(u => {
        if (!(u.isMod())) throw new Error("Sorry, but you do not have the permissions to do this")
    }).catch(e => { return next(e); })
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS smslist(name TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS smsuserlist(id TEXT, pnumber TEXT, list TEXT)");
        db.get("SELECT * FROM smslist WHERE name=?", req.body.tablename, (err, row) => {
            if (row) {
                next(new Error("That SMSList already exists!"));
            } else {
                db.run("INSERT INTO smslist(name) VALUES(?)", req.body.tablename, (err, row) => {
                    if (err) {
                        next(new Error("Error inserting into SMSList: " + err));
                    } else {
                        res.json({
                            "status": 201,
                            "result": "List successfully created"
                        });

                    }
                });
            }
            db.close();
        })
    })

});

/**
 * @api {post} /api/sms/smslist/:name/delete
 * @apiVersion 1.0.0
 * @apiName delete a SMSList
 * @apiGroup SMSlist
 *
 * @apiParam {string} name The name for the smslist to be deleted
 * @apiParam {string} token Used to authenticate the user sending has perms to do this
 *
 * @apiSuccess (Success 201) {json} response A response
 */
smslist.post('/:name/delete', [check('token').notEmpty().isString()], (req, res, next) => {
    apicatcher(validationResult, req);
    var db = opendb("smslists");
    var dbuser = opendb("user");
    retrieveuser(dbuser, undefined, req.body.token).then(u => {
        if (!(u.isMod())) next(new Error("Sorry, but you do not have the permissions to do this"))
    }).catch(e => { return next(e); })
    db.serialize(() => {
        db.get('SELECT * FROM smslist WHERE name=?', req.params.name, (err, row) => {
            if (!row) {
                next(new Error('That SMSList does not exist!'))
            } else {
                db.run('DELETE FROM smslist WHERE name=?', req.params.name);
                db.run('DELETE FROM smsuserlist WHERE list=?', req.params.name, (err, row) => {
                    res.json({
                        "status": 201,
                        "result": "Table successfully deleted"
                    })
                });
            }
        })
    })
});


/**
 * @api {post} /api/sms/smslist/:name/add
 * @apiVersion 1.0.0
 * @apiName Add a user to the SMSList
 * @apiGroup SMSlist
 *
 * @apiParam {string} name The SMSlist name to add
 * @apiParam {string} id Used to search up the person
 *
 * @apiSuccess (Success 201) {json} user The user that is created
 */
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
                            retrieveuser(dbusers, req.body.id).then(u => {
                                db.run("INSERT INTO smsuserlist(id, pnumber, list) VALUES(?, ?, ?)", [req.body.id, u.pnumber, req.params.name], (err, row) => {
                                    if (err) {
                                        return next(new Error("There was an error inserting the user into the SMSList"));
                                    } else {
                                        res.json({
                                            "status": 201,
                                            "result": "User has been added to the SMSList"
                                        });
                                    }
                                })
                            })
                        }
                    })
                }).catch(e => { return next(e) })
            } else {
                return next(new Error("That SMSList does not exist"));
            }
        });
    })
})

/**
 * @api {post} /api/sms/smslist/:name/sendText
 * @apiVersion 1.0.0
 * @apiName Send a text to a SMSList
 * @apiGroup SMSlist
 *
 * @apiParam {string} name The name of the SMSList to send the message to
 * @apiParam {string} message The body of the text to send
 * @apiParam {string} token Used to authenticate the user sending has perms to do this
 * 
 * @apiSuccess (Success 201) {json} response The response from the server
 */
smslist.post('/:name/sendText', [check("message").notEmpty(), check('token').notEmpty()], (req, res, next) => {
    apicatcher(validationResult, req);
    var dbuser = opendb('user');
    var db = opendb("smslists");
    retrieveuser(dbuser, undefined, req.body.token).then(u => {
        if (u.isMod()) {
            db.get("SELECT DISTINCT * FROM smslist WHERE name=?", req.params.name, (err, row) => {
                if (!row) {
                    next(new Error("There are no SMSLists with that name"));
                } else {
                    db.all("SELECT DISTINCT * FROM smsuserlist WHERE list=?", req.params.name, (err, row1) => {
                        if (!row1) {
                            next(new Error("There are no users within that SMSList"));
                        } else {
                            row1.forEach(r => {
                                console.log(r.pnumber)
                                client.messages
                                    .create({
                                        body: req.body.message,
                                        from: numberreal,
                                        to: '+1' + r.pnumber
                                    })
                                    .then(message => console.log(message))
                                    .catch(e => res.json({ "result": "There was an error sending to the SMSList. Please contact an Admin" }));
                            })
                            res.json({
                                "status": 201,
                                "result": "Successfully sent!"
                            })
                        }
                    })
                }
            })
        } else {
            throw new Error("You do not have the permissions to do this action");
        }
    }).catch(e => { next(e) })
});

module.exports = smslist;
