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
                        where: {
                            [Op.or]: [
                                {
                                    [Op.and]: {
                                        IDNhanVienKTPD: user[i].IDNhanvien,
                                        TrangThaiPheDuyetKT: 'Chờ phê duyệt',
                                    },
                                }, {
                                    [Op.and]: {
                                        TrangThaiPheDuyetKT: { [Op.ne]: 'Chờ phê duyệt' },
                                        IDNhanVienLDPD: user[i].IDNhanvien,
                                        TrangThaiPheDuyetLD: 'Chờ phê duyệt',
                                    }
                                }
                            ],
                        },
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
    return array
}
async function getStaffContractExpirationData() {
    var array = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            await mtblDMNhanvien(db).findAll().then(async staff => {
                for (var i = 0; i < staff.length; i++) {
                    let contract = await mtblHopDongNhanSu(db).findOne({
                        where: {
                            IDNhanVien: staff[i].ID,
                            Status: 'Có hiệu lực',
                            // Announced: false,
                        },
                        order: [
                            ['ID', 'DESC']
                        ],
                    })
                    if (contract) {
                        array.push({
                            staffName: staff[i].StaffName,
                            staffCode: staff[i].StaffCode,
                            contractDateEnd: contract.ContractDateEnd ? contract.ContractDateEnd : null,
                        })
                        await mtblHopDongNhanSu(db).update({
                            Announced: true,
                        }, {
                            where: {
                                ID: contract.ID,
                            },
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
module.exports = {
    sockketIO: async (io) => {
        io.on("connection", async function (socket) {
            console.log('The user is connecting : ' + socket.id);
            var array = await getPaymentAndREquest()
            var arrayContract = await getStaffContractExpirationData();
            io.sockets.emit("Server-send-data", array);
            socket.emit("Server-send-contract-notification-schedule", arrayContract);
            await database.connectDatabase().then(async db => {
                if (db) {
                    var insurancePremiums = await mtblMucDongBaoHiem(db).findOne({
                        order: [
                            Sequelize.literal('max(DateEnd) DESC'),
                        ],
                        group: ['ID', 'CompanyBHXH', 'CompanyBHYT', 'CompanyBHTN', 'StaffBHXH', 'StaffBHYT', 'StaffBHTN', 'DateStart', 'StaffUnion', 'StaffBHTNLD', 'DateEnd', 'MinimumWage'],
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
                                    where: {
                                        [Op.or]: [
                                            {
                                                [Op.and]: {
                                                    IDNhanVienKTPD: user[i].IDNhanvien,
                                                    TrangThaiPheDuyetKT: 'Chờ phê duyệt',
                                                },
                                            }, {
                                                [Op.and]: {
                                                    TrangThaiPheDuyetKT: { [Op.ne]: 'Chờ phê duyệt' },
                                                    IDNhanVienLDPD: user[i].IDNhanvien,
                                                    TrangThaiPheDuyetLD: 'Chờ phê duyệt',
                                                }
                                            }
                                        ],
                                    },
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
            });
        })
    },
}