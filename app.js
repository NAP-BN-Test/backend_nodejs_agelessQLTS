var session = require('express-session')

let app = require('express')();
let server = require('http').createServer(app);
let cors = require('cors');
const path = require('path');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser')
const Sequelize = require('sequelize');


app.use(session({
    name: 'user_sid',
    secret: '00a2152372fa8e0e62edbb45dd82831a',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000,
        maxAge: 3000000,
        sameSite: true,
        secure: true,
        httpOnly: true
    }
}))

app.use(cors())
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
app.use(bodyParser.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: false }));

// ------------------------------------------------------------------------------------------------------
var nameMiddle;
async function getDateInt(req, res, next) {
    var datetime = new Date();
    nameMiddle = Date.parse(datetime) + Math.floor(Math.random() * 1000000);
    next();
}
var pathFile;
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        pathFile = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + nameMiddle + pathFile);
    }
});
let upload = multer({ storage: storage });
const DIR = 'D:/images_services/ageless_sendmail';

app.post('/qlnb/upload', getDateInt, upload.array('photo', 12), function (req, res) {
    if (!req.files) {
        console.log("No file received");
        return res.send({
            success: false
        });
    } else {
        console.log('http://118.27.192.106:1357/ageless_sendmail/photo-' + nameMiddle + pathFile);
        return res.send({
            link: 'http://118.27.192.106:1357/ageless_sendmail/photo-' + nameMiddle + pathFile,
            success: true
        })
    }
});
// -------------------------------------------------------------------------------------------------------------------------
let routes = require('./api/router') //importing route
routes(app)

let connect = require('./api/database')

connect.connectDatabase();

const port = process.env.PORT || 3202

server.listen(port, function () {
    console.log('http://localhost:' + port);
});