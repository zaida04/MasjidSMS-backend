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
 * @api {post} /api/users/createAdmin
 * @apiName Create Admin
 * @apiGroup User
 *
 * @apiParam {string} email The users email
 * @apiParam {string} firstname The users firstname
 * @apiParam {string} lastname The users lastname
 * @apiParam {string} pnumber The users phone number
 * @apiParam {string} token The token of the executor of the request
 *
 * @apiSuccess {json} user The user that is created
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
                res.json(i.toString())
            })
        } else {
            throw new Error("You do not have the credentials for this action");
        }
    }).catch(e => {next(e)})
});

/**
 * @api {post} /api/users/createMod
 * @apiName Create Mod
 * @apiGroup User
 *
 * @apiParam {string} email The users email
 * @apiParam {string} firstname The users firstname
 * @apiParam {string} lastname The users lastname
 * @apiParam {string} pnumber The users phone number
 * @apiParam {string} token The token of the executor of the request
 *
 * @apiSuccess {json} user The user that is created
 */
sys.post('/createMod', [check('email').notEmpty().isEmail().normalizeEmail(), check('firstname').notEmpty().isLength({ min: 3 }).trim().escape().isString(), check('lastname').notEmpty().isString().isLength({ min: 3 }).trim().escape(), check('pnumber').notEmpty().isString(), check('token').notEmpty().isString()], (req, res, next) => {
    var db = opendb("user");
    retrieveuser(db, null, req.body.token).then(u => {
        if (u.isAdmin()) {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //the ip of the user
            var tokgen = uidgen.generateSync(); //generate a token for the user
            var id = Math.floor(Math.random() * 1000000 + 1);
            createMod(db, ip, req.body.pnumber, req.body.email, { firstname: req.body.firstname, lastname: req.body.lastname }, tokgen, id).then(i => {
                res.json(i.toString())
            })
        } else {
            throw new Error("You do not have the credentials for this action");
        }
    }).catch(e => { next(e) })
})

/**
 * @api {get} /api/users/:id
 * @apiName Retrieve User
 * @apiGroup User
 *
 * @apiParam {int} id The users ID to retrieve
 * @apiParam {string} token The token of the executor of the request
 *
 * @apiSuccess {User} user The user that is retrieved
 */
sys.get('/:id', check('token').notEmpty(), (req, res, next) => {
    apicatcher(validationResult, req);
    var db = opendb("user");
    retrieveuser(db, req.params.id).then(u => {
        if (u.token !== req.body.token) throw new Error("Credentials Invalid")
        res.json(u.toString())
    }).catch(e => {
        console.error(e);
        next(e);
    })
    db.close();
})

/**
 * @api {post} /api/users/signup
 * @apiName Create User
 * @apiGroup User
 *
 * @apiParam {string} email The users email
 * @apiParam {string} firstname The users firstname
 * @apiParam {string} lastname The users lastname
 * @apiParam {string} pnumber The users phone number
 *
 * @apiSuccess {json} user The user that is created
 */
sys.post('/signup', [check('email').notEmpty().isEmail().normalizeEmail(), check('firstname').notEmpty().isLength({ min: 3 }).trim().escape().isString(), check('lastname').notEmpty().isString().isLength({ min: 3 }).trim().escape(), check('pnumber').notEmpty().isString()], (req, res, next) => {
    if (!(req.body.email && req.body.pnumber && req.body.firstname && req.body.lastname)) throw new APIError("You are missing one or more fields", 400, "body", null);
     //get the validation result and see if it passed the tests
    isPN(req.body.pnumber);//check if phone number is all gucci
    apicatcher(validationResult, req)
    var tokgen = uidgen.generateSync(); //generate a token for the user
    var id = Math.floor(Math.random() * 1000000 + 1);
    var db = opendb("user");
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //the ip of the user
    try {
        signup(db, ip, req.body.pnumber, req.body.email, { firstname: req.body.firstname, lastname: req.body.lastname }, tokgen, id).then(u => { //send to the signup function
            res.json(u.toString()) //return the newly created user object
        });
        return; //end the function
    } catch (e) {
        next(e);
    }
    db.close(); //close the database
});

/**
 * @api {post} /api/users/:id/update
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
 * @apiSuccess {json} user The user that is updated with the new Data
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
            res.json(u.toString());
        })
    }).catch(e => { next(e); })
})

module.exports = sys;