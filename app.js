var session = require('express-session')

let app = require('express')();
let server = require('http').createServer(app);
let cors = require('cors');
const path = require('path');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser')
const Sequelize = require('sequelize');
var mtblFileAttach = require("./api/tables/constants/tblFileAttach");
var mtblDMUser = require("./api/tables/constants/tblDMUser");
var mtblDMNhanvien = require("./api/tables/constants/tblDMNhanvien");
var mtblYeuCauMuaSam = require("./api/tables/qlnb/tblYeuCauMuaSam");
var mtblDeNghiThanhToan = require("./api/tables/qlnb/tblDeNghiThanhToan");
var database = require('./api/database');
const Op = require('sequelize').Op;

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
var nameFile;
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        pathFile = path.extname(file.originalname)
        nameFile = file.originalname.split('.')[0]
        cb(null, file.fieldname + '-' + nameMiddle + pathFile);
    }
});
let upload = multer({ storage: storage });
const DIR = 'D:/images_services/ageless_sendmail';

app.post('/qlnb/upload', getDateInt, upload.array('photo', 12), async function (req, res) {
    if (!req.files) {
        console.log("No file received");
        return res.send({
            success: false
        });
    } else {
        database.connectDatabase().then(async db => {
            let idLink = await mtblFileAttach(db).create({
                Name: nameFile + pathFile,
                Link: 'http://118.27.192.106:1357/ageless_sendmail/photo-' + nameMiddle + pathFile,
            })
            return res.send({
                link: 'http://118.27.192.106:1357/ageless_sendmail/photo-' + nameMiddle + pathFile,
                name: nameFile + pathFile,
                id: idLink.ID,
                success: true
            })
        })
    }
});

// -------------------------------------------------------------------------------------------------------------------------
let routes = require('./api/router') //importing route
routes(app)

let connect = require('./api/database')

connect.connectDatabase();

const port = process.env.PORT || 3100
// wsEngine cho phép gọi vào hàm
var io = require("socket.io")(server, {
    cors: {
        wsEngine: 'eiows',
        origin: ["http://118.27.192.106:8692", "http://localhost:4200"],
        methods: ["GET", "POST"],
        credentials: true,
    }
})
server.listen(port, function () {
    console.log('http://localhost:' + port);
});
var employee = require("./api/controllers/ctl-tblDMNhanvien");
io.on("connection", async function (socket) {
    console.log('The user is connecting : ' + socket.id);

    socket.on("disconnect", function () {
        console.log(socket.id + " disconnected!");
    });
    socket.on("Client-send-data", async function (data) {
        console.log(socket.id + " just sent: " + data);
        var array = [];
        await database.connectDatabase().then(async db => {
            if (db) {
                var user = await mtblDMUser(db).findAll();
                let count = 0;
                for (var i = 0; i < user.length; i++) {
                    if (user[i]) {
                        let tblYeuCauMuaSam = mtblYeuCauMuaSam(db);
                        tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
                        await tblYeuCauMuaSam.findAll({
                            where: [
                                { IDPheDuyet1: user[i].IDNhanvien },
                                { Status: 'Chờ phê duyệt' }
                            ],
                            include: [
                                {
                                    model: mtblDMNhanvien(db),
                                    required: false,
                                    as: 'nv'
                                },
                            ],
                        }).then(data => {
                            data.forEach(item => {
                                array.push({
                                    name: item.nv ? item.nv.StaffName : 'admin',
                                    type: 'shopping_cart',
                                    userID: user[i].ID,
                                })
                                count += 1;
                            })
                        })
                        await tblYeuCauMuaSam.findAll({
                            where: [
                                { IDPheDuyet2: user[i].IDNhanvien },
                                { Status: 'Đang phê duyệt' }
                            ],
                            include: [
                                {
                                    model: mtblDMNhanvien(db),
                                    required: false,
                                    as: 'nv'
                                },
                            ],
                        }).then(data => {
                            data.forEach(item => {
                                array.push({
                                    name: item.nv ? item.nv.StaffName : 'admin',
                                    type: 'shopping_cart',
                                    userID: user[i].ID,
                                })
                                count += 1;
                            })
                        })
                        let tblDeNghiThanhToan = mtblDeNghiThanhToan(db);
                        tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
                        await tblDeNghiThanhToan.findAll({
                            where: [
                                { IDNhanVienKTPD: user[i].IDNhanvien },
                                { TrangThaiPheDuyetKT: 'Chờ phê duyệt' }
                            ],
                            include: [
                                {
                                    model: mtblDMNhanvien(db),
                                    required: false,
                                    as: 'nv'
                                },
                            ],
                        }).then(data => {
                            data.forEach(item => {
                                array.push({
                                    name: item.nv ? item.nv.StaffName : 'admin',
                                    type: 'payment',
                                    userID: user[i].ID,
                                })
                                count += 1;
                            })
                        })
                        await tblDeNghiThanhToan.findAll({
                            where: [
                                { IDNhanVienLDPD: user[i].IDNhanvien },
                                {
                                    [Op.or]: [
                                        { TrangThaiPheDuyetKT: 'Đã phê duyệt' },
                                        { TrangThaiPheDuyetKT: 'Đã hủy' },
                                    ]
                                }
                            ],
                            include: [
                                {
                                    model: mtblDMNhanvien(db),
                                    required: false,
                                    as: 'nv'
                                },
                            ],
                        }).then(data => {
                            data.forEach(item => {
                                array.push({
                                    name: item.nv ? item.nv.StaffName : 'admin',
                                    type: 'payment',
                                    userID: user[i].ID,
                                })
                                count += 1;
                            })
                        })
                    }
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
        io.sockets.emit("Server-send-data", array);
    })
})