var moment = require('moment');
var fs = require('fs');
var database = require('../database');
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;
var mtblDMNhanvien = require("../tables/constants/tblDMNhanvien");
var mtblHopDongNhanSu = require('../tables/hrmanage/tblHopDongNhanSu')
const bodyParser = require('body-parser');
var mtblDMUser = require('../tables/constants/tblDMUser');
var mtblNghiPhep = require('../tables/hrmanage/tblNghiPhep')
async function getAllLeaveOfUser(userID) {
    let array = []
    await database.connectDatabase().then(async db => {
        if (db) {
            let User = await mtblDMUser(db).findOne({ where: { ID: userID } })
            let tblNghiPhep = mtblNghiPhep(db);
            tblNghiPhep.belongsTo(mtblDMUser(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
            await tblNghiPhep.findAll({
                where: {
                    [Op.or]: [{
                                IDNhanVien: User.IDNhanvien,
                                Type: 'TakeLeave',
                            },
                            {
                                IDHeadDepartment: User.IDNhanvien,
                                Type: 'TakeLeave',
                            },
                            {
                                IDHeads: User.IDNhanvien,
                                Type: 'TakeLeave',
                            },
                            {
                                IDAdministrationHR: User.IDNhanvien,
                                Type: 'TakeLeave',
                            },
                        ]
                        // Type: 'SignUp',
                },
                include: [{
                    model: mtblDMUser(db),
                    required: false,
                    as: 'nv'
                }, ],
            }).then(async leave => {
                if (leave) {
                    for (l = 0; l < leave.length; l++) {
                        if (leave[l].Status == 'Chờ trưởng bộ phận phê duyệt') {
                            var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: leave[l].IDHeadDepartment } });
                            let objResult = {
                                name: leave[l].nv ? leave[l].nv.StaffName : '',
                                type: 'TakeLeave',
                                userID: userID.ID,
                                status: 'Yêu cầu duyệt',
                                code: leave[l].NumberLeave,
                                id: leave[l].ID,
                            }
                            array.push(objResult)
                        } else if (leave[l].Status == 'Chờ thủ trưởng phê duyệt') {
                            var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: leave[l].IDHeads } });
                            let objResult = {
                                name: leave[l].nv ? leave[l].nv.StaffName : '',
                                type: 'TakeLeave',
                                userID: userID.ID,
                                status: 'Yêu cầu duyệt',
                                code: leave[l].NumberLeave,
                                id: leave[l].ID,
                            }
                            array.push(objResult)
                        } else if (leave[l].Status == 'Chờ hành chính nhân sự phê duyệt') {
                            var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: leave[l].IDAdministrationHR } });
                            let objResult = {
                                name: leave[l].nv ? leave[l].nv.StaffName : '',
                                type: 'TakeLeave',
                                userID: userID.ID,
                                status: 'Yêu cầu duyệt',
                                code: leave[l].NumberLeave,
                                id: leave[l].ID,
                            }
                            array.push(objResult)
                        } else if (leave[l].Status == 'Hoàn thành') {
                            let objResult = {
                                name: '',
                                type: 'TakeLeave',
                                userID: leave[l].IDNhanVien,
                                status: 'Đã được duyệt',
                                code: leave[l].NumberLeave,
                                id: leave[l].ID,
                            }
                            array.push(objResult)
                        }
                    }
                }
            })
        }
    })
    return array
}

async function getLeaveAndOvertimeOfUser(userID) {
    let arrayResult = []
    let arrayLeave = await getAllLeaveOfUser(userID)
    Array.prototype.push.apply(arrayResult, arrayLeave);
    return arrayResult
}
module.exports = {
    sockketIO: async(io) => {
        io.on("connection", async function(socket) {
            console.log('The user is connecting : ' + socket.id);
            //  gửi cho chính socket đang đăng nhập check quyền
            socket.on("system-wide-notification-ns", async(data) => {
                console.log(socket.userID, '----------------- get data -------------------');
                if (socket.userID) {
                    let array = await getLeaveAndOvertimeOfUser(socket.userID);
                    socket.emit("system-wide-notification-ns", array)
                }
            })
            socket.on("disconnect", function() {
                console.log(socket.id + " disconnected!");
            });
        })
    },
}