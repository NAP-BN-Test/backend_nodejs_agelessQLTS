const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMTaiKhoanKeToan = require('../tables/financemanage/tblDMLoaiTaiKhoanKeToan')
var database = require('../database');
async function deleteRelationshiptblDMTaiKhoanKeToan(db, listID) {
    await mtblDMTaiKhoanKeToan(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblDMTaiKhoanKeToan,
    //  get_detail_tbl_dm_taikhoanketoan
    // detailtblDMTaiKhoanKeToan: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 mtblDMTaiKhoanKeToan(db).findOne({ where: { ID: body.id } }).then(data => {
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
    // add_tbl_dm_taikhoanketoan
    addtblDMTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMTaiKhoanKeToan(db).create({
                        AccountingCodeI: body.accountingCodeI ? body.accountingCodeI : '',
                        AccountingCodeII: body.accountingCodeII ? body.accountingCodeII : '',
                        AccountingName: body.accountingName ? body.accountingName : '',
                        IDLoaiTaiKhoanKeToan: body.idLoaiTaiKhoanKeToan ? body.idLoaiTaiKhoanKeToan : null,
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
    // update_tbl_dm_taikhoanketoan
    updatetblDMTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.accountingCodeI || body.accountingCodeI === '')
                        update.push({ key: 'AccountingCodeI', value: body.accountingCodeI });
                    if (body.accountingCodeII || body.accountingCodeII === '')
                        update.push({ key: 'AccountingCodeII', value: body.accountingCodeII });
                    if (body.accountingName || body.accountingName === '')
                        update.push({ key: 'AccountingName', value: body.accountingName });
                    if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
                        if (body.idLoaiTaiKhoanKeToan === '')
                            update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
                        else
                            update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
                    }
                    database.updateTable(update, mtblDMTaiKhoanKeToan(db), body.id).then(response => {
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
    // delete_tbl_dm_taikhoanketoan
    deletetblDMTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDMTaiKhoanKeToan(db, listID);
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
    // get_list_tbl_dm_taikhoanketoan
    getListtblDMTaiKhoanKeToan: (req, res) => {
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
                    mtblDMTaiKhoanKeToan(db).findAll({
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
                                accountingCodeI: element.AccountingCodeI ? element.AccountingCodeI : '',
                                accountingCodeII: element.AccountingCodeII ? element.AccountingCodeII : '',
                                accountingName: element.AccountingName ? element.AccountingName : '',
                                idLoaiTaiKhoanKeToan: element.IDLoaiTaiKhoanKeToan ? element.IDLoaiTaiKhoanKeToan : null,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblDMTaiKhoanKeToan(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_dm_taikhoanketoan
    getListNametblDMTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMTaiKhoanKeToan(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                accountingName: element.AccountingName ? element.AccountingName : '',
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