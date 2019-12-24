const express = require('express'); //Web Framework
var app = express();
var bodyParser = require('body-parser')
var helmet = require('helmet'); //Security for Express
//Library Declarations

//Controller
var smsapi = require('./Routers/sms/smsmain.js');
app.use(helmet());
app.use(bodyParser());
app.use(express.json());
app.use('/api/sms', smsapi);
app.use(function (err, req, res, next) {
    res.json({
        "error": err.message
    })
    console.log(err)
    next();
});

//Requests
app.listen('80', () => {
    console.log("API Started");
})