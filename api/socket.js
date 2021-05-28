var moment = require('moment');
var fs = require('fs');
var database = require('./database');
var mtblMucDongBaoHiem = require('./tables/hrmanage/tblMucDongBaoHiem')
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;
var mtblDMUser = require("./tables/constants/tblDMUser");
var mtblDMNhanvien = require("./tables/constants/tblDMNhanvien");
var mtblYeuCauMuaSam = require("./tables/qlnb/tblYeuCauMuaSam");
var mtblDeNghiThanhToan = require("./tables/qlnb/tblDeNghiThanhToan");
var mtblHopDongNhanSu = require('./tables/hrmanage/tblHopDongNhanSu')
var mtblDMPermission = require('./tables/constants/tblDMPermission');
const bodyParser = require('body-parser');

async function getPaymentAndREquest() {
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
                        include: [{
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'nv'
                        }, ],
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
                        include: [{
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'nv'
                        }, ],
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
                        where: {
                            [Op.or]: [{
                                [Op.and]: {
                                    IDNhanVienKTPD: user[i].IDNhanvien,
                                    TrangThaiPheDuyetKT: 'Chờ phê duyệt',
                                },
                            }, {
                                [Op.and]: {
                                    TrangThaiPheDuyetKT: {
                                        [Op.ne]: 'Chờ phê duyệt'
                                    },
                                    IDNhanVienLDPD: user[i].IDNhanvien,
                                    TrangThaiPheDuyetLD: 'Chờ phê duyệt',
                                }
                            }],
                        },
                        include: [{
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'nv'
                        }, ],
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
    return array
}
async function getStaffContractExpirationData() {
    var array = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            let now = moment().format('YYYY-MM-DD');
            let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
            let tblHopDongNhanSu = mtblHopDongNhanSu(db);
            tblHopDongNhanSu.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'staff' })
            await tblHopDongNhanSu.findAll({
                where: {
                    [Op.or]: [{
                            Status: 'Có hiệu lực',
                            Time: {
                                [Op.eq]: null
                            },
                            NoticeTime: {
                                [Op.substring]: now
                            }
                        },
                        {
                            Status: 'Có hiệu lực',
                            NoticeTime: {
                                [Op.substring]: now
                            },
                            Time: {
                                [Op.lte]: nowTime
                            },
                        }
                    ]
                },
                order: [
                    ['ID', 'DESC']
                ],
                include: [{
                    model: mtblDMNhanvien(db),
                    required: false,
                    as: 'staff'
                }, ],
            }).then(contract => {
                if (contract.length > 0) {
                    for (var i = 0; i < contract.length; i++) {
                        array.push({
                            contractID: contract[i].ID,
                            staffName: contract[i].staff.StaffName,
                            staffCode: contract[i].staff.StaffCode,
                            contractDateEnd: contract[i].ContractDateEnd ? contract[i].ContractDateEnd : null,
                            noticeTime: contract[i].NoticeTime ? contract[i].NoticeTime : null,
                        })
                    }
                }
            })
        } else {
            res.json(Constant.MESSAGE.USER_FAIL)
        }
    })
    return array
}
async function connectDatabase(dbname) {
    const db = new Sequelize(dbname, 'struck_user', '123456a$', {
        host: 'dbdev.namanphu.vn',
        dialect: 'mssql',
        operatorsAliases: '0',
        // Bắt buộc phải có
        dialectOptions: {
            options: { encrypt: false }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: false,
            freezeTableName: true
        }
    });
    return db
}
module.exports = {
    sockketIO: async(io) => {
        var array = await getPaymentAndREquest()
        var arrayContract = await getStaffContractExpirationData();
        io.on("connection", async function(socket) {
            socket.on("sendrequest", async function(data) {
                let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                const db = new Sequelize(data.dbname, 'struck_user', '123456a$', {
                    host: 'dbdev.namanphu.vn',
                    dialect: 'mssql',
                    operatorsAliases: '0',
                    // Bắt buộc phải có
                    dialectOptions: {
                        options: { encrypt: false }
                    },
                    pool: {
                        max: 5,
                        min: 0,
                        acquire: 30000,
                        idle: 10000
                    },
                    define: {
                        timestamps: false,
                        freezeTableName: true
                    }
                });

                db.authenticate()
                    .then(() => console.log('Ket noi thanh cong'))
                    .catch(err => console.log(err.message));
                let str = '(';
                for (var key = 0; key < data.id.length; key++) {
                    if (key == (data.id.length - 1)) {
                        str += data.id[key];
                        str += ')'
                    } else {
                        str += data.id[key] + ', ';
                    }
                }
                if (data.id) {
                    let query = "UPDATE dbo.tblYeuCau SET TrangThai = N'ĐÃ GỬI', NgayGui = '" + now + "' where ID in " + str
                    console.log(query, 1234);
                    db.query(query)
                    io.sockets.emit("sendrequest", data.id);
                }
                io.sockets.emit("sendrequest", []);

            });
            socket.on("notification-zalo", async function(data) {
                io.sockets.emit("notification-zalo", { dbname: data.dbname });

            });
            socket.on("change-received-status", async function(data) {
                let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                let dbMaster = await connectDatabase('STRUCK_CUSTOMER_DB')
                let dbName1 = await connectDatabase(data.dbname1)
                let dbMasterQuery = "SELECT ID FROM CustomerDB WHERE NameDatabase = N'" + data.dbname2 + "'"
                let IDCustomerDB;
                IDCustomerDB = await dbMaster.query(dbMasterQuery)
                console.log(IDCustomerDB[0][0]);
                if (!IDCustomerDB[0][0]) {
                    dbMaster = await connectDatabase('Customer_VTNAP')
                    IDCustomerDB = await dbMaster.query(dbMasterQuery)
                }
                let strGetCus = 'SELECt ID FROM tblKhachHang WHERE IDCustomer = ' + IDCustomerDB[0][0].ID
                let IDCus = await dbName1.query(strGetCus)
                console.log(IDCus);
                let query = "UPDATE dbo.tblYeuCau SET TrangThai = N'ĐÃ NHẬN', NgayGui = '" + now + "', IDNhaXe = " + IDCus[0][0].ID + " where ID = " + data.id
                console.log(query);
                dbName1.query(query)
                io.sockets.emit("sendrequest", []);

            });
            socket.on("send-plan-cost", async function(data) {
                let status = 'XÁC NHẬN KẾ HOẠCH'
                if (data.type == 'CHIPHI')
                    status = 'XÁC NHẬN CHI PHÍ'
                let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                const db = new Sequelize(data.dbname, 'struck_user', '123456a$', {
                    host: 'dbdev.namanphu.vn',
                    dialect: 'mssql',
                    operatorsAliases: '0',
                    // Bắt buộc phải có
                    dialectOptions: {
                        options: { encrypt: false }
                    },
                    pool: {
                        max: 5,
                        min: 0,
                        acquire: 30000,
                        idle: 10000
                    },
                    define: {
                        timestamps: false,
                        freezeTableName: true
                    }
                });

                db.authenticate()
                    .then(() => console.log('Ket noi thanh cong'))
                    .catch(err => console.log(err.message));

                let queryUpdateOrder = 'SELECT IDKhachHang, IDNhaXe FROM tblDonHang WHERE ID = ' + data.iddonhang
                let orderObj = await db.query(queryUpdateOrder)
                let ConfirmKH;
                let ConfirmNX;
                let keyConnectKH;
                let keyConnectNX;
                if (orderObj[0][0]) {
                    let queryCustomer = 'SELECT KeyConnect FROM tblKhachHang WHERE ID = ' + orderObj[0][0].IDKhachHang
                    let CustomerObj = await db.query(queryCustomer)
                    if (CustomerObj[0][0] && CustomerObj[0][0].KeyConnect) {
                        ConfirmKH = null
                        keyConnectKH = CustomerObj[0][0].KeyConnect
                    } else {
                        ConfirmKH = 1
                        keyConnectKH = null
                    }
                } else {
                    ConfirmKH = null
                    keyConnectKH = null
                }
                if (orderObj[0][0]) {
                    let queryCustomer = 'SELECT KeyConnect FROM tblKhachHang WHERE ID = ' + orderObj[0][0].IDNhaXe
                    let CustomerObj = await db.query(queryCustomer)
                    if (CustomerObj[0][0] && CustomerObj[0][0].KeyConnect) {
                        ConfirmNX = null
                        keyConnectNX = CustomerObj[0][0].KeyConnect
                    } else {
                        ConfirmNX = 1
                        keyConnectNX = null
                    }
                } else {
                    ConfirmNX = null
                    keyConnectNX = null
                }
                let dbMaster = await connectDatabase('STRUCK_CUSTOMER_DB')
                let dbnameKH;
                let dbnameNX;
                if (keyConnectKH) {
                    let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = " + keyConnectKH
                    dbnameKH = await dbMaster.query(dbMasterQuery)
                    if (dbnameKH[0][0] && dbnameKH[0][0].NameDatabase) {
                        dbnameKH = dbnameKH[0][0].NameDatabase
                    } else {
                        dbMaster = await connectDatabase('Customer_VTNAP')
                        dbnameKH = await dbMaster.query(dbMasterQuery)
                        if (dbnameKH[0][0] && dbnameKH[0][0].NameDatabase) {
                            dbnameKH = dbnameKH[0][0].NameDatabase
                        } else {
                            dbnameKH = null
                        }
                    }
                } else {
                    dbnameKH = null
                }
                if (keyConnectNX) {
                    let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = " + keyConnectNX
                    dbnameNX = await dbMaster.query(dbMasterQuery)
                    if (dbnameNX[0][0] && dbnameNX[0][0].NameDatabase) {
                        dbnameNX = dbnameNX[0][0].NameDatabase
                    } else {
                        dbMaster = await connectDatabase('Customer_VTNAP')
                        dbnameNX = await dbMaster.query(dbMasterQuery)
                        if (dbnameNX[0][0] && dbnameNX[0][0].NameDatabase) {
                            dbnameNX = dbnameNX[0][0].NameDatabase
                        } else {
                            dbnameNX = null
                        }
                    }
                } else {
                    dbnameNX = null
                }
                console.log(dbnameNX, dbnameKH);
                console.log("UPDATE tblDonHang SET NgayGui = '" + now + "' ,TrangThaiCho = N'" + status + "', ConfirmKH = '" + ConfirmKH + "', ConfirmNX = '" + ConfirmNX + "' WHERE ID = " + data.iddonhang);
                await db.query("UPDATE tblDonHang SET NgayGui = '" + now + "' ,TrangThaiCho = N'" + status + "', ConfirmKH = " + ConfirmKH + ", ConfirmNX = " + ConfirmNX + " WHERE ID = " + data.iddonhang)
                let objResult = {
                    dbnameKH: dbnameKH,
                    dbnameNX: dbnameNX,
                    type: data.type,
                }
                console.log(objResult);
                io.sockets.emit("send-plan-cost", objResult);

            });
            socket.on("confirm-plan-cost", async function(data) {
                let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                const db = new Sequelize(data.dbname, 'struck_user', '123456a$', {
                    host: 'dbdev.namanphu.vn',
                    dialect: 'mssql',
                    operatorsAliases: '0',
                    // Bắt buộc phải có
                    dialectOptions: {
                        options: { encrypt: false }
                    },
                    pool: {
                        max: 5,
                        min: 0,
                        acquire: 30000,
                        idle: 10000
                    },
                    define: {
                        timestamps: false,
                        freezeTableName: true
                    }
                });
                db.authenticate()
                    .then(() => console.log('Ket noi thanh cong'))
                    .catch(err => console.log(err.message));
                let objOrder = await db.query("SELECT ConfirmKH, IDKhachHang, IDNhaXe , ConfirmNX FROM tblDonHang WHERE ID = " + data.id)
                objOrder = objOrder[0][0]
                if (data.object.toUpperCase() == 'KHÁCH HÀNG') {
                    if (data.confirm == 0) {
                        let queryUpdate = "UPDATE tblDonHang SET ConfirmKH = 0, TrangThaiCho = N'Khách Hàng Từ Chối' WHERE ID = " + data.id
                        await db.query(queryUpdate)
                    } else {
                        if (objOrder.ConfirmNX == 1) {
                            if (data.type.toUpperCase() == 'KEHOACH') {
                                await db.query("UPDATE tblDonHang SET ConfirmKH = 1, TrangThaiCho = N'KẾ HOẠCH HOÀN THÀNH' WHERE ID = " + data.id)
                            } else {
                                await db.query("UPDATE tblDonHang SET ConfirmKH = 1, TrangThaiCho = N'CHI PHÍ HOÀN THÀNH' WHERE ID = " + data.id)
                            }
                        } else {
                            await db.query("UPDATE tblDonHang SET ConfirmKH = 1 WHERE ID = " + data.id)
                        }
                    }
                } else {
                    if (data.confirm == 0) {
                        let queryUpdate = "UPDATE tblDonHang SET ConfirmNX = 0, TrangThaiCho = N'Nhà Xe Từ Chối' WHERE ID = " + data.id
                        await db.query(queryUpdate)
                    } else {
                        if (objOrder.ConfirmKH == 1) {
                            if (data.type.toUpperCase() == 'KEHOACH') {
                                await db.query("UPDATE tblDonHang SET ConfirmNX = 1, TrangThaiCho = N'KẾ HOẠCH HOÀN THÀNH', IDDMXeCongTy = NULL, BienSoXe = " + data.xecongty.biensoxe + ", TenLaiXe = " + data.xecongty.tenlaixe + ", SDTLaiXe = " + data.xecongty.sodienthoai + " WHERE ID = " + data.id)
                            } else {
                                await db.query("UPDATE tblDonHang SET ConfirmNX = 1, TrangThaiCho = N'CHI PHÍ HOÀN THÀNH' WHERE ID = " + data.id)
                            }
                        } else {
                            await db.query("UPDATE tblDonHang SET ConfirmNX = 1, IDDMXeCongTy = NULL, BienSoXe = " + data.xecongty.biensoxe + ", TenLaiXe = " + data.xecongty.tenlaixe + ", SDTLaiXe = " + data.xecongty.sodienthoai + " WHERE ID = " + data.id)
                        }
                    }
                }
                let dbnameKH;
                let dbnameNX;
                let KeyConnect;
                let IDNhaXe;
                let dbMaster = await connectDatabase('STRUCK_CUSTOMER_DB')
                    // check dbname khách hàng
                if (!objOrder.IDKhachHang) {
                    dbnameKH = null
                } else {
                    KeyConnect = await db.query('select KeyConnect from tblKhachHang where ID = ' + objOrder.IDKhachHang)
                    KeyConnect = KeyConnect[0][0]
                    if (!KeyConnect)
                        dbnameKH = null
                    else {
                        let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = " + KeyConnect.KeyConnect
                        dbnameKH = await dbMaster.query(dbMasterQuery)
                        dbnameKH = dbnameKH[0][0]
                        if (dbnameKH) {
                            dbnameKH = dbnameKH.NameDatabase
                        } else {
                            let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = " + KeyConnect.KeyConnect
                            dbMaster = await connectDatabase('Customer_VTNAP')
                            dbnameKH = await dbMaster.query(dbMasterQuery)
                            dbnameKH = dbnameKH[0][0]
                            if (dbnameKH)
                                dbnameKH = dbnameKH.NameDatabase
                            else
                                dbnameKH = null
                        }
                    }
                }
                // check dbname nhà xe
                dbMaster = await connectDatabase('STRUCK_CUSTOMER_DB')

                if (!objOrder.IDNhaXe) {
                    dbnameNX = null
                } else {
                    IDNhaXe = await db.query('select KeyConnect from tblKhachHang where ID = ' + objOrder.IDNhaXe)
                    IDNhaXe = IDNhaXe[0][0]
                    if (!IDNhaXe)
                        dbnameNX = null
                    else {
                        let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = " + IDNhaXe.KeyConnect
                        dbnameNX = await dbMaster.query(dbMasterQuery)
                        dbnameNX = dbnameNX[0][0]
                        if (dbnameNX) {
                            dbnameNX = dbnameNX.NameDatabase
                        } else {
                            let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = " + IDNhaXe.KeyConnect
                            dbMaster = await connectDatabase('Customer_VTNAP')
                            dbnameNX = await dbMaster.query(dbMasterQuery)
                            dbnameNX = dbnameNX[0][0]
                            if (dbnameNX)
                                dbnameNX = dbnameNX.NameDatabase
                            else
                                dbnameNX = null
                        }
                    }
                }

                let obj = {
                    dbnameKH: dbnameKH,
                    dbnameNX: dbnameNX,
                }
                io.sockets.emit("confirm-plan-cost", obj);

            });
            console.log('The user is connecting : ' + socket.id);
            io.sockets.emit("Server-send-data", array);
            socket.emit("Server-send-contract-notification-schedule", arrayContract);
            io.sockets.emit("Server-send-all-the-messages", {
                'qltsArray': array,
                'qlnsArray': arrayContract,
            });
            await database.connectDatabase().then(async db => {
                if (db) {
                    var insurancePremiums = await mtblMucDongBaoHiem(db).findOne({
                        order: [
                            Sequelize.literal('max(DateEnd) DESC'),
                        ],
                        group: ['ID', 'CompanyBHXH', 'CompanyBHYT', 'CompanyBHTN', 'StaffBHXH', 'StaffBHYT', 'StaffBHTN', 'DateStart', 'StaffUnion', 'StaffBHTNLD', 'DateEnd', 'MinimumWage'],
                        where: {
                            DateEnd: {
                                [Op.gt]: moment().subtract(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS')
                            }
                        }
                    })
                    if (!insurancePremiums) {
                        io.to(socket.id).emit("check-insurance-premiums", 1);
                    }
                }
            })
            socket.on("disconnect", function() {
                console.log(socket.id + " disconnected!");
            });
            socket.on("Client-send-data", async function(data) {
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
                                    include: [{
                                        model: mtblDMNhanvien(db),
                                        required: false,
                                        as: 'nv'
                                    }, ],
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
                                    include: [{
                                        model: mtblDMNhanvien(db),
                                        required: false,
                                        as: 'nv'
                                    }, ],
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
                                    where: {
                                        [Op.or]: [{
                                            [Op.and]: {
                                                IDNhanVienKTPD: user[i].IDNhanvien,
                                                TrangThaiPheDuyetKT: 'Chờ phê duyệt',
                                            },
                                        }, {
                                            [Op.and]: {
                                                TrangThaiPheDuyetKT: {
                                                    [Op.ne]: 'Chờ phê duyệt'
                                                },
                                                IDNhanVienLDPD: user[i].IDNhanvien,
                                                TrangThaiPheDuyetLD: 'Chờ phê duyệt',
                                            }
                                        }],
                                    },
                                    include: [{
                                        model: mtblDMNhanvien(db),
                                        required: false,
                                        as: 'nv'
                                    }, ],
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
            });
            socket.on("Client-send-contract-notification-schedule", async function(data) {
                var arrayContractClient = await getStaffContractExpirationData();

                io.sockets.emit("Server-send-contract-notification-schedule", arrayContractClient);
            });
        })
    },
    socketEmit: async(io, dbname) => {
        io.sockets.emit("notification-zalo", { dbname: dbname });
    },
    socketEmitNotifiPlan: async(io, dbname) => {
        io.sockets.emit("notification-kehoach", { dbname: dbname });
    },
    socketEmitNotifiCost: async(io, dbname) => {
        io.sockets.emit("notification-chiphi", { dbname: dbname });
    },
}