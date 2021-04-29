const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDecidedInsuranceSalary = require('../tables/hrmanage/tblDecidedInsuranceSalary')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
async function deleteRelationshiptblDecidedInsuranceSalary(db, listID) {
    await mtblDecidedInsuranceSalary(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblDecidedInsuranceSalary,
    //  get_detail_tbl_decided_insurance_salary
    detailtblDecidedInsuranceSalary: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDecidedInsuranceSalary(db).findOne({ where: { ID: body.id } }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                name: data.Name,
                                code: data.Code,
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
    // add_tbl_decided_insurance_salary
    addtblDecidedInsuranceSalary: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    if (body.idStaff && body.coefficient)
                        await mtblDMNhanvien(db).update({
                            CoefficientsSalary: body.coefficient
                        }, { where: { ID: body.idStaff } })
                    mtblDecidedInsuranceSalary(db).create({
                        IDStaff: body.idStaff ? body.idStaff : null,
                        Name: body.name ? body.name : '',
                        StartDate: body.startDate ? body.startDate : null,
                        EndDate: body.endDate ? body.endDate : null,
                        Increase: body.increase ? body.increase : null,
                        Coefficient: body.coefficient ? body.coefficient : null,
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
    // update_tbl_decided_insurance_salary
    updatetblDecidedInsuranceSalary: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.idStaff && body.coefficient)
                        await mtblDMNhanvien(db).update({
                            CoefficientsSalary: body.coefficient
                        }, { where: { ID: body.idStaff } })
                    if (body.name || body.name === '')
                        update.push({ key: 'Name', value: body.name });
                    if (body.idStaff || body.idStaff === '') {
                        if (body.idStaff === '')
                            update.push({ key: 'IDStaff', value: null });
                        else
                            update.push({ key: 'IDStaff', value: body.idStaff });
                    }
                    if (body.startDate || body.startDate === '') {
                        if (body.startDate === '')
                            update.push({ key: 'StartDate', value: null });
                        else
                            update.push({ key: 'StartDate', value: body.startDate });
                    }
                    if (body.endDate || body.endDate === '') {
                        if (body.endDate === '')
                            update.push({ key: 'EndDate', value: null });
                        else
                            update.push({ key: 'EndDate', value: body.endDate });
                    }
                    if (body.increase || body.increase === '') {
                        if (body.increase === '')
                            update.push({ key: 'Increase', value: null });
                        else
                            update.push({ key: 'Increase', value: body.increase });
                    }
                    if (body.coefficient || body.coefficient === '') {
                        if (body.coefficient === '')
                            update.push({ key: 'Coefficient', value: null });
                        else
                            update.push({ key: 'Coefficient', value: body.coefficient });
                    }
                    database.updateTable(update, mtblDecidedInsuranceSalary(db), body.id).then(response => {
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
    // delete_tbl_decided_insurance_salary
    deletetblDecidedInsuranceSalary: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDecidedInsuranceSalary(db, listID);
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
    // get_list_tbl_decided_insurance_salary
    getListtblDecidedInsuranceSalary: (req, res) => {
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
                    let tblDecidedInsuranceSalary = mtblDecidedInsuranceSalary(db);
                    tblDecidedInsuranceSalary.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDStaff', sourceKey: 'IDStaff', as: 'staff' })
                    tblDecidedInsuranceSalary.findAll({
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
                                name: element.Name ? element.Name : '',
                                idStaff: element.IDStaff ? element.IDStaff : null,
                                staffName: element.IDStaff ? element.staff.StaffName : null,
                                startDate: element.StartDate ? moment(element.StartDate).format('DD/MM/YYYY') : null,
                                endDate: element.EndDate ? moment(element.EndDate).format('DD/MM/YYYY') : null,
                                increase: element.Increase ? element.Increase : null,
                                coefficient: element.Coefficient ? element.Coefficient : null,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblDecidedInsuranceSalary(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_decided_insurance_salary
    getListNametblDecidedInsuranceSalary: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDecidedInsuranceSalary(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                name: element.Name ? element.Name : '',
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