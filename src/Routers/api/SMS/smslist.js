const { check, validationResult } = require('express-validator'); //validate input
var { Router } = require('express'); //grab the router class from express
var { User } = require('../../Models/User.js'); //Model of a user
var smslist = Router({ mergeParams: true }); //Router
var { opendb } = require('../functions/opendb.js');


smslist.post('/create', [check('name').notEmpty()],(req, res, next) => {
    var db = opendb("smslists");
    db.prepare(`CREATE TABLE IF NOT EXISTS ?(email TEXT)`).run()
})

module.exports = smslist;
