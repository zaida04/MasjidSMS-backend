var { Router } = require('express'); //grab the router class from express
var { User } = require('../../Models/User.js'); //Model of a user
var smsapi = Router({ mergeParams: true }); //Router

smsapi.get('/index', (req, res) => {
    res.json({ "response": "All Good " });
    return;
});

module.exports = smsapi; //export the router