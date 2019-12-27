//^require libraries (external)
var { Router } = require('express');//grab the router class from express and generate a router
var api = Router({ mergeParams: true });
//grab the functions

//hook the routers
var smsapi = require('./SMS/smsmain.js'); //accessible from /api/sms
api.use('/sms', smsapi);
var usersys = require('./UserSys/sys.js') //accessible from /api/users
api.use('/users', usersys);


module.exports = api //export the router