const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblCustomer = require('../tables/financemanage/tblCustomer')
var database = require('../database');
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')
var mtblInvoice = require('../tables/financemanage/tblInvoice')
var ctlPMCM = require('../controller_finance/ctl-apiSpecializedSoftware')
var mtblPaymentRInvoice = require('../tables/financemanage/tblPaymentRInvoice')
var mtblCurrency = require('../tables/financemanage/tblCurrency')

async function deleteRelationshiptblCustomer(db, listID) {
    await mtblCustomer(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}


async function calculateTheTotalAmountOfEachCurrency(db, array) {
    let arrayResult = []
    let arrayCheck = []
    for (let i = 0; i < array.length; i++) {
        let check = await mtblInvoice(db).findOne({
            where: { IDSpecializedSoftware: array[i].id }
        })
        if (check) {
            if (check.Status == 'Chờ thanh toán') {
                for (let j = 0; j < array[i].arrayMoney.length; j++) {
                    if (!checkDuplicate(arrayCheck, array[i].arrayMoney[j].typeMoney)) {
                        arrayCheck.push(array[i].arrayMoney[j].typeMoney)
                        arrayResult.push({
                            total: Number(array[i].arrayMoney[j].total),
                            typeMoney: array[i].arrayMoney[j].typeMoney,
                            date: array[i].createdDate,
                        })
                    } else {
                        arrayResult.forEach(element => {
                            if (element.typeMoney == array[i].arrayMoney[j].typeMoney) {
                                element.total += Number(array[i].arrayMoney[j].total)
                            }
                        })
                    }
                }
            }
        } else {
            if (array[i].statusName == 'Chờ thanh toán') {
                for (let j = 0; j < array[i].arrayMoney.length; j++) {
                    if (!checkDuplicate(arrayCheck, array[i].arrayMoney[j].typeMoney)) {
                        arrayCheck.push(array[i].arrayMoney[j].typeMoney)
                        arrayResult.push({
                            total: Number(array[i].arrayMoney[j].total),
                            typeMoney: array[i].arrayMoney[j].typeMoney,
                            date: array[i].createdDate,
                        })
                    } else {
                        arrayResult.forEach(element => {
                            if (element.typeMoney == array[i].arrayMoney[j].typeMoney) {
                                element.total += Number(array[i].arrayMoney[j].total)
                            }
                        })
                    }
                }
            }
        }


    }
    return arrayResult
}

function checkDuplicate(array, elm) {
    var check = false;
    array.forEach(item => {
        if (item === elm) check = true;
    })
    return check;
}
async function calculateTheTotalForCredit(db, array) {
    let arrayResult = []
    let total = 0
    for (let i = 0; i < array.length; i++) {
        let check = await mtblInvoice(db).findOne({
            where: { IDSpecializedSoftware: dataCredit[i].id }
        })
        if (check) {
            if (check.Status == 'Chờ thanh toán') {
                total += Number(array[i].total)
            }
        } else
        if (array[i].statusName == 'Chờ thanh toán')
            total += Number(array[i].total)
    }
    arrayResult.push({
        typeMoney: 'VND',
        total: total
    })
    return arrayResult
}
const axios = require('axios');
module.exports = {
    deleteRelationshiptblCustomer,
    // add_tbl_customer
    addtblCustomer: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblCustomer(db).create({
                        IDSpecializedSoftware: body.idSpecializedSoftware ? body.idSpecializedSoftware : null,
                        AmountUnspecified: body.amountUnspecified ? body.amountUnspecified : null,
                        AmountSpent: body.amountSpent ? body.amountSpent : null,
                        AmountReceivable: body.amountReceivable ? body.amountReceivable : null,
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
    // update_tbl_customer
    updatetblCustomer: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.idSpecializedSoftware || body.idSpecializedSoftware === '') {
                        if (body.idSpecializedSoftware === '')
                            update.push({ key: 'IDSpecializedSoftware', value: null });
                        else
                            update.push({ key: 'IDSpecializedSoftware', value: body.idSpecializedSoftware });
                    }
                    if (body.amountUnspecified || body.amountUnspecified === '') {
                        if (body.amountUnspecified === '')
                            update.push({ key: 'AmountUnspecified', value: null });
                        else
                            update.push({ key: 'AmountUnspecified', value: body.amountUnspecified });
                    }
                    if (body.amountSpent || body.amountSpent === '') {
                        if (body.amountSpent === '')
                            update.push({ key: 'AmountSpent', value: null });
                        else
                            update.push({ key: 'AmountSpent', value: body.amountSpent });
                    }
                    if (body.amountReceivable || body.amountReceivable === '') {
                        if (body.amountReceivable === '')
                            update.push({ key: 'AmountReceivable', value: null });
                        else
                            update.push({ key: 'AmountReceivable', value: body.amountReceivable });
                    }
                    database.updateTable(update, mtblCustomer(db), body.id).then(response => {
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
    // delete_tbl_customer
    deletetblCustomer: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblCustomer(db, listID);
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
    // get_list_tbl_customer
    getListtblCustomer: (req, res) => {
        let body = req.body;
        console.log(body.dataSearch11);
        let dataSearch = JSON.parse(body.dataSearch)
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let dataCustomer = await ctlPMCM.getCustomerOfPMCM(body.page ? body.page : 1, body.itemPerPage ? body.itemPerPage : 1000, dataSearch.search ? dataSearch.search : null)
                    let stt = 1;
                    let arrayResult = []
                    for (let cus of dataCustomer.data) {
                        let arrayCredit = []
                        let arrayInvoice = []
                        let amountUnspecified = []
                        let tblReceiptsPayment = mtblReceiptsPayment(db);
                        tblReceiptsPayment.belongsTo(mtblCurrency(db), { foreignKey: 'IDCurrency', sourceKey: 'IDCurrency', as: 'cur' })
                        await tblReceiptsPayment.findAll({
                            where: {
                                IDCustomer: cus.id
                            },
                            include: [{
                                model: mtblCurrency(db),
                                required: false,
                                as: 'cur'
                            }, ],
                        }).then(payment => {
                            for (let pay of payment) {
                                let currencyName = pay.cur ? pay.cur.ShortName : 'VND';
                                let arrayCurrencyCheck = []
                                if (!checkDuplicate(arrayCurrencyCheck, currencyName)) {
                                    arrayCurrencyCheck.push(currencyName)
                                    if (pay.Unknown) {
                                        amountUnspecified.push({
                                            total: pay.Amount,
                                            typeMoney: currencyName,
                                        })
                                    }
                                    if (pay.Type == 'payment' || pay.Type == 'debit') {
                                        arrayInvoice.push({
                                            total: pay.Amount,
                                            typeMoney: currencyName,
                                        })
                                    } else if (pay.Type == 'receipt' || pay.Type == 'spending') {
                                        arrayCredit.push({
                                            total: pay.Amount,
                                            typeMoney: currencyName,
                                        })
                                    }
                                } else {
                                    if (pay.Unknown) {
                                        for (let inv of amountUnspecified) {
                                            if (inv.typeMoney == currencyName)
                                                inv.total = Number(inv.total) + Number(pay.Amount)
                                        }
                                    }
                                    if (pay.Type == 'payment' || pay.Type == 'debit') {
                                        for (let inv of arrayInvoice) {
                                            if (inv.typeMoney == currencyName)
                                                inv.total = Number(inv.total) + Number(pay.Amount)
                                        }
                                    } else if (pay.Type == 'receipt' || pay.Type == 'spending') {
                                        for (let cre of arrayCredit) {
                                            if (cre.typeMoney == currencyName)
                                                cre.total = Number(cre.total) + Number(pay.Amount)
                                        }
                                    }
                                }
                            }
                        })
                        var obj = {
                            stt: stt,
                            id: Number(cus.id),
                            name: cus.name ? cus.name : '',
                            code: cus.code ? cus.code : '',
                            address: cus.address ? cus.address : '',
                            idSpecializedSoftware: Number(cus.id),
                            amountUnspecified: amountUnspecified,
                            amountSpent: arrayCredit,
                            amountReceivable: arrayInvoice,
                        }
                        arrayResult.push(obj);
                        stt += 1;
                    }
                    var result = {
                        array: arrayResult,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: dataCustomer.count
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
    // get_list_tbl_customer_debt
    getListtblCustomerDebt: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let dataCustomer = await ctlPMCM.getCustomerOfPMCM(body.page ? body.page : 1, body.itemPerPage ? body.itemPerPage : 100000000)
                    let stt = 1;
                    let arrayCredit = []
                    let arrayInvoice = []
                    let arrayResult = []
                    for (let cus of dataCustomer.data) {
                        var obj = {
                            stt: stt,
                            id: Number(cus.id),
                            name: cus.name ? cus.name : '',
                            code: cus.code ? cus.code : '',
                            address: cus.address ? cus.address : '',
                            idSpecializedSoftware: Number(cus.id),
                            amountUnspecified: [{ total: 1, typeMoney: 'VND' }, { total: 0, typeMoney: 'USD' }],
                            amountSpent: arrayCredit,
                            amountReceivable: arrayInvoice,
                        }
                        arrayResult.push(obj);
                        stt += 1;
                    }
                    var result = {
                        array: arrayResult,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: dataCustomer.count
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
    // get_list_name_tbl_customer
    getListNametblCustomer: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblCustomer(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                idSpecializedSoftware: element.IDSpecializedSoftware ? element.IDSpecializedSoftware : '',
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