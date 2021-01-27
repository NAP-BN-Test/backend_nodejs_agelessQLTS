const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblYeuCauMuaSam = require('../tables/qlnb/tblYeuCauMuaSam')
var mtblYeuCauMuaSamDetail = require('../tables/qlnb/tblYeuCauMuaSamDetail')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMHangHoa = require('../tables/qlnb/tblDMHangHoa');
var mtblDMLoaiTaiSan = require('../tables/qlnb/tblDMLoaiTaiSan');
var mtblFileAttach = require('../tables/constants/tblFileAttach');
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblDMChiNhanh = require('../tables/constants/tblDMChiNhanh')
var mtblDMUser = require('../tables/constants/tblDMUser');

var database = require('../database');
async function deleteRelationshiptblYeuCauMuaSam(db, listID) {
    await mtblYeuCauMuaSamDetail(db).destroy({
        where: {
            IDYeuCauMuaSam: { [Op.in]: listID }
        }
    })
    await mtblFileAttach(db).destroy({
        where: {
            IDYeuCauMuaSam: { [Op.in]: listID }
        }
    })
    await mtblYeuCauMuaSam(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblYeuCauMuaSam,
    // add_tbl_yeucaumuasam
    addtblYeuCauMuaSam: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var deparment = await mtblDMNhanvien(db).findOne({ where: { ID: body.idNhanVien } })
                    console.log(deparment.IDBoPhan, body.idNhanVien);
                    mtblYeuCauMuaSam(db).create({
                        IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                        IDPhongBan: deparment ? deparment.IDBoPhan ? deparment.IDBoPhan : null : null,
                        RequireDate: body.requireDate ? body.requireDate : null,
                        Reason: body.reason ? body.reason : '',
                        Status: 'Chờ phê duyệt',
                        IDPheDuyet1: body.idPheDuyet1 ? body.idPheDuyet1 : null,
                        IDPheDuyet2: body.idPheDuyet2 ? body.idPheDuyet2 : null,
                    }).then(async data => {
                        body.fileAttach = JSON.parse(body.fileAttach)
                        if (body.fileAttach.length > 0)
                            for (var j = 0; j < body.fileAttach.length; j++)
                                await mtblFileAttach(db).update({
                                    IDYeuCauMuaSam: data.ID,
                                }, {
                                    where: {
                                        ID: body.fileAttach[j].id
                                    }
                                })
                        body.line = JSON.parse(body.line)
                        if (body.line.length > 0)
                            for (var i = 0; i < body.line.length; i++) {
                                await mtblYeuCauMuaSamDetail(db).create({
                                    IDYeuCauMuaSam: data.ID,
                                    IDDMHangHoa: body.line[i].idDMHangHoa.id,
                                    Amount: body.line[i].amount,
                                    Price: body.line[i].unitPrice,
                                })
                            }
                        var result = {
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        res.json(result);
                    })
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // update_tbl_yeucaumuasam
    updatetblYeuCauMuaSam: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.idNhanVien || body.idNhanVien === '') {
                        if (body.idNhanVien === '')
                            update.push({ key: 'IDNhanVien', value: null });
                        else
                            update.push({ key: 'IDNhanVien', value: body.idNhanVien });
                    }
                    if (body.idPhongBan || body.idPhongBan === '') {
                        if (body.idPhongBan === '')
                            update.push({ key: 'IDPhongBan', value: null });
                        else
                            update.push({ key: 'IDPhongBan', value: body.idPhongBan });
                    }
                    if (body.requireDate || body.requireDate === '') {
                        if (body.requireDate === '')
                            update.push({ key: 'RequireDate', value: null });
                        else
                            update.push({ key: 'RequireDate', value: body.requireDate });
                    }
                    body.line = JSON.parse(body.line)
                    body.fileAttach = JSON.parse(body.fileAttach)

                    if (body.fileAttach.length > 0)
                        for (var j = 0; j < body.fileAttach.length; j++)
                            await mtblFileAttach(db).update({
                                IDYeuCauMuaSam: body.id,
                            }, {
                                where: {
                                    ID: body.fileAttach[j].id
                                }
                            })
                    console.log(body.line);
                    if (body.line.length > 0) {
                        await mtblYeuCauMuaSamDetail(db).destroy({
                            where: { IDYeuCauMuaSam: body.id }
                        })
                        for (var i = 0; i < body.line.length; i++) {
                            await mtblYeuCauMuaSamDetail(db).create({
                                IDYeuCauMuaSam: body.id,
                                IDDMHangHoa: body.line[i].idDMHangHoa.id,
                                Amount: body.line[i].amount,
                                Price: body.line[i].unitPrice ? body.line[i].unitPrice : 0
                            })
                        }
                    }

                    if (body.reason || body.reason === '')
                        update.push({ key: 'Reason', value: body.reason });
                    if (body.idPheDuyet2 || body.idPheDuyet2 === '') {
                        if (body.idPheDuyet2 === '')
                            update.push({ key: 'IDPheDuyet2', value: null });
                        else
                            update.push({ key: 'IDPheDuyet2', value: body.idPheDuyet2 });
                    }
                    if (body.idPheDuyet1 || body.idPheDuyet1 === '') {
                        if (body.idPheDuyet1 === '')
                            update.push({ key: 'IDPheDuyet1', value: null });
                        else
                            update.push({ key: 'IDPheDuyet1', value: body.idPheDuyet1 });
                    }
                    database.updateTable(update, mtblYeuCauMuaSam(db), body.id).then(response => {
                        if (response == 1) {
                            res.json(Result.ACTION_SUCCESS);
                        } else {
                            res.json(Result.SYS_ERROR_RESULT);
                        }
                    })
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // delete_tbl_yeucaumuasam
    deletetblYeuCauMuaSam: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            let body = req.body;
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblYeuCauMuaSam(db, listID);
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },


    // approval_first_approver
    approvalFirstApprover: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            let body = req.body;
            if (db) {
                try {
                    await mtblYeuCauMuaSam(db).update({
                        Status: 'Đang phê duyệt',
                    }, { where: { ID: body.id } })
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // approval_second_approver
    approvalSecondApprover: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            let body = req.body;
            if (db) {
                try {
                    await mtblYeuCauMuaSam(db).update({
                        Status: 'Đã phê duyệt',
                    }, { where: { ID: body.id } })
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // refuse_first_approver
    refuseFirstApprover: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblYeuCauMuaSam(db).update({
                        ReasonReject1: body.reason,
                        Status: 'Từ chối',
                    }, { where: { ID: body.id } })
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // refuse_second_approver
    refuseSecondApprover: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblYeuCauMuaSam(db).update({
                        ReasonReject2: body.reason,
                        Status: 'Từ chối',
                    }, { where: { ID: body.id } })
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // cancel_purchase
    cancelPurchase: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblYeuCauMuaSam(db).update({
                        Status: 'Hủy mua',
                        ReasonReject: body.reason
                    }, { where: { ID: body.id } })
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // done_purchase
    donePurchase: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblYeuCauMuaSam(db).update({
                        Status: 'Đã mua',
                        ReasonReject: body.reason,
                    }, { where: { ID: body.id } })
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },



    // get_list_tbl_yeucaumuasam
    getListtblYeuCauMuaSam: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let whereObj = []
                    let where = []
                    let whereSecond = []
                    let userObj = [];
                    if (body.status === "request") {
                        where = [
                            { Status: "Chờ phê duyệt" },
                            { Status: "Đang phê duyệt" },
                            { Status: "Từ chối" },
                        ]
                        if (body.userID) {
                            let staff = await mtblDMUser(db).findOne({
                                where: { ID: body.userID }
                            })
                            if (staff && staff.Username.toUpperCase() != 'ADMIN') {
                                userObj.push({ IDPheDuyet1: staff.IDNhanvien })
                                userObj.push({ IDNhanVien: staff.IDNhanvien })
                                userObj.push({ IDPheDuyet2: staff.IDNhanvien })
                            }

                        }
                    }
                    if (body.status === "approval") {
                        where = [
                            { Status: "Đã phê duyệt" },
                            { Status: "Hủy mua" },
                        ]
                        if (body.userID) {
                            let staff = await mtblDMUser(db).findOne({
                                where: { ID: body.userID }
                            })
                            if (staff && staff.Username.toUpperCase() != 'ADMIN') {
                                userObj.push({ IDNhanVien: staff.IDNhanvien })
                            }

                        }
                    }
                    if (body.status === "success") {
                        where = [
                            { Status: "Đã mua" },
                        ]
                        if (body.userID) {
                            let staff = await mtblDMUser(db).findOne({
                                where: { ID: body.userID }
                            })
                            if (staff && staff.Username.toUpperCase() != 'ADMIN') {
                                userObj.push({ IDNhanVien: staff.IDNhanvien })
                            }

                        }
                    }
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)
                        if (data.search) {
                            var listStaff = [];
                            await mtblDMNhanvien(db).findAll({
                                where: {
                                    [Op.or]: [
                                        { StaffName: { [Op.like]: '%' + data.search + '%' } },
                                        { StaffCode: { [Op.like]: '%' + data.search + '%' } }
                                    ]
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    listStaff.push(item.ID);
                                })
                            })
                            var listDepartment = [];
                            await mtblDMBoPhan(db).findAll({
                                where: {
                                    [Op.or]: [
                                        { DepartmentCode: { [Op.like]: '%' + data.search + '%' } },
                                        { DepartmentName: { [Op.like]: '%' + data.search + '%' } }
                                    ]
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    listDepartment.push(item.ID);
                                })
                            })

                            var listGoods = [];
                            await mtblDMHangHoa(db).findAll({
                                where: {
                                    [Op.or]: [
                                        { Name: { [Op.like]: '%' + data.search + '%' } },
                                        { Code: { [Op.like]: '%' + data.search + '%' } }
                                    ]
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    listGoods.push(item.ID);
                                })
                            })

                            var listYCMS = [];
                            await mtblYeuCauMuaSamDetail(db).findAll({
                                where: { IDDMHangHoa: { [Op.in]: listGoods } }
                            }).then(data => {
                                data.forEach(item => {
                                    listYCMS.push(item.IDYeuCauMuaSam);
                                })
                            })

                            whereSecond.push(
                                { Status: { [Op.like]: '%' + data.search + '%' } }
                            )
                            whereSecond.push(
                                { IDNhanVien: { [Op.in]: listStaff } },
                            )
                            whereSecond.push(
                                { IDPhongBan: { [Op.in]: listDepartment } },
                            )
                            whereSecond.push(
                                { ID: { [Op.in]: listYCMS } }
                            )
                        } else {
                            whereSecond.push({
                                Status: { [Op.like]: '%%' },
                            })
                        }
                        if (userObj.length > 0)

                            whereObj = {
                                [Op.or]: where,
                                [Op.and]: [{ [Op.or]: whereSecond }, { [Op.or]: userObj }]
                            }
                        else

                            whereObj = {
                                [Op.or]: where,
                                [Op.and]: [{ [Op.or]: whereSecond }]
                            }
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'TRẠNG THÁI') {
                                    userFind['Status'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereObj[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereObj[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereObj[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'BỘ PHẬN ĐỀ XUẤT') {
                                    var list = [];
                                    await mtblDMBoPhan(db).findAll({
                                        where: {
                                            [Op.or]: [
                                                { DepartmentName: { [Op.like]: '%' + data.items[i]['searchFields'] + '%' } },
                                                { DepartmentCode: { [Op.like]: '%' + data.items[i]['searchFields'] + '%' } },
                                            ]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.ID);
                                        })
                                    })
                                    userFind['IDPhongBan'] = { [Op.in]: list }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereObj[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereObj[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereObj[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'NHÂN VIÊN') {
                                    var list = [];
                                    await mtblDMNhanvien(db).findAll({
                                        where: {
                                            [Op.or]: [
                                                { StaffName: { [Op.like]: '%' + data.items[i]['searchFields'] + '%' } },
                                                { StaffCode: { [Op.like]: '%' + data.items[i]['searchFields'] + '%' } },
                                            ]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.ID);
                                        })
                                    })
                                    userFind['IDNhanVien'] = { [Op.in]: list }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereObj[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereObj[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereObj[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'MÃ TS/TB/LK') {
                                    var listGoods = [];
                                    await mtblDMHangHoa(db).findAll({
                                        where: {
                                            [Op.or]: [
                                                { Code: { [Op.like]: '%' + data.items[i]['searchFields'] + '%' } }
                                            ]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            listGoods.push(item.ID);
                                        })
                                    })

                                    var listYCMS = [];
                                    await mtblYeuCauMuaSamDetail(db).findAll({
                                        where: { IDDMHangHoa: { [Op.in]: listGoods } }
                                    }).then(data => {
                                        data.forEach(item => {
                                            listYCMS.push(item.IDYeuCauMuaSam);
                                        })
                                    })
                                    userFind['ID'] = { [Op.in]: listYCMS }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereObj[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereObj[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereObj[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'TÊN TS/TB/LK') {
                                    var listGoods = [];
                                    await mtblDMHangHoa(db).findAll({
                                        where: {
                                            [Op.or]: [
                                                { Name: { [Op.like]: '%' + data.items[i]['searchFields'] + '%' } },
                                            ]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            listGoods.push(item.ID);
                                        })
                                    })

                                    var listYCMS = [];
                                    await mtblYeuCauMuaSamDetail(db).findAll({
                                        where: { IDDMHangHoa: { [Op.in]: listGoods } }
                                    }).then(data => {
                                        data.forEach(item => {
                                            listYCMS.push(item.IDYeuCauMuaSam);
                                        })
                                    })
                                    userFind['ID'] = { [Op.in]: listYCMS }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereObj[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereObj[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereObj[Op.not] = userFind
                                    }
                                }
                            }
                        }
                    }
                    let stt = 1;
                    let tblYeuCauMuaSam = mtblYeuCauMuaSam(db); // bắt buộc
                    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
                    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet1', sourceKey: 'IDPheDuyet1', as: 'PheDuyet1' })
                    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet2', sourceKey: 'IDPheDuyet2', as: 'PheDuyet2' })
                    tblYeuCauMuaSam.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDPhongBan', sourceKey: 'IDPhongBan', as: 'phongban' })
                    let tblYeuCauMuaSamDetail = mtblYeuCauMuaSamDetail(db);
                    tblYeuCauMuaSam.hasMany(tblYeuCauMuaSamDetail, { foreignKey: 'IDYeuCauMuaSam', as: 'line' })
                    tblYeuCauMuaSam.findAll({
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
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereObj
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var reasonReject = '';
                            console.log(element.ReasonReject1, element.ReasonReject2, element.ReasonReject);
                            if (element.ReasonReject1) {
                                reasonReject = 'Người phê duyệt trước đã từ chối: ' + element.ReasonReject1
                            }
                            if (element.ReasonReject2) {
                                reasonReject = 'Người phê duyệt sau đã từ chối: ' + element.ReasonReject2
                            }
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                idNhanVien: element.IDNhanVien ? element.IDNhanVien : null,
                                nameIDNhanVien: element.NhanVien ? element.NhanVien.StaffName : null,
                                idPhongBan: element.IDPhongBan ? element.IDPhongBan : null,
                                codePhongBan: element.phongban ? element.phongban.DepartmentCode : null,
                                namePhongBan: element.phongban ? element.phongban.DepartmentName : null,
                                requireDate: element.RequireDate ? moment(element.RequireDate).format('DD/MM/YYYY') : null,
                                reason: element.Reason ? element.Reason : '',
                                status: element.Status ? element.Status : '',
                                idPheDuyet1: element.IDPheDuyet1 ? element.IDPheDuyet1 : null,
                                namePheDuyet1: element.PheDuyet1 ? element.PheDuyet1.StaffName : null,
                                idPheDuyet2: element.IDPheDuyet2 ? element.IDPheDuyet2 : null,
                                namePheDuyet2: element.PheDuyet2 ? element.PheDuyet2.StaffName : null,
                                reasonReject: reasonReject,
                                line: element.line,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        for (var i = 0; i < array.length; i++) {
                            var arrayTaiSan = []
                            var arrayFile = []
                            var total = 0;
                            for (var j = 0; j < array[i].line.length; j++) {
                                await mtblDMHangHoa(db).findOne({ where: { ID: array[i].line[j].IDDMHangHoa } }).then(data => {
                                    var price = array[i].line[j].Price ? array[i].line[j].Price : 0
                                    var amount = array[i].line[j].Amount ? array[i].line[j].Amount : 0

                                    if (data) {
                                        total += amount * price
                                        arrayTaiSan.push({
                                            name: data.Name,
                                            code: data.Code,
                                            amount: amount,
                                            unitPrice: price,
                                            id: array[i].line[j].id,
                                        })
                                    }
                                })
                            }
                            array[i]['price'] = total;
                            await mtblFileAttach(db).findAll({ where: { IDYeuCauMuaSam: array[i].id } }).then(file => {
                                if (file.length > 0) {
                                    for (var e = 0; e < file.length; e++) {
                                        arrayFile.push({
                                            name: file[e].Name ? file[e].Name : '',
                                            link: file[e].Link ? file[e].Link : '',
                                        })
                                    }
                                }
                            })
                            array[i]['arrayTaiSan'] = arrayTaiSan;
                            array[i]['arrayFile'] = arrayFile;

                        }
                        var count = await tblYeuCauMuaSam.count({ where: whereObj })
                        var result = {
                            array: array,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                            all: count
                        }
                        res.json(result);
                    })

                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // get_detail_tbl_yeucaumuasam
    getDetailtblYeuCauMuaSam: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    let tblYeuCauMuaSam = mtblYeuCauMuaSam(db); // bắt buộc
                    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
                    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet1', sourceKey: 'IDPheDuyet1', as: 'PheDuyet1' })
                    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet2', sourceKey: 'IDPheDuyet2', as: 'PheDuyet2' })
                    tblYeuCauMuaSam.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDPhongBan', sourceKey: 'IDPhongBan', as: 'phongban' })
                    let tblYeuCauMuaSamDetail = mtblYeuCauMuaSamDetail(db);
                    tblYeuCauMuaSam.hasMany(tblYeuCauMuaSamDetail, { foreignKey: 'IDYeuCauMuaSam', as: 'line' })

                    tblYeuCauMuaSam.findOne({
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
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: { ID: body.id }
                    }).then(async data => {
                        var obj = {
                            stt: stt,
                            id: Number(data.ID),
                            idNhanVien: data.IDNhanVien ? data.IDNhanVien : null,
                            nameNhanVien: data.NhanVien ? data.NhanVien.StaffName : null,
                            idPhongBan: data.IDPhongBan ? data.IDPhongBan : null,
                            codePhongBan: data.phongban ? data.phongban.DepartmentCode : null,
                            namePhongBan: data.phongban ? data.phongban.DepartmentName : null,
                            requireDate: data.RequireDate ? moment(data.RequireDate).format('DD/MM/YYYY') : null,
                            reason: data.Reason ? data.Reason : '',
                            status: data.Status ? data.Status : '',
                            idPheDuyet1: data.IDPheDuyet1 ? data.IDPheDuyet1 : null,
                            namePheDuyet1: data.PheDuyet1 ? data.PheDuyet1.StaffName : null,
                            idPheDuyet2: data.IDPheDuyet2 ? data.IDPheDuyet2 : null,
                            namePheDuyet2: data.PheDuyet2 ? data.PheDuyet2.StaffName : null,
                            line: data.line
                        }
                        var arrayTaiSan = []
                        var arrayFile = []
                        var total = 0;
                        for (var j = 0; j < obj.line.length; j++) {
                            var price = obj.line[j].Price ? obj.line[j].Price : 0
                            var amount = obj.line[j].Amount ? obj.line[j].Amount : 0
                            total += amount * price
                            let tblDMHangHoa = mtblDMHangHoa(db);
                            tblDMHangHoa.belongsTo(mtblDMLoaiTaiSan(db), { foreignKey: 'IDDMLoaiTaiSan', sourceKey: 'IDDMLoaiTaiSan', as: 'loaiTaiSan' })
                            await tblDMHangHoa.findOne({
                                where: {
                                    ID: obj.line[j].IDDMHangHoa,
                                },
                                include: [
                                    {
                                        model: mtblDMLoaiTaiSan(db),
                                        required: false,
                                        as: 'loaiTaiSan'
                                    },
                                ],
                            }).then(data => {
                                arrayTaiSan.push({
                                    id: Number(data.ID),
                                    name: data.Name,
                                    code: data.Code,
                                    amount: obj.line[j] ? obj.line[j].Amount : 0,
                                    nameLoaiTaiSan: data.loaiTaiSan ? data.loaiTaiSan.Name : '',
                                    idLine: obj.line[j].ID,
                                    amount: amount,
                                    unitPrice: price,
                                })
                            })
                        }
                        obj['price'] = total;
                        await mtblFileAttach(db).findAll({ where: { IDYeuCauMuaSam: obj.id } }).then(file => {
                            if (file.length > 0) {
                                for (var e = 0; e < file.length; e++) {
                                    arrayFile.push({
                                        name: file[e].Name ? file[e].Name : '',
                                        link: file[e].Link ? file[e].Link : '',
                                    })
                                }
                            }
                        })
                        obj['arrayTaiSan'] = arrayTaiSan;
                        obj['arrayFile'] = arrayFile;

                        var result = {
                            obj: obj,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        res.json(result);
                    })

                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },

}