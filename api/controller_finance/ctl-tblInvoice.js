const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblInvoice = require('../tables/financemanage/tblInvoice')
var database = require('../database');
const axios = require('axios');
var mtblCurrency = require('../tables/financemanage/tblCurrency')
var mtblInvoiceRCurrency = require('../tables/financemanage/tblInvoiceRCurrency')
var dataExport = require('../controller_finance/ctl-apiSpecializedSoftware')
var mtblRate = require('../tables/financemanage/tblRate')
async function deleteRelationshiptblInvoice(db, listID) {
    await mtblInvoice(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
var mtblPaymentRInvoice = require('../tables/financemanage/tblPaymentRInvoice')
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')

function checkDuplicate(array, elm) {
    var check = false;
    array.forEach(item => {
        if (item === elm) check = true;
    })
    return check;
}
async function calculateTheTotalAmountOfEachCurrency(array) {
    let arrayResult = []
    let arrayCheck = []
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].arrayMoney.length; j++) {
            if (!checkDuplicate(arrayCheck, array[i].arrayMoney[j].typeMoney)) {
                arrayCheck.push(array[i].arrayMoney[j].typeMoney)
                arrayResult.push({
                    total: Number(array[i].arrayMoney[j].total),
                    type: array[i].arrayMoney[j].typeMoney,
                    date: array[i].createdDate,
                })
            } else {
                arrayResult.forEach(element => {
                    if (element.type == array[i].arrayMoney[j].typeMoney) {
                        element.total += Number(array[i].arrayMoney[j].total)
                    }
                })
            }
        }
    }
    await database.connectDatabase().then(async db => {
        for (let a = 0; a < arrayResult.length; a++) {
            let totelMoney = await calculateMoneyFollowVND(db, arrayResult[a].type, arrayResult[a].total, arrayResult[a].date)
            arrayResult['totalMoneyVND'] = totelMoney
        }
    })
    return arrayResult
}
async function calculateMoneyFollowVND(db, typeMoney, total, date) {
    let exchangeRate = 1;
    let result = 0;
    let currency = await mtblCurrency(db).findOne({
        where: { ShortName: typeMoney }
    })
    if (currency)
        await mtblRate(db).findOne({
            where: {
                Date: {
                    [Op.substring]: date
                },
                IDCurrency: currency.ID
            },
            order: [
                ['ID', 'DESC']
            ],
        }).then(async Rate => {
            if (Rate)
                exchangeRate = Rate.ExchangeRate
            else {
                let searchNow = moment().format('YYYY-MM-DD');
                await mtblRate(db).findOne({
                    where: {
                        Date: {
                            [Op.substring]: searchNow
                        },
                        IDCurrency: currency.ID
                    },
                    order: [
                        ['ID', 'DESC']
                    ],
                }).then(Rate => {
                    if (Rate)
                        exchangeRate = Rate.ExchangeRate
                })
            }
        })
    result = ((exchangeRate ? exchangeRate : 1) * total)
    return result
}
async function getExchangeRateFromDate(db, typeMoney, date) {
    let exchangeRate = 1;
    let result = {};
    let currency = await mtblCurrency(db).findOne({
        where: { ShortName: typeMoney }
    })
    if (currency)
        await mtblRate(db).findOne({
            where: {
                Date: {
                    [Op.substring]: date
                },
                IDCurrency: currency.ID
            },
            order: [
                ['ID', 'DESC']
            ],
        }).then(async Rate => {
            if (Rate)
                result = {
                    typeMoney: typeMoney,
                    exchangeRate: Rate.ExchangeRate,
                }
            else {
                let searchNow = moment().format('YYYY-MM-DD');
                await mtblRate(db).findOne({
                    where: {
                        Date: {
                            [Op.substring]: searchNow
                        },
                        IDCurrency: currency.ID
                    },
                    order: [
                        ['ID', 'DESC']
                    ],
                }).then(Rate => {
                    if (Rate)
                        result = {
                            typeMoney: typeMoney,
                            exchangeRate: Rate.ExchangeRate,
                        }
                })
            }
        })
    return result
}
module.exports = {
    deleteRelationshiptblInvoice,
    // get_list_tbl_invoice
    getListtblInvoice: async(req, res) => {
        var body = req.body
        let data = dataExport.data
        console.log(data);
        database.connectDatabase().then(async db => {
            var obj = {
                "paging": {
                    "pageSize": body.itemPerPage ? body.itemPerPage : 0,
                    "currentPage": body.page ? body.page : 0
                },
                "type": body.type
            }
            if (data) {
                let totalMoney = await calculateTheTotalAmountOfEachCurrency(data)
                for (let i = 0; i < data.length; i++) {
                    let check = await mtblInvoice(db).findOne({
                        where: { IDSpecializedSoftware: data[i].id }
                    })
                    let invoiceID;
                    if (!check) {
                        invoiceID = await mtblInvoice(db).create({
                            IDSpecializedSoftware: data[i].id,
                            Status: data[i].statusName,
                            Request: data[i].request,
                            IsInvoice: true
                        })
                        check = invoiceID
                    } else {
                        invoiceID = check
                        data[i].statusName = check.Status
                        data[i].request = check.Request
                    }
                    let totalMoneyVND = 0
                    let arrayExchangeRate = []
                    let arrayCurrency = []
                    for (let m = 0; m < data[i].arrayMoney.length; m++) {
                        arrayCurrency.push(data[i].arrayMoney[m].typeMoney)
                        totalMoneyVND += await calculateMoneyFollowVND(db, data[i].arrayMoney[m].typeMoney, (data[i].arrayMoney[m].total ? data[i].arrayMoney[m].total : 0), moment(data[i].createdDate).format('YYYY-DD-MM'))
                        arrayExchangeRate.push(await getExchangeRateFromDate(db, data[i].arrayMoney[m].typeMoney, moment(data[i].createdDate).format('YYYY-DD-MM')))
                        let currency = await mtblCurrency(db).findOne({
                            where: {
                                ShortName: data[i].arrayMoney[m].typeMoney
                            }
                        })
                        if (currency) {
                            let checkCurrency = await mtblInvoiceRCurrency(db).findOne({
                                where: {
                                    CurrencyID: currency.ID,
                                    InvoiceID: invoiceID.ID,
                                }
                            })
                            if (!checkCurrency)
                                await mtblInvoiceRCurrency(db).create({
                                    CurrencyID: currency.ID,
                                    InvoiceID: invoiceID.ID,
                                    UnpaidAmount: data[i].arrayMoney[m].total,
                                    PaidAmount: 0,
                                    InitialAmount: data[i].arrayMoney[m].total,
                                    Status: data[i].statusName,
                                })
                        }
                        let paidAmountArray = []
                        let remainingAmountArray = []
                        for (let cur of arrayCurrency) {
                            let currency = await mtblCurrency(db).findOne({
                                where: {
                                    ShortName: cur
                                }
                            })
                            let ObjAmount = await mtblInvoiceRCurrency(db).findOne({
                                where: {
                                    CurrencyID: currency.ID,
                                    InvoiceID: check.ID,
                                }
                            })
                            paidAmountArray.push({
                                key: cur,
                                value: ObjAmount.PaidAmount ? ObjAmount.PaidAmount : null,
                            })
                            remainingAmountArray.push({
                                key: cur,
                                value: ObjAmount.UnpaidAmount ? ObjAmount.UnpaidAmount : null,
                            })
                        }
                        data[i]['paidAmountArray'] = paidAmountArray;
                        data[i]['remainingAmountArray'] = remainingAmountArray;
                    }
                    data[i]['totalMoneyVND'] = totalMoneyVND
                    data[i]['arrayExchangeRate'] = arrayExchangeRate
                    data[i]['payDate'] = check ? (check.PayDate ? moment(check.PayDate).format('DD/MM/YYYY') : null) : ''
                    data[i]['payments'] = check ? check.Payments : ''
                    let tblPaymentRInvoice = mtblPaymentRInvoice(db)
                    tblPaymentRInvoice.belongsTo(mtblReceiptsPayment(db), { foreignKey: 'IDPayment', sourceKey: 'IDPayment', as: 'payment' })
                    let arrayReceiptPayment = []
                    await tblPaymentRInvoice.findAll({
                        where: {
                            IDSpecializedSoftware: data[i].id
                        },
                        include: [{
                            model: mtblReceiptsPayment(db),
                            required: false,
                            as: 'payment'
                        }, ],
                    }).then(invoice => {
                        if (invoice && invoice.length > 0) {
                            for (let item of invoice) {
                                arrayReceiptPayment.push({
                                    receiptPaymentID: item.IDPayment,
                                    receiptPaymentName: item.payment ? item.payment.CodeNumber : ''
                                })
                            }
                        }
                    })
                    data[i]['arrayReceiptPayment'] = arrayReceiptPayment
                }
                let totalMoneyVND = 0
                for (let a = 0; a < totalMoney.length; a++) {
                    totalMoneyVND += await calculateMoneyFollowVND(db, totalMoney[a].type, totalMoney[a].total, totalMoney[a].date)
                }
                var result = {
                    array: data,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    all: 10,
                    totalMoney: totalMoney,
                    totalMoneyVND: totalMoneyVND,

                }
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
}