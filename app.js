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
var mtblTemplate = require('./api/tables/qlnb/tblTemplate')
var mtblDMBoPhan = require('./api/tables/constants/tblDMBoPhan')
var mtblYeuCauMuaSamDetail = require('./api/tables/qlnb/tblYeuCauMuaSamDetail')

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
            var pathTo = 'D:/images_services/ageless_sendmail/'
            var pathFinal = '';
            pathFirst = pathTo + 'photo-' + nameMiddle + pathFile;
            if (pathFirst.slice(-1) == 'c') {
                var randomOutput = 'output-' + Math.floor(Math.random() * Math.floor(100000000000)) + '.docx';
                var CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
                var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
                var Apikey = defaultClient.authentications['Apikey'];
                Apikey.apiKey = "867a8adc-9881-4c99-85f8-4c9d2cd7aaeb"

                var apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();
                var inputFile = Buffer.from(fs.readFileSync(pathFirst).buffer); // File | Input file to perform the operation on.
                var callback = function (error, data, response) {
                    if (error) {
                        console.error(error);
                    } else {
                        fs.writeFileSync(path.resolve(pathTo, randomOutput), data);
                    }
                };
                apiInstance.convertDocumentDocToDocx(inputFile, callback);
                pathFinal = pathTo + randomOutput;
                fs.unlink(pathFirst, (err) => {
                    if (err) console.log(err);
                });
            }
            else {
                pathFinal = pathFirst;
            }
            pathFinal = pathFinal.slice(36, 100)
            let idLink = await mtblFileAttach(db).create({
                Name: nameFile + pathFile,
                Link: 'http://118.27.192.106:1357/ageless_sendmail/' + pathFinal,
            })
            return res.send({
                link: 'http://118.27.192.106:1357/ageless_sendmail/' + pathFinal,
                name: nameFile + pathFile,
                id: idLink.ID,
                success: true
            })
        })
    }
});
var fs = require('fs');
const JSZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const Constant = require('./api/constants/constant');
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var mtblDMHangHoa = require('./api/tables/qlnb/tblDMHangHoa');
var mtblDMLoaiTaiSan = require('./api/tables/qlnb/tblDMLoaiTaiSan');
var mtblDMChiNhanh = require('./api/tables/qlnb/tblDMLoaiTaiSan')
var mtblMucDongBaoHiem = require('./api/tables/hrmanage/tblMucDongBaoHiem')

var moment = require('moment');
async function handleRequestShopping(db, idycms) {
    var objKey = {
        'BỘ PHẬN ĐỀ XUẤT': '',
        'NHÂN VIÊN': '',
        'NGÀY ĐỀ XUẤT': '',
        'MÃ TS/TB/LK': '',
        'TÊN TS/TB/LK': '',
        'ĐƠN GIÁ': '',
        'SỐ LƯỢNG': '',
        'TỔNG TIỀN': '',
        'LÝ DO MUA': '',
        'TRẠNG THÁI': '',
    };
    let tblYeuCauMuaSam = mtblYeuCauMuaSam(db); // bắt buộc
    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet1', sourceKey: 'IDPheDuyet1', as: 'PheDuyet1' })
    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet2', sourceKey: 'IDPheDuyet2', as: 'PheDuyet2' })
    tblYeuCauMuaSam.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDPhongBan', sourceKey: 'IDPhongBan', as: 'phongban' })
    let tblYeuCauMuaSamDetail = mtblYeuCauMuaSamDetail(db);
    tblYeuCauMuaSam.hasMany(tblYeuCauMuaSamDetail, { foreignKey: 'IDYeuCauMuaSam', as: 'line' })

    await tblYeuCauMuaSam.findOne({
        order: [
            ['ID', 'DESC']
        ],
        include: [
            {
                model: mtblDMBoPhan(db),
                required: false,
                as: 'phongban'
            },
            {
                model: mtblDMNhanvien(db),
                required: false,
                as: 'NhanVien'
            },
            {
                model: mtblDMNhanvien(db),
                required: false,
                as: 'PheDuyet1',
            },
            {
                model: mtblDMNhanvien(db),
                required: false,
                as: 'PheDuyet2',
            },
            {
                model: tblYeuCauMuaSamDetail,
                required: false,
                as: 'line'
            },
        ],
        where: { ID: idycms }
    }).then(async data => {
        var total = 0;
        var code = '';
        var name = '';
        var unitPrice = '';
        var amountHH = '';
        if (data) {
            for (var j = 0; j < data.line.length; j++) {
                var price = data.line[j].Price ? data.line[j].Price : 0
                var amount = data.line[j].Amount ? data.line[j].Amount : 0
                total += amount * price
                let tblDMHangHoa = mtblDMHangHoa(db);
                tblDMHangHoa.belongsTo(mtblDMLoaiTaiSan(db), { foreignKey: 'IDDMLoaiTaiSan', sourceKey: 'IDDMLoaiTaiSan', as: 'loaiTaiSan' })
                await tblDMHangHoa.findOne({
                    where: {
                        ID: data.line[j].IDDMHangHoa,
                    },
                    include: [
                        {
                            model: mtblDMLoaiTaiSan(db),
                            required: false,
                            as: 'loaiTaiSan'
                        },
                    ],
                }).then(data => {
                    if (data) {
                        name += ',' + data ? data.Name : ''
                        code += ',' + data ? data.Code : ''
                        amount += ',' + amount
                        unitPrice += ',' + price
                    }
                })
                objKey = {
                    'BỘ PHẬN ĐỀ XUẤT': data.phongban ? data.phongban.DepartmentName : '',
                    'NHÂN VIÊN': data.NhanVien ? data.NhanVien.StaffName : '',
                    'NGÀY ĐỀ XUẤT': data.RequireDate ? moment(data.RequireDate).format('DD/MM/YYYY') : '',
                    'MÃ TS/TB/LK': code,
                    'TÊN TS/TB/LK': name,
                    'ĐƠN GIÁ': (Number(unitPrice)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                    'SỐ LƯỢNG': amountHH,
                    'GIÁ/TỔNG TIỀN': (Number(total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                    'LÝ DO MUA': data.Reason ? data.Reason : '',
                    'TRẠNG THÁI': data.Status ? data.Status : '',
                }
            }
        }

    })
    return objKey
}
async function handlePaymentOrder(db, iddntt) {
    var objKey = {
        'CHỨNG TỪ': '',
        'NGƯỜI ĐỀ NGHỊ': '',
        'NỘI DUNG THANH TOÁN': '',
        'SỐ TIỀN THANH TOÁN': '',
        'NGƯỜI PHÊ DUYỆT TRƯỚC': '',
        'NGƯỜI PHÊ DUYỆT SAU': '',
        'BỘ PHẬN': '',
    };
    let tblDeNghiThanhToan = mtblDeNghiThanhToan(db);
    let tblDMNhanvien = mtblDMNhanvien(db);
    let tblDMBoPhan = mtblDMBoPhan(db);
    tblDMNhanvien.belongsTo(tblDMBoPhan, { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bophan' })
    tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh', as: 'chinhanh' })

    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'idNhanVienKTPD', sourceKey: 'idNhanVienKTPD', as: 'KTPD' })
    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'idNhanVienLDPD', sourceKey: 'idNhanVienLDPD', as: 'LDPD' })
    await tblDeNghiThanhToan.findOne({
        where: { ID: iddntt },
        order: [
            ['ID', 'DESC']
        ],
        include: [
            {
                model: tblDMNhanvien,
                required: false,
                as: 'NhanVien',
                include: [
                    {
                        model: tblDMBoPhan,
                        required: false,
                        as: 'bophan',
                        include: [
                            {
                                model: mtblDMChiNhanh(db),
                                required: false,
                                as: 'chinhanh'
                            },
                        ],
                    },
                ],
            },
            {
                model: mtblDMNhanvien(db),
                required: false,
                as: 'KTPD'
            },
            {
                model: mtblDMNhanvien(db),
                required: false,
                as: 'LDPD'
            },
        ],
    }).then(async data => {
        objKey = {
            'CHỨNG TỪ': '',
            'NGƯỜI ĐỀ NGHỊ': data.NhanVien ? data.NhanVien.StaffName : '',
            'NỘI DUNG THANH TOÁN': data.Contents ? data.Contents : '',
            'SỐ TIỀN THANH TOÁN': data.Cost ? (Number(data.Cost)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : 0,
            'NGƯỜI PHÊ DUYỆT TRƯỚC': data.KTPD ? data.KTPD.StaffName : '',
            'NGƯỜI PHÊ DUYỆT SAU': data.LDPD ? data.LDPD.StaffName : '',
            'BỘ PHẬN': data.NhanVien ? data.NhanVien.bophan ? data.NhanVien.bophan.DepartmentName : '' : '',
        };
    })
    return objKey
}
async function getPathFromtblTmplate(db, code, idycms) {
    let tblTemplate = mtblTemplate(db);
    var pathFirst = '';
    tblTemplate.hasMany(mtblFileAttach(db), { foreignKey: 'IDTemplate', as: 'tem' })
    await tblTemplate.findOne({
        where: { Code: code },
        include: [
            {
                model: mtblFileAttach(db),
                required: false,
                as: 'tem'
            },
        ],
    }).then(data => {
        //  data.tem[0].Link.slice(44, 100)
        pathFirst = data.tem[0].Link.slice(44, 100);
        if (!data.tem[0].ID) {
            return res.json('Không tìm thấy code. Vui lòng cấu hình lại mẫu !')
        }
    })
    return pathFirst
}
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.post('/qlnb/render_automatic_work', async function (req, res) {
    let body = req.body;
    console.log(body);
    var pathFirst = '';
    var objKey = {};
    await database.connectDatabase().then(async db => {
        pathFirst = await getPathFromtblTmplate(db, body.code, body.id)
        if (body.code == 'ycms') {
            objKey = await handleRequestShopping(db, body.id)
        } else if (body.code == 'dntt') {
            objKey = await handlePaymentOrder(db, body.id)
        } else {
            objKey = await handleRequestShopping(db, body.id)
        }
    })
    var pathTo = 'D:/images_services/ageless_sendmail/'
    fs.readFile(pathTo + pathFirst, 'binary', function (err, data) {
        try {
            var zip = new JSZip(data);
            var doc = new Docxtemplater().loadZip(zip)
            //set the templateVariables
            doc.setData(objKey);
            doc.render()
            var buf = doc.getZip().generate({ type: 'nodebuffer' });
            // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
            // var randomOutput = 'output-' + Math.floor(Math.random() * Math.floor(100000000000)) + '.docx';
            fs.writeFileSync(path.resolve(pathTo, 'export-file-word.docx'), buf);
            var result = {
                link: 'http://118.27.192.106:1357/ageless_sendmail/' + 'export-file-word.docx',
                status: Constant.STATUS.SUCCESS,
                message: Constant.MESSAGE.ACTION_SUCCESS,
            }
            res.json(result);
        } catch (error) {
            console.log(error);
            res.json('Lỗi file export. Vui lòng cầu hình lại!')
        }
    });
})
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
    await database.connectDatabase().then(async db => {
        if (db) {
            var insurancePremiums = await mtblMucDongBaoHiem(db).findOne({
                order: [
                    Sequelize.literal('max(DateEnd) DESC'),
                ],
                group: ['ID', 'CompanyBHXH', 'CompanyBHYT', 'CompanyBHTN', 'StaffBHXH', 'StaffBHYT', 'StaffBHTN', 'DateStart', 'StaffUnion', 'StaffBHTNLD', 'DateEnd'],
                where: { DateEnd: { [Op.gt]: moment().subtract(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS') } }
            })
            if (!insurancePremiums) {
                io.to(socket.id).emit("check-insurance-premiums", 1);
            }
        }
    })
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