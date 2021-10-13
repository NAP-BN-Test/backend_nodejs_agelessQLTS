const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblCustomer = require('../tables/financemanage/tblCustomer')
var database = require('../database');
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')
var mtblInvoice = require('../tables/financemanage/tblInvoice')
var customerData = require('../controller_finance/ctl-apiSpecializedSoftware')

async function deleteRelationshiptblCustomer(db, listID) {
    await mtblCustomer(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
data = [{
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
totalMoney = [{
    total: 1000000000,
    type: 'VND',
},
{
    total: 1000,
    type: 'USD',
}
];
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
    accountingDebt: '331',
    accountingCredit: '642',
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
    accountingDebt: '331',
    accountingCredit: '642',
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
    accountingDebt: '331',
    accountingCredit: '642',
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
    accountingDebt: '331',
    accountingCredit: '642',
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
    accountingDebt: '331',
    accountingCredit: '642',
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
    accountingDebt: '331',
    accountingCredit: '642',
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
    accountingDebt: '331',
    accountingCredit: '642',
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
    accountingDebt: '331',
    accountingCredit: '642',
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
    accountingDebt: '331',
    accountingCredit: '642',
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
    accountingDebt: '331',
    accountingCredit: '642',
},
]
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
        }
        else
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
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // await axios.get(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/address_book/partners_share`).then(async data => {
                    //     if (data) {
                    let dataCustomer = customerData.getCustomerSpecializeSoftware()
                    // var array = data.data.data;
                    var array = dataCustomer;
                    var arrayResult = [];
                    var stt = 1;
                    let arrayInvoice = []
                    let arrayCredit = []
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].id == 1) {
                            arrayInvoice = await calculateTheTotalAmountOfEachCurrency(db, data)
                            // arrayCredit = await calculateTheTotalForCredit(db, dataCredit)
                            arrayCredit = [
                                {
                                    typeMoney: 'VND',
                                    total: 0
                                }]
                        } else if (array[i].id == 10) {
                            // arrayInvoice = await calculateTheTotalAmountOfEachCurrency(db, data)
                            arrayCredit = await calculateTheTotalForCredit(db, dataCredit)
                            arrayInvoice = [
                                {
                                    typeMoney: 'VND',
                                    total: 0
                                }]
                        } else {
                            arrayInvoice = [
                                {
                                    typeMoney: 'VND',
                                    total: 0
                                }]
                            arrayCredit = [
                                {
                                    typeMoney: 'VND',
                                    total: 0
                                }]
                        }
                        var cus = await mtblCustomer(db).findOne({
                            where: {
                                IDSpecializedSoftware: array[i].id
                            }
                        })
                        if (!cus) {
                            await mtblCustomer(db).create({
                                IDSpecializedSoftware: array[i].id ? array[i].id : null,
                                AmountUnspecified: 0,
                                AmountSpent: 0,
                                AmountReceivable: 0,
                            })
                        }
                        let totalInv = 0;
                        let totalUndefind = 0;
                        let totalCredit = 0;
                        await mtblCustomer(db).findOne({
                            where: { IDSpecializedSoftware: array[i].id },
                        }).then(async data => {
                            for (var inv = 0; inv < data.length; inv++) {
                                if (data[inv].idCustomer == array[i].id) {
                                    totalInv += Number(data[inv].total)
                                }
                            }
                            for (var cre = 0; cre < dataCredit.length; cre++) {
                                if (dataCredit[cre].idCustomer == array[i].id) {
                                    totalCredit += Number(dataCredit[cre].total)
                                }
                            }
                            await mtblReceiptsPayment(db).findAll({
                                where: {
                                    IDCustomer: array[i].id,
                                    UnpaidAmount: { [Op.ne]: 0 },
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    totalUndefind += Number(item.UnpaidAmount);
                                })
                            })
                            var obj = {
                                stt: stt,
                                id: Number(data.IDSpecializedSoftware),
                                name: array[i].name ? array[i].name : '',
                                code: array[i].customerCode ? array[i].customerCode : '',
                                address: array[i].address ? array[i].address : '',
                                idSpecializedSoftware: data.IDSpecializedSoftware ? data.IDSpecializedSoftware : 0,
                                amountUnspecified: [{ total: totalUndefind, typeMoney: 'VND' }, { total: 0, typeMoney: 'USD' }],
                                amountSpent: arrayCredit,
                                amountReceivable: arrayInvoice,
                            }
                            arrayResult.push(obj);
                            stt += 1;
                        })
                    }
                    var count = await mtblCustomer(db).count()
                    var result = {
                        array: arrayResult,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: count
                    }
                    res.json(result);
                    //     }
                    //     else {
                    //         res.json(Result.SYS_ERROR_RESULT)
                    //     }
                    //     // console.log(data.data);
                    // })
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
                    // await axios.get(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/address_book/partners_share`).then(async data => {
                    //     if (data) {
                    let dataCustomer = customerData.getCustomerSpecializeSoftware()
                    // var array = data.data.data;
                    var array = dataCustomer;
                    var arrayResult = [];
                    var stt = 1;
                    let arrayInvoice = []
                    let arrayCredit = []
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].id == 1) {
                            arrayInvoice = await calculateTheTotalAmountOfEachCurrency(db, data)
                            arrayCredit = await calculateTheTotalForCredit(db, dataCredit)
                        } else {
                            arrayInvoice = [
                                {
                                    typeMoney: 'VND',
                                    total: 0
                                }]
                            arrayCredit = [
                                {
                                    typeMoney: 'VND',
                                    total: 0
                                }]
                        }
                        var cus = await mtblCustomer(db).findOne({
                            where: {
                                IDSpecializedSoftware: array[i].id
                            }
                        })
                        if (!cus) {
                            await mtblCustomer(db).create({
                                IDSpecializedSoftware: array[i].id ? array[i].id : null,
                                AmountUnspecified: 0,
                                AmountSpent: 0,
                                AmountReceivable: 0,
                            })
                        }
                        let totalInv = 0;
                        let totalUndefind = 0;
                        let totalCredit = 0;
                        await mtblCustomer(db).findOne({
                            where: { IDSpecializedSoftware: array[i].id },
                        }).then(async data => {
                            for (var inv = 0; inv < data.length; inv++) {
                                if (data[inv].idCustomer == array[i].id) {
                                    totalInv += Number(data[inv].total)
                                }
                            }
                            for (var cre = 0; cre < dataCredit.length; cre++) {
                                if (dataCredit[cre].idCustomer == array[i].id) {
                                    totalCredit += Number(dataCredit[cre].total)
                                }
                            }
                            await mtblReceiptsPayment(db).findAll({
                                where: {
                                    IDCustomer: array[i].id,
                                    UnpaidAmount: { [Op.ne]: 0 },
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    totalUndefind += Number(item.Amount);
                                })
                            })
                            console.log(arrayInvoice);
                            var obj = {
                                stt: stt,
                                id: Number(data.IDSpecializedSoftware),
                                name: array[i].name ? array[i].name : '',
                                code: array[i].customerCode ? array[i].customerCode : '',
                                address: array[i].address ? array[i].address : '',
                                idSpecializedSoftware: data.IDSpecializedSoftware ? data.IDSpecializedSoftware : 0,
                                amountUnspecified: [{ total: totalUndefind, typeMoney: 'VND' }, { total: 0, typeMoney: 'USD' }],
                                amountSpent: arrayCredit,
                                amountReceivable: arrayInvoice,
                            }
                            let checkCredit = false
                            arrayCredit.forEach(item => {
                                if (item.total != 0)
                                    checkCredit = true
                            })
                            let checkInvoice = false
                            arrayInvoice.forEach(item => {
                                if (item.total != 0)
                                    checkInvoice = true
                            })
                            if (totalUndefind != 0 || checkCredit == true || checkInvoice == true)
                                arrayResult.push(obj);
                            stt += 1;
                        })
                    }
                    var count = await mtblCustomer(db).count()
                    var result = {
                        array: arrayResult,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: count
                    }
                    res.json(result);
                    //     }
                    //     else {
                    //         res.json(Result.SYS_ERROR_RESULT)
                    //     }
                    //     // console.log(data.data);
                    // })
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