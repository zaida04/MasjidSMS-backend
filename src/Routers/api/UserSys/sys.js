const { check, validationResult } = require('express-validator'); //validate input
const UIDGenerator = require('uid-generator'); //Token generating
const uidgen = new UIDGenerator(); //instance of token generator
var { Router } = require('express'); //grab the router class from express
var { signup } = require('../functions/userfunctions/signup.js'); //Function for signing up
var { updateuser } = require('../functions/userfunctions/update.js'); //Function for updating
var { retrieveuser } = require('../functions/userfunctions/retrieveuser.js'); //retrieve the user from the db
var { opendb } = require('../functions/opendb.js');
var { createAdmin } = require('../functions/userfunctions/createAdmin.js');
var { apicatcher } = require('../functions/apierrorcatcher.js')
var { isPN } = require('../functions/isPN.js');
var { createMod } = require('../functions/userfunctions/createMod.js')
var sys = Router({ mergeParams: true }); //Router

sys.post('/test', (req, res) => {
    var db = opendb("user");
    db.all(req.body.query, (err, row) => {
        res.json({
            "result": row
        })
    })
});

/**
 * @api {post} /api/users/login
 * @apiVersion 1.0.0
 * @apiName login User
 * @apiGroup User
 *
 * @apiParam {string} email The users email
 * @apiParam {string} password The users password
 *
 * @apiSuccess (Success 201) {json} user The user that is created
 */
sys.post('/login', [check('email').notEmpty(), check('password').notEmpty()], (req, res, next) => {
    var db = opendb('user');
    apicatcher(validationResult, req);
    db.get('SELECT * from users where email=?', req.body.email, (err, row) => {
        if (!row) {
            next(new Error("There is no user with that email"));
        } else {
            if (row.password == req.body.password) {
                res.json({
                    "status": "success",
                    "user": {
                        "id": row.id,
                        "token": row.token,
                        "firstname": row.firstname,
                        "lastname": row.lastname
                    }
                })
            } else {
                next(new Error("The password provided is incorrect"));
            }
        }
    })
})

/**
 * @api {post} /api/users/signup
 * @apiVersion 1.0.0
 * @apiName Create User
 * @apiGroup User
 *
 * @apiParam {string} email The users email
 * @apiParam {string} firstname The users firstname
 * @apiParam {string} lastname The users lastname
 * @apiParam {string} pnumber The users phone number
 *
 * @apiSuccess (Success 201) {json} user The user that is created
 */

/**
 * @api {post} /api/users/createAdmin
 * @apiVersion 1.0.0
 * @apiName Create Admin
 * @apiGroup User
 *
 * @apiParam {string} email The users email
 * @apiParam {string} firstname The users firstname
 * @apiParam {string} lastname The users lastname
 * @apiParam {string} pnumber The users phone number
 * @apiParam {string} token The token of the executor of the request
 *
 * @apiSuccess (Success 201) {json} user The user that is created
 */
sys.post('/createAdmin', [check('email').notEmpty().isEmail().normalizeEmail(), check('firstname').notEmpty().isLength({ min: 3 }).trim().escape().isString(), check('lastname').notEmpty().isString().isLength({ min: 3 }).trim().escape(), check('pnumber').notEmpty().isString(), check('token').notEmpty().isString()],(req, res, next) => {
    apicatcher(validationResult, req);
    var db = opendb("user");
    retrieveuser(db, null, req.body.token).then(u => {
        if (u.isSuperAdmin()) {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //the ip of the user
            var tokgen = uidgen.generateSync(); //generate a token for the user
            var id = Math.floor(Math.random() * 1000000 + 1);
            createAdmin(db, ip, req.body.pnumber, req.body.email, { firstname: req.body.firstname, lastname: req.body.lastname }, tokgen, id).then(i => {
                res.status(201).json(i.toString())
            })
        } else {
            throw new Error("You do not have the credentials for this action");
        }
    }).catch(e => {next(e)})
});

/**
 * @api {post} /api/users/createMod
 * @apiVersion 1.0.0
 * @apiName Create Mod
 * @apiGroup User
 *
 * @apiParam {string} email The users email
 * @apiParam {string} firstname The users firstname
 * @apiParam {string} lastname The users lastname
 * @apiParam {string} pnumber The users phone number
 * @apiParam {string} token The token of the executor of the request
 *
 * @apiSuccess (Success 201) {json} user The user that is created
 */
sys.post('/createMod', [check('email').notEmpty().isEmail().normalizeEmail(), check('firstname').notEmpty().isLength({ min: 3 }).trim().escape().isString(), check('lastname').notEmpty().isString().isLength({ min: 3 }).trim().escape(), check('pnumber').notEmpty().isString(), check('token').notEmpty().isString()], (req, res, next) => {
    var db = opendb("user");
    retrieveuser(db, null, req.body.token).then(u => {
        if (u.isAdmin()) {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //the ip of the user
            var tokgen = uidgen.generateSync(); //generate a token for the user
            var id = Math.floor(Math.random() * 1000000 + 1);
            createMod(db, ip, req.body.pnumber, req.body.email, { firstname: req.body.firstname, lastname: req.body.lastname }, tokgen, id).then(i => {
                res.status(201).json(i.toString())
            })
        } else {
            throw new Error("You do not have the credentials for this action");
        }
    }).catch(e => { next(e) })
})

/**
 * @api {get} /api/users/:id
 * @apiVersion 1.0.0
 * @apiName Retrieve User
 * @apiGroup User
 *
 * @apiParam {int} id The users ID to retrieve
 * @apiParam {string} token The token of the executor of the request
 *
 * @apiSuccess (Success 201) {User} user The user that is retrieved
 */
sys.get('/:id', check('token').notEmpty(), (req, res, next) => {
    apicatcher(validationResult, req);
    var db = opendb("user");
    retrieveuser(db, req.params.id).then(u => {
        if (u.token !== req.body.token) throw new Error("Credentials Invalid")
        res.status(200).json(u.toString())
    }).catch(e => {
        console.error(e);
        next(e);
    })
    db.close();
})

/**
 * @api {post} /api/users/:id/update
 * @apiVersion 1.0.0
 * @apiName Update User
 * @apiGroup User
 *
 * @apiParam {string} email The users email
 * @apiParam {string} firstname The users firstname
 * @apiParam {int} id The users ID
 * @apiParam {string} lastname The users lastname
 * @apiParam {string} pnumber The users phone number
 * @apiParam {string} token The token of the executor of the request
 *
 * @apiSuccess (Success 201) {json} user The user that is updated with the new Data
 */
sys.post('/:id/update', [check('email').notEmpty().isEmail().normalizeEmail(), check('firstname').notEmpty().isLength({ min: 3 }).trim().escape().isString(), check('lastname').notEmpty().isString().isLength({ min: 3 }).trim().escape(), check('pnumber').notEmpty().isString(), check('token').notEmpty().isString()], (req, res, next) => {
    if (!(req.body.firstname || req.body.lastname || req.body.email || req.body.pnumber)) {
        throw new Error("...You don't seem to be changing anything?")
    }
    var db = opendb("user");
    apicatcher(validationResult, req)
    retrieveuser(db, req.params.id).then(u => {
        if (u.token !== req.body.token) throw new Error("Credentials Invalid")
        isPN(req.body.pnumber);
        u.pnumber = req.body.pnumber.trim() || u.pnumber;
        u.firstname = req.body.firstname.trim() || u.firstname;
        u.lastname = req.body.lastname.trim() || u.lastname;
        u.email = req.body.email.trim() || u.email;
        updateuser(db, u).then(u => {
            res.status(200).json(u.toString());
        })
    }).catch(e => { next(e); })
})

module.exports = sys;