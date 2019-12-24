var { Router } = require('express');
var { User } = require('../Models/User.js');
var { signupMailList } = require('./functions/signup.js');
var { updateMailList } = require('./functions/update.js');
var { retrieveuser } = require('./functions/retrieveuser.js');
var smsapi = Router();

smsapi.get('/index', (req, res) => {
    res.json({ "response": "All Good " })
});

smsapi.post('/signup', (req, res, next) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    try {
        var tempuser = signupMailList(ip, req.body.pnumber, req.body.email, { firstname: req.body.firstname, lastname: req.body.lastname });
        res.json({
            "user": {
                "firstname": tempuser.name.firstname,
                "lastname": tempuser.name.lastname,
                "email": tempuser.email,
                "phone_number": tempuser.phonenumber,
            }
        })
    } catch (e) {
        next(e)
    }
});
smsapi.post('/update/:id', (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var tempuser = retrieveuser(req.body.firstname, req.body.lastname, req.body.email, req.body.pnumber);
    
});




module.exports = smsapi;