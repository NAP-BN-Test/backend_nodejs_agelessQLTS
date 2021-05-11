const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblRewardPunishment = require('../tables/hrmanage/tblRewardPunishment')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblFileAttach = require('../tables/constants/tblFileAttach');

async function deleteRelationshiptblRewardPunishment(db, listID) {
    await mtblRewardPunishment(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblRewardPunishment,
    //  get_detail_tbl_reward_punishment
    detailtblRewardPunishment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblRewardPunishment(db).findOne({ where: { ID: body.id } }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                date: data.Date ? data.Date : null,
                                idStaff: data.IDStaff ? data.IDStaff : null,
                                amountMoney: data.SalaryIncrease ? data.SalaryIncrease : null,
                                reason: data.Reason ? data.Reason : null,
                                code: data.Code ? data.Code : null,
                                status: data.Status ? data.Status : null,
                                idEmployeeApproval: data.IDEmployeeApproval ? data.IDEmployeeApproval : null,
                                reasonReject: data.ReasonReject ? data.ReasonReject : null,
                            }
                            var result = {
                                obj: obj,
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                            }
                            res.json(result);
                        } else {
                            res.json(Result.NO_DATA_RESULT)

                        }

                    })
                } catch (error) {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // add_tbl_reward_punishment
    addtblRewardPunishment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblRewardPunishment(db).create({
                        IDStaff: body.idStaff ? body.idStaff : null,
                        Date: body.date ? body.date : null,
                        SalaryIncrease: body.amountMoney ? body.amountMoney : '',
                        Reason: body.reason ? body.reason : '',
                        Code: body.code ? body.code : '',
                        Status: body.status ? body.status : '',
                        IDEmployeeApproval: body.idEmployeeApproval ? body.idEmployeeApproval : '',
                        ReasonReject: body.reasonReject ? body.reasonReject : '',
                        Type: body.type ? body.type : '',
                    }).then(async data => {
                        if (data) {
                            if (body.fileAttach) {
                                body.fileAttach = JSON.parse(body.fileAttach)
                                if (body.fileAttach.length > 0)
                                    for (var j = 0; j < body.fileAttach.length; j++)
                                        await mtblFileAttach(db).update({
                                            IDRewardPunishment: data.ID,
                                        }, {
                                            where: {
                                                ID: body.fileAttach[j].id
                                            }
                                        })
                            }

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
    // update_tbl_reward_punishment
    updatetblRewardPunishment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.fileAttach) {
                        body.fileAttach = JSON.parse(body.fileAttach)
                        if (body.fileAttach.length > 0)
                            for (var j = 0; j < body.fileAttach.length; j++)
                                await mtblFileAttach(db).update({
                                    IDRewardPunishment: body.id,
                                }, {
                                    where: {
                                        ID: body.fileAttach[j].id
                                    }
                                })
                    }
                    if (body.idStaff || body.idStaff === '') {
                        if (body.idStaff === '')
                            update.push({ key: 'IDStaff', value: null });
                        else
                            update.push({ key: 'IDStaff', value: body.idStaff });
                    }
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    if (body.amountMoney || body.amountMoney === '') {
                        if (body.amountMoney === '')
                            update.push({ key: 'SalaryIncrease', value: null });
                        else
                            update.push({ key: 'SalaryIncrease', value: body.amountMoney });
                    }
                    if (body.idEmployeeApproval || body.idEmployeeApproval === '') {
                        if (body.idEmployeeApproval === '')
                            update.push({ key: 'IDEmployeeApproval', value: null });
                        else
                            update.push({ key: 'IDEmployeeApproval', value: body.idEmployeeApproval });
                    }
                    if (body.reason || body.reason === '')
                        update.push({ key: 'Reason', value: body.reason });
                    if (body.code || body.code === '')
                        update.push({ key: 'Code', value: body.code });
                    if (body.status || body.status === '')
                        update.push({ key: 'Status', value: body.status });
                    if (body.reasonReject || body.reasonReject === '')
                        update.push({ key: 'ReasonReject', value: body.reasonReject });
                    database.updateTable(update, mtblRewardPunishment(db), body.id).then(response => {
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
    // delete_tbl_reward_punishment
    deletetblRewardPunishment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblRewardPunishment(db, listID);
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
    // get_list_tbl_reward_punishment
    getListtblRewardPunishment: (req, res) => {
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
                    let tblRewardPunishment = mtblRewardPunishment(db);
                    tblRewardPunishment.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDStaff', sourceKey: 'IDStaff', as: 'staff' })
                    tblRewardPunishment.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        order: [
                            ['ID', 'DESC']
                        ],
                        include: [
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'staff'
                            },
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                date: element.Date ? moment(element.Date).format('DD/MM/YYYY') : null,
                                idStaff: element.IDStaff ? element.IDStaff : null,
                                staffName: element.IDStaff ? element.staff.StaffName : '',
                                amountMoney: element.SalaryIncrease ? element.SalaryIncrease : null,
                                reason: element.Reason ? element.Reason : null,
                                code: element.Code ? element.Code : null,
                                status: element.Status ? element.Status : null,
                                idEmployeeApproval: element.IDEmployeeApproval ? element.IDEmployeeApproval : null,
                                reasonReject: element.ReasonReject ? element.ReasonReject : null,
                                type: element.Type ? element.Type : null,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblRewardPunishment(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_reward_punishment
    getListNametblRewardPunishment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblRewardPunishment(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                code: element.Code ? element.Code : '',
                            }
                            array.push(obj);
                        });
                        var result = {
                            array: array,
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
    }
}