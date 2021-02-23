const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDaoTaoSau = require('../tables/hrmanage/tblDaoTaoSau')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');

var database = require('../database');
async function deleteRelationshiptblDaoTaoSaus(db, listID) {
    await mtblDaoTaoSau(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblDaoTaoSaus,
    //  get_detail_tbl_training_after
    detailtblDaoTaoSaus: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblDaoTaoSau = mtblDaoTaoSau(db);
                    tblDaoTaoSau.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'employee' })
                    tblDaoTaoSau.findOne({
                        where: { ID: body.id },
                        include: [
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'employee'
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                dateStart: data.DateStart ? data.DateStart : '',
                                idNhanVien: data.IDNhanVien ? data.IDNhanVien : '',
                                nameNhanVien: data.employee ? data.employee.StaffName : '',
                                dateEnd: data.DateEnd ? data.DateEnd : '',
                                trainningCourse: data.TrainningCourse ? data.TrainningCourse : '',
                                companyCost: data.CompanyCost ? data.CompanyCost : '',
                                result: data.Result ? data.Result : '',
                                staffCost: data.StaffCost ? data.StaffCost : '',
                                majors: data.Majors ? data.Majors : '',
                                rangeDate: data.RangeDate ? data.RangeDate : '',
                                expirationDate: data.ExpirationDate ? data.ExpirationDate : '',
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
    // add_tbl_training_after
    addtblDaoTaoSaus: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDaoTaoSau(db).create({
                        IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                        DateStart: body.dateStart ? body.dateStart : null,
                        DateEnd: body.dateEnd ? body.dateEnd : null,
                        TrainingCourse: body.trainingCourse ? body.trainingCourse : '',
                        CompanyCost: body.companyCost ? body.companyCost : null,
                        Result: body.result ? body.result : '',
                        StaffCost: body.staffCost ? body.staffCost : null,
                        Majors: body.majors ? body.majors : '',
                        NumberCertificates: body.numberCertificates ? body.numberCertificates : '',
                        ExpirationDate: body.expirationDate ? body.expirationDate : null,
                        RangeDate: body.rangeDate ? body.rangeDate : null,
                        FormTraining: body.formTraining ? body.formTraining : '',
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
    // update_tbl_training_after
    updatetblDaoTaoSaus: (req, res) => {
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
                    if (body.dateStart || body.dateStart === '') {
                        if (body.dateStart === '')
                            update.push({ key: 'DateStart', value: null });
                        else
                            update.push({ key: 'DateStart', value: body.dateStart });
                    }
                    if (body.dateEnd || body.dateEnd === '') {
                        if (body.dateEnd === '')
                            update.push({ key: 'DateEnd', value: null });
                        else
                            update.push({ key: 'DateEnd', value: body.dateEnd });
                    }

                    if (body.rangeDate || body.rangeDate === '') {
                        if (body.rangeDate === '')
                            update.push({ key: 'RangeDate', value: null });
                        else
                            update.push({ key: 'RangeDate', value: body.rangeDate });
                    }
                    if (body.expirationDate || body.expirationDate === '') {
                        if (body.expirationDate === '')
                            update.push({ key: 'ExpirationDate', value: null });
                        else
                            update.push({ key: 'ExpirationDate', value: body.expirationDate });
                    }
                    if (body.numberCertificates || body.numberCertificates === '')
                        update.push({ key: 'NumberCertificates', value: body.numberCertificates });

                    if (body.formTraining || body.formTraining === '')
                        update.push({ key: 'FormTraining', value: body.formTraining });

                    if (body.trainingCourse || body.trainingCourse === '')
                        update.push({ key: 'TrainingCourse', value: body.trainingCourse });
                    if (body.companyCost || body.companyCost === '')
                        update.push({ key: 'CompanyCost', value: body.companyCost });
                    if (body.staffCost || body.staffCost === '')
                        update.push({ key: 'StaffCost', value: body.staffCost });
                    if (body.result || body.result === '')
                        update.push({ key: 'Result', value: body.result });
                    if (body.majors || body.majors === '')
                        update.push({ key: 'Majors', value: body.majors });
                    database.updateTable(update, mtblDaoTaoSau(db), body.id).then(response => {
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
    // delete_tbl_training_after
    deletetblDaoTaoSaus: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDaoTaoSaus(db, listID);
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
    // get_list_tbl_training_after
    getListtblDaoTaoSaus: (req, res) => {
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
                        // whereOjb = { [Op.or]: where };
                        // if (data.items) {
                        //     for (var i = 0; i < data.items.length; i++) {
                        //         let userFind = {};
                        //         if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                        //             userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                        //             if (data.items[i].conditionFields['name'] == 'And') {
                        //                 whereOjb[Op.and] = userFind
                        //             }
                        //             if (data.items[i].conditionFields['name'] == 'Or') {
                        //                 whereOjb[Op.or] = userFind
                        //             }
                        //             if (data.items[i].conditionFields['name'] == 'Not') {
                        //                 whereOjb[Op.not] = userFind
                        //             }
                        //         }
                        //     }
                        // }
                    }
                    let stt = 1;
                    let tblDaoTaoSau = mtblDaoTaoSau(db);
                    tblDaoTaoSau.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'employee' })
                    tblDaoTaoSau.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: { IDNhanVien: body.idNhanVien },
                        include: [
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'employee'
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                dateStart: element.DateStart ? moment(element.DateStart).format('DD/MM/YYYY') : '',
                                idNhanVien: element.IDNhanVien ? element.IDNhanVien : '',
                                nameNhanVien: element.employee ? element.employee.StaffName : '',
                                dateEnd: element.DateEnd ? moment(element.DateEnd).format('DD/MM/YYYY') : '',
                                trainingCourse: element.TrainingCourse ? element.TrainingCourse : '',
                                companyCost: element.CompanyCost ? element.CompanyCost : '',
                                result: element.Result ? element.Result : '',
                                staffCost: element.StaffCost ? element.StaffCost : '',
                                majors: element.Majors ? element.Majors : '',
                                formTraining: element.FormTraining ? element.FormTraining : '',
                                numberCertificates: element.NumberCertificates ? element.NumberCertificates : '',
                                rangeDate: element.RangeDate ? moment(element.RangeDate).format('DD/MM/YYYY') : '',
                                expirationDate: element.ExpirationDate ? moment(element.ExpirationDate).format('DD/MM/YYYY') : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblDaoTaoSau(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_training_after
    getListNametblDaoTaoSaus: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDaoTaoSau(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                trainningCourse: element.TrainningCourse ? element.TrainningCourse : '',
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