const { check, query, validationResult } = require('express-validator'); //validate input
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
        if (!(u.isMod())) next(new Error("Sorry, but you do not have the permissions to do this"))
    }).catch(e => { return next(e); })
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS smslist(name TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS smsuserlist(firstname TEXT, lastname TEXT, email TEXT, pnumber TEXT, list TEXT)");
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
 * @apiSuccess (Success 200) {json} response Successful deletion
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
                        "status": 200,
                        "result": "SMSList successfully deleted"
                    })
                });
            }
        })
    })
});

/**
 * @api {get} /api/sms/smslist/smslists
 * @apiVersion 1.0.0
 * @apiName Retrieve list of SMSLists
 * @apiGroup SMSlist
 *
 * @apiParam {string} token Used to authenticate user
 * 
 * @apiSuccess (Success 200) {json} response A response
 */
smslist.get('/smslists', [query('token').notEmpty().isString()], (req, res, next) => {
    apicatcher(validationResult, req);
    var db = opendb('smslists');
    var dbusers = opendb('user');
    retrieveuser(dbusers, undefined, req.query.token).then(u => {
        if (!(u.isMod())) next(new Error("You do not have permissions to do this"));
        db.all('SELECT * FROM smslist', (err, row) => {
            if (!row) {
                next(new Error("Sorry, there are no SMSLists currently"));
            } else {
                res.status(200).json({
                    "smslists": row
                })
            }
        })
    })
})

smslist.post('/:smslist/:pnumber/delete', [check('token').notEmpty().isString()], (req, res, next) => {
    apicatcher(validationResult, req);
    var db = opendb('smslists');
    var dbusers = opendb('user')
    retrieveuser(dbusers, undefined, req.body.token).then(u => {
        if (!(u.isMod())) next(new Error("You do not have permissions to do this"));
        else {
            db.get('SELECT * FROM smslist WHERE name=?', req.params.smslist, (err, row) => {
                if (!row) next(new Error("That SMSList dont exist"))
                else {
                    db.get('SELECT * FROM smsuserlist WHERE pnumber=? AND list=?', [req.params.pnumber, req.params.smslist], (err, row) => {
                        if (!row) {
                            next(new Error("That user is not in the SMSList"));
                        } else {
                            console.log(row);
                            db.run('DELETE FROM smsuserlist WHERE pnumber=? AND list=?', [req.params.pnumber, req.params.smslist], (err, row) => {
                                if (err) next(new Error("An error deleting user: " + err));
                                else {
                                    res.json({
                                        "status": 200,
                                        "description": "User deleted from smslist"
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

/**
 * @api {get} /api/sms/smslist/:smslist/users
 * @apiVersion 1.0.0
 * @apiName Retrieve list of users in SMSLists
 * @apiGroup SMSlist
 *
 * @apiParam {string} token Used to authenticate user
 *
 * @apiSuccess (Success 200) {json} response A response
 */
smslist.get('/:smslist/users', [query('token').notEmpty().isString()], (req, res, next) => {
    apicatcher(validationResult, req);
    var db = opendb('smslists');
    var dbusers = opendb('user');
    retrieveuser(dbusers, undefined, req.query.token).then(u => {
        if (!(u.isMod())) next(new Error("You do not have permissions to do this"));
        db.get('SELECT * FROM smslist WHERE name=?', req.params.smslist, (err, row) => {
            if (!row) {
                next(new Error("That SMSList does not exist"))
            } else {
                db.all('SELECT * FROM smsuserlist WHERE list=?', req.params.smslist, (err, row) => {
                    if (!row) {
                        next(new Error("Sorry, there are no users currently"));
                    } else {
                        res.status(200).json({
                            "smslist": req.params.smslist,
                            "users": row
                        })
                    }
                })
            }
        })
    })
})

/**
 * @api {get} /api/sms/smslist/embed/:smslist
 * @apiVersion 1.0.0
 * @apiName Endpoint to check if smslist exists for embed only
 * @apiGroup SMSlist
 *
 *
 * @apiSuccess (Success 200) {json} response A response
 */
smslist.get('/embed/:smslist', (req, res, next) => {
    console.log(req.params.smslist)
    var db = opendb('smslists');
    db.get('SELECT * FROM smslist WHERE name=?', req.params.smslist, (err, row) => {
        if (!row) {
            res.json({
                "smslist": req.params.smslist,
                "exists": "no"
            })
        } else {
            res.json({
                "smslist": req.params.smslist,
                "exists": "yes"
            })
        }
    })
})

/**
 * FOR WEBSITE ONLY
 * @api {post} /api/sms/smslist/:name/add
 * @apiVersion 1.0.0
 * @apiName Add a user to the SMSList
 * @apiGroup SMSlist
 *
 * @apiParam {string} name The SMSlist name to add
 * @apiParam {string} firstname Firstname of person
 * @apiParam {string} lastname lastname of person
 * @apiParam {string} email email of person
 * @apiParam {string} pnumber pnumber of person
 *
 * @apiSuccess (Success 201) {json} user The user that is created
 */
smslist.post('/:name/add', [check('firstname').notEmpty().isString(), check('lastname').notEmpty().isString(), check('email').notEmpty().isString(), check('pnumber').notEmpty().isString()], (req, res, next) => {
    apicatcher(validationResult, req);
    var dbusers = opendb("user");
    var db = opendb("smslists");
    db.serialize(() => {
        db.get('SELECT name FROM smslist WHERE name=?', req.params.name, (err, row) => {
            if (row) {
                db.get('SELECT * FROM smsuserlist WHERE pnumber=? AND list=?', [req.body.pnumber, req.params.name], (err, row) => {
                    if (row) {
                        return next(new Error("This user is already in the SMSList"));
                    } else {
                        db.run("INSERT INTO smsuserlist(firstname, lastname, email, pnumber, list) VALUES(?, ?, ?, ?, ?)", [req.body.firstname, req.body.lastname, req.body.email, req.body.pnumber, req.params.name], (err, row) => {
                            if (err) {
                                console.log(err);
                                return next(new Error("There was an error inserting the user into the SMSList"));
                            } else {
                                res.json({
                                    "status": 201,
                                    "result": "User has been added to the SMSList"
                                });
                            }
                        })
                    }
                })
            } else {
                return next(new Error("That SMSList does not exist"));
            }
        })
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
 * @apiSuccess (Success 200) {json} response The response from the server
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
                        if (row1.length < 0 || row1.length == 0 || !row1) {
                            next(new Error("There are no users within that SMSList"));
                        } else {
                            row1.forEach(r => {
                                client.messages
                                    .create({
                                        body: req.body.message,
                                        from: numberreal,
                                        to: '+1' + r.pnumber
                                    })
                                    //.then(message => console.log(message))
                                    .catch(e => res.json({ "result": "There was an error sending to the SMSList. Please contact an Admin" }));
                            })
                            res.json({
                                "status": 200,
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
