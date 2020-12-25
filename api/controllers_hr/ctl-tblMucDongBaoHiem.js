const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblMucDongBaoHiem = require('../tables/hrmanage/tblMucDongBaoHiem')
var database = require('../database');
async function deleteRelationshiptblMucDongBaoHiem(db, listID) {
    await mtblMucDongBaoHiem(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblMucDongBaoHiem,
    // //  get_detail_tbl_mucdong_baohiem
    // detailtblMucDongBaoHiem: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 mtblMucDongBaoHiem(db).findOne({ where: { ID: body.id } }).then(data => {
    //                     if (data) {
    //                         var obj = {
    //                             id: data.ID,
    //                             name: data.Name,
    //                             code: data.Code,
    //                         }
    //                         var result = {
    //                             obj: obj,
    //                             status: Constant.STATUS.SUCCESS,
    //                             message: Constant.MESSAGE.ACTION_SUCCESS,
    //                         }
    //                         res.json(result);
    //                     } else {
    //                         res.json(Result.NO_DATA_RESULT)

    //                     }

    //                 })
    //             } catch (error) {
    //                 res.json(Result.SYS_ERROR_RESULT)
    //             }
    //         } else {
    //             res.json(Constant.MESSAGE.USER_FAIL)
    //         }
    //     })
    // },
    // add_tbl_mucdong_baohiem
    addtblMucDongBaoHiem: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblMucDongBaoHiem(db).create({
                        CompanyBHXH: body.companyBHXH ? body.companyBHXH : null,
                        CompanyBHYT: body.companyBHYT ? body.companyBHYT : null,
                        CompanyBHTN: body.companyBHTN ? body.companyBHTN : null,
                        StaffBHXH: body.staffBHXH ? body.staffBHXH : null,
                        StaffBHYT: body.staffBHYT ? body.staffBHYT : null,
                        StaffBHTN: body.staffBHTN ? body.staffBHTN : null,
                        DateStart: body.dateStart ? body.dateStart : null,
                        DateEnd: body.dateEnd ? body.dateEnd : null,
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
    // update_tbl_mucdong_baohiem
    updatetblMucDongBaoHiem: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.companyBHXH || body.companyBHXH === '') {
                        if (body.companyBHXH === '')
                            update.push({ key: 'CompanyBHXH', value: null });
                        else
                            update.push({ key: 'CompanyBHXH', value: body.companyBHXH });
                    }
                    if (body.companyBHYT || body.companyBHYT === '') {
                        if (body.companyBHYT === '')
                            update.push({ key: 'CompanyBHYT', value: null });
                        else
                            update.push({ key: 'CompanyBHYT', value: body.companyBHYT });
                    }
                    if (body.companyBHTN || body.companyBHTN === '') {
                        if (body.companyBHTN === '')
                            update.push({ key: 'CompanyBHTN', value: null });
                        else
                            update.push({ key: 'CompanyBHTN', value: body.companyBHTN });
                    }
                    if (body.staffBHXH || body.staffBHXH === '') {
                        if (body.staffBHXH === '')
                            update.push({ key: 'StaffBHXH', value: null });
                        else
                            update.push({ key: 'StaffBHXH', value: body.staffBHXH });
                    }
                    if (body.staffBHYT || body.staffBHYT === '') {
                        if (body.staffBHYT === '')
                            update.push({ key: 'StaffBHYT', value: null });
                        else
                            update.push({ key: 'StaffBHYT', value: body.staffBHYT });
                    }
                    if (body.staffBHTN || body.staffBHTN === '') {
                        if (body.staffBHTN === '')
                            update.push({ key: 'StaffBHTN', value: null });
                        else
                            update.push({ key: 'StaffBHTN', value: body.staffBHTN });
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
                    database.updateTable(update, mtblMucDongBaoHiem(db), body.id).then(response => {
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
    // delete_tbl_mucdong_baohiem
    deletetblMucDongBaoHiem: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblMucDongBaoHiem(db, listID);
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
    // get_list_tbl_mucdong_baohiem
    getListtblMucDongBaoHiem: (req, res) => {
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
                    mtblMucDongBaoHiem(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                companyBHXH: element.CompanyBHXH ? element.CompanyBHXH : null,
                                companyBHYT: element.CompanyBHYT ? element.CompanyBHYT : null,
                                companyBHTN: element.CompanyBHTN ? element.CompanyBHTN : null,
                                staffBHXH: element.StaffBHXH ? element.StaffBHXH : null,
                                staffBHYT: element.StaffBHYT ? element.StaffBHYT : null,
                                staffBHTN: element.StaffBHTN ? element.StaffBHTN : null,
                                dateStart: element.DateStart ? element.DateStart : null,
                                dateEnd: element.DateEnd ? element.DateEnd : null,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblMucDongBaoHiem(db).count({ where: whereOjb, })
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
}