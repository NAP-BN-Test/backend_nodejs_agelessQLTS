const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMNhaCungCap = require('../tables/qlnb/tblDMNhaCungCap');
var mtblThemVPP = require('../tables/qlnb/tblThemVPP')
var mtblTaiSanADD = require('../tables/qlnb/tblTaiSanADD')

var database = require('../database');
async function deleteRelationshiptblDMNhaCungCap(db, listID) {
    await mtblThemVPP(db).update({
        IDNhaCungCap: null,
    }, { where: { IDNhaCungCap: { [Op.in]: listID } } })
    await mtblTaiSanADD(db).update({
        IDNhaCungCap: null,
    }, { where: { IDNhaCungCap: { [Op.in]: listID } } })
    await mtblDMNhaCungCap(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblDMNhaCungCap,
    // add_tbl_dmnhacungcap
    addtblDMNhaCungCap: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMNhaCungCap(db).create({
                        SupplierCode: body.supplierCode ? body.supplierCode : '',
                        SupplierName: body.supplierName ? body.supplierName : '',
                        TaxNumber: body.taxNumber ? body.taxNumber : '',
                        BankNumber: body.bankNumber ? body.bankNumber : '',
                        BankName: body.bankName ? body.bankName : '',
                        Address: body.address ? body.address : '',
                        PhoneNumber: body.phoneNumber ? body.phoneNumber : '',
                        FaxNumber: body.faxNumber ? body.faxNumber : '',
                        Email: body.email ? body.email : '',
                        Describe: body.describe ? body.describe : '',
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
    // update_tbl_dmnhacungcap
    updatetblDMNhaCungCap: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.supplierCode || body.supplierCode === '')
                        update.push({ key: 'SupplierCode', value: body.supplierCode });
                    if (body.supplierName || body.supplierName === '')
                        update.push({ key: 'SupplierName', value: body.supplierName });
                    if (body.taxNumber || body.taxNumber === '')
                        update.push({ key: 'TaxNumber', value: body.taxNumber });
                    if (body.bankNumber || body.bankNumber === '')
                        update.push({ key: 'BankNumber', value: body.bankNumber });
                    if (body.bankName || body.bankName === '')
                        update.push({ key: 'BankName', value: body.bankName });
                    if (body.address || body.address === '')
                        update.push({ key: 'Address', value: body.address });
                    if (body.phoneNumber || body.phoneNumber === '')
                        update.push({ key: 'PhoneNumber', value: body.phoneNumber });
                    if (body.faxNumber || body.faxNumber === '')
                        update.push({ key: 'FaxNumber', value: body.faxNumber });
                    if (body.email || body.email === '')
                        update.push({ key: 'Email', value: body.email });
                    if (body.describe || body.describe === '')
                        update.push({ key: 'Describe', value: body.describe });
                    database.updateTable(update, mtblDMNhaCungCap(db), body.id).then(response => {
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
    // delete_tbl_dmnhacungcap
    deletetblDMNhaCungCap: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDMNhaCungCap(db, listID);
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
    // get_list_tbl_dmnhacungcap
    getListtblDMNhaCungCap: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var data = JSON.parse(body.dataSearch)

                    if (data.search) {
                        where = [
                            { supplierName: { [Op.like]: '%' + data.search + '%' } },
                            { supplierCode: { [Op.like]: '%' + data.search + '%' } },
                        ];
                    } else {
                        where = [
                            { supplierName: { [Op.ne]: '%%' } },
                        ];
                    }
                    let whereOjb = { [Op.or]: where };
                    if (data.items) {
                        for (var i = 0; i < data.items.length; i++) {
                            let userFind = {};
                            if (data.items[i].fields['name'] === 'TÊN NHÀ CUNG CẤP') {
                                userFind['supplierName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                if (data.items[i].conditionFields['name'] == 'And') {
                                    whereOjb[Op.and] = userFind
                                }
                                if (data.items[i].conditionFields['name'] == 'Or') {
                                    whereOjb[Op.or] = userFind
                                }
                                if (data.items[i].conditionFields['name'] == 'Not') {
                                    whereOjb[Op.not] = userFind
                                }
                            }
                            if (data.items[i].fields['name'] === 'MÃ NHÀ CUNG CẤP') {
                                userFind['supplierCode'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                if (data.items[i].conditionFields['name'] == 'And') {
                                    whereOjb[Op.and] = userFind
                                }
                                if (data.items[i].conditionFields['name'] == 'Or') {
                                    whereOjb[Op.or] = userFind
                                }
                                if (data.items[i].conditionFields['name'] == 'Not') {
                                    whereOjb[Op.not] = userFind
                                }
                            }
                        }
                    }
                    let stt = 1;
                    mtblDMNhaCungCap(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                supplierCode: element.SupplierCode ? element.SupplierCode : '',
                                supplierName: element.SupplierName ? element.SupplierName : '',
                                taxNumber: element.TaxNumber ? element.TaxNumber : '',
                                bankNumber: element.BankNumber ? element.BankNumber : '',
                                bankName: element.BankName ? element.BankName : '',
                                address: element.Address ? element.Address : '',
                                phoneNumber: element.PhoneNumber ? element.PhoneNumber : '',
                                faxNumber: element.FaxNumber ? element.FaxNumber : '',
                                email: element.Email ? element.Email : '',
                                Describe: element.describe ? element.describe : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblDMNhaCungCap(db).count({ where: whereOjb })
                        var result = {
                            all: count,
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
    },
    // get_list_name_tbl_dmnhacungcap
    getListNametblDMNhaCungCap: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMNhaCungCap(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                supplierName: element.SupplierName ? element.SupplierName : '',
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