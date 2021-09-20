const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblAccountingBooks = require('../tables/financemanage/tblAccountingBooks')
var database = require('../database');
var mModules = require('../constants/modules');
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')
var mtblCreditDebtnotices = require('../tables/financemanage/tblCreditDebtnotices')
var mtblCurrency = require('../tables/financemanage/tblCurrency')
var mtblRate = require('../tables/financemanage/tblRate')
dataCredit = [{
    id: 100,
    createdDate: '01/05/2020',
    invoiceNumber: 'INV0001',
    total: '1000000',
    statusName: 'Chờ thanh toám',
    idCustomer: 10,
    creditNumber: 'CRE0001',
    typeMoney: 'VND',
    customerName: 'Công ty tnhh Hòa Phát',
    employeeName: 'Lê Thị Thảo',
    idEmployee: 1,
    content: 'test 01',
    request: 'Yêu cầu Xóa',
    accountingCredit: '331',
    accountingDebt: '642',
},
{
    id: 102,
    createdDate: '01/05/2020',
    invoiceNumber: 'INV0002',
    total: '1200000',
    statusName: 'Chờ thanh toán',
    idCustomer: 10,
    creditNumber: 'CRE0002',
    typeMoney: 'VND',
    customerName: 'Công ty tnhh Hòa Phát',
    employeeName: 'Lê Thị Thảo',
    idEmployee: 1,
    content: 'test 01',
    request: '',
    accountingCredit: '331',
    accountingDebt: '642',
},
{
    id: 103,
    createdDate: '03/05/2020',
    invoiceNumber: 'INV0003',
    total: '1300000',
    statusName: 'Đã thanh toán',
    idCustomer: 10,
    creditNumber: 'CRE0003',
    typeMoney: 'VND',
    customerName: 'Công ty tnhh Hòa Phát',
    employeeName: 'Lê Thị Thảo',
    idEmployee: 1,
    content: 'test 01',
    request: 'Yêu cầu xóa',
    accountingCredit: '331',
    accountingDebt: '642',
},
{
    id: 104,
    createdDate: '04/05/2020',
    invoiceNumber: 'INV0004',
    total: '1400000',
    statusName: 'Đã thanh toán',
    idCustomer: 10,
    creditNumber: 'CRE0004',
    typeMoney: 'VND',
    customerName: 'Công ty tnhh Hòa Phát',
    employeeName: 'Lê Thị Thảo',
    idEmployee: 1,
    content: 'test 01',
    request: 'Yêu cầu sửa',
    accountingCredit: '331',
    accountingDebt: '642',
},
{
    id: 105,
    createdDate: '05/05/2020',
    invoiceNumber: 'INV0005',
    total: '1500000',
    statusName: 'Chờ thanh toán',
    idCustomer: 10,
    creditNumber: 'CRE0005',
    typeMoney: 'VND',
    customerName: 'Công ty tnhh Hòa Phát',
    employeeName: 'Lê Thị Thảo',
    idEmployee: 1,
    content: 'test 01',
    request: '',
    accountingCredit: '331',
    accountingDebt: '642',
},
{
    id: 106,
    createdDate: '06/05/2020',
    invoiceNumber: 'INV0006',
    total: '1600000',
    statusName: 'Chờ thanh toán',
    idCustomer: 10,
    creditNumber: 'CRE0006',
    typeMoney: 'VND',
    customerName: 'Công ty tnhh Hòa Phát',
    employeeName: 'Lê Thị Thảo',
    idEmployee: 1,
    content: 'test 01',
    request: '',
    accountingCredit: '331',
    accountingDebt: '642',
},
{
    id: 107,
    createdDate: '07/05/2020',
    invoiceNumber: 'INV0007',
    total: '1700000',
    statusName: 'Đã thanh toán',
    idCustomer: 10,
    creditNumber: 'CRE0007',
    typeMoney: 'VND',
    customerName: 'Công ty tnhh Hòa Phát',
    employeeName: 'Lê Thị Thảo',
    idEmployee: 1,
    content: 'test 01',
    request: 'Yêu cầu xóa',
    accountingCredit: '331',
    accountingDebt: '642',
},
{
    id: 108,
    createdDate: '08/05/2020',
    invoiceNumber: 'INV0008',
    total: '1800000',
    statusName: 'Chờ thanh toán',
    idCustomer: 10,
    creditNumber: 'CRE0008',
    typeMoney: 'VND',
    customerName: 'Công ty tnhh Hòa Phát',
    employeeName: 'Lê Thị Thảo',
    idEmployee: 1,
    content: 'test 01',
    request: '',
    accountingCredit: '331',
    accountingDebt: '642',
},
{
    id: 109,
    createdDate: '10/05/2020',
    invoiceNumber: 'INV0009',
    total: '1900000',
    statusName: 'Chờ thanh toán',
    idCustomer: 10,
    creditNumber: 'CRE0009',
    typeMoney: 'VND',
    customerName: 'Công ty tnhh Hòa Phát',
    employeeName: 'Lê Thị Thảo',
    idEmployee: 1,
    content: 'test 01',
    request: '',
    accountingCredit: '331',
    accountingDebt: '642',
},
{
    id: 110,
    createdDate: '12/05/2020',
    invoiceNumber: 'INV0010',
    total: '12000000',
    statusName: 'Đã thanh toán',
    idCustomer: 10,
    creditNumber: 'CRE0010',
    typeMoney: 'VND',
    customerName: 'Công ty tnhh Hòa Phát',
    employeeName: 'Lê Thị Thảo',
    idEmployee: 1,
    content: 'test 01',
    request: 'Yêu cầu sửa',
    accountingCredit: '331',
    accountingDebt: '642',
},
]
dataInvoice = [{
    id: 1,
    createdDate: '01/05/2020',
    refNumber: 'REF0001',
    invoiceNumber: 'INV0001',
    arrayMoney: [{
        total: '1000000',
        typeMoney: 'VND',
    },
    {
        total: '100',
        typeMoney: 'USD',
    },

    ],
    statusName: 'Đã thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 1',
    request: '',
    departmentName: 'Sáng chế',
    departmentID: 10025,
},
{
    id: 2,
    createdDate: '02/05/2021',
    refNumber: 'REF0002',
    invoiceNumber: 'INV0002',
    arrayMoney: [{
        total: '1100000',
        typeMoney: 'VND',
    },
    {
        total: '10',
        typeMoney: 'USD',
    },
    ],
    statusName: 'Đã thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 2',
    request: 'Yêu cầu xóa',
    departmentName: 'KẾ TOÁN',
    departmentID: 10026,
},
{
    id: 3,
    createdDate: '03/05/2021',
    refNumber: 'REF0003',
    invoiceNumber: 'INV0003',
    arrayMoney: [{
        total: '1200000',
        typeMoney: 'VND',
    },

    ],
    statusName: 'Đã thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 3',
    request: 'Yêu cầu sửa',
    departmentName: 'Sáng chế',
    departmentID: 10025,
},
{
    id: 4,
    createdDate: '04/05/2021',
    refNumber: 'REF0004',
    invoiceNumber: 'INV0004',
    arrayMoney: [{
        total: '1300000',
        typeMoney: 'VND',
    },
    {
        total: '100',
        typeMoney: 'USD',
    },

    ],
    statusName: 'Đã thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 4',
    request: 'Yêu cầu sửa',
    departmentName: 'HÀNH CHÍNH NHÂN SỰ',
    departmentID: 10027,

},
{
    id: 5,
    createdDate: '05/05/2020',
    refNumber: 'REF0005',
    invoiceNumber: 'INV0005',
    arrayMoney: [{
        total: '1400000',
        typeMoney: 'VND',
    },

    ],
    statusName: 'Đã thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 5',
    request: '',
    departmentName: 'Sáng chế',
    departmentID: 10025,
},
{
    id: 6,
    createdDate: '06/05/2020',
    refNumber: 'REF0006',
    invoiceNumber: 'INV0006',
    arrayMoney: [{
        total: '1500000',
        typeMoney: 'VND',
    },
    {
        total: '100',
        typeMoney: 'USD',
    },
    ],
    statusName: 'Đã thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 6',
    request: 'Yêu cầu xóa',
    departmentName: 'Sáng chế',
    departmentID: 10025,
},
{
    id: 7,
    createdDate: '07/05/2021',
    refNumber: 'REF0007',
    invoiceNumber: 'INV0007',
    arrayMoney: [{
        total: '1600000',
        typeMoney: 'VND',
    },

    ],
    statusName: 'Chờ thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 7',
    request: 'Yêu cầu xóa',
    departmentName: 'KẾ TOÁN',
    departmentID: 10026,
},
{
    id: 8,
    createdDate: '08/05/2020',
    refNumber: 'REF0008',
    invoiceNumber: 'INV0008',
    arrayMoney: [{
        total: '100',
        typeMoney: 'USD',
    },

    ],
    statusName: 'Chờ thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 8',
    request: 'Yêu cầu sửa',
    departmentName: 'Sáng chế',
    departmentID: 10025,
},
{
    id: 9,
    createdDate: '09/05/2020',
    refNumber: 'REF0009',
    invoiceNumber: 'INV0009',
    arrayMoney: [{
        total: '2000000',
        typeMoney: 'VND',
    },
    {
        total: '130',
        typeMoney: 'USD',
    },

    ],
    statusName: 'Chờ thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 9',
    request: 'Yêu cầu sửa',
    departmentName: 'Ban NH3',
    departmentID: 10035,
},
{
    id: 10,
    createdDate: '10/05/2020',
    refNumber: 'REF0010',
    invoiceNumber: 'INV0010',
    arrayMoney: [{
        total: '123',
        typeMoney: 'VND',
    },],
    statusName: 'Chờ thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 10',
    request: 'Yêu cầu sửa',
    departmentName: 'Ban NH3',
    departmentID: 10035,
},
];
var mtblInvoice = require('../tables/financemanage/tblInvoice')
var mtblDMTaiKhoanKeToan = require('../tables/financemanage/tblDMTaiKhoanKeToan')
async function deleteRelationshiptblAccountingBooks(db, listID) {
    await mtblAccountingBooks(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}

function checkDuplicate(array, elm) {
    var check = false;
    array.forEach(item => {
        if (item === elm) check = true;
    })
    return check;
}
async function getInvoiceWaitForPayInDB(db, dataRequest, account) {
    let array = [];
    for (let i = 0; i < dataRequest.length; i++) {
        let check = await mtblInvoice(db).findOne({
            where: { IDSpecializedSoftware: dataRequest[i].id }
        })
        if (check) {
            if (account == '331')
                dataRequest[i].invoiceNumber = dataRequest[i].creditNumber
            dataRequest[i].statusName = check.Status
            dataRequest[i].request = check.Request
            dataRequest[i]['invoiceID'] = check.ID
            // if (check.Status == 'Chờ thanh toán')
            array.push(dataRequest[i])
        }
    }
    return array;
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
                Date: { [Op.substring]: date },
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
                        Date: { [Op.substring]: searchNow },
                        IDCurrency: currency.ID
                    },
                    order: [
                        ['ID', 'DESC']
                    ],
                }).then(Rate => {
                    if (Rate)
                        exchangeRate = Rate.ExchangeRate
                    else {

                    }
                })
            }
        })
    result = ((exchangeRate ? exchangeRate : 1) * total)
    return result
}
async function getInvoiceWaitForPay(db, objWaitForPay, stt) {
    let totalMoneyVND = 0;
    for (let m = 0; m < objWaitForPay.arrayMoney.length; m++) {
        totalMoneyVND += await calculateMoneyFollowVND(db, objWaitForPay.arrayMoney[m].typeMoney, (objWaitForPay.arrayMoney[m].total ? objWaitForPay.arrayMoney[m].total : 0), moment(objWaitForPay.createdDate).format('YYYY-DD-MM'))
    }
    let obj = {
        stt: stt,
        // id: Number(item.ID),
        accountingName: 'Phải thu của khách hàng',
        accountingCode: '131',
        accountingReciprocalName: 'Doanh thu bán hàng',
        accountingReciprocalCode: '511',
        numberReceipts: '',
        createDate: objWaitForPay.createdDate,
        entryDate: objWaitForPay.createdDate,
        number: objWaitForPay.invoiceNumber,
        reason: objWaitForPay.customerName + ' chưa thanh toán',
        idAccounting: objWaitForPay.invoiceID ? objWaitForPay.invoiceID : null,
        creditIncurred: 0,
        debtIncurred: totalMoneyVND,
        debtSurplus: 0, // số dư phải tính
        creaditSurplus: 0,
    }
    return obj;
}
async function getCreditWaitPay(db, objWaitForPay, stt) {
    console.log(objWaitForPay);
    let accountingCredit = await mtblDMTaiKhoanKeToan(db).findOne({
        where: {
            AccountingCode: objWaitForPay.accountingCredit
        }
    })
    let accountingDebt = await mtblDMTaiKhoanKeToan(db).findOne({
        where: {
            AccountingCode: objWaitForPay.accountingDebt
        }
    })
    let obj = {
        stt: stt,
        // id: Number(item.ID),
        accountingName: accountingCredit ? accountingCredit.AccountingName : '',
        accountingCode: accountingCredit ? accountingCredit.AccountingCode : '',
        accountingReciprocalName: accountingDebt ? accountingDebt.AccountingName : '',
        accountingReciprocalCode: accountingDebt ? accountingDebt.AccountingCode : '',
        numberReceipts: '',
        createDate: objWaitForPay.createdDate,
        entryDate: objWaitForPay.createdDate,
        number: objWaitForPay.invoiceNumber,
        reason: 'Chưa trả cho ' + objWaitForPay.customerName,
        idAccounting: objWaitForPay.invoiceID ? objWaitForPay.invoiceID : null,
        creditIncurred: objWaitForPay.total,
        debtIncurred: 0,
        debtSurplus: 0, // số dư phải tính
        creaditSurplus: 0,
    }
    return obj;
}

let arrayCreditAccount = ["214", "2141", "2142", "2143", "2147", "229", "2291", "2292", "2293", "2294", "334", "335", "336", "3361", "3368", "341", "3411", "3412", "352", "3521", "3522", "3523", "3524", "353", "3531", "3532", "3533", "3534", "356", "3561", "3562", "411", "4111", "4112", "4118", "418"]
let arrayDebtAccount = ["111", "1111", "1112", "112", "1121", "1122", "121", "128", "1281", "1288", "133", "1331", "1332", "136", "1361", "1368", "1386", "141", "151", "152", "153", "154", "155", "156", "157", "211", "2111", "21111", "21112", "21113", "21114", "21115", "21116", "21118", "2112", "2113", "21131", "21132", "21133", "21133", "21134", "21135", "21136", "21138", "217", "228", "2281", "2288", "241", "2411", "2412", "2413", "242", "419"]
let arrayBiexualAccount = ["131", "138", "1381", "1388", "331", "333", "3331", "33311", "33312", "3332", "3333", "3334", "3335", "3336", "3337", "3338", "33381", "33381", "3339", "338", "3381", "3382", "3383", "3384", "3385", "3386", "3387", "3388", "413", "421", "4211", "4212", "511", "5111", "5112", "5113", "5118", "515", "611", "531", "632", "635", "642", "6421", "6422", "711", "811", "821", "911"]

module.exports = {
    deleteRelationshiptblAccountingBooks,
    //  get_detail_tbl_accounting_books
    detailtblAccountingBooks: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblAccountingBooks(db).findOne({ where: { ID: body.id } }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                numberReceipts: data.NumberReceipts ? data.NumberReceipts : '',
                                createDate: data.CreateDate ? data.CreateDate : null,
                                entryDate: data.EntryDate ? data.EntryDate : null,
                                number: data.Number ? data.Number : '',
                                reason: data.Reason ? data.Reason : '',
                                idAccounting: data.IDAccounting ? data.IDAccounting : null,
                                debtIncurred: data.DebtIncurred ? data.DebtIncurred : null,
                                creditIncurred: data.CreditIncurred ? data.CreditIncurred : null,
                                debtSurplus: data.DebtSurplus ? data.DebtSurplus : null,
                                creaditSurplus: data.CreaditSurplus ? data.CreaditSurplus : null,
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
    // add_tbl_accounting_books
    addtblAccountingBooks: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblAccountingBooks(db).create({
                        NumberReceipts: body.numberReceipts ? body.numberReceipts : '',
                        CreateDate: body.createDate ? body.createDate : null,
                        EntryDate: body.entryDate ? body.entryDate : null,
                        Number: body.number ? body.number : '',
                        Reason: body.reason ? body.reason : '',
                        IDAccounting: body.idAccounting ? body.idAccounting : null,
                        DebtIncurred: body.debtIncurred ? body.debtIncurred : null,
                        CreditIncurred: body.creditIncurred ? body.creditIncurred : null,
                        DebtSurplus: body.debtSurplus ? body.debtSurplus : null,
                        CreaditSurplus: body.creaditSurplus ? body.creaditSurplus : null,
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
    // update_tbl_accounting_books
    updatetblAccountingBooks: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.number || body.number === '')
                        update.push({ key: 'Number', value: body.number });
                    if (body.reason || body.reason === '')
                        update.push({ key: 'Reason', value: body.reason });
                    if (body.numberReceipts || body.numberReceipts === '')
                        update.push({ key: 'NumberReceipts', value: body.numberReceipts });
                    if (body.createDate || body.createDate === '') {
                        if (body.createDate === '')
                            update.push({ key: 'CreateDate', value: null });
                        else
                            update.push({ key: 'CreateDate', value: body.createDate });
                    }
                    if (body.entryDate || body.entryDate === '') {
                        if (body.entryDate === '')
                            update.push({ key: 'EntryDate', value: null });
                        else
                            update.push({ key: 'EntryDate', value: body.entryDate });
                    }
                    if (body.idAccounting || body.idAccounting === '') {
                        if (body.idAccounting === '')
                            update.push({ key: 'IDAccounting', value: null });
                        else
                            update.push({ key: 'IDAccounting', value: body.idAccounting });
                    }
                    if (body.debtIncurred || body.debtIncurred === '') {
                        if (body.debtIncurred === '')
                            update.push({ key: 'DebtIncurred', value: null });
                        else
                            update.push({ key: 'DebtIncurred', value: body.debtIncurred });
                    }
                    if (body.creditIncurred || body.creditIncurred === '') {
                        if (body.creditIncurred === '')
                            update.push({ key: 'CreditIncurred', value: null });
                        else
                            update.push({ key: 'CreditIncurred', value: body.creditIncurred });
                    }
                    if (body.debtSurplus || body.debtSurplus === '') {
                        if (body.debtSurplus === '')
                            update.push({ key: 'DebtSurplus', value: null });
                        else
                            update.push({ key: 'DebtSurplus', value: body.debtSurplus });
                    }
                    if (body.creaditSurplus || body.creaditSurplus === '') {
                        if (body.creaditSurplus === '')
                            update.push({ key: 'CreaditSurplus', value: null });
                        else
                            update.push({ key: 'CreaditSurplus', value: body.creaditSurplus });
                    }
                    database.updateTable(update, mtblAccountingBooks(db), body.id).then(response => {
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
    // delete_tbl_accounting_books
    deletetblAccountingBooks: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblAccountingBooks(db, listID);
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
    // get_list_tbl_accounting_books
    getListtblAccountingBooks: (req, res) => {
        let body = req.body;
        let array = [
            'first_six_months',
            'last_six_months',
            'one_quarter',
            'two_quarter',
            'three_quarter',
            'four_quarter',
            'last_year',
            'this_year',
        ]
        let dataSearch = JSON.parse(body.dataSearch)
        var arrayIDAccount = []
        if (dataSearch.accountSystemID)
            arrayIDAccount.push(dataSearch.accountSystemID)
        if (dataSearch.accountSystemOtherID)
            arrayIDAccount.push(dataSearch.accountSystemOtherID)
        const currentYear = new Date().getFullYear()
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (arrayIDAccount.length > 0)
                        whereOjb.push({
                            IDAccounting: {
                                [Op.in]: arrayIDAccount
                            }
                        })
                    if (dataSearch.selection == 'first_six_months') {
                        const startedDate = new Date(currentYear + "-01-01 14:00:00");
                        const endDate = new Date(currentYear + "-06-30 14:00:00");
                        whereOjb.push({
                            CreateDate: {
                                [Op.between]: [startedDate, endDate]
                            }
                        })
                    } else if (dataSearch.selection == 'last_six_months') {
                        let startedDate = new Date(currentYear + "-06-01 07:00:00");
                        let endDate = new Date(currentYear + "-12-30 24:00:00");
                        whereOjb.push({
                            CreateDate: {
                                [Op.between]: [startedDate, endDate]
                            }
                        })
                    } else if (dataSearch.selection == 'one_quarter') {
                        let startedDate = new Date(currentYear + "-01-01 07:00:00");
                        let endDate = new Date(currentYear + "-04-01 00:00:00");
                        whereOjb.push({
                            CreateDate: {
                                [Op.between]: [startedDate, endDate]
                            }
                        })
                    } else if (dataSearch.selection == 'two_quarter') {
                        let startedDate = new Date(currentYear + "-04-01 07:00:00");
                        let endDate = new Date(currentYear + "-07-01 00:00:00");
                        whereOjb.push({
                            CreateDate: {
                                [Op.between]: [startedDate, endDate]
                            }
                        })
                    } else if (dataSearch.selection == 'three_quarter') {
                        let startedDate = new Date(currentYear + "-07-01 07:00:00");
                        let endDate = new Date(currentYear + "-10-01 00:00:00");
                        whereOjb.push({
                            CreateDate: {
                                [Op.between]: [startedDate, endDate]
                            }
                        })
                    } else if (dataSearch.selection == 'four_quarter') {
                        let startedDate = new Date(currentYear + "-10-01 07:00:00");
                        let endDate = new Date(currentYear + "-12-30 24:00:00");
                        whereOjb.push({
                            CreateDate: {
                                [Op.between]: [startedDate, endDate]
                            }
                        })
                    } else if (dataSearch.selection == 'last_year') {
                        let startedDate = new Date((currentYear - 1) + "-01-01 07:00:00");
                        let endDate = new Date((currentYear - 1) + "-12-30 24:00:00");
                        whereOjb.push({
                            CreateDate: {
                                [Op.between]: [startedDate, endDate]
                            }
                        })
                    } else if (dataSearch.selection == 'this_year') {
                        let startedDate = new Date(currentYear + "-01-01 07:00:00");
                        let endDate = new Date(currentYear + "-12-30 24:00:00");
                        whereOjb.push({
                            CreateDate: {
                                [Op.between]: [startedDate, endDate]
                            }
                        })
                    } else if (dataSearch.dateFrom && dataSearch.dateTo) {
                        dataSearch.dateTo = moment(dataSearch.dateTo).add(2, 'days').format('YYYY-MM-DD')
                        whereOjb.push({
                            CreateDate: {
                                [Op.between]: [dataSearch.dateFrom, dataSearch.dateTo]
                            }
                        })
                    }
                    let totalCreditIncurred = 0;
                    let totalDebtIncurred = 0;
                    let totalCreaditSurplus = 0;
                    let totalDebtSurplus = 0;
                    let arisingPeriod = 0;
                    let openingBalanceCredit = 0;
                    let openingBalanceDebit = 0;
                    let endingBalanceDebit = 0;
                    let endingBalanceCredit = 0;
                    let stt = 1;
                    let tblAccountingBooks = mtblAccountingBooks(db);
                    let accountBooks = await mtblDMTaiKhoanKeToan(db).findOne({
                        where: {
                            ID: dataSearch.accountSystemID
                        }
                    })
                    arisingPeriod = totalDebtIncurred - totalCreditIncurred;
                    openingBalanceDebit = accountBooks ? (accountBooks.MoneyDebit ? accountBooks.MoneyDebit : null) : null
                    openingBalanceCredit = accountBooks ? (accountBooks.MoneyCredit ? accountBooks.MoneyCredit : null) : null
                    let debtSurplus = openingBalanceDebit;
                    let creaditSurplus = openingBalanceCredit;
                    tblAccountingBooks.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDAccounting', sourceKey: 'IDAccounting', as: 'accounting' })
                    tblAccountingBooks.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        order: [
                            ['ID', 'ASC']
                        ],
                        include: [{
                            model: mtblDMTaiKhoanKeToan(db),
                            required: false,
                            as: 'accounting'
                        },],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            var arrayWhere = []
                            if (data[i].IDPayment) {
                                arrayWhere.push({
                                    IDPayment: data[i].IDPayment
                                })
                            } else if (data[i].IDnotices) {
                                arrayWhere.push({
                                    IDnotices: data[i].IDnotices
                                })
                            } else {
                                arrayWhere.push({
                                    IDPayment: {
                                        [Op.ne]: null
                                    }
                                })
                            }
                            let clauseType = "Credit"
                            if (data[i].ClauseType == "Credit") {
                                clauseType = "Debit"
                            }
                            await tblAccountingBooks.findAll({
                                where: {
                                    [Op.and]: [{
                                        [Op.or]: arrayWhere
                                    },
                                    {
                                        ID: {
                                            [Op.ne]: data[i].ID
                                        }
                                    }, {
                                        ClauseType: clauseType
                                    }
                                    ]
                                },
                                order: [
                                    ['ID', 'ASC']
                                ],
                                include: [{
                                    model: mtblDMTaiKhoanKeToan(db),
                                    required: false,
                                    as: 'accounting'
                                },],
                            }).then(async accounting => {
                                if (accounting) {
                                    for (item of accounting) {
                                        let checkTypeClause = await mtblDMTaiKhoanKeToan(db).findOne({
                                            where: {
                                                ID: data[i].IDAccounting
                                            }
                                        })
                                        if (checkTypeClause && checkTypeClause.TypeClause == 'Biexual') {
                                            debtSurplus += (openingBalanceDebit != null ? ((data[i].DebtIncurred ? data[i].DebtIncurred : 0) - (data[i].CreditIncurred ? data[i].CreditIncurred : 0)) : 0);
                                            creaditSurplus += (openingBalanceCredit != null ? ((data[i].CreditIncurred ? data[i].CreditIncurred : 0) - (data[i].DebtIncurred ? data[i].DebtIncurred : 0)) : 0);
                                        } else if (checkTypeClause && checkTypeClause.TypeClause == 'Debt') {
                                            debtSurplus += (openingBalanceDebit != null ? ((data[i].DebtIncurred ? data[i].DebtIncurred : 0) - (data[i].CreditIncurred ? data[i].CreditIncurred : 0)) : 0);
                                            creaditSurplus += 0;
                                        } else if (checkTypeClause && checkTypeClause.TypeClause == 'Credit') {
                                            debtSurplus += 0;
                                            creaditSurplus += (openingBalanceCredit != null ? ((data[i].CreditIncurred ? data[i].CreditIncurred : 0) - (data[i].DebtIncurred ? data[i].DebtIncurred : 0)) : 0);
                                        } else {
                                            debtSurplus = 0;
                                            creaditSurplus = 0;
                                        }
                                        var obj = {
                                            stt: stt,
                                            id: Number(item.ID),
                                            accountingName: data[i].accounting ? data[i].accounting.AccountingName : '',
                                            accountingCode: data[i].accounting ? data[i].accounting.AccountingCode : '',
                                            accountingReciprocalName: item.accounting ? item.accounting.AccountingName : '',
                                            accountingReciprocalCode: item.accounting ? item.accounting.AccountingCode : '',
                                            numberReceipts: item.NumberReceipts ? item.NumberReceipts : '',
                                            createDate: item.CreateDate ? moment(item.CreateDate).format('DD/MM/YYYY') : null,
                                            entryDate: item.EntryDate ? moment(item.EntryDate).format('DD/MM/YYYY') : null,
                                            number: item.Number ? item.Number : '',
                                            reason: item.Reason ? item.Reason : '',
                                            idAccounting: item.IDAccounting ? item.IDAccounting : null,
                                            creditIncurred: data[i].CreditIncurred ? data[i].CreditIncurred : 0,
                                            debtIncurred: data[i].DebtIncurred ? data[i].DebtIncurred : 0,
                                            debtSurplus: debtSurplus == 0 ? null : debtSurplus,
                                            creaditSurplus: creaditSurplus == 0 ? null : creaditSurplus,
                                        }
                                        if (arrayIDAccount.length <= 1) {
                                            totalCreditIncurred += (obj.creditIncurred ? obj.creditIncurred : 0);
                                            totalDebtIncurred += (obj.debtIncurred ? obj.debtIncurred : 0);
                                            totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                            totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                            array.push(obj);
                                            stt += 1;
                                        } else {
                                            if (dataSearch.accountSystemID == Number(data[i].IDAccounting) && dataSearch.accountSystemOtherID == Number(item.IDAccounting)) {
                                                totalCreditIncurred += (obj.creditIncurred ? obj.creditIncurred : 0);
                                                totalDebtIncurred += (obj.debtIncurred ? obj.debtIncurred : 0);
                                                totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                array.push(obj);
                                                stt += 1;
                                            }
                                        }
                                    }
                                }
                            })
                        }
                        // Hàm lấy ra Những invoice chưa thanh toán tự động định khoản vào sổ tài khoản 131 và đối ứng là tài khoản 511
                        let checkAccount131 = await mtblDMTaiKhoanKeToan(db).findOne({
                            where: {
                                ID: dataSearch.accountSystemID
                            }
                        })
                        if (checkAccount131.AccountingCode == '131') {
                            let arrayInvoice = await getInvoiceWaitForPayInDB(db, dataInvoice, '131')
                            for (invoice of arrayInvoice) {
                                let objWaitForPay = await getInvoiceWaitForPay(db, invoice, stt);
                                // vì là tài khoản lưỡng tính
                                if (creaditSurplus != 0)
                                    creaditSurplus += Number(invoice.total);
                                if (debtSurplus != 0)
                                    debtSurplus += Number(invoice.total);
                                objWaitForPay['debtSurplus'] = debtSurplus == 0 ? null : debtSurplus
                                objWaitForPay['creaditSurplus'] = creaditSurplus == 0 ? null : creaditSurplus
                                totalCreditIncurred += (objWaitForPay.creditIncurred ? objWaitForPay.creditIncurred : 0);
                                totalDebtIncurred += (objWaitForPay.debtIncurred ? objWaitForPay.debtIncurred : 0);
                                totalCreaditSurplus += (objWaitForPay.creaditSurplus ? objWaitForPay.creaditSurplus : 0);
                                totalDebtSurplus += (objWaitForPay.debtSurplus ? objWaitForPay.debtSurplus : 0);
                                array.push(objWaitForPay);
                                stt += 1;
                            }
                        }
                        //  lấy dữ liệu credit Những credit chưa thanh toán tự động định khoản vào sổ tài khoản (tài khoản lấy theo pmcm gửi về)
                        let checkAccount331 = await mtblDMTaiKhoanKeToan(db).findOne({
                            where: {
                                ID: dataSearch.accountSystemID
                            }
                        })
                        if (checkAccount331.AccountingCode == '331') {
                            let arrayCredit = await getInvoiceWaitForPayInDB(db, dataCredit, '331')
                            for (credit of arrayCredit) {
                                let objWaitForPay = await getCreditWaitPay(db, credit, stt)
                                // vì là tài khoản lưỡng tính
                                if (creaditSurplus != 0)
                                    creaditSurplus += Number(credit.total);
                                if (debtSurplus != 0)
                                    debtSurplus += Number(credit.total);
                                objWaitForPay['debtSurplus'] = debtSurplus == 0 ? null : debtSurplus
                                objWaitForPay['creaditSurplus'] = creaditSurplus == 0 ? null : creaditSurplus
                                totalCreditIncurred += (objWaitForPay.creditIncurred ? Number(objWaitForPay.creditIncurred) : 0);
                                totalDebtIncurred += (objWaitForPay.debtIncurred ? Number(objWaitForPay.debtIncurred) : 0);
                                totalCreaditSurplus += (objWaitForPay.creaditSurplus ? Number(objWaitForPay.creaditSurplus) : 0);
                                totalDebtSurplus += (objWaitForPay.debtSurplus ? Number(objWaitForPay.debtSurplus) : 0);
                                array.push(objWaitForPay);
                                stt += 1;
                            }
                        }
                        var count = await mtblAccountingBooks(db).count({ where: whereOjb, })
                        endingBalanceDebit = openingBalanceDebit != null ? (openingBalanceDebit + (totalDebtIncurred - totalCreditIncurred)) : null;
                        endingBalanceCredit = openingBalanceCredit != null ? (openingBalanceCredit + (totalCreditIncurred - totalDebtIncurred)) : null;
                        var result = {
                            total: {
                                totalCreditIncurred,
                                totalDebtIncurred,
                                totalCreaditSurplus,
                                totalDebtSurplus,
                                arisingPeriod,
                                openingBalanceDebit,
                                openingBalanceCredit,
                                endingBalanceDebit,
                                endingBalanceCredit,
                            },
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
    // api update tài khoản dư nợ/ có/ lưỡng tính vào database
    // insert_account_db
    insertAccountDB: (req, res) => {
        database.connectDatabase().then(async db => {
            if (db) {
                mtblDMTaiKhoanKeToan(db).findAll().then(async data => {
                    for (item of data) {
                        if (checkDuplicate(arrayDebtAccount, item.AccountingCode)) {
                            await mtblDMTaiKhoanKeToan(db).update({
                                TypeClause: 'Debt'
                            }, {
                                where: { ID: item.ID }
                            })
                        }
                        else if (checkDuplicate(arrayCreditAccount, item.AccountingCode)) {
                            await mtblDMTaiKhoanKeToan(db).update({
                                TypeClause: 'Credit'
                            }, {
                                where: { ID: item.ID }
                            })
                        }
                        else if (checkDuplicate(arrayBiexualAccount, item.AccountingCode)) {
                            await mtblDMTaiKhoanKeToan(db).update({
                                TypeClause: 'Biexual'
                            }, {
                                where: { ID: item.ID }
                            })
                        } else {
                            await mtblDMTaiKhoanKeToan(db).update({
                                TypeClause: 'Chưa co du lieu'
                            }, {
                                where: { ID: item.ID }
                            })
                        }
                    }
                })
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
}