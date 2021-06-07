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
        var clients = {}
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
                } else {
                    io.sockets.emit("sendrequest", []);
                }
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
                let query1 = "DELETE FROM dbo.tblDauGia WHERE IDYeuCau = '" + data.id + "' AND IDCustomer = '" + IDCustomerDB[0][0].ID + "'"
                dbName1.query(query1)
                let query = "INSERT INTO dbo.tblDauGia (IDYeuCau, IDCustomer, ChiPhi) VALUES ('" + data.id + "', '" + IDCustomerDB[0][0].ID + "', '" + data.chiphi + "')"
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
                    let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = '" + keyConnectKH + "'"
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
                    let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = '" + keyConnectNX + "'"
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
                const db2 = new Sequelize(data.dbname2, 'struck_user', '123456a$', {
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
                let objOrder = await db.query("SELECT * FROM tblDonHang WHERE ID = " + data.id)
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
                        //lấy dữ liệu đơn gốc
                        let loaihinhvanchuyen = await db.query("SELECT * FROM tblLoaiHinhVanChuyen WHERE ID = " + objOrder.IDLoaiHinhVanChuyen)
                        let loaivo = await db.query("SELECT * FROM tblLoaiVo WHERE ID = " + objOrder.IDLoaiVo)
                        let hangtau = await db.query("SELECT * FROM tblHangTau WHERE ID = " + objOrder.IDHangTau)

                        //dữ liệu mới
                        let IDLoaiHinhVanChuyen;
                        let TypeLoaiHinhVanChuyen;
                        let IDKhachHang;
                        let IDDMXeCongTy = data.xecongty.id;
                        let SoLuongVo = objOrder.SoLuongVo;
                        let IDLoaiVo;
                        let IDHangTau;
                        let TrongLuong = objOrder.TrongLuong;
                        let NgayDong = objOrder.NgayDong;
                        let GioDong = objOrder.GioDong;
                        let NgayTra = objOrder.NgayTra;
                        let GioTra = objOrder.GioTra;
                        let NoiDong = objOrder.NoiDong;
                        let NoiTra = objOrder.NoiTra;
                        let CuocVanChuyen = objOrder.GiaCuocChi;
                        let SoContainer = objOrder.SoContainer;
                        let SoChi = objOrder.SoChi;
                        let DiaDiemDong = objOrder.DiaDiemDong;
                        let NguoiLayHang = objOrder.NguoiLayHang;
                        let SDTNguoiLay = objOrder.SDTNguoiLay;
                        let GhiChuLay = objOrder.GhiChuLay;
                        let DiaDiemTra = objOrder.DiaDiemTra;
                        let NguoiTraHang = objOrder.NguoiTraHang;
                        let SDTNguoiTra = objOrder.SDTNguoiTra;
                        let GhiChuTra = objOrder.GhiChuTra;
                        let GhiChuChiPhi = objOrder.GhiChuChiPhi;
                        let TrangThai = "MỚI";
                        let PheDuyet = "ĐÃ DUYỆT";
                        let IDNhanVienKH = data.idnhanvienkh;
                        let ts = Date.now();

                        let date_ob = new Date(ts);
                        let date = ("0" + date_ob.getDate()).slice(-2);
                        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                        let year = date_ob.getFullYear();
                        let hours = date_ob.getHours();
                        let minutes = date_ob.getMinutes();
                        let seconds = date_ob.getSeconds();

                        let CreateDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
                        let EditDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

                        let getdonghang = await db2.query("SELECT * FROM tblDonHang WHERE SoDonHang like '%" + date + month + year + "%' AND SoDonHang not like '%-%'")

                        let loaihinhvanchuyen2 = await db2.query("SELECT * FROM tblLoaiHinhVanChuyen WHERE TenVietTat = '" + loaihinhvanchuyen[0][0].TenVietTat + "'")
                        if (!loaihinhvanchuyen2[0][0]) {
                            let create_lhvc = await db2.query("INSERT INTO tblLoaiHinhVanChuyen (TenVietTat, TenLoaiHinh) values ('" + loaihinhvanchuyen[0][0].TenVietTat + "', '" + loaihinhvanchuyen[0][0].TenLoaiHinh + "')")
                            IDLoaiHinhVanChuyen = create_lhvc[0][0].ID
                            TypeLoaiHinhVanChuyen = create_lhvc[0][0].TenVietTat
                        } else {
                            IDLoaiHinhVanChuyen = loaihinhvanchuyen2[0][0].ID
                            TypeLoaiHinhVanChuyen = loaihinhvanchuyen2[0][0].TenVietTat
                        }
                        let SoDonHang = TypeLoaiHinhVanChuyen + "." + date + month + year + "." + (getdonghang[0].length + 1).toString()
                        if (!loaivo[0][0]) {
                            IDLoaiVo = null
                        } else {
                            let loaivo2 = await db2.query("SELECT * FROM tblLoaiVo WHERE TenLoaiVo = '" + loaivo[0][0].TenLoaiVo + "'")
                            if (!loaivo2[0][0]) {
                                await db2.query("INSERT INTO tblLoaiVo (TenLoaiVo, GhiChu, TrangThai) values ('" + loaivo[0][0].TenLoaiVo + "', '" + loaivo[0][0].GhiChu + "', 0 )")
                                let create_lv = await db2.query("SELECT * FROM tblLoaiVo WHERE TenLoaiVo = '" + loaivo[0][0].TenLoaiVo + "'")
                                IDLoaiVo = create_lv[0][0].ID
                            } else {
                                IDLoaiVo = loaivo2[0][0].ID
                            }
                        }
                        if (!hangtau[0][0]) {
                            IDHangTau = null
                        } else {
                            let hangtau2 = await db2.query("SELECT * FROM tblHangTau WHERE BaiContainer = '" + hangtau[0][0].BaiContainer + "'")
                            if (!hangtau2[0][0]) {
                                await db2.query("INSERT INTO tblHangTau (BaiContainer, TenHangTau, GhiChu, TrangThai) values (N'" + hangtau[0][0].BaiContainer + "', N'" + hangtau[0][0].TenHangTau + "', N'" + hangtau[0][0].GhiChu + "', 0)")
                                let create_ht = await db2.query("SELECT * FROM tblHangTau WHERE TenHangTau = '" + hangtau[0][0].TenHangTau + "'")
                                IDHangTau = create_ht[0][0].ID
                            } else {
                                IDHangTau = hangtau2[0][0].ID
                            }
                        }
                        let diadiemdong = await db.query("SELECT * FROM tblKho WHERE ID= " + objOrder.IDDiaDiemDong)
                        if (diadiemdong[0][0]) {
                            DiaDiemDong = diadiemdong[0][0].Address
                            NguoiLayHang = diadiemdong[0][0].TenThuKho
                            SDTNguoiLay = diadiemdong[0][0].PhoneNumber
                        }
                        let diadiemtra = await db.query("SELECT * FROM tblKho WHERE ID= " + objOrder.IDDiaDiemTra)
                        if (diadiemtra[0][0]) {
                            DiaDiemTra = diadiemtra[0][0].Address
                            NguoiTraHang = diadiemtra[0][0].TenThuKho
                            SDTNguoiTra = diadiemtra[0][0].PhoneNumber
                        }
                        let dbMaster = await connectDatabase('STRUCK_CUSTOMER_DB')
                        let dbMasterQuery = await dbMaster.query("SELECT KeyConnect FROM CustomerDB WHERE NameDatabase = '" + data.dbname + "'")
                        if (!dbMasterQuery[0][0]) {
                            dbMaster = await connectDatabase('Customer_VTNAP')
                            dbMasterQuery = await dbMaster.query("SELECT KeyConnect FROM CustomerDB WHERE NameDatabase = '" + data.dbname + "'")
                        }
                        let khachhang = await db2.query("SELECT * FROM tblKhachHang WHERE KeyConnect = '" + dbMasterQuery[0][0].KeyConnect + "'")
                        IDKhachHang = khachhang[0][0].ID
                        let chiphiphatsinhchi = await db.query("SELECT * FROM tblChiPhiChiDonHang WHERE IDDonHang = " + data.id + " AND (ISCOM = 0 or ISCOM is null)")
                        let ChiPhiPhatSinhThu = 0
                        chiphiphatsinhchi[0].forEach(value => {
                            ChiPhiPhatSinhThu = ChiPhiPhatSinhThu + value.ChiPhiPhatSinhChi
                        })
                        let TongTienThu = CuocVanChuyen + ChiPhiPhatSinhThu
                        let CreateOrderQuery = "Insert INTO tblDonHang (IDLoaiHinhVanChuyen, IDDMXeCongTy, SoDonHang, CuocVanChuyen, GiaCuocThu, NgayDong, NgayTra, GioDong, GioTra, ChiPhiPhatSinhThu, TongTienThu, TrangThai, IDKhachHang, SoLuongVo, IDLoaiVo, IDHangTau, TrongLuong, NoiDong, DiaDiemDong, NoiTra,DiaDiemTra, PheDuyet, SoContainer, SoChi, NguoiLayHang, SDTNguoiLay, GhiChuLay, NguoiTraHang, SDTNguoiTra, GhiChuTra, GhiChuChiPhi, IDNhanVienCSKH,CreateDate, EditDate) values (" + IDLoaiHinhVanChuyen + "," + IDDMXeCongTy + ",'" + SoDonHang + "'," + CuocVanChuyen + "," + TongTienThu + ",'" + NgayDong + "','" + NgayTra + "','" + GioDong + "','" + GioTra + "'," + ChiPhiPhatSinhThu + "," + TongTienThu + ", N'MỚI'," + IDKhachHang + "," + SoLuongVo + "," + IDLoaiVo + "," + IDHangTau + ",'" + TrongLuong + "',N'" + NoiDong + "',N'" + DiaDiemDong + "',N'" + NoiTra + "',N'" + DiaDiemTra + "', N'ĐÃ DUYỆT','" + SoContainer + "','" + SoChi + "',N'" + NguoiLayHang + "','" + SDTNguoiLay + "',N'" + GhiChuLay + "',N'" + NguoiTraHang + "','" + SDTNguoiTra + "',N'" + GhiChuTra + "',N'" + GhiChuChiPhi + "'," + IDNhanVienKH + ",'" + CreateDate + "','" + EditDate + "')"
                        await db2.query(CreateOrderQuery)
                        let NewOrder = await db2.query("SELECT * FROM tblDonHang WHERE SoDonHang = '" + SoDonHang + "'")
                        let IDDonHang = NewOrder[0][0].ID
                        chiphiphatsinhchi[0].forEach(value => {
                            db2.query("INSERT INTO tblDoanhThuKhacChoXeCT (IDDonHang, TenDoanhThuKhac, ChiPhi) values ('" + IDDonHang + "', '" + value.TenChiPhiChi + "', " + value.ChiPhiPhatSinhChi + ")")
                        })
                        if (objOrder.ConfirmKH == 1) {
                            if (data.type.toUpperCase() == 'KEHOACH') {
                                await db.query("UPDATE tblDonHang SET ConfirmNX = 1, TrangThaiCho = N'KẾ HOẠCH HOÀN THÀNH', IDDMXeCongTy = NULL, BienSoXe = '" + data.xecongty.biensoxe + "', TenLaiXe = N'" + data.xecongty.tenlaixe + "', SDTLaiXe = '" + data.xecongty.sodienthoai + "' WHERE ID = " + data.id)
                            } else {
                                await db.query("UPDATE tblDonHang SET ConfirmNX = 1, TrangThaiCho = N'CHI PHÍ HOÀN THÀNH' WHERE ID = " + data.id)
                            }
                        } else {
                            await db.query("UPDATE tblDonHang SET ConfirmNX = 1, IDDMXeCongTy = NULL, BienSoXe = '" + data.xecongty.biensoxe + "', TenLaiXe = N'" + data.xecongty.tenlaixe + "', SDTLaiXe = '" + data.xecongty.sodienthoai + "' WHERE ID = " + data.id)
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
                        let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = '" + KeyConnect.KeyConnect + "'"
                        dbnameKH = await dbMaster.query(dbMasterQuery)
                        dbnameKH = dbnameKH[0][0]
                        if (dbnameKH) {
                            dbnameKH = dbnameKH.NameDatabase
                        } else {
                            let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = '" + KeyConnect.KeyConnect + "'"
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
                        let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = '" + IDNhaXe.KeyConnect + "'"
                        dbnameNX = await dbMaster.query(dbMasterQuery)
                        dbnameNX = dbnameNX[0][0]
                        if (dbnameNX) {
                            dbnameNX = dbnameNX.NameDatabase
                        } else {
                            let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = '" + IDNhaXe.KeyConnect + "'"
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
            socket.emit("Server-send-data", array);
            socket.emit("Server-send-contract-notification-schedule", arrayContract);
            socket.emit("Server-send-all-the-messages", {
                'qltsArray': array,
                'qlnsArray': arrayContract,
            });
            // await database.connectDatabase().then(async db => {
            //     if (db) {
            //         var insurancePremiums = await mtblMucDongBaoHiem(db).findOne({
            //             order: [
            //                 Sequelize.literal('max(DateEnd) DESC'),
            //             ],
            //             group: ['ID', 'CompanyBHXH', 'CompanyBHYT', 'CompanyBHTN', 'StaffBHXH', 'StaffBHYT', 'StaffBHTN', 'DateStart', 'StaffUnion', 'StaffBHTNLD', 'DateEnd', 'MinimumWage'],
            //             where: {
            //                 DateEnd: {
            //                     [Op.gte]: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss.SSS')
            //                 }
            //             }
            //         })
            //         if (insurancePremiums) {
            //             socket.emit("check-insurance-premiums", 1);
            //         }
            //     }
            // })
            clients[socket.id] = socket;

            socket.on('disconnect', function() {
                console.log(socket.id + " disconnected!");
                delete clients[socket.id];
            });
            // socket.on("disconnect", function() {
            //     console.log(socket.id + " disconnected!");
            // });
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
    socketEmitNotifiRequest: async(io, dbname) => {
        io.sockets.emit("sendrequest", { dbname: dbname });
    },
}