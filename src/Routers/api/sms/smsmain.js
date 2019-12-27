var { Router } = require('express'); //grab the router class from express
var smsapi = Router({ mergeParams: true }); //Router

var smslist = require('./smslist.js');
smsapi.use('/smslist', smslist); //sms router

module.exports = smsapi; //export the router