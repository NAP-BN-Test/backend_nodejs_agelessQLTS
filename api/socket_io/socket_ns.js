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
var mtblHopDongNhanSu = require('../tables/hrmanage/tblHopDongNhanSu')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblMucDongBaoHiem = require('../tables/hrmanage/tblMucDongBaoHiem')

async function getAllLeaveOfUser(userID, type) {
    let array = []
    await database.connectDatabase().then(async db => {
        if (db) {
            let User = await mtblDMUser(db).findOne({ where: { ID: userID } })
            let tblNghiPhep = mtblNghiPhep(db);
            tblNghiPhep.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
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
                    model: mtblDMNhanvien(db),
                    required: false,
                    as: 'nv'
                },],
            }).then(async leave => {
                if (leave) {
                    for (l = 0; l < leave.length; l++) {
                        if (type == 'both' || type == 'request') {
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
                            }
                        }
                        if (type == 'both' || type == 'approved') {
                            if (leave[l].Status == 'Hoàn thành') {
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
                }
            })
        }
    })
    return array
}
async function getAllOvertimeOfUser(userID, type) {
    let array = []
    await database.connectDatabase().then(async db => {
        if (db) {
            let User = await mtblDMUser(db).findOne({ where: { ID: userID } })
            let tblNghiPhep = mtblNghiPhep(db);
            tblNghiPhep.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
            await tblNghiPhep.findAll({
                where: {
                    [Op.or]: [{
                        IDNhanVien: User.IDNhanvien,
                        Type: 'SignUp',
                    },
                    {
                        IDHeadDepartment: User.IDNhanvien,
                        Type: 'SignUp',
                    },
                    {
                        IDHeads: User.IDNhanvien,
                        Type: 'SignUp',
                    },
                    {
                        IDAdministrationHR: User.IDNhanvien,
                        Type: 'SignUp',
                    },
                    ]
                },
                include: [{
                    model: mtblDMNhanvien(db),
                    required: false,
                    as: 'nv'
                },],
            }).then(async leave => {
                if (leave) {
                    for (l = 0; l < leave.length; l++) {
                        if (type == 'both' || type == 'request') {
                            if (leave[l].Status == 'Chờ trưởng bộ phận phê duyệt' || leave[l].Status == 'Chờ trưởng bộ phận xác nhận') {
                                var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: leave[l].IDHeadDepartment } });
                                let objResult = {
                                    name: leave[l].nv ? leave[l].nv.StaffName : '',
                                    type: 'SignUp',
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
                                    type: 'SignUp',
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
                                    type: 'SignUp',
                                    userID: userID.ID,
                                    status: 'Yêu cầu duyệt',
                                    code: leave[l].NumberLeave,
                                    id: leave[l].ID,
                                }
                                array.push(objResult)
                            }
                        }
                        if (type == 'both' || type == 'approved') {
                            if (leave[l].Status == 'Hoàn thành') {
                                let objResult = {
                                    name: '',
                                    type: 'SignUp',
                                    userID: leave[l].IDNhanVien,
                                    status: 'Đã được duyệt',
                                    code: leave[l].NumberLeave,
                                    id: leave[l].ID,
                                }
                                array.push(objResult)
                            }
                        }

                    }
                }
            })
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
                },],
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
            array = []
        }
    })
    return array
}
async function getInsurancePremiums(socket) {
    let isNotiInscreaseInsurance = false
    await database.connectDatabase().then(async db => {
        if (db) {
            if (socket.userID) {
                let user = await mtblDMUser(db).findOne({
                    where: { ID: socket.userID }
                })
                if (user) {
                    let permissions = user.Permissions ? JSON.parse(user.Permissions) : {}
                    if (permissions.notiNS) {
                        for (let ts = 0; ts < permissions.notiNS.length; ts++) {
                            if (permissions.notiNS[ts].key == 'isNotiInscreaseInsurance' && permissions.notiNS[ts].completed == true) {
                                isNotiInscreaseInsurance = true
                            }
                        }
                    }
                }
                if (isNotiInscreaseInsurance == true) {
                    await database.connectDatabase().then(async db => {
                        if (db) {
                            var insurancePremiums = await mtblMucDongBaoHiem(db).findOne({
                                order: [
                                    Sequelize.literal('max(DateEnd) DESC'),
                                ],
                                group: ['ID', 'CompanyBHXH', 'CompanyBHYT', 'CompanyBHTN', 'StaffBHXH', 'StaffBHYT', 'StaffBHTN', 'DateStart', 'StaffUnion', 'StaffBHTNLD', 'DateEnd', 'MinimumWage'],
                                where: {
                                    DateEnd: {
                                        [Op.gte]: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss.SSS')
                                    }
                                }
                            })
                            if (insurancePremiums) {
                                socket.emit("insurance-premiums", 1);
                            }
                        }
                    })
                }
            }
        }
    })
}
async function getLeaveAndOvertimeOfUser(userID) {
    let isNotiApprovalTakeLeave = false
    let isNotiPersonalTakeLeave = false
    let isNotiApprovalSignUp = false
    let isNotiPersonalSignUp = false
    let isNotiContract = false
    let arrayResult = []
    await database.connectDatabase().then(async db => {
        if (db) {
            let user = await mtblDMUser(db).findOne({
                where: { ID: userID }
            })
            if (user) {
                let permissions = user.Permissions ? JSON.parse(user.Permissions) : {}
                if (permissions.notiNS) {
                    console.log(permissions.notiNS);
                    for (let ts = 0; ts < permissions.notiNS.length; ts++) {
                        if (permissions.notiNS[ts].key == 'isNotiApprovalTakeLeave' && permissions.notiNS[ts].completed == true) {
                            isNotiApprovalTakeLeave = true
                        }
                        if (permissions.notiNS[ts].key == 'isNotiPersonalTakeLeave' && permissions.notiNS[ts].completed == true) {
                            isNotiPersonalTakeLeave = true
                        }
                        if (permissions.notiNS[ts].key == 'isNotiApprovalSignUp' && permissions.notiNS[ts].completed == true) {
                            isNotiApprovalSignUp = true
                        }
                        if (permissions.notiNS[ts].key == 'isNotiPersonalSignUp' && permissions.notiNS[ts].completed == true) {
                            isNotiPersonalSignUp = true
                        }
                        // if (permissions.notiNS[ts].key == 'isNotiContract' && permissions.notiNS[ts].completed == true) {
                        //     isNotiContract = true
                        // }
                    }
                }
            }
            let arrayLeave = []
            let arrayOvertime = []
            //  approved: đã được duyệt, request: yêu cầu duyệt, both: cả hai
            if (isNotiApprovalTakeLeave == true && isNotiPersonalTakeLeave == true) {
                arrayLeave = await getAllLeaveOfUser(userID, 'both')
            } else if (isNotiApprovalTakeLeave == true && isNotiPersonalTakeLeave == false) {
                arrayLeave = await getAllLeaveOfUser(userID, 'request')
            } else if (isNotiApprovalTakeLeave == false && isNotiPersonalTakeLeave == true) {
                arrayLeave = await getAllLeaveOfUser(userID, 'approved')
            }

            if (isNotiApprovalSignUp == true && isNotiPersonalSignUp == true) {
                arrayOvertime = await getAllOvertimeOfUser(userID, 'both')
            } else if (isNotiApprovalSignUp == true && isNotiPersonalSignUp == false) {
                arrayOvertime = await getAllOvertimeOfUser(userID, 'request')
            } else if (isNotiApprovalSignUp == false && isNotiPersonalSignUp == true) {
                arrayOvertime = await getAllOvertimeOfUser(userID, 'approved')
            }
            // var arrayContract = []
            // if (isNotiContract == true) {
            //     arrayContract = await getStaffContractExpirationData();
            // }
            Array.prototype.push.apply(arrayResult, arrayLeave);
            Array.prototype.push.apply(arrayResult, arrayOvertime);
            // Array.prototype.push.apply(arrayResult, arrayContract);
        }
    })
    return arrayResult
}
async function getListContactExpiration(db) {
    let arrayResult = []
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
        },],
    }).then(contract => {
        if (contract.length > 0) {
            for (var i = 0; i < contract.length; i++) {
                arrayResult.push({
                    contractID: contract[i].ID,
                    staffName: contract[i].staff.StaffName,
                    staffCode: contract[i].staff.StaffCode,
                    contractDateEnd: contract[i].ContractDateEnd ? contract[i].ContractDateEnd : null,
                    noticeTime: contract[i].NoticeTime ? contract[i].NoticeTime : null,
                })
            }
        }
    })
    return arrayResult
}
async function getListContactDetail(db, id) {
    let obj = {}
    let now = moment().format('YYYY-MM-DD');
    let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    let tblHopDongNhanSu = mtblHopDongNhanSu(db);
    tblHopDongNhanSu.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'staff' })
    await tblHopDongNhanSu.findOne({
        where: {
            [Op.or]: [{
                Status: 'Có hiệu lực',
                Time: {
                    [Op.eq]: null
                },
                NoticeTime: {
                    [Op.substring]: now
                },
                ID: id
            },
            {
                Status: 'Có hiệu lực',
                NoticeTime: {
                    [Op.substring]: now
                },
                Time: {
                    [Op.lte]: nowTime
                },
                ID: id
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
        },],
    }).then(contract => {
        if (contract) {
            obj = {
                contractID: contract.ID,
                staffName: contract.staff.StaffName,
                staffCode: contract.staff.StaffCode,
                contractDateEnd: contract.ContractDateEnd ? contract.ContractDateEnd : null,
                noticeTime: contract.NoticeTime ? contract.NoticeTime : null,
            }
        }
    })
    return obj
}
async function getStaffContractExpirationDataFollowSocket(socket, id) {
    var array = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            if (socket.userID) {
                let isNotiContract = false
                let user = await mtblDMUser(db).findOne({
                    where: { ID: socket.userID }
                })
                if (user) {
                    let permissions = user.Permissions ? JSON.parse(user.Permissions) : {}
                    if (permissions.notiNS) {
                        console.log(permissions.notiNS);
                        for (let ts = 0; ts < permissions.notiNS.length; ts++) {
                            if (permissions.notiNS[ts].key == 'isNotiContract' && permissions.notiNS[ts].completed == true) {
                                isNotiContract = true
                            }
                        }
                    }
                }
                if (isNotiContract == true) {
                    array = await getListContactExpiration(db)
                    socket.emit("contract-expiration", array);
                    obj = await getListContactDetail(db, id)
                    console.log(obj);
                    socket.emit("contract-expiration-detail", obj);
                }
            }
        }
    })
}
async function getDetailLeaveOrOvertime(id) {
    var obj = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            let tblNghiPhep = mtblNghiPhep(db);
            tblNghiPhep.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
            await tblNghiPhep.findOne({
                where: {
                    ID: id
                },
                include: [{
                    model: mtblDMNhanvien(db),
                    required: false,
                    as: 'nv'
                },],
            }).then(async data => {
                if (data) {
                    if (data.Type == 'TakeLeave') {
                        if (data.Status == 'Chờ trưởng bộ phận phê duyệt') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDHeadDepartment } })
                            obj = {
                                name: data.nv ? data.nv.StaffName : '',
                                type: 'TakeLeave',
                                userID: User.ID,
                                status: 'Yêu cầu duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        } else if (data.Status == 'Chờ thủ trưởng phê duyệt') {
                            obj = {
                                name: data.nv ? data.nv.StaffName : '',
                                type: 'TakeLeave',
                                userID: User.ID,
                                status: 'Yêu cầu duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        } else if (data.Status == 'Chờ hành chính nhân sự phê duyệt') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDAdministrationHR } })

                            obj = {
                                name: data.nv ? data.nv.StaffName : '',
                                type: 'TakeLeave',
                                userID: User.ID,
                                status: 'Yêu cầu duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        } else if (data.Status == 'Hoàn thành') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDNhanVien } })
                            obj = {
                                name: '',
                                type: 'TakeLeave',
                                userID: User.ID,
                                status: 'Đã được duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        }
                    } else {
                        if (data.Status == 'Chờ trưởng bộ phận phê duyệt') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDHeadDepartment } })
                            obj = {
                                name: data.nv ? data.nv.StaffName : '',
                                type: 'SignUp',
                                userID: User.ID,
                                status: 'Yêu cầu duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        } else if (data.Status == 'Chờ trưởng bộ phận xác nhận') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDHeadDepartment } })
                            obj = {
                                name: data.nv ? data.nv.StaffName : '',
                                type: 'SignUp',
                                userID: User.ID,
                                status: 'Yêu cầu duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        } else if (data.Status == 'Chờ thủ trưởng phê duyệt') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDHeads } })
                            obj = {
                                name: data.nv ? data.nv.StaffName : '',
                                type: 'SignUp',
                                userID: User.ID,
                                status: 'Yêu cầu duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        } else if (data.Status == 'Chờ hành chính nhân sự phê duyệt') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDAdministrationHR } })
                            obj = {
                                name: data.nv ? data.nv.StaffName : '',
                                type: 'SignUp',
                                userID: User.ID,
                                status: 'Yêu cầu duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        } else if (data.Status == 'Hoàn thành') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDNhanVien } })
                            obj = {
                                name: '',
                                type: 'SignUp',
                                userID: User.ID,
                                status: 'Đã được duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        }
                    }
                }
            })
        }
    })
    return obj
}
module.exports = {
    sockketIO: async (io) => {
        io.on("connection", async function (socket) {
            console.log('The user is connecting : ' + socket.id);
            //  gửi cho chính socket đang đăng nhập check quyền
            socket.on("insurance-premiums", async function () {
                await getInsurancePremiums(socket)
            });
            socket.on("contract-expiration", async function (data) {
                console.log('--------------------------contract-expiration----------------------', data);
                await getStaffContractExpirationDataFollowSocket(socket, data)
            });
            socket.on("system-wide-notification-ns", async (data) => {
                console.log(socket.userID, '----------------- system-wide-notification-ns -------------------');
                if (socket.userID) {
                    let array = await getLeaveAndOvertimeOfUser(socket.userID);
                    socket.emit("system-wide-notification-ns", array)
                }
            })
            socket.on("notice-create-leave-or-overtime", async (data) => {
                let obj = await getDetailLeaveOrOvertime(data)
                console.log(data, '---------------------------------notice-create-leave-or-overtime-------------------------------------');
                if (obj && obj.type == 'TakeLeave') {
                    let roomLeave = io.sockets.adapter.rooms['isNotiApprovalTakeLeave'].sockets
                    if (obj.status == 'Đã được duyệt') {
                        roomLeave = io.sockets.adapter.rooms['isNotiPersonalTakeLeave'].sockets
                    }
                    //  Laays danh sách socket trong room
                    roomLeave = Object.keys(roomLeave)
                    for (let s = 0; s < roomLeave.length; s++) {
                        let socketGet = io.sockets.connected[roomLeave[s]]
                        console.log(socketGet.userID);
                        if (obj.userID == socketGet.userID)
                            io.sockets.in(socketGet.id).emit('receive-data', obj)
                        else
                            io.sockets.in(socketGet.id).emit('receive-data', null)

                    }
                } else {
                    let roomOvertime = io.sockets.adapter.rooms['isNotiApprovalSignUp'].sockets
                    if (obj.status == 'Đã được duyệt') {
                        roomOvertime = io.sockets.adapter.rooms['isNotiPersonalSignUp'].sockets
                    }
                    //  Laays danh sách socket trong room
                    roomOvertime = Object.keys(roomOvertime)
                    for (let s = 0; s < roomOvertime.length; s++) {
                        let socketGet = io.sockets.connected[roomOvertime[s]]
                        console.log(socketGet.id);
                        if (obj.userID == socketGet.userID)
                            io.sockets.in(socketGet.id).emit('receive-data', obj)
                        else
                            io.sockets.in(socketGet.id).emit('receive-data', null)

                    }
                }
                console.log(io.sockets.adapter.rooms);
            })
            socket.on("disconnect", function () {
                console.log(socket.id + " disconnected!");
            });
        })
    },
}