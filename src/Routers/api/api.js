const { check, validationResult } = require('express-validator'); //validate input
const sqlite3 = require('sqlite3').verbose(); //the db
const UIDGenerator = require('uid-generator'); //Token generating
const uidgen = new UIDGenerator(); //instance of token generator
//^require libraries (external)
var { Router } = require('express');
var api = Router({ mergeParams: true });
//grab the router class from express and generate a router
var { signup } = require('./functions/signup.js'); //Function for signing up
var { updateuser } = require('./functions/update.js'); //Function for updating
var { retrieveuser } = require('./functions/retrieveuser.js'); //retrieve the user from the db
var { APIError } = require('../Models/apierror.js');

//grab the functions
var smsapi = require('./sms/smsmain.js');
api.use('/sms', smsapi); //sms router
//define the sub api of sms

api.get('/users/:id', check('token').notEmpty(), (req, res, next) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new APIError(errors.array()[0].msg, 500, errors.array()[0].param, errors.array()[0].value);
    }
    var db = opendb();
    try {
        retrieveuser(db, req.params.id).then(u => {
            console.log("row: " + JSON.stringify(u))
            res.json(u.toString())
        }).catch(e => { throw new APIError(e.message, 500, e.field, null) })
    } catch (e) {
        next(e);
    }
    db.close();
})

/*
 * Signup url. Takes a email, phone number, name (firstname and lastname) and takes the ip and generates its own token
 * Returns created user 
 */
api.post('/signup', [check('email').notEmpty().isEmail().normalizeEmail(), check('firstname').notEmpty().isLength({ min: 3 }).trim().escape().isString(), check('lastname').notEmpty().isString().isLength({ min: 3 }).trim().escape(), check('pnumber').notEmpty().isString()], (req, res, next) => {
    if (!(req.body.email && req.body.pnumber && req.body.firstname && req.body.lastname)) throw new APIError("You are missing one or more fields", 500, "body", null);
    var errors = validationResult(req); //get the validation result and see if it passed the tests
    if (!req.body.pnumber.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
        throw new APIError("not a phone number", 500, "phone_number", req.body.pnumber);
    }//check if phone number is all gucci
    if (!errors.isEmpty()) { //if there is an error, throw it
        throw new APIError(errors.array()[0].msg, 500, errors.array()[0].param, errors.array()[0].value)
    }
    var tokgen = uidgen.generateSync(); //generate a token for the user
    var id = Math.floor(Math.random() * 1000000 + 1);
    var db = opendb();
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

function opendb() {
    return new sqlite3.Database('./user.db', (err) => { if (err) { console.error(err); } }); //open up the database
}

module.exports = api //export the router