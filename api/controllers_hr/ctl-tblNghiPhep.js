const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblNghiPhep = require('../tables/hrmanage/tblNghiPhep')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblLoaiChamCong = require('../tables/hrmanage/tblLoaiChamCong')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan');

async function deleteRelationshiptblNghiPhep(db, listID) {
    await mtblNghiPhep(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
var mModules = require('../constants/modules');

var enumerateDaysBetweenDates = function (startDate, endDate) {
    var dates = [];
    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');
    while (currDate.add(1, 'days').diff(lastDate) < 0) {
        dates.push(moment(currDate.clone().toDate()).format('YYYY-MM-DD'));
    }

    return dates;
};
module.exports = {
    deleteRelationshiptblNghiPhep,
    // add_tbl_nghiphep
    addtblNghiPhep: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var number = 1;
                    var code = 'DXN'
                    await mtblNghiPhep(db).findOne({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(data => {
                        if (data)
                            if (data.NumberLeave) {
                                number = Number(data.NumberLeave.slice(3, 100)) + 1
                            }
                    })
                    code += number
                    mtblNghiPhep(db).create({
                        DateStart: body.dateStart ? moment(body.dateStart).format('DD-MM-YYYY HH:mm:ss.SSS') : null,
                        DateEnd: body.dateEnd ? moment(body.dateEnd).format('DD-MM-YYYY HH:mm:ss.SSS') : null,
                        IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                        IDLoaiChamCong: body.idLoaiChamCong ? body.idLoaiChamCong : null,
                        NumberLeave: code,
                        Type: body.type ? body.type : '',
                        Date: body.date ? body.date : null,
                        Remaining: body.remaining ? body.remaining : 0,
                        IDHeadDepartment: body.idHeadDepartment ? body.idHeadDepartment : null,
                        IDAdministrationHR: body.idAdministrationHR ? body.idAdministrationHR : null,
                        IDHeads: body.idHeads ? body.idHeads : null,
                        Status: 'Chờ trưởng bộ phận phê duyệt',
                    }).then(data => {
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
    // update_tbl_nghiphep
    updatetblNghiPhep: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.numberLeave || body.numberLeave === '')
                        update.push({ key: 'NumberLeave', value: body.numberLeave });
                    if (body.type || body.type === '')
                        update.push({ key: 'Type', value: body.type });
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    if (body.remaining || body.remaining === '') {
                        if (body.remaining === '')
                            update.push({ key: 'Remaining', value: 0 });
                        else
                            update.push({ key: 'Remaining', value: body.remaining });
                    }
                    if (body.idHeadDepartment || body.idHeadDepartment === '') {
                        if (body.idHeadDepartment === '')
                            update.push({ key: 'IDHeadDepartment', value: null });
                        else
                            update.push({ key: 'IDHeadDepartment', value: body.idHeadDepartment });
                    }
                    if (body.idAdministrationHR || body.idAdministrationHR === '') {
                        if (body.idAdministrationHR === '')
                            update.push({ key: 'IDAdministrationHR', value: null });
                        else
                            update.push({ key: 'IDAdministrationHR', value: body.idAdministrationHR });
                    }
                    if (body.idHeads || body.idHeads === '') {
                        if (body.idHeads === '')
                            update.push({ key: 'IDHeads', value: null });
                        else
                            update.push({ key: 'IDHeads', value: body.idHeads });
                    }
                    if (body.dateEnd || body.dateEnd === '') {
                        if (body.dateEnd === '')
                            update.push({ key: 'DateEnd', value: null });
                        else
                            update.push({ key: 'DateEnd', value: moment(body.dateEnd).format('DD-MM-YYYY HH:mm:ss.SSS') });
                    }
                    if (body.dateStart || body.dateStart === '') {
                        if (body.dateStart === '')
                            update.push({ key: 'DateStart', value: null });
                        else
                            update.push({ key: 'DateStart', value: moment(body.dateStart).format('DD-MM-YYYY HH:mm:ss.SSS') });
                    }
                    if (body.idNhanVien || body.idNhanVien === '') {
                        if (body.idNhanVien === '')
                            update.push({ key: 'IDNhanVien', value: null });
                        else
                            update.push({ key: 'IDNhanVien', value: body.idNhanVien });
                    }
                    if (body.idLoaiChamCong || body.idLoaiChamCong === '') {
                        if (body.idLoaiChamCong === '')
                            update.push({ key: 'IDLoaiChamCong', value: null });
                        else
                            update.push({ key: 'IDLoaiChamCong', value: body.idLoaiChamCong });
                    }
                    database.updateTable(update, mtblNghiPhep(db), body.id).then(response => {
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
    // delete_tbl_nghiphep
    deletetblNghiPhep: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblNghiPhep(db, listID);
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
    // get_list_tbl_nghiphep
    getListtblNghiPhep: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    // if (body.dataSearch) {
                    //     var data = JSON.parse(body.dataSearch)

                    //     if (data.search) {
                    //         where = [
                    //             { FullName: { [Op.like]: '%' + data.search + '%' } },
                    //             { Address: { [Op.like]: '%' + data.search + '%' } },
                    //             { CMND: { [Op.like]: '%' + data.search + '%' } },
                    //             { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
                    //         ];
                    //     } else {
                    //         where = [
                    //             { FullName: { [Op.ne]: '%%' } },
                    //         ];
                    //     }
                    //     whereOjb = {
                    //         [Op.and]: [{ [Op.or]: where }],
                    //         [Op.or]: [{ ID: { [Op.ne]: null } }],
                    //     };
                    //     if (data.items) {
                    //         for (var i = 0; i < data.items.length; i++) {
                    //             let userFind = {};
                    //             if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                    //                 userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                    //                 if (data.items[i].conditionFields['name'] == 'And') {
                    //                     whereOjb[Op.and].push(userFind)
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Or') {
                    //                     whereOjb[Op.or].push(userFind)
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Not') {
                    //                     whereOjb[Op.not] = userFind
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                    let stt = 1;
                    let tblNghiPhep = mtblNghiPhep(db);
                    let tblDMNhanvien = mtblDMNhanvien(db);
                    tblNghiPhep.belongsTo(mtblLoaiChamCong(db), { foreignKey: 'IDLoaiChamCong', sourceKey: 'IDLoaiChamCong', as: 'loaiChamCong' })
                    tblNghiPhep.belongsTo(tblDMNhanvien, { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
                    tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bp' })
                    tblNghiPhep.belongsTo(tblDMNhanvien, { foreignKey: 'IDHeadDepartment', sourceKey: 'IDHeadDepartment', as: 'headDepartment' })
                    tblNghiPhep.belongsTo(tblDMNhanvien, { foreignKey: 'IDAdministrationHR', sourceKey: 'IDAdministrationHR', as: 'adminHR' })
                    tblNghiPhep.belongsTo(tblDMNhanvien, { foreignKey: 'IDHeads', sourceKey: 'IDHeads', as: 'heads' })
                    tblNghiPhep.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [
                            {
                                model: mtblLoaiChamCong(db),
                                required: false,
                                as: 'loaiChamCong'
                            },
                            {
                                model: tblDMNhanvien,
                                required: false,
                                as: 'nv',
                                include: [
                                    {
                                        model: mtblDMBoPhan(db),
                                        required: false,
                                        as: 'bp'
                                    },
                                ]
                            },
                            {
                                model: tblDMNhanvien,
                                required: false,
                                as: 'headDepartment'
                            },
                            {
                                model: tblDMNhanvien,
                                required: false,
                                as: 'adminHR'
                            },
                            {
                                model: tblDMNhanvien,
                                required: false,
                                as: 'heads'
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        let month = Number(moment().format('MM'));
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                dateEnd: element.DateEnd ? moment(element.DateEnd).subtract(7, 'hours').format('DD/MM/YYYY HH:mm:ss') : '',
                                dateStart: element.DateStart ? moment(element.DateStart).subtract(7, 'hours').format('DD/MM/YYYY HH:mm:ss') : '',
                                idLoaiChamCong: element.loaiChamCong ? element.loaiChamCong.ID : '',
                                nameLoaiChamCong: element.loaiChamCong ? element.loaiChamCong.Name : '',
                                codeLoaiChamCong: element.loaiChamCong ? element.loaiChamCong.Code : '',
                                idNhanVien: element.IDNhanVien ? element.IDNhanVien : '',
                                staffCode: element.nv ? element.nv.StaffCode : '',
                                staffName: element.nv ? element.nv.StaffName : '',
                                departmentName: element.nv ? element.nv.bp ? element.nv.bp.DepartmentName : '' : '',
                                departmentID: element.nv ? element.nv.bp ? element.nv.bp.ID : '' : '',
                                numberLeave: element.NumberLeave ? element.NumberLeave : '',
                                status: element.Status ? element.Status : '',
                                type: element.Type ? element.Type : '',
                                date: element.Date ? moment(element.Date).format('DD/MM/YYYY') : null,
                                remaining: element.Remaining ? month - 1 - element.Remaining : 0,
                                idHeadDepartment: element.IDHeadDepartment ? element.IDHeadDepartment : '',
                                headDepartmentCode: element.headDepartment ? element.headDepartment.StaffCode : '',
                                headDepartmentName: element.headDepartment ? element.headDepartment.StaffName : '',
                                idAdministrationHR: element.IDAdministrationHR ? element.IDAdministrationHR : '',
                                administrationHRCode: element.adminHR ? element.adminHR.StaffCode : '',
                                administrationHRName: element.adminHR ? element.adminHR.StaffName : '',
                                idHeads: element.IDHeads ? element.IDHeads : '',
                                headsCode: element.heads ? element.heads.StaffCode : '',
                                headsName: element.heads ? element.heads.StaffName : '',
                                reason: element.Reason ? element.Reason : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblNghiPhep(db).count({ where: whereOjb, })
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
    // approval_head_department
    approvalHeadDepartment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblNghiPhep(db).update({
                        Status: 'Chờ hành chính nhân sự phê duyệt',
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
    // approval_administration_hr
    approvalAdministrationHR: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblNghiPhep(db).update({
                        Status: 'Chờ thủ trưởng phê duyệt',
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
    // approval_heads
    approvalHeads: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblNghiPhep(db).update({
                        Status: 'Hoàn thành',
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
    // refuse_head_department
    refuseHeadDepartment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblNghiPhep(db).update({
                        Status: 'Hành chính nhân sự đã từ chối',
                        Reason: body.reason,
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
    // refuse_administration_hr
    refuseAdministrationHR: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblNghiPhep(db).update({
                        Status: 'Thủ trưởng đã từ chối',
                        Reason: body.reason,
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
    // refuse_heads
    refuseHeads: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblNghiPhep(db).update({
                        Status: 'Thủ trưởng đã từ chối',
                        Reason: body.reason,
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
    // handle_take_leave_day
    handleTakeLeaveDay: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let result = 0;
                    let subtractHalfDay = 0;
                    let dateStart = body.dateStart;
                    let dateEnd = body.dateEnd;
                    let days = await enumerateDaysBetweenDates(dateStart, dateEnd)
                    let array7th = [];
                    for (var i = 0; i < days.length; i++) {
                        var datetConvert = mModules.toDatetimeDay(moment(days[i]).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
                        if (datetConvert.slice(0, 8) == 'Chủ nhật') {
                            array7th.push(days[i])
                        }
                        if (datetConvert.slice(0, 5) == 'Thứ 7') {
                            array7th.push(days[i])
                        }
                    }
                    let checkDateStart = Number(dateStart.slice(11, 13))
                    let checkDateEnd = Number(dateEnd.slice(11, 13))
                    if (checkDateStart < 12) {
                        if (checkDateEnd <= 12)
                            subtractHalfDay = 0.5
                    } else {
                        subtractHalfDay = 0.5
                    }
                    if (days.length < 1)
                        if (Number(dateStart.slice(8, 10)) != Number(dateEnd.slice(8, 10)))
                            if (checkDateEnd < 17)
                                result = 1.5
                            else
                                result = 2
                        else
                            if (checkDateEnd < 17)
                                result = 0.5
                            else
                                result = 1
                    else
                        result = days.length + 2 - array7th.length - subtractHalfDay
                    var resultRes = {
                        result: result,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(resultRes);
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