const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblHopDongNhanSu = require('../tables/hrmanage/tblHopDongNhanSu')
var database = require('../database');
async function deleteRelationshiptblHopDongNhanSu(db, listID) {
    await mtblHopDongNhanSu(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblHopDongNhanSu,
    //  get_detail_tbl_hophong_nhansu
    detailtblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblHopDongNhanSu(db).findOne({ where: { ID: body.id } }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                contractCode: data.ContractCode ? data.ContractCode : '',
                                signDate: data.Date ? data.Date : null,
                                idLoaiHopDong: data.IDLoaiHopDong ? data.IDLoaiHopDong : '',
                                salaryNumber: data.SalaryNumber ? data.SalaryNumber : '',
                                salaryText: data.SalaryText ? data.SalaryText : '',
                                contractDateEnd: data.ContractDateEnd ? data.contractDateEnd : '',
                                contractDateStart: data.ContractDateStart ? data.ContractDateStart : null,
                                unitSalary: 'VND',
                                status: data.Status ? data.Status : '',
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
    // add_tbl_hophong_nhansu
    addtblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblHopDongNhanSu(db).create({
                        ContractCode: body.contractCode ? body.contractCode : '',
                        Date: body.signDate ? body.signDate : null,
                        IDLoaiHopDong: body.idLoaiHopDong ? body.idLoaiHopDong : '',
                        SalaryNumber: body.salaryNumber ? body.salaryNumber : '',
                        SalaryText: body.salaryNumber ? body.salaryNumber : '',
                        ContractDateEnd: body.contractDateEnd ? body.contractDateEnd : '',
                        ContractDateStart: body.signDate ? body.signDate : null,
                        UnitSalary: 'VND',
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
    // update_tbl_hophong_nhansu
    updatetblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.contractCode || body.contractCode === '')
                        update.push({ key: 'ContractCode', value: body.contractCode });
                    if (body.signDate || body.signDate === '') {
                        if (body.signDate === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.signDate });
                    }
                    if (body.salaryNumber || body.salaryNumber === '') {
                        if (body.salaryNumber === '')
                            update.push({ key: 'SalaryNumber', value: null });
                        else
                            update.push({ key: 'SalaryNumber', value: body.salaryNumber });
                    }
                    if (body.contractDateEnd || body.contractDateEnd === '')
                        update.push({ key: 'ContractDateEnd', value: body.contractDateEnd });
                    if (body.contractDateStart || body.contractDateStart === '')
                        update.push({ key: 'ContractDateStart', value: body.contractDateStart });
                    if (body.status || body.status === '')
                        update.push({ key: 'Status', value: body.status });
                    database.updateTable(update, mtblHopDongNhanSu(db), body.id).then(response => {
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
    // delete_tbl_hophong_nhansu
    deletetblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblHopDongNhanSu(db, listID);
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
    // get_list_tbl_hophong_nhansu
    getListtblHopDongNhanSu: (req, res) => {
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
                    mtblHopDongNhanSu(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                contractCode: data.ContractCode ? data.ContractCode : '',
                                signDate: data.Date ? data.Date : null,
                                idLoaiHopDong: data.IDLoaiHopDong ? data.IDLoaiHopDong : '',
                                salaryNumber: data.SalaryNumber ? data.SalaryNumber : '',
                                salaryText: data.SalaryText ? data.SalaryText : '',
                                contractDateEnd: data.ContractDateEnd ? data.contractDateEnd : '',
                                contractDateStart: data.ContractDateStart ? data.ContractDateStart : null,
                                unitSalary: 'VND',
                                status: data.Status ? data.Status : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblHopDongNhanSu(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_hophong_nhansu
    getListNametblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblHopDongNhanSu(db).findAll().then(data => {
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