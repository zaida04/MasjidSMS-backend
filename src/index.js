const express = require('express'); //Web Framework
var app = express();
var bodyParser = require('body-parser')
var CFonts = require('cfonts');
var cors = require('cors')
var port = 80;
var helmet = require('helmet'); //Security for Express
//Library Declarations

//Controller
var api = require('./Routers/api/api.js');
app.use(cors())
app.use(helmet());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.json());
app.use('/api', api);//Router
//ERROR HANDLER
app.use(function (err, req, res, next) {
    if (err) {
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
    res.status(404).json({
        "status": 404,
        "error": "404, page not found",
        "url": req.originalUrl
    })
})

app.listen(port, () => {
    CFonts.say(`API Started|on port ${port}`, { //am like fancy
        font: 'block',              // define the font face
        align: 'left',              // define text alignment
        colors: ['system'],         // define all colors
        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
        letterSpacing: 1,           // define letter spacing
        lineHeight: 1,              // define the line height
        space: true,                // define if the output text should have empty lines on top and on the bottom
        maxLength: '0',             // define how many character can be on one line
    });
})