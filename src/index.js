const express = require('express'); //Web Framework
var app = express();
var bodyParser = require('body-parser')
var helmet = require('helmet'); //Security for Express
//Library Declarations

//Controller
var api = require('./Routers/api/api.js');
app.use(helmet());
app.use(bodyParser());
app.use(express.json());
app.use('/api', api);//Router
//ERROR HANDLER
app.use(function (err, req, res, next) {
    if (err) {
        if(err.status) res.status(err.status)
        res.json({
            "status": err.status || 400,
            "code": err.code,
            "url": req.originalUrl,
            "error": {
                "field": err.field,
                "value": err.value,
                "message": err.msg,
                "description": err.message
            },
            "timestamp": new Date()
        })
    }
});

//404 handler
app.use((req, res, next) => {
    res.status('404').json({
        "status": 404,
        "error": "404, page not found",
        "url": req.originalUrl
    })
})

app.listen('80', () => {
    console.log("API Started");
})