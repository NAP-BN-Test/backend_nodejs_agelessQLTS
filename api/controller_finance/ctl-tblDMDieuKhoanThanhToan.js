const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMDieuKhoanThanhToan = require('../tables/financemanage/tblDMDieuKhoanThanhToan')
var database = require('../database');
async function deleteRelationshiptblDMDieuKhoanThanhToan(db, listID) {
    await mtblDMDieuKhoanThanhToan(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblDMDieuKhoanThanhToan,
    //  get_detail_tbl_dm_dieukhoan_thanhtoan
    detailtblDMDieuKhoanThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMDieuKhoanThanhToan(db).findOne({ where: { ID: body.id } }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                name: data.RuleCode ? data.RuleCode : '',
                                status: data.Status ? data.Status : '',
                                ruleName: data.RuleName ? data.RuleName : '',
                                ruleCode: data.RuleCode ? data.RuleCode : '',
                                numberDate: data.NumberDate ? data.NumberDate : '',
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
    // add_tbl_dm_dieukhoan_thanhtoan
    addtblDMDieuKhoanThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    if (body.ruleCode) {
                        var check = await mtblDMDieuKhoanThanhToan(db).findOne({
                            where: {
                                RuleCode: body.ruleCode

                            }
                        })
                        if (check) {
                            var result = {
                                status: Constant.STATUS.FAIL,
                                message: "Mã điều khoản thanh toán đã tồn tại. Vui lòng kiểm tra lại !",
                            }
                            res.json(result);
                            return
                        }
                    }
                    mtblDMDieuKhoanThanhToan(db).create({
                        RuleName: body.ruleName ? body.ruleName : '',
                        RuleCode: body.ruleCode ? body.ruleCode : '',
                        NumberDate: body.numberDate ? body.numberDate : 0,
                        Status: body.status ? body.status : '',
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
    // update_tbl_dm_dieukhoan_thanhtoan
    updatetblDMDieuKhoanThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.ruleCode) {
                        var check = await mtblDMDieuKhoanThanhToan(db).findOne({
                            RuleCode: body.ruleCode
                        })
                        if (check) {
                            var result = {
                                status: Constant.STATUS.FAIL,
                                message: "Mã điều khoản thanh toán đã tồn tại. Vui lòng kiểm tra lại !",
                            }
                            res.json(result);
                            return
                        }
                    }
                    if (body.ruleCode || body.ruleCode === '')
                        update.push({ key: 'RuleCode', value: body.ruleCode });
                    if (body.ruleName || body.ruleName === '')
                        update.push({ key: 'RuleName', value: body.ruleName });
                    if (body.status || body.status === '')
                        update.push({ key: 'status', value: body.status });
                    if (body.numberDate || body.numberDate === '') {
                        if (body.numberDate === '')
                            update.push({ key: 'NumberDate', value: null });
                        else
                            update.push({ key: 'NumberDate', value: body.numberDate });
                    }
                    database.updateTable(update, mtblDMDieuKhoanThanhToan(db), body.id).then(response => {
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
    // delete_tbl_dm_dieukhoan_thanhtoan
    deletetblDMDieuKhoanThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDMDieuKhoanThanhToan(db, listID);
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
    // get_list_tbl_dm_dieukhoan_thanhtoan
    getListtblDMDieuKhoanThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        // var data = JSON.parse(body.dataSearch)

                        // if (data.search) {
                        //     where = [
                        //         { FullName: { [Op.like]: '%' + data.search + '%' } },
                        //         { Address: { [Op.like]: '%' + data.search + '%' } },
                        //         { CMND: { [Op.like]: '%' + data.search + '%' } },
                        //         { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
                        //     ];
                        // } else {
                        //     where = [
                        //         { FullName: { [Op.ne]: '%%' } },
                        //     ];
                        // }
                        // whereOjb = {
                        //     [Op.and]: [{ [Op.or]: where }],
                        //     [Op.or]: [{ ID: { [Op.ne]: null } }],
                        // };
                        // if (data.items) {
                        //     for (var i = 0; i < data.items.length; i++) {
                        //         let userFind = {};
                        //         if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                        //             userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                        //             if (data.items[i].conditionFields['name'] == 'And') {
                        //                 whereOjb[Op.and].push(userFind)
                        //             }
                        //             if (data.items[i].conditionFields['name'] == 'Or') {
                        //                 whereOjb[Op.or].push(userFind)
                        //             }
                        //             if (data.items[i].conditionFields['name'] == 'Not') {
                        //                 whereOjb[Op.not] = userFind
                        //             }
                        //         }
                        //     }
                        // }
                    }
                    let stt = 1;
                    mtblDMDieuKhoanThanhToan(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                name: element.RuleCode ? element.RuleCode : '',
                                status: element.Status ? element.Status : '',
                                ruleName: element.RuleName ? element.RuleName : '',
                                ruleCode: element.RuleCode ? element.RuleCode : '',
                                numberDate: element.NumberDate ? element.NumberDate : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblDMDieuKhoanThanhToan(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_dm_dieukhoan_thanhtoan
    getListNametblDMDieuKhoanThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMDieuKhoanThanhToan(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                ruleName: element.RuleName ? element.RuleName : '',
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