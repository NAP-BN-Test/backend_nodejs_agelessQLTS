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
var customerData = require('../controller_finance/ctl-apiSpecializedSoftware')
dataCredit = [{
    id: 100,
    createdDate: '01/05/2021',
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
    createdDate: '01/05/2021',
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
    createdDate: '03/05/2021',
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
    createdDate: '04/05/2021',
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
    createdDate: '05/05/2021',
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
    createdDate: '06/05/2021',
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
    createdDate: '07/05/2021',
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
    createdDate: '08/05/2021',
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
    createdDate: '10/05/2021',
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
    createdDate: '12/05/2021',
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
    createdDate: '01/05/2021',
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
    accountingDebt: '131',
    nameAccountingDebt: 'Phải thu khách hàng',
    accountingCredit: '511',
    nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
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
    accountingDebt: '131',
    nameAccountingDebt: 'Phải thu khách hàng',
    accountingCredit: '511',
    nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
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
    accountingDebt: '131',
    nameAccountingDebt: 'Phải thu khách hàng',
    accountingCredit: '511',
    nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
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
    accountingDebt: '131',
    nameAccountingDebt: 'Phải thu khách hàng',
    accountingCredit: '511',
    nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
},
{
    id: 5,
    createdDate: '05/05/2021',
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
    accountingDebt: '131',
    nameAccountingDebt: 'Phải thu khách hàng',
    accountingCredit: '511',
    nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
},
{
    id: 6,
    createdDate: '06/05/2021',
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
    accountingDebt: '131',
    nameAccountingDebt: 'Phải thu khách hàng',
    accountingCredit: '511',
    nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
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
    accountingDebt: '131',
    nameAccountingDebt: 'Phải thu khách hàng',
    accountingCredit: '511',
    nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
},
{
    id: 8,
    createdDate: '08/05/2021',
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
    accountingDebt: '131',
    nameAccountingDebt: 'Phải thu khách hàng',
    accountingCredit: '511',
    nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
},
{
    id: 9,
    createdDate: '09/05/2021',
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
    accountingDebt: '131',
    nameAccountingDebt: 'Phải thu khách hàng',
    accountingCredit: '511',
    nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
},
{
    id: 10,
    createdDate: '10/05/2021',
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
    accountingDebt: '131',
    nameAccountingDebt: 'Phải thu khách hàng',
    accountingCredit: '511',
    nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
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
async function getInvoiceWaitForPayInDB(db, dataRequest, account, customerID = null) {
    let array = [];
    for (let i = 0; i < dataRequest.length; i++) {
        if (customerID == null || Number(dataRequest[i].idCustomer) == Number(customerID)) {
            let check = await mtblInvoice(db).findOne({
                where: { IDSpecializedSoftware: dataRequest[i].id }
            })
            if (check) {
                if (account == '331')
                    dataRequest[i].invoiceNumber = dataRequest[i].creditNumber
                dataRequest[i].statusName = check.Status
                dataRequest[i].request = check.Request
                dataRequest[i]['invoiceID'] = check.ID
                let totalMoneyVND = 0;
                if (account != '331')
                    for (let m = 0; m < dataRequest[i].arrayMoney.length; m++) {
                        totalMoneyVND += await calculateMoneyFollowVND(db, dataRequest[i].arrayMoney[m].typeMoney, (dataRequest[i].arrayMoney[m].total ? dataRequest[i].arrayMoney[m].total : 0), moment(dataRequest[i].createdDate).format('YYYY-DD-MM'))
                    }
                dataRequest[i]['total'] = totalMoneyVND != 0 ? totalMoneyVND : dataRequest[i]['total']
                // if (check.Status == 'Chờ thanh toán')
                array.push(dataRequest[i])
            }
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
async function getInvoiceWaitForPay(db, objWaitForPay, stt, customerName = '') {
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
        numberOfReceipt: '',
        numberOfPayment: '',
        receiver: '',
        customerName: customerName,
    }
    return obj;
}
async function getCreditWaitPay(db, objWaitForPay, stt, customerName = '') {
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
        numberOfReceipt: '',
        numberOfPayment: '',
        receiver: '',
        customerName: customerName,
    }
    return obj;
}
async function getDetailCustomer(id) {
    let dataCustomer = customerData.getCustomerSpecializeSoftware()
    var obj = {}
    dataCustomer.forEach(item => {
        if (item.id == id) {
            obj = item
        }
    })
    return obj

}

function checkConditionPushArrayResult(lenthArray, accountName, accountSystemID, idAccounting, idAccountingItem, accountSystemOtherID, type) {
    let check = false
    if (lenthArray <= 1) {
        check = true
    } else {
        if (accountName == '112' || accountName == '111') {
            check = true

        } else {
            if (accountSystemID == Number(idAccounting)) {
                if (accountSystemOtherID && accountSystemOtherID == Number(idAccountingItem)) {
                    check = true

                } else if (!accountSystemOtherID) {
                    check = true

                }
            } else if (type) {
                if (accountSystemOtherID && accountSystemOtherID == Number(idAccountingItem)) {
                    check = true

                }

            }
        }
    }
    return check

}
let arrayCreditAccount = ["214", "2141", "2142", "2143", "2147", "229", "2291", "2292", "2293", "2294", "334", "335", "336", "3361", "3368", "341", "3411", "3412", "352", "3521", "3522", "3523", "3524", "353", "3531", "3532", "3533", "3534", "356", "3561", "3562", "411", "4111", "4112", "4118", "418"]
let arrayDebtAccount = ["111", "1111", "1112", "112", "1121", "1122", "121", "128", "1281", "1288", "133", "1331", "1332", "136", "1361", "1368", "1386", "141", "151", "152", "153", "154", "155", "156", "157", "211", "2111", "21111", "21112", "21113", "21114", "21115", "21116", "21118", "2112", "2113", "21131", "21132", "21133", "21133", "21134", "21135", "21136", "21138", "217", "228", "2281", "2288", "241", "2411", "2412", "2413", "242", "419"]
let arrayBiexualAccount = ["131", "138", "1381", "1388", "331", "333", "3331", "33311", "33312", "3332", "3333", "3334", "3335", "3336", "3337", "3338", "33381", "33381", "3339", "338", "3381", "3382", "3383", "3384", "3385", "3386", "3387", "3388", "413", "421", "4211", "4212", "511", "5111", "5112", "5113", "5118", "515", "611", "531", "632", "635", "642", "6421", "6422", "711", "811", "821", "911"]

function checkForDuplicateObjInArray(obj, array) {
    let result = false;
    for (item of array) {
        if (item.accountingCode == obj.accountingCode && item.accountingReciprocalCode == obj.accountingReciprocalCode && item.number == obj.number) {
            result = true;
        }
    }
    return result
}
dataCustomer = [{
    "customerCode": "KH0001",
    "name": "Công ty tnhh An Phú",
    "attributesChangeLog": "Công ty chuyên về lắp ráp linh kiện",
    "tax": "123456789",
    "countryName": "Việt Nam",
    "address": "Số 2 Hoàng Mai Hà Nội",
    "mobile": "098705124",
    "fax": "01234567",
    "email": "anphu@gmail.com",
    "id": 1,
},
{
    "customerCode": "KH0002",
    "name": "Công ty tnhh Is Tech Vina",
    "attributesChangeLog": "Công ty chuyên sản xuất bánh kẹo ",
    "tax": "01245870",
    "countryName": "Việt Nam",
    "address": "Số 35 Bạch mai Cầu Giấy Hà Nội",
    "mobile": "082457145",
    "fax": "0241368451",
    "email": "istech@gmail.com",
    "id": 2,
},
{
    "customerCode": "KH0003",
    "name": "Công ty cổ phần Orion Việt Nam",
    "attributesChangeLog": "Công ty chuyên sản xuất bánh kẹo",
    "tax": "012341250",
    "countryName": "Việt nam",
    "address": "Số 12 Bạch Mai Hà Nội",
    "mobile": "0315456554",
    "fax": "132456545",
    "email": "orion13@gmail.com",
    "id": 3,
},
{
    "customerCode": "KH0004",
    "name": "Công ty TNHH Rồng Việt",
    "attributesChangeLog": "Công ty chuyên cung cấp thiết bị điện lạnh",
    "tax": "01323255",
    "countryName": "Việt Nam",
    "address": "Số 11 Vĩnh Tuy Hai Bà Trưng Hà Nội",
    "mobile": "0445445474",
    "fax": "1135635",
    "email": "rongviet@gmail.com",
    "id": 4,
},
{
    "customerCode": "KH0005",
    "name": "Công ty cổ phần và thương mại Đức Việt",
    "attributesChangeLog": "Công ty chuyên cung cấp thức ăn đông lạnh ",
    "tax": "017654124",
    "countryName": "Việt Nam",
    "address": "Số 389 Lĩnh Nam Hoàng mai Hà Nội",
    "mobile": "0444545401",
    "fax": "75241241241",
    "email": "ducviet0209@gmail.com",
    "id": 5,
},
{
    "customerCode": "KH0006",
    "name": "Công ty TNHH 1 thành viên Bảo Minh",
    "attributesChangeLog": "Công ty chuyên cung cấp cácclaoị thực phẩm khô",
    "tax": "154654565",
    "countryName": "Việt Nam",
    "address": "Số 25 Ba Đình Hà Nội",
    "mobile": "045102474",
    "fax": "02137244",
    "email": "baominh56@gmail.com",
    "id": 6,
},
{
    "customerCode": "KH0007",
    "name": "Công ty Sx và Tm Minh Hòa",
    "attributesChangeLog": "Công ty chuyên cung cấp lao động thời vụ",
    "tax": "04785635432",
    "countryName": "Việt Nam",
    "address": "Số 21 Hàng Mã Hà Nội",
    "mobile": "0045454510",
    "fax": "415265654",
    "email": "minhhoa1212@gmail.com",
    "id": 7,
},
{
    "customerCode": "KH0008",
    "name": "Công ty cổ phần EC",
    "attributesChangeLog": "Công ty chuyên cung cấp đồ gá khuôn jig",
    "tax": "45454545",
    "countryName": "Việt Nam",
    "address": "Số 13 đường 17 KCN Tiên Sơn Bắc Ninh",
    "mobile": "012345474",
    "fax": "012244635",
    "email": "ec1312@gmail.com",
    "id": 8,
},
{
    "customerCode": "KH0009",
    "name": "Công ty cổ phần Thu Hương",
    "attributesChangeLog": "Công ty chuyên cung cấp suất ăn công  nghiệp",
    "tax": "012546565",
    "countryName": "Việt Nam",
    "address": "Số 24 Bạch Mai Hà Nội",
    "mobile": "015245454",
    "fax": "45552478",
    "email": "thuhuong34@gmail.com",
    "id": 9,
},
{
    "customerCode": "KH0010",
    "name": "Công ty tnhh Hòa Phát",
    "attributesChangeLog": "Công ty chuyên sản xuất tôn ngói ",
    "tax": "014775745",
    "countryName": "Việt Nam",
    "address": "Số 2 Phố Huế Hà Nội",
    "mobile": "045245401",
    "fax": "021455235",
    "email": "hoaphat0102@gmail.com",
    "id": 10,
},
{
    "customerCode": "KH0011",
    "name": "Cơ quan nhà nước",
    "attributesChangeLog": "Cơ quan nhà nước",
    "tax": "014775745",
    "countryName": "Việt Nam",
    "address": "Số 2 Phố Huế Hà Nội",
    "mobile": "045245401",
    "fax": "021455235",
    "email": "cqnnvn@gmail.com",
    "id": 11,
},
]
async function findAcountingFollowLevel(db, level, idLevelAbove) {
    var result = []
    let tblDMTaiKhoanKeToan = mtblDMTaiKhoanKeToan(db);
    tblDMTaiKhoanKeToan.belongsTo(mtblDMLoaiTaiKhoanKeToan(db), { foreignKey: 'IDLoaiTaiKhoanKeToan', sourceKey: 'IDLoaiTaiKhoanKeToan', as: 'Loai' })
    await tblDMTaiKhoanKeToan.findAll({
        include: [
            {
                model: mtblDMLoaiTaiKhoanKeToan(db),
                required: false,
                as: 'Loai'
            },
        ],
        where: {
            Levels: level,
            IDLevelAbove: idLevelAbove,
        },
        order: [
            ['AccountingCode', 'ASC']
        ],
    }).then(data => {
        for (var i = 0; i < data.length; i++) {
            result.push({
                id: data[i].ID,
                accountingName: data[i].AccountingName ? data[i].AccountingName : '',
                accountingCode: data[i].AccountingCode ? data[i].AccountingCode : '',
                idLoaiTaiKhoanKeToan: data[i].IDLoaiTaiKhoanKeToan ? data[i].IDLoaiTaiKhoanKeToan : '',
                nameTypeAcounting: data[i].Loai ? data[i].Loai.TypeName : '',
                idLevelAbove: idLevelAbove ? idLevelAbove : '',
                levels: level ? level : '',
                moneyCredit: data[i].MoneyCredit ? data[i].MoneyCredit : 0,
                moneyDebit: data[i].MoneyDebit ? data[i].MoneyDebit : 0,
                typeClause: data[i].TypeClause ? data[i].TypeClause : 'Unknown',
            })
        }
    })
    return result
}
async function addValueOfArray(array, nameCurrency, plusValue) {
    for (let item of array) {
        if (item.key == nameCurrency) {
            item.value += plusValue
        }
    }
    return array
}
var mtblDMNhaCungCap = require('../tables/qlnb/tblDMNhaCungCap');

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
    getListtblAccountingBooks: async (req, res) => {
        let body = req.body;
        dataInvoice = [{
            id: 1,
            createdDate: '01/05/2021',
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
            accountingDebt: '131',
            nameAccountingDebt: 'Phải thu khách hàng',
            accountingCredit: '511',
            nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
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
            accountingDebt: '131',
            nameAccountingDebt: 'Phải thu khách hàng',
            accountingCredit: '511',
            nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
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
            accountingDebt: '131',
            nameAccountingDebt: 'Phải thu khách hàng',
            accountingCredit: '511',
            nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
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
            accountingDebt: '131',
            nameAccountingDebt: 'Phải thu khách hàng',
            accountingCredit: '511',
            nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
        },
        {
            id: 5,
            createdDate: '05/05/2021',
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
            accountingDebt: '131',
            nameAccountingDebt: 'Phải thu khách hàng',
            accountingCredit: '511',
            nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
        },
        {
            id: 6,
            createdDate: '06/05/2021',
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
            accountingDebt: '131',
            nameAccountingDebt: 'Phải thu khách hàng',
            accountingCredit: '511',
            nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
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
            accountingDebt: '131',
            nameAccountingDebt: 'Phải thu khách hàng',
            accountingCredit: '511',
            nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
        },
        {
            id: 8,
            createdDate: '08/05/2021',
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
            accountingDebt: '131',
            nameAccountingDebt: 'Phải thu khách hàng',
            accountingCredit: '511',
            nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
        },
        {
            id: 9,
            createdDate: '09/05/2021',
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
            accountingDebt: '131',
            nameAccountingDebt: 'Phải thu khách hàng',
            accountingCredit: '511',
            nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
        },
        {
            id: 10,
            createdDate: '10/05/2021',
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
            accountingDebt: '131',
            nameAccountingDebt: 'Phải thu khách hàng',
            accountingCredit: '511',
            nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
        },
        ];
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
        console.log(body);
        let dataSearch = JSON.parse(body.dataSearch)
        const currentYear = new Date().getFullYear()
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let accountName = '';
                    var arrayIDAccount = []
                    let checkAccount111 = await mtblDMTaiKhoanKeToan(db).findOne({
                        where: {
                            AccountingCode: '111'
                        }
                    })
                    let checkAccount112 = await mtblDMTaiKhoanKeToan(db).findOne({
                        where: {
                            AccountingCode: '112'
                        }
                    })
                    let accountBooks;
                    if (dataSearch.type && dataSearch.type == 'cash') {
                        if (dataSearch.currencyID) {
                            let objAccount = await mtblDMTaiKhoanKeToan(db).findOne({
                                where: {
                                    CurrencyID: dataSearch.currencyID,
                                    IDLevelAbove: checkAccount111.ID,
                                }
                            })
                            if (objAccount) {
                                accountBooks = await mtblDMTaiKhoanKeToan(db).findOne({
                                    where: {
                                        ID: objAccount.ID
                                    }
                                })
                                accountName = objAccount.AccountingCode
                                arrayIDAccount.push(objAccount.ID)
                            }
                        }
                    } else if (dataSearch.type && dataSearch.type == 'bank') {
                        if (dataSearch.currencyID) {
                            let objAccount = await mtblDMTaiKhoanKeToan(db).findOne({
                                where: {
                                    CurrencyID: dataSearch.currencyID,
                                    IDLevelAbove: checkAccount112.ID,
                                }
                            })
                            if (objAccount) {
                                accountName = objAccount.AccountingCode
                                arrayIDAccount.push(objAccount.ID)
                                accountBooks = await mtblDMTaiKhoanKeToan(db).findOne({
                                    where: {
                                        ID: objAccount.ID
                                    }
                                })
                            }
                        }
                    } else {
                        if (dataSearch.accountSystemID)
                            accountBooks = await mtblDMTaiKhoanKeToan(db).findOne({
                                where: {
                                    ID: dataSearch.accountSystemID
                                }
                            })
                        if (dataSearch.accountSystemID) {
                            arrayIDAccount.push(dataSearch.accountSystemID)
                        }
                        if (dataSearch.accountSystemOtherID)
                            arrayIDAccount.push(dataSearch.accountSystemOtherID)
                    }
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
                        dataSearch.dateTo = moment(dataSearch.dateTo).add(30, 'hours').format('YYYY-MM-DD HH:MM:ss')
                        dataSearch.dateFrom = moment(dataSearch.dateFrom).add(7, 'hours').format('YYYY-MM-DD HH:MM:ss')
                        whereOjb.push({
                            CreateDate: {
                                [Op.between]: [dataSearch.dateFrom, dataSearch.dateTo]
                            }
                        })
                    }
                    let typeCus = 'customer'
                    let arrayWhere = []
                    let supplierName = {}
                    if (dataSearch.customerID)
                        if (dataSearch.type == 'supplier') {
                            typeCus = 'supplier'
                            await mtblReceiptsPayment(db).findAll({
                                where: {
                                    SupplierID: dataSearch.customerID
                                }
                            }).then(data => {
                                for (item of data) {
                                    arrayWhere.push(item.ID)
                                }
                            })
                            supplierName = await mtblDMNhaCungCap(db).findOne({
                                where: {
                                    ID: dataSearch.customerID
                                }
                            })
                        } else {
                            await mtblReceiptsPayment(db).findAll({
                                where: {
                                    IDCustomer: dataSearch.customerID
                                }
                            }).then(data => {
                                for (item of data) {
                                    arrayWhere.push(item.ID)
                                }
                            })
                        }
                    if (dataSearch.currencyID) {
                        await mtblReceiptsPayment(db).findAll({
                            where: {
                                IDCurrency: dataSearch.currencyID
                            }
                        }).then(data => {
                            for (item of data) {
                                arrayWhere.push(item.ID)
                            }
                        })

                    }
                    if (dataSearch.customerID || dataSearch.currencyID) {
                        whereOjb.push({
                            IDPayment: {
                                [Op.in]: arrayWhere
                            }
                        })
                    }
                    let totalCreditIncurred = 0;
                    let arrayCreditIncurred = [];
                    let totalDebtIncurred = 0;
                    let arrayDebtIncurred = [];
                    let totalCreaditSurplus = 0;
                    let arrayCreaditSurplus = [];
                    let totalDebtSurplus = 0;
                    let arrayDebtSurplus = [];
                    let arisingPeriod = 0;
                    let openingBalanceCredit = 0;
                    let openingBalanceDebit = 0;
                    let endingBalanceDebit = [];
                    let endingBalanceCredit = [];
                    let stt = 1;
                    let tblAccountingBooks = mtblAccountingBooks(db);
                    arisingPeriod = totalDebtIncurred - totalCreditIncurred;
                    openingBalanceDebit = accountBooks ? (accountBooks.MoneyDebit ? accountBooks.MoneyDebit : null) : null
                    openingBalanceCredit = accountBooks ? (accountBooks.MoneyCredit ? accountBooks.MoneyCredit : null) : null
                    let debtSurplus = openingBalanceDebit;
                    let creaditSurplus = openingBalanceCredit;
                    tblAccountingBooks.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDAccounting', sourceKey: 'IDAccounting', as: 'accounting' })
                    tblAccountingBooks.belongsTo(mtblReceiptsPayment(db), { foreignKey: 'IDPayment', sourceKey: 'IDPayment', as: 'payment' })
                    let tblReceiptsPayment = mtblReceiptsPayment(db);
                    tblReceiptsPayment.belongsTo(mtblCurrency(db), { foreignKey: 'IDCurrency', sourceKey: 'IDCurrency', as: 'currency' })
                    tblAccountingBooks.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        order: [
                            ['ID', 'ASC']
                        ],
                        include: [{
                            model: tblReceiptsPayment,
                            required: false,
                            as: 'payment',
                            include: [{
                                model: mtblCurrency(db),
                                required: false,
                                as: 'currency',
                            }]
                        },
                        {
                            model: mtblDMTaiKhoanKeToan(db),
                            required: false,
                            as: 'accounting'
                        }
                        ],
                    }).then(async data => {
                        var array = [];
                        let objCustomer = {}
                        if (dataSearch.customerID)
                            objCustomer = await getDetailCustomer(dataSearch.customerID)
                        // Hàm lấy ra Những invoice chưa thanh toán tự động định khoản vào sổ tài khoản 131 và đối ứng là tài khoản 511
                        let checkAccount131 = await mtblDMTaiKhoanKeToan(db).findOne({
                            where: {
                                ID: dataSearch.accountSystemID
                            }
                        })
                        let checkCccountSystemOtherID;
                        if (dataSearch.accountSystemOtherID)
                            checkCccountSystemOtherID = await mtblDMTaiKhoanKeToan(db).findOne({
                                where: {
                                    ID: dataSearch.accountSystemOtherID
                                }
                            })
                        let nameCurrencyCheck = 'VND'
                        if (checkAccount131) {
                            await mtblCurrency(db).findOne({
                                where: {
                                    ID: checkAccount131.CurrencyID
                                }
                            }).then(data => {
                                if (data)
                                    nameCurrencyCheck = data.ShortName
                            })
                        }
                        // Chỉ để demo sau sẽ có sửa
                        arrayCreditIncurred.push({
                            key: nameCurrencyCheck,
                            value: debtSurplus
                        })
                        arrayDebtIncurred.push({
                            key: nameCurrencyCheck,
                            value: 0
                        })
                        arrayDebtSurplus.push({
                            key: nameCurrencyCheck,
                            value: debtSurplus
                        })
                        arrayCreaditSurplus.push({
                            key: nameCurrencyCheck,
                            value: creaditSurplus
                        })
                        console.log(arrayDebtSurplus, nameCurrencyCheck);
                        // //////////////////////////////////////////////////////////////////////////////
                        // có api qmcm sẽ phải làm lại
                        if (dataSearch.selection && (dataSearch.dateTo || dataSearch.selection == 'two_quarter' || dataSearch.selection == 'all' || dataSearch.selection == 'this_year' || dataSearch.selection == 'first_six_months') && checkAccount131.AccountingCode == '131') {
                            let arrayInvoice = await getInvoiceWaitForPayInDB(db, dataInvoice, '131', dataSearch.customerID ? dataSearch.customerID : null)
                            for (invoice of arrayInvoice) {
                                let dateInvoice = moment(invoice.createdDate).format('YYYY-DD-MM')
                                let dateFrom = moment(dataSearch.dateFrom).subtract(7, 'hours').format('YYYY-MM-DD')
                                let dateTo = moment(dataSearch.dateTo).subtract(7, 'hours').format('YYYY-MM-DD')
                                if (!dataSearch.accountSystemOtherID || checkCccountSystemOtherID && checkCccountSystemOtherID.AccountingCode == invoice.accountingCredit) {
                                    if (moment(dateTo).isAfter(dateInvoice) && moment(dateFrom).isBefore(dateInvoice) || moment(dateTo).isSame(dateInvoice) || moment(dateFrom).isSame(dateInvoice)) {
                                        let objWaitForPay = await getInvoiceWaitForPay(db, invoice, stt, Object.keys(objCustomer).length > 0 ? objCustomer.name : '');
                                        // vì là tài khoản lưỡng tính
                                        debtSurplus += Number(invoice.total);
                                        objWaitForPay['debtSurplus'] = debtSurplus ? debtSurplus : 0
                                        objWaitForPay['creaditSurplus'] = null
                                        objWaitForPay['nameCurrency'] = 'VND'
                                        arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, 'VND', (objWaitForPay.debtIncurred ? objWaitForPay.debtIncurred : 0))
                                        arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, 'VND', (objWaitForPay.creditIncurred ? objWaitForPay.creditIncurred : 0))
                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, 'VND', Number(invoice.total))
                                        totalCreaditSurplus += (objWaitForPay.creaditSurplus ? objWaitForPay.creaditSurplus : 0);
                                        totalDebtSurplus += (objWaitForPay.debtSurplus ? objWaitForPay.debtSurplus : 0);
                                        array.push(objWaitForPay);
                                        stt += 1;
                                    }
                                    if (!dataSearch.dateFrom || !dataSearch.dateTo) {
                                        let objWaitForPay = await getInvoiceWaitForPay(db, invoice, stt, Object.keys(objCustomer).length > 0 ? objCustomer.name : '');
                                        // vì là tài khoản lưỡng tính
                                        debtSurplus += Number(invoice.total);
                                        objWaitForPay['debtSurplus'] = debtSurplus ? debtSurplus : 0
                                        objWaitForPay['creaditSurplus'] = null
                                        objWaitForPay['nameCurrency'] = 'VND'
                                        arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, 'VND', (objWaitForPay.debtIncurred ? objWaitForPay.debtIncurred : 0))
                                        arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, 'VND', (objWaitForPay.creditIncurred ? objWaitForPay.creditIncurred : 0))
                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, 'VND', Number(invoice.total))
                                        totalCreaditSurplus += (objWaitForPay.creaditSurplus ? objWaitForPay.creaditSurplus : 0);
                                        totalDebtSurplus += (objWaitForPay.debtSurplus ? objWaitForPay.debtSurplus : 0);
                                        array.push(objWaitForPay);
                                        stt += 1;
                                    }
                                }
                            }
                        }
                        //  lấy dữ liệu credit Những credit chưa thanh toán tự động định khoản vào sổ tài khoản (tài khoản lấy theo pmcm gửi về)
                        let checkAccount331 = await mtblDMTaiKhoanKeToan(db).findOne({
                            where: {
                                ID: dataSearch.accountSystemID
                            }
                        })
                        if (dataSearch.selection && (dataSearch.dateTo || dataSearch.selection == 'two_quarter' || dataSearch.selection == 'all' || dataSearch.selection == 'this_year' || dataSearch.selection == 'first_six_months') && checkAccount331.AccountingCode == '331') {
                            let arrayCredit = await getInvoiceWaitForPayInDB(db, dataCredit, '331', dataSearch.customerID ? dataSearch.customerID : null)
                            for (credit of arrayCredit) {
                                let dateInvoice = moment(credit.createdDate).format('YYYY-DD-MM')
                                let dateFrom = moment(dataSearch.dateFrom).subtract(7, 'hours').format('YYYY-MM-DD')
                                let dateTo = moment(dataSearch.dateTo).subtract(7, 'hours').format('YYYY-MM-DD')
                                if (!dataSearch.accountSystemOtherID || checkCccountSystemOtherID && checkCccountSystemOtherID.AccountingCode == credit.accountingDebt) {
                                    if (moment(dateTo).isAfter(dateInvoice) && moment(dateFrom).isBefore(dateInvoice) || moment(dateTo).isSame(dateInvoice) || moment(dateFrom).isSame(dateInvoice)) {
                                        let objWaitForPay = await getCreditWaitPay(db, credit, stt, Object.keys(objCustomer).length > 0 ? objCustomer.name : '')
                                        // vì là tài khoản lưỡng tính
                                        creaditSurplus += Number(credit.total);
                                        objWaitForPay['debtSurplus'] = null
                                        objWaitForPay['nameCurrency'] = 'VND'
                                        objWaitForPay['creaditSurplus'] = creaditSurplus ? creaditSurplus : 0
                                        arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, 'VND', (objWaitForPay.debtIncurred ? Number(objWaitForPay.debtIncurred) : 0))
                                        arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, 'VND', (objWaitForPay.creditIncurred ? Number(objWaitForPay.creditIncurred) : 0))
                                        arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, 'VND', (objWaitForPay.creaditSurplus ? Number(objWaitForPay.creaditSurplus) : 0))
                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, 'VND', (objWaitForPay.debtSurplus ? Number(objWaitForPay.debtSurplus) : 0))
                                        totalCreaditSurplus += (objWaitForPay.creaditSurplus ? Number(objWaitForPay.creaditSurplus) : 0);
                                        totalDebtSurplus += (objWaitForPay.debtSurplus ? Number(objWaitForPay.debtSurplus) : 0);
                                        array.push(objWaitForPay);
                                        stt += 1;
                                    }
                                    if (!dataSearch.dateFrom || !dataSearch.dateTo) {
                                        let objWaitForPay = await getCreditWaitPay(db, credit, stt, Object.keys(objCustomer).length > 0 ? objCustomer.name : '')
                                        // vì là tài khoản lưỡng tính
                                        creaditSurplus += Number(credit.total);
                                        objWaitForPay['debtSurplus'] = null
                                        objWaitForPay['nameCurrency'] = 'VND'
                                        objWaitForPay['creaditSurplus'] = creaditSurplus ? creaditSurplus : 0
                                        arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, 'VND', (objWaitForPay.debtIncurred ? Number(objWaitForPay.debtIncurred) : 0))
                                        arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, 'VND', (objWaitForPay.creditIncurred ? Number(objWaitForPay.creditIncurred) : 0))
                                        arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, 'VND', (objWaitForPay.creaditSurplus ? Number(objWaitForPay.creaditSurplus) : 0))
                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, 'VND', (objWaitForPay.debtSurplus ? Number(objWaitForPay.debtSurplus) : 0))
                                        totalCreaditSurplus += (objWaitForPay.creaditSurplus ? Number(objWaitForPay.creaditSurplus) : 0);
                                        totalDebtSurplus += (objWaitForPay.debtSurplus ? Number(objWaitForPay.debtSurplus) : 0);
                                        array.push(objWaitForPay);
                                        stt += 1;
                                    }
                                }
                            }
                        }
                        let arrayCurrency = []
                        arrayCurrency.push(nameCurrencyCheck)
                        for (var i = 0; i < data.length; i++) {
                            var arrayWhere = []
                            let nameCurrency = data[i].payment ? (data[i].payment.currency ? data[i].payment.currency.ShortName : 'VND') : 'VND'
                            if (data[i].IDPayment) {
                                arrayWhere.push({
                                    IDPayment: data[i].IDPayment
                                })
                                if (!checkDuplicate(arrayCurrency, data[i].payment.currency.ShortName)) {
                                    arrayCurrency.push(data[i].payment.currency.ShortName)
                                    arrayCreditIncurred.push({
                                        key: data[i].payment.currency.ShortName,
                                        value: 0
                                    })
                                    arrayDebtIncurred.push({
                                        key: data[i].payment.currency.ShortName,
                                        value: 0
                                    })
                                    arrayDebtSurplus.push({
                                        key: data[i].payment.currency.ShortName,
                                        value: 0
                                    })
                                    arrayCreaditSurplus.push({
                                        key: data[i].payment.currency.ShortName,
                                        value: 0
                                    })
                                }
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
                                    console.log(arrayDebtSurplus);
                                    for (item of accounting) {
                                        if (checkConditionPushArrayResult(arrayIDAccount.length, accountName, dataSearch.accountSystemID, data[i].IDAccounting, item.IDAccounting, dataSearch.accountSystemOtherID, dataSearch.type)) {
                                            let checkTypeClause = await mtblDMTaiKhoanKeToan(db).findOne({
                                                where: {
                                                    ID: data[i].IDAccounting
                                                }
                                            })
                                            let typeCheck = 'Biexual';
                                            let creditIncurred = accounting.length < 2 ? (data[i].CreditIncurred ? data[i].CreditIncurred : 0) : (item.DebtIncurred ? item.DebtIncurred : 0);
                                            let debtIncurred = accounting.length < 2 ? (data[i].DebtIncurred ? data[i].DebtIncurred : 0) : (item.CreditIncurred ? item.CreditIncurred : 0);
                                            if (checkTypeClause && checkTypeClause.TypeClause == 'Biexual') {
                                                typeCheck = 'Biexual'
                                                //  nếu là tài khoản đầu 1,2 : bên nợ
                                                //  nếu là tài khoản đầu 3,4 : bên có
                                                if (openingBalanceCredit == null && openingBalanceDebit == null) {
                                                    if (checkTypeClause.AccountingCode.slice(0, 1) == '1' || checkTypeClause.AccountingCode.slice(0, 1) == '2') {
                                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, nameCurrency, (debtIncurred - creditIncurred))
                                                        for (let item of arrayDebtSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                debtSurplus = item.value
                                                            }
                                                        }
                                                        creaditSurplus = null;
                                                    }
                                                    if (checkTypeClause.AccountingCode.slice(0, 1) == '3' || checkTypeClause.AccountingCode.slice(0, 1) == '4') {
                                                        debtSurplus = null;
                                                        arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, nameCurrency, (creditIncurred - debtIncurred))
                                                        for (let item of arrayCreaditSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                creaditSurplus = item.value
                                                            }
                                                        }

                                                    }
                                                } else {
                                                    if (openingBalanceCredit != null) {
                                                        debtSurplus = null;
                                                        arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, nameCurrency, (creditIncurred - debtIncurred))
                                                        for (let item of arrayCreaditSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                creaditSurplus = item.value
                                                            }
                                                        }
                                                    } else if (openingBalanceDebit != null) {
                                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, nameCurrency, (debtIncurred - creditIncurred))
                                                        for (let item of arrayDebtSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                debtSurplus = item.value
                                                            }
                                                        }
                                                        creaditSurplus = null;
                                                    } else {
                                                        arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, nameCurrency, (creditIncurred - debtIncurred))
                                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, nameCurrency, (debtIncurred - creditIncurred))
                                                        for (let item of arrayCreaditSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                creaditSurplus = item.value
                                                            }
                                                        }
                                                        for (let item of arrayDebtSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                debtSurplus = item.value
                                                            }
                                                        }
                                                    }
                                                }
                                            } else if (checkTypeClause && checkTypeClause.TypeClause == 'Debt') {
                                                arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, nameCurrency, (debtIncurred - creditIncurred))
                                                console.log(arrayDebtSurplus);
                                                for (let item of arrayDebtSurplus) {
                                                    if (item.key == nameCurrency) {
                                                        debtSurplus = item.value
                                                    }
                                                }
                                                creaditSurplus = null;
                                                typeCheck = 'Debt'
                                            } else if (checkTypeClause && checkTypeClause.TypeClause == 'Credit') {
                                                typeCheck = 'Credit'
                                                debtSurplus = null;
                                                arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, nameCurrency, (creditIncurred - debtIncurred))
                                                for (let item of arrayCreaditSurplus) {
                                                    if (item.key == nameCurrency) {
                                                        creaditSurplus = item.value
                                                    }
                                                }
                                            } else {
                                                arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, nameCurrency, debtIncurred - creditIncurred)
                                                arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, nameCurrency, debtIncurred - creditIncurred)
                                                for (let item of arrayCreaditSurplus) {
                                                    if (item.key == nameCurrency) {
                                                        creaditSurplus = Math.round(item.value * 100) / 100
                                                    }
                                                }
                                                for (let item of arrayDebtSurplus) {
                                                    if (item.key == nameCurrency) {
                                                        debtSurplus = Math.round(item.value * 100) / 100
                                                    }
                                                }
                                            }
                                            // thu: có - GBC
                                            // chi: nợ - GBN
                                            let reason = accounting.length < 2 ? (data[i].Contents ? data[i].Contents : '') : (item.Contents ? item.Contents : '');
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
                                                reason: reason,
                                                idAccounting: item.IDAccounting ? item.IDAccounting : null,
                                                creditIncurred: creditIncurred,
                                                debtIncurred: debtIncurred,
                                                nameCurrency: nameCurrency,
                                                debtSurplus: debtSurplus,
                                                creaditSurplus: creaditSurplus,
                                                numberOfReceipt: data[i].payment ? (data[i].payment.Type == 'receipt' ? data[i].payment.CodeNumber : '') : '',
                                                numberOfPayment: data[i].payment ? (data[i].payment.Type == 'payment' ? data[i].payment.CodeNumber : '') : '',
                                                receiver: data[i].payment ? data[i].payment.ApplicantReceiverName : '',
                                                customerName: typeCus == 'supplier' ? supplierName.SupplierName : Object.keys(objCustomer).length > 0 ? objCustomer.name : '',
                                            }
                                            arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                            arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                            totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                            totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                            array.push(obj);
                                            stt += 1;

                                        }
                                    }
                                }
                            })
                        }
                        var count = await mtblAccountingBooks(db).count({ where: whereOjb, })
                        let checkType = await mtblDMTaiKhoanKeToan(db).findOne({
                            where: {
                                ID: dataSearch.accountSystemID
                            }
                        })
                        let curencyOfAccount;
                        if (checkType)
                            curencyOfAccount = await mtblCurrency(db).findOne({
                                where: {
                                    ID: checkType.CurrencyID
                                }
                            })
                        // Trừ số tiền dư nợ đầu kì để tính tổng phát sinh
                        let valueOpen = 0;
                        if (openingBalanceDebit) {
                            for (let item of arrayCreditIncurred) {
                                if (item.key == nameCurrencyCheck) {
                                    valueOpen = item.value - openingBalanceDebit
                                    item.value = valueOpen
                                }
                            }
                        }
                        // ----------------------------------------------------------
                        let arrayEndingBalanceDebit = []
                        for (let debt of arrayDebtIncurred) {
                            let objPush = {}
                            for (let credit of arrayCreditIncurred) {
                                if (credit.key == debt.key) {
                                    objPush['key'] = debt.key
                                    if (curencyOfAccount && curencyOfAccount.ShortName == credit.key)
                                        objPush['value'] = openingBalanceDebit + debt.value - credit.value
                                    else
                                        objPush['value'] = debt.value - credit.value

                                }
                            }
                            arrayEndingBalanceDebit.push(objPush)
                        }
                        let arrayEndingBalanceCredit = []
                        for (let credit of arrayCreditIncurred) {
                            let objPush = {}
                            for (let debt of arrayDebtIncurred) {
                                if (credit.key == debt.key) {
                                    objPush['key'] = debt.key
                                    if (curencyOfAccount && curencyOfAccount.ShortName == credit.key)
                                        objPush['value'] = openingBalanceCredit + credit.value - debt.value
                                    else
                                        objPush['value'] = credit.value - debt.value
                                }
                            }
                            arrayEndingBalanceCredit.push(objPush)
                        }
                        if (checkType && checkType.TypeClause == "Credit") {
                            endingBalanceCredit = arrayEndingBalanceCredit
                            endingBalanceDebit = null;
                        } else if (checkType && checkType.TypeClause == "Debt") {
                            endingBalanceCredit = null;
                            endingBalanceDebit = arrayEndingBalanceDebit
                        } else {
                            let balanceCredit = arrayEndingBalanceCredit
                            let balanceDebit = arrayEndingBalanceDebit
                            if (openingBalanceCredit == null && openingBalanceDebit == null) {
                                if (checkType && checkType.AccountingCode.slice(0, 1) == '1' || checkType.AccountingCode.slice(0, 1) == '2') {
                                    endingBalanceCredit = null;
                                    endingBalanceDebit = balanceDebit;
                                }
                                if (checkType && checkType.AccountingCode.slice(0, 1) == '3' || checkType.AccountingCode.slice(0, 1) == '4') {
                                    endingBalanceCredit = balanceCredit;
                                    endingBalanceDebit = null;
                                }
                            } else {
                                if (openingBalanceCredit != null) {
                                    endingBalanceCredit = balanceCredit;
                                    endingBalanceDebit = null;
                                } else if (openingBalanceDebit != null) {
                                    endingBalanceCredit = null;
                                    endingBalanceDebit = balanceDebit;
                                } else {
                                    endingBalanceCredit = balanceCredit;
                                    endingBalanceDebit = balanceDebit;
                                }
                            }
                        }
                        var result = {
                            total: {
                                arrayCreditIncurred,
                                arrayDebtIncurred,
                                accountName,
                                totalCreaditSurplus,
                                totalDebtSurplus,
                                arisingPeriod,
                                openingBalanceDebit,
                                openingBalanceCredit,
                                endingBalanceDebit,
                                endingBalanceCredit,
                                customerName: Object.keys(objCustomer).length > 0 ? objCustomer.name : '',
                                customerCode: Object.keys(objCustomer).length > 0 ? objCustomer.customerCode : '',
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
    // get_all_accounting_books
    getAllAccountBooks: (req, res) => {
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
        console.log(body);
        let dataSearch = JSON.parse(body.dataSearch)
        const currentYear = new Date().getFullYear()
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let accountName = '';
                    var arrayIDAccount = []
                    let checkAccount111 = await mtblDMTaiKhoanKeToan(db).findOne({
                        where: {
                            AccountingCode: '111'
                        }
                    })
                    let checkAccount112 = await mtblDMTaiKhoanKeToan(db).findOne({
                        where: {
                            AccountingCode: '112'
                        }
                    })
                    let accountBooks;
                    if (dataSearch.type && dataSearch.type == 'cash') {
                        if (dataSearch.currencyID) {
                            let objAccount = await mtblDMTaiKhoanKeToan(db).findOne({
                                where: {
                                    CurrencyID: dataSearch.currencyID,
                                    IDLevelAbove: checkAccount111.ID,
                                }
                            })
                            if (objAccount) {
                                accountBooks = await mtblDMTaiKhoanKeToan(db).findOne({
                                    where: {
                                        ID: objAccount.ID
                                    }
                                })
                                accountName = objAccount.AccountingCode
                                arrayIDAccount.push(objAccount.ID)
                            }
                        }
                    } else if (dataSearch.type && dataSearch.type == 'bank') {
                        if (dataSearch.currencyID) {
                            let objAccount = await mtblDMTaiKhoanKeToan(db).findOne({
                                where: {
                                    CurrencyID: dataSearch.currencyID,
                                    IDLevelAbove: checkAccount112.ID,
                                }
                            })
                            if (objAccount) {
                                accountName = objAccount.AccountingCode
                                arrayIDAccount.push(objAccount.ID)
                                accountBooks = await mtblDMTaiKhoanKeToan(db).findOne({
                                    where: {
                                        ID: objAccount.ID
                                    }
                                })
                            }
                        }
                    } else {
                        if (dataSearch.accountSystemID)
                            accountBooks = await mtblDMTaiKhoanKeToan(db).findOne({
                                where: {
                                    ID: dataSearch.accountSystemID
                                }
                            })
                        if (dataSearch.accountSystemID) {
                            arrayIDAccount.push(dataSearch.accountSystemID)
                        }
                        if (dataSearch.accountSystemOtherID)
                            arrayIDAccount.push(dataSearch.accountSystemOtherID)
                    }
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
                        dataSearch.dateTo = moment(dataSearch.dateTo).add(30, 'hours').format('YYYY-MM-DD HH:MM:ss')
                        dataSearch.dateFrom = moment(dataSearch.dateFrom).add(7, 'hours').format('YYYY-MM-DD HH:MM:ss')
                        whereOjb.push({
                            CreateDate: {
                                [Op.between]: [dataSearch.dateFrom, dataSearch.dateTo]
                            }
                        })
                    }
                    let typeCus = 'customer'
                    let arrayWhere = []
                    let supplierName = {}
                    if (dataSearch.customerID)
                        if (dataSearch.type == 'supplier') {
                            typeCus = 'supplier'
                            await mtblReceiptsPayment(db).findAll({
                                where: {
                                    SupplierID: dataSearch.customerID
                                }
                            }).then(data => {
                                for (item of data) {
                                    arrayWhere.push(item.ID)
                                }
                            })
                            supplierName = await mtblDMNhaCungCap(db).findOne({
                                where: {
                                    ID: dataSearch.customerID
                                }
                            })
                        } else {
                            await mtblReceiptsPayment(db).findAll({
                                where: {
                                    IDCustomer: dataSearch.customerID
                                }
                            }).then(data => {
                                for (item of data) {
                                    arrayWhere.push(item.ID)
                                }
                            })
                        }
                    if (dataSearch.currencyID) {
                        await mtblReceiptsPayment(db).findAll({
                            where: {
                                IDCurrency: dataSearch.currencyID
                            }
                        }).then(data => {
                            for (item of data) {
                                arrayWhere.push(item.ID)
                            }
                        })

                    }
                    if (dataSearch.customerID || dataSearch.currencyID) {
                        whereOjb.push({
                            IDPayment: {
                                [Op.in]: arrayWhere
                            }
                        })
                    }
                    let totalCreditIncurred = 0;
                    let arrayCreditIncurred = [];
                    let totalDebtIncurred = 0;
                    let arrayDebtIncurred = [];
                    let totalCreaditSurplus = 0;
                    let arrayCreaditSurplus = [];
                    let totalDebtSurplus = 0;
                    let arrayDebtSurplus = [];
                    let arisingPeriod = 0;
                    let openingBalanceCredit = 0;
                    let openingBalanceDebit = 0;
                    let endingBalanceDebit = 0;
                    let endingBalanceCredit = 0;
                    let stt = 1;
                    let tblAccountingBooks = mtblAccountingBooks(db);
                    arisingPeriod = totalDebtIncurred - totalCreditIncurred;
                    openingBalanceDebit = accountBooks ? (accountBooks.MoneyDebit ? accountBooks.MoneyDebit : null) : null
                    openingBalanceCredit = accountBooks ? (accountBooks.MoneyCredit ? accountBooks.MoneyCredit : null) : null
                    let debtSurplus = openingBalanceDebit;
                    let creaditSurplus = openingBalanceCredit;
                    tblAccountingBooks.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDAccounting', sourceKey: 'IDAccounting', as: 'accounting' })
                    tblAccountingBooks.belongsTo(mtblReceiptsPayment(db), { foreignKey: 'IDPayment', sourceKey: 'IDPayment', as: 'payment' })
                    let tblReceiptsPayment = mtblReceiptsPayment(db);
                    tblReceiptsPayment.belongsTo(mtblCurrency(db), { foreignKey: 'IDCurrency', sourceKey: 'IDCurrency', as: 'currency' })
                    tblAccountingBooks.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        order: [
                            ['ID', 'ASC']
                        ],
                        include: [{
                            model: tblReceiptsPayment,
                            required: false,
                            as: 'payment',
                            include: [{
                                model: mtblCurrency(db),
                                required: false,
                                as: 'currency',
                            }]
                        },
                        {
                            model: mtblDMTaiKhoanKeToan(db),
                            required: false,
                            as: 'accounting'
                        }
                        ],
                    }).then(async data => {
                        var array = [];
                        let arrayCheckDulicant = [];
                        let objCustomer = {}
                        let debtSurplus = 0;
                        let creaditSurplus = 0;
                        if (dataSearch.customerID)
                            objCustomer = await getDetailCustomer(dataSearch.customerID)
                        // Hàm lấy ra Những invoice chưa thanh toán tự động định khoản vào sổ tài khoản 131 và đối ứng là tài khoản 511
                        let checkAccount131;
                        let checkAccount331;
                        if (dataSearch.accountSystemID) {
                            checkAccount331 = await mtblDMTaiKhoanKeToan(db).findOne({
                                where: {
                                    ID: dataSearch.accountSystemID
                                }
                            })
                            checkAccount131 = await mtblDMTaiKhoanKeToan(db).findOne({
                                where: {
                                    ID: dataSearch.accountSystemID
                                }
                            })
                        }
                        let checkCccountSystemOtherID;
                        if (dataSearch.accountSystemOtherID)
                            checkCccountSystemOtherID = await mtblDMTaiKhoanKeToan(db).findOne({
                                where: {
                                    ID: dataSearch.accountSystemOtherID
                                }
                            })
                        // Chỉ để demo sau sẽ có sửa
                        arrayCreditIncurred.push({
                            key: 'VND',
                            value: 0
                        })
                        arrayDebtIncurred.push({
                            key: 'VND',
                            value: 0
                        })
                        arrayDebtSurplus.push({
                            key: 'VND',
                            value: debtSurplus
                        })
                        arrayCreaditSurplus.push({
                            key: 'VND',
                            value: creaditSurplus
                        })
                        // //////////////////////////////////////////////////////////////////////////////
                        if (checkAccount131 && checkAccount131.AccountingCode == '131' || !checkAccount131) {
                            let arrayInvoice = await getInvoiceWaitForPayInDB(db, dataInvoice, '131', dataSearch.customerID ? dataSearch.customerID : null)
                            for (invoice of arrayInvoice) {
                                let dateInvoice = moment(invoice.createdDate).format('YYYY-DD-MM')
                                let dateFrom = moment(dataSearch.dateFrom).subtract(7, 'hours').format('YYYY-MM-DD')
                                let dateTo = moment(dataSearch.dateTo).subtract(7, 'hours').format('YYYY-MM-DD')
                                if (!dataSearch.accountSystemOtherID || checkCccountSystemOtherID && checkCccountSystemOtherID.AccountingCode == invoice.accountingCredit) {
                                    if (moment(dateTo).isAfter(dateInvoice) && moment(dateFrom).isBefore(dateInvoice) || moment(dateTo).isSame(dateInvoice) || moment(dateFrom).isSame(dateInvoice)) {
                                        let objWaitForPay = await getInvoiceWaitForPay(db, invoice, stt, Object.keys(objCustomer).length > 0 ? objCustomer.name : '');
                                        // vì là tài khoản lưỡng tính
                                        objWaitForPay['creditIncurred'] = objWaitForPay.debtIncurred
                                        debtSurplus += Number(invoice.total);
                                        objWaitForPay['debtSurplus'] = debtSurplus ? debtSurplus : 0
                                        objWaitForPay['creaditSurplus'] = null
                                        objWaitForPay['nameCurrency'] = 'VND'
                                        arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, 'VND', (objWaitForPay.debtIncurred ? objWaitForPay.debtIncurred : 0))
                                        arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, 'VND', (objWaitForPay.creditIncurred ? objWaitForPay.creditIncurred : 0))
                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, 'VND', Number(invoice.total))
                                        totalCreaditSurplus += (objWaitForPay.creaditSurplus ? objWaitForPay.creaditSurplus : 0);
                                        totalDebtSurplus += (objWaitForPay.debtSurplus ? objWaitForPay.debtSurplus : 0);
                                        array.push(objWaitForPay);
                                        stt += 1;
                                    }
                                    if (!dataSearch.dateFrom || !dataSearch.dateTo) {
                                        let objWaitForPay = await getInvoiceWaitForPay(db, invoice, stt, Object.keys(objCustomer).length > 0 ? objCustomer.name : '');
                                        // vì là tài khoản lưỡng tính
                                        objWaitForPay['creditIncurred'] = objWaitForPay.debtIncurred
                                        debtSurplus += Number(invoice.total);
                                        objWaitForPay['debtSurplus'] = debtSurplus ? debtSurplus : 0
                                        objWaitForPay['creaditSurplus'] = null
                                        objWaitForPay['nameCurrency'] = 'VND'
                                        arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, 'VND', (objWaitForPay.debtIncurred ? objWaitForPay.debtIncurred : 0))
                                        arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, 'VND', (objWaitForPay.creditIncurred ? objWaitForPay.creditIncurred : 0))
                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, 'VND', Number(invoice.total))
                                        totalCreaditSurplus += (objWaitForPay.creaditSurplus ? objWaitForPay.creaditSurplus : 0);
                                        totalDebtSurplus += (objWaitForPay.debtSurplus ? objWaitForPay.debtSurplus : 0);
                                        array.push(objWaitForPay);
                                        stt += 1;
                                    }
                                }
                            }
                        }
                        //  lấy dữ liệu credit Những credit chưa thanh toán tự động định khoản vào sổ tài khoản (tài khoản lấy theo pmcm gửi về)
                        if (checkAccount331 && checkAccount331.AccountingCode == '331' || !checkAccount331) {
                            let arrayCredit = await getInvoiceWaitForPayInDB(db, dataCredit, '331', dataSearch.customerID ? dataSearch.customerID : null)
                            for (credit of arrayCredit) {
                                let dateInvoice = moment(credit.createdDate).format('YYYY-DD-MM')
                                let dateFrom = moment(dataSearch.dateFrom).subtract(7, 'hours').format('YYYY-MM-DD')
                                let dateTo = moment(dataSearch.dateTo).subtract(7, 'hours').format('YYYY-MM-DD')
                                if (!dataSearch.accountSystemOtherID || checkCccountSystemOtherID && checkCccountSystemOtherID.AccountingCode == credit.accountingDebt) {
                                    if (moment(dateTo).isAfter(dateInvoice) && moment(dateFrom).isBefore(dateInvoice) || moment(dateTo).isSame(dateInvoice) || moment(dateFrom).isSame(dateInvoice)) {
                                        let objWaitForPay = await getCreditWaitPay(db, credit, stt, Object.keys(objCustomer).length > 0 ? objCustomer.name : '')
                                        // vì là tài khoản lưỡng tính
                                        creaditSurplus += Number(credit.total);
                                        objWaitForPay['debtSurplus'] = null
                                        objWaitForPay['nameCurrency'] = 'VND'
                                        objWaitForPay['debtIncurred'] = objWaitForPay.creditIncurred
                                        objWaitForPay['creaditSurplus'] = creaditSurplus ? creaditSurplus : 0
                                        arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, 'VND', (objWaitForPay.debtIncurred ? Number(objWaitForPay.debtIncurred) : 0))
                                        arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, 'VND', (objWaitForPay.creditIncurred ? Number(objWaitForPay.creditIncurred) : 0))
                                        arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, 'VND', (objWaitForPay.creaditSurplus ? Number(objWaitForPay.creaditSurplus) : 0))
                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, 'VND', (objWaitForPay.debtSurplus ? Number(objWaitForPay.debtSurplus) : 0))
                                        totalCreaditSurplus += (objWaitForPay.creaditSurplus ? Number(objWaitForPay.creaditSurplus) : 0);
                                        totalDebtSurplus += (objWaitForPay.debtSurplus ? Number(objWaitForPay.debtSurplus) : 0);
                                        array.push(objWaitForPay);
                                        stt += 1;
                                    }
                                    if (!dataSearch.dateFrom || !dataSearch.dateTo) {
                                        let objWaitForPay = await getCreditWaitPay(db, credit, stt, Object.keys(objCustomer).length > 0 ? objCustomer.name : '')
                                        // vì là tài khoản lưỡng tính
                                        creaditSurplus += Number(credit.total);
                                        objWaitForPay['debtSurplus'] = null
                                        objWaitForPay['nameCurrency'] = 'VND'
                                        objWaitForPay['debtIncurred'] = objWaitForPay.creditIncurred
                                        objWaitForPay['creaditSurplus'] = creaditSurplus ? creaditSurplus : 0
                                        arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, 'VND', (objWaitForPay.debtIncurred ? Number(objWaitForPay.debtIncurred) : 0))
                                        arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, 'VND', (objWaitForPay.creditIncurred ? Number(objWaitForPay.creditIncurred) : 0))
                                        arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, 'VND', (objWaitForPay.creaditSurplus ? Number(objWaitForPay.creaditSurplus) : 0))
                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, 'VND', (objWaitForPay.debtSurplus ? Number(objWaitForPay.debtSurplus) : 0))
                                        totalCreaditSurplus += (objWaitForPay.creaditSurplus ? Number(objWaitForPay.creaditSurplus) : 0);
                                        totalDebtSurplus += (objWaitForPay.debtSurplus ? Number(objWaitForPay.debtSurplus) : 0);
                                        array.push(objWaitForPay);
                                        stt += 1;
                                    }
                                }
                            }
                        }
                        let arrayCurrency = ['VND']
                        for (var i = 0; i < data.length; i++) {
                            var arrayWhere = []
                            let nameCurrency = data[i].payment ? (data[i].payment.currency ? data[i].payment.currency.ShortName : 'VND') : 'VND'
                            if (data[i].IDPayment) {
                                arrayWhere.push({
                                    IDPayment: data[i].IDPayment
                                })
                                if (!checkDuplicate(arrayCurrency, data[i].payment.currency.ShortName)) {
                                    arrayCurrency.push(data[i].payment.currency.ShortName)
                                    arrayCreditIncurred.push({
                                        key: data[i].payment.currency.ShortName,
                                        value: 0
                                    })
                                    arrayDebtIncurred.push({
                                        key: data[i].payment.currency.ShortName,
                                        value: 0
                                    })
                                    arrayDebtSurplus.push({
                                        key: data[i].payment.currency.ShortName,
                                        value: 0
                                    })
                                    arrayCreaditSurplus.push({
                                        key: data[i].payment.currency.ShortName,
                                        value: 0
                                    })
                                }
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
                                        let accountingCode = data[i].accounting ? data[i].accounting.AccountingCode : '';
                                        let accountID = item.IDAccounting ? Number(item.IDAccounting) : null
                                        let accountingReciprocalCode = item.accounting ? item.accounting.AccountingCode : '';
                                        let createDate = item.CreateDate ? moment(item.CreateDate).format('DD/MM/YYYY') : null;
                                        let entryDate = item.EntryDate ? moment(item.EntryDate).format('DD/MM/YYYY') : null;
                                        let number = data[i].payment ? data[i].payment.CodeNumber : '';
                                        let reason = accounting.length < 2 ? (data[i].Contents ? data[i].Contents : '') : (item.Contents ? item.Contents : '');
                                        let creditIncurred = accounting.length < 2 ? (data[i].CreditIncurred ? data[i].CreditIncurred : 0) : (item.DebtIncurred ? item.DebtIncurred : 0);
                                        let debtIncurred = accounting.length < 2 ? (data[i].DebtIncurred ? data[i].DebtIncurred : 0) : (item.CreditIncurred ? item.CreditIncurred : 0);
                                        let objCheck = {
                                            accountingCode: accountingCode,
                                            accountingReciprocalCode: accountingReciprocalCode,
                                            number: number,
                                        }
                                        if (!checkForDuplicateObjInArray(objCheck, arrayCheckDulicant)) {
                                            let objCheckReciprocal = {
                                                accountingCode: accountingReciprocalCode,
                                                accountingReciprocalCode: accountingCode,
                                                number: number,
                                            }
                                            arrayCheckDulicant.push(objCheck)
                                            arrayCheckDulicant.push(objCheckReciprocal)
                                            var obj = {
                                                stt: stt,
                                                id: Number(item.ID),
                                                accountingName: data[i].accounting ? data[i].accounting.AccountingName : '',
                                                accountingCode: accountingCode,
                                                accountingReciprocalName: item.accounting ? item.accounting.AccountingName : '',
                                                accountingReciprocalCode: accountingReciprocalCode,
                                                numberReceipts: item.NumberReceipts ? item.NumberReceipts : '',
                                                createDate: createDate,
                                                entryDate: entryDate,
                                                number: number,
                                                reason: reason,
                                                nameCurrency: nameCurrency,
                                                idAccounting: item.IDAccounting ? item.IDAccounting : null,
                                                creditIncurred: creditIncurred > 0 ? creditIncurred : debtIncurred,
                                                debtIncurred: debtIncurred > 0 ? debtIncurred : creditIncurred,
                                                debtSurplus: debtSurplus,
                                                creaditSurplus: creaditSurplus,
                                                numberOfReceipt: data[i].payment ? (data[i].payment.Type == 'receipt' ? data[i].payment.CodeNumber : '') : '',
                                                numberOfPayment: data[i].payment ? (data[i].payment.Type == 'payment' ? data[i].payment.CodeNumber : '') : '',
                                                receiver: data[i].payment ? data[i].payment.ApplicantReceiverName : '',
                                                customerName: Object.keys(objCustomer).length > 0 ? objCustomer.name : '',
                                            }
                                            if (arrayIDAccount.length <= 1) {
                                                arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                                arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                                totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                array.push(obj);
                                                stt += 1;
                                            } else {
                                                if (accountName == '112' || accountName == '111') {
                                                    arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                                    arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                                    totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                    totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                    array.push(obj);
                                                    stt += 1;
                                                } else {
                                                    if (dataSearch.accountSystemID == Number(data[i].IDAccounting)) {
                                                        console.log(accountID, dataSearch.accountSystemOtherID);
                                                        if (dataSearch.accountSystemOtherID && dataSearch.accountSystemOtherID == accountID) {
                                                            arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                                            arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                                            totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                            totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                            array.push(obj);
                                                            stt += 1;
                                                        } else if (!dataSearch.accountSystemOtherID) {
                                                            arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                                            arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                                            totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                            totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                            array.push(obj);
                                                            stt += 1;
                                                        }
                                                    } else if (dataSearch.type) {
                                                        if (dataSearch.accountSystemOtherID && dataSearch.accountSystemOtherID == accountID) {
                                                            arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                                            arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                                            totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                            totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                            array.push(obj);
                                                            stt += 1;
                                                        }

                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            })
                        }
                        var count = await mtblAccountingBooks(db).count({ where: whereOjb, })
                        let checkType;
                        if (dataSearch.accountSystemID)
                            checkType = await mtblDMTaiKhoanKeToan(db).findOne({
                                where: {
                                    ID: dataSearch.accountSystemID
                                }
                            })
                        if (checkType && checkType.TypeClause == "Credit") {
                            endingBalanceCredit = ((openingBalanceCredit == null || openingBalanceCredit == 0) ? 0 : openingBalanceCredit) + (totalCreditIncurred - totalDebtIncurred);
                            endingBalanceDebit = null;
                        } else if (checkType && checkType.TypeClause == "Debt") {
                            endingBalanceCredit = null;
                            endingBalanceDebit = ((openingBalanceDebit == null || openingBalanceDebit == 0) ? 0 : openingBalanceDebit) + (totalDebtIncurred - totalCreditIncurred);
                        } else {
                            let balanceCredit = ((openingBalanceCredit == null || openingBalanceCredit == 0) ? 0 : openingBalanceCredit) + (totalCreditIncurred - totalDebtIncurred);
                            let balanceDebit = ((openingBalanceDebit == null || openingBalanceDebit == 0) ? 0 : openingBalanceDebit) + (totalDebtIncurred - totalCreditIncurred);
                            if (openingBalanceCredit == null && openingBalanceDebit == null) {
                                if (checkType && checkType.AccountingCode.slice(0, 1) == '1' || checkType && checkType.AccountingCode.slice(0, 1) == '2') {
                                    endingBalanceCredit = null;
                                    endingBalanceDebit = balanceDebit;
                                }
                                if (checkType && checkType.AccountingCode.slice(0, 1) == '3' || checkType && checkType.AccountingCode.slice(0, 1) == '4') {
                                    endingBalanceCredit = balanceCredit;
                                    endingBalanceDebit = null;
                                }
                            } else {
                                if (openingBalanceCredit != null) {
                                    endingBalanceCredit = balanceCredit;
                                    endingBalanceDebit = null;
                                } else if (openingBalanceDebit != null) {
                                    endingBalanceCredit = null;
                                    endingBalanceDebit = balanceDebit;
                                } else {
                                    endingBalanceCredit = balanceCredit;
                                    endingBalanceDebit = balanceDebit;
                                }
                            }
                        }
                        var result = {
                            total: {
                                arrayCreditIncurred,
                                arrayDebtIncurred,
                                accountName,
                                totalCreaditSurplus,
                                totalDebtSurplus,
                                arisingPeriod,
                                openingBalanceDebit,
                                openingBalanceCredit,
                                endingBalanceDebit,
                                endingBalanceCredit,
                                customerName: Object.keys(objCustomer).length > 0 ? objCustomer.name : '',
                                customerCode: Object.keys(objCustomer).length > 0 ? objCustomer.customerCode : '',
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
    // get_data_summary_book
    getDataSummaryBook: (req, res) => {
        let body = req.body;
        console.log(body);
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
                    let arrayResponse = [];
                    let sttReponse = 1;
                    for (let customer of dataCustomer) {
                        let accountName = '';
                        var arrayIDAccount = []
                        let checkAccount111 = await mtblDMTaiKhoanKeToan(db).findOne({
                            where: {
                                AccountingCode: '111'
                            }
                        })
                        let checkAccount112 = await mtblDMTaiKhoanKeToan(db).findOne({
                            where: {
                                AccountingCode: '112'
                            }
                        })
                        let accountBooks;
                        if (dataSearch.type && dataSearch.type == 'cash') {
                            if (dataSearch.currencyID) {
                                let objAccount = await mtblDMTaiKhoanKeToan(db).findOne({
                                    where: {
                                        CurrencyID: dataSearch.currencyID,
                                        IDLevelAbove: checkAccount111.ID,
                                    }
                                })
                                if (objAccount) {
                                    accountBooks = await mtblDMTaiKhoanKeToan(db).findOne({
                                        where: {
                                            ID: objAccount.ID
                                        }
                                    })
                                    accountName = objAccount.AccountingCode
                                    arrayIDAccount.push(objAccount.ID)
                                }
                            }
                        } else if (dataSearch.type && dataSearch.type == 'bank') {
                            if (dataSearch.currencyID) {
                                let objAccount = await mtblDMTaiKhoanKeToan(db).findOne({
                                    where: {
                                        CurrencyID: dataSearch.currencyID,
                                        IDLevelAbove: checkAccount112.ID,
                                    }
                                })
                                if (objAccount) {
                                    accountName = objAccount.AccountingCode
                                    arrayIDAccount.push(objAccount.ID)
                                    accountBooks = await mtblDMTaiKhoanKeToan(db).findOne({
                                        where: {
                                            ID: objAccount.ID
                                        }
                                    })
                                }
                            }
                        } else {
                            if (dataSearch.accountSystemID)
                                accountBooks = await mtblDMTaiKhoanKeToan(db).findOne({
                                    where: {
                                        ID: dataSearch.accountSystemID
                                    }
                                })
                            if (dataSearch.accountSystemID) {
                                arrayIDAccount.push(dataSearch.accountSystemID)
                            }
                            if (dataSearch.accountSystemOtherID)
                                arrayIDAccount.push(dataSearch.accountSystemOtherID)
                        }
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
                            dataSearch.dateTo = moment(dataSearch.dateTo).add(30, 'hours').format('YYYY-MM-DD HH:MM:ss')
                            dataSearch.dateFrom = moment(dataSearch.dateFrom).add(7, 'hours').format('YYYY-MM-DD HH:MM:ss')
                            whereOjb.push({
                                CreateDate: {
                                    [Op.between]: [dataSearch.dateFrom, dataSearch.dateTo]
                                }
                            })
                        }
                        let typeCus = 'customer'
                        let arrayWhere = []
                        let supplierName = {}
                        if (customer.id)
                            if (dataSearch.type == 'supplier') {
                                typeCus = 'supplier'
                                await mtblReceiptsPayment(db).findAll({
                                    where: {
                                        SupplierID: customer.id
                                    }
                                }).then(data => {
                                    for (item of data) {
                                        arrayWhere.push(item.ID)
                                    }
                                })
                                supplierName = await mtblDMNhaCungCap(db).findOne({
                                    where: {
                                        ID: customer.id
                                    }
                                })
                            } else {
                                await mtblReceiptsPayment(db).findAll({
                                    where: {
                                        IDCustomer: customer.id
                                    }
                                }).then(data => {
                                    for (item of data) {
                                        arrayWhere.push(item.ID)
                                    }
                                })
                            }
                        if (dataSearch.currencyID) {
                            await mtblReceiptsPayment(db).findAll({
                                where: {
                                    IDCurrency: dataSearch.currencyID
                                }
                            }).then(data => {
                                for (item of data) {
                                    arrayWhere.push(item.ID)
                                }
                            })

                        }
                        if (customer.id || dataSearch.currencyID) {
                            whereOjb.push({
                                IDPayment: {
                                    [Op.in]: arrayWhere
                                }
                            })
                        }
                        let totalCreditIncurred = 0;
                        let arrayCreditIncurred = [];
                        let totalDebtIncurred = 0;
                        let arrayDebtIncurred = [];
                        let totalCreaditSurplus = 0;
                        let arrayCreaditSurplus = [];
                        let totalDebtSurplus = 0;
                        let arrayDebtSurplus = [];
                        let arisingPeriod = 0;
                        let openingBalanceCredit = 0;
                        let openingBalanceDebit = 0;
                        let endingBalanceDebit = [];
                        let endingBalanceCredit = [];
                        let stt = 1;
                        let tblAccountingBooks = mtblAccountingBooks(db);
                        arisingPeriod = totalDebtIncurred - totalCreditIncurred;
                        openingBalanceDebit = accountBooks ? (accountBooks.MoneyDebit ? accountBooks.MoneyDebit : null) : null
                        openingBalanceCredit = accountBooks ? (accountBooks.MoneyCredit ? accountBooks.MoneyCredit : null) : null
                        let debtSurplus = openingBalanceDebit;
                        let creaditSurplus = openingBalanceCredit;
                        tblAccountingBooks.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDAccounting', sourceKey: 'IDAccounting', as: 'accounting' })
                        tblAccountingBooks.belongsTo(mtblReceiptsPayment(db), { foreignKey: 'IDPayment', sourceKey: 'IDPayment', as: 'payment' })
                        let tblReceiptsPayment = mtblReceiptsPayment(db);
                        tblReceiptsPayment.belongsTo(mtblCurrency(db), { foreignKey: 'IDCurrency', sourceKey: 'IDCurrency', as: 'currency' })
                        await tblAccountingBooks.findAll({
                            offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                            limit: Number(body.itemPerPage),
                            where: whereOjb,
                            order: [
                                ['ID', 'ASC']
                            ],
                            include: [{
                                model: tblReceiptsPayment,
                                required: false,
                                as: 'payment',
                                include: [{
                                    model: mtblCurrency(db),
                                    required: false,
                                    as: 'currency',
                                }]
                            },
                            {
                                model: mtblDMTaiKhoanKeToan(db),
                                required: false,
                                as: 'accounting'
                            }
                            ],
                        }).then(async data => {
                            var array = [];
                            let objCustomer = {}
                            if (customer.id)
                                objCustomer = await getDetailCustomer(customer.id)
                            // Hàm lấy ra Những invoice chưa thanh toán tự động định khoản vào sổ tài khoản 131 và đối ứng là tài khoản 511
                            let checkAccount131 = await mtblDMTaiKhoanKeToan(db).findOne({
                                where: {
                                    ID: dataSearch.accountSystemID
                                }
                            })
                            let checkCccountSystemOtherID;
                            if (dataSearch.accountSystemOtherID)
                                checkCccountSystemOtherID = await mtblDMTaiKhoanKeToan(db).findOne({
                                    where: {
                                        ID: dataSearch.accountSystemOtherID
                                    }
                                })
                            let nameCurrencyCheck = 'VND'
                            if (dataSearch.currencyID) {
                                await mtblCurrency(db).findOne({
                                    where: {
                                        ID: dataSearch.currencyID
                                    }
                                }).then(data => {
                                    if (data)
                                        nameCurrencyCheck = data.ShortName
                                })
                            }
                            // Chỉ để demo sau sẽ có sửa
                            arrayCreditIncurred.push({
                                key: nameCurrencyCheck,
                                value: debtSurplus
                            })
                            arrayDebtIncurred.push({
                                key: nameCurrencyCheck,
                                value: 0
                            })
                            arrayDebtSurplus.push({
                                key: nameCurrencyCheck,
                                value: debtSurplus
                            })
                            arrayCreaditSurplus.push({
                                key: nameCurrencyCheck,
                                value: creaditSurplus
                            })
                            // //////////////////////////////////////////////////////////////////////////////
                            if (checkAccount131.AccountingCode == '131') {
                                let arrayInvoice = await getInvoiceWaitForPayInDB(db, dataInvoice, '131', customer.id ? customer.id : null)
                                for (invoice of arrayInvoice) {
                                    let dateInvoice = moment(invoice.createdDate).format('YYYY-DD-MM')
                                    let dateFrom = moment(dataSearch.dateFrom).subtract(7, 'hours').format('YYYY-MM-DD')
                                    let dateTo = moment(dataSearch.dateTo).subtract(7, 'hours').format('YYYY-MM-DD')
                                    if (!dataSearch.accountSystemOtherID || checkCccountSystemOtherID && checkCccountSystemOtherID.AccountingCode == invoice.accountingCredit) {
                                        if (moment(dateTo).isAfter(dateInvoice) && moment(dateFrom).isBefore(dateInvoice) || moment(dateTo).isSame(dateInvoice) || moment(dateFrom).isSame(dateInvoice)) {

                                            let objWaitForPay = await getInvoiceWaitForPay(db, invoice, stt, Object.keys(objCustomer).length > 0 ? objCustomer.name : '');
                                            // vì là tài khoản lưỡng tính
                                            debtSurplus += Number(invoice.total);
                                            objWaitForPay['debtSurplus'] = debtSurplus ? debtSurplus : 0
                                            objWaitForPay['creaditSurplus'] = null
                                            objWaitForPay['nameCurrency'] = 'VND'
                                            arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, 'VND', (objWaitForPay.debtIncurred ? objWaitForPay.debtIncurred : 0))
                                            arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, 'VND', (objWaitForPay.creditIncurred ? objWaitForPay.creditIncurred : 0))
                                            arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, 'VND', Number(invoice.total))
                                            totalCreaditSurplus += (objWaitForPay.creaditSurplus ? objWaitForPay.creaditSurplus : 0);
                                            totalDebtSurplus += (objWaitForPay.debtSurplus ? objWaitForPay.debtSurplus : 0);
                                            array.push(objWaitForPay);
                                            stt += 1;
                                        }
                                        if (!dataSearch.dateFrom || !dataSearch.dateTo) {
                                            let objWaitForPay = await getInvoiceWaitForPay(db, invoice, stt, Object.keys(objCustomer).length > 0 ? objCustomer.name : '');
                                            // vì là tài khoản lưỡng tính
                                            debtSurplus += Number(invoice.total);
                                            objWaitForPay['debtSurplus'] = debtSurplus ? debtSurplus : 0
                                            objWaitForPay['creaditSurplus'] = null
                                            objWaitForPay['nameCurrency'] = 'VND'
                                            arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, 'VND', (objWaitForPay.debtIncurred ? objWaitForPay.debtIncurred : 0))
                                            arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, 'VND', (objWaitForPay.creditIncurred ? objWaitForPay.creditIncurred : 0))
                                            arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, 'VND', Number(invoice.total))
                                            totalCreaditSurplus += (objWaitForPay.creaditSurplus ? objWaitForPay.creaditSurplus : 0);
                                            totalDebtSurplus += (objWaitForPay.debtSurplus ? objWaitForPay.debtSurplus : 0);
                                            array.push(objWaitForPay);
                                            stt += 1;
                                        }
                                    }
                                }
                            }
                            //  lấy dữ liệu credit Những credit chưa thanh toán tự động định khoản vào sổ tài khoản (tài khoản lấy theo pmcm gửi về)
                            let checkAccount331 = await mtblDMTaiKhoanKeToan(db).findOne({
                                where: {
                                    ID: dataSearch.accountSystemID
                                }
                            })
                            if (checkAccount331.AccountingCode == '331') {
                                let arrayCredit = await getInvoiceWaitForPayInDB(db, dataCredit, '331', customer.id ? customer.id : null)
                                for (credit of arrayCredit) {
                                    let dateInvoice = moment(credit.createdDate).format('YYYY-DD-MM')
                                    let dateFrom = moment(dataSearch.dateFrom).subtract(7, 'hours').format('YYYY-MM-DD')
                                    let dateTo = moment(dataSearch.dateTo).subtract(7, 'hours').format('YYYY-MM-DD')
                                    if (!dataSearch.accountSystemOtherID || checkCccountSystemOtherID && checkCccountSystemOtherID.AccountingCode == credit.accountingDebt) {
                                        let objWaitForPay = await getCreditWaitPay(db, credit, stt, Object.keys(objCustomer).length > 0 ? objCustomer.name : '')
                                        // vì là tài khoản lưỡng tính
                                        creaditSurplus += Number(credit.total);
                                        objWaitForPay['debtSurplus'] = null
                                        objWaitForPay['nameCurrency'] = 'VND'
                                        objWaitForPay['creaditSurplus'] = creaditSurplus ? creaditSurplus : 0
                                        arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, 'VND', (objWaitForPay.debtIncurred ? Number(objWaitForPay.debtIncurred) : 0))
                                        arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, 'VND', (objWaitForPay.creditIncurred ? Number(objWaitForPay.creditIncurred) : 0))
                                        arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, 'VND', (objWaitForPay.creaditSurplus ? Number(objWaitForPay.creaditSurplus) : 0))
                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, 'VND', (objWaitForPay.debtSurplus ? Number(objWaitForPay.debtSurplus) : 0))
                                        totalCreaditSurplus += (objWaitForPay.creaditSurplus ? Number(objWaitForPay.creaditSurplus) : 0);
                                        totalDebtSurplus += (objWaitForPay.debtSurplus ? Number(objWaitForPay.debtSurplus) : 0);
                                        array.push(objWaitForPay);
                                        stt += 1;
                                    }
                                }
                            }
                            let arrayCurrency = []
                            arrayCurrency.push(nameCurrencyCheck)
                            for (var i = 0; i < data.length; i++) {
                                var arrayWhere = []
                                let nameCurrency = data[i].payment ? (data[i].payment.currency ? data[i].payment.currency.ShortName : 'VND') : 'VND'
                                if (data[i].IDPayment) {
                                    arrayWhere.push({
                                        IDPayment: data[i].IDPayment
                                    })
                                    if (!checkDuplicate(arrayCurrency, data[i].payment.currency.ShortName)) {
                                        arrayCurrency.push(data[i].payment.currency.ShortName)
                                        arrayCreditIncurred.push({
                                            key: data[i].payment.currency.ShortName,
                                            value: 0
                                        })
                                        arrayDebtIncurred.push({
                                            key: data[i].payment.currency.ShortName,
                                            value: 0
                                        })
                                        arrayDebtSurplus.push({
                                            key: data[i].payment.currency.ShortName,
                                            value: 0
                                        })
                                        arrayCreaditSurplus.push({
                                            key: data[i].payment.currency.ShortName,
                                            value: 0
                                        })
                                    }
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
                                            let typeCheck = 'Biexual';
                                            let creditIncurred = accounting.length < 2 ? (data[i].CreditIncurred ? data[i].CreditIncurred : 0) : (item.DebtIncurred ? item.DebtIncurred : 0);
                                            let debtIncurred = accounting.length < 2 ? (data[i].DebtIncurred ? data[i].DebtIncurred : 0) : (item.CreditIncurred ? item.CreditIncurred : 0);
                                            if (checkTypeClause && checkTypeClause.TypeClause == 'Biexual') {
                                                typeCheck = 'Biexual'
                                                //  nếu là tài khoản đầu 1,2 : bên nợ
                                                //  nếu là tài khoản đầu 3,4 : bên có
                                                if (openingBalanceCredit == null && openingBalanceDebit == null) {
                                                    if (checkTypeClause.AccountingCode.slice(0, 1) == '1' || checkTypeClause.AccountingCode.slice(0, 1) == '2') {
                                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, nameCurrency, (debtIncurred - creditIncurred))
                                                        for (let item of arrayDebtSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                debtSurplus = item.value
                                                            }
                                                        }
                                                        creaditSurplus = null;
                                                    }
                                                    if (checkTypeClause.AccountingCode.slice(0, 1) == '3' || checkTypeClause.AccountingCode.slice(0, 1) == '4') {
                                                        debtSurplus = null;
                                                        arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, nameCurrency, (creditIncurred - debtIncurred))
                                                        for (let item of arrayCreaditSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                creaditSurplus = item.value
                                                            }
                                                        }

                                                    }
                                                } else {
                                                    if (openingBalanceCredit != null) {
                                                        debtSurplus = null;
                                                        arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, nameCurrency, (creditIncurred - debtIncurred))
                                                        for (let item of arrayCreaditSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                creaditSurplus = item.value
                                                            }
                                                        }
                                                    } else if (openingBalanceDebit != null) {
                                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, nameCurrency, (debtIncurred - creditIncurred))
                                                        for (let item of arrayDebtSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                debtSurplus = item.value
                                                            }
                                                        }
                                                        creaditSurplus = null;
                                                    } else {
                                                        arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, nameCurrency, (creditIncurred - debtIncurred))
                                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, nameCurrency, (debtIncurred - creditIncurred))
                                                        for (let item of arrayCreaditSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                creaditSurplus = item.value
                                                            }
                                                        }
                                                        for (let item of arrayDebtSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                debtSurplus = item.value
                                                            }
                                                        }
                                                    }
                                                }
                                            } else if (checkTypeClause && checkTypeClause.TypeClause == 'Debt') {
                                                arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, nameCurrency, (debtIncurred - creditIncurred))
                                                for (let item of arrayDebtSurplus) {
                                                    if (item.key == nameCurrency) {
                                                        debtSurplus = item.value
                                                    }
                                                }
                                                creaditSurplus += 0;
                                                typeCheck = 'Debt'
                                            } else if (checkTypeClause && checkTypeClause.TypeClause == 'Credit') {
                                                typeCheck = 'Credit'
                                                debtSurplus += 0;
                                                arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, nameCurrency, (creditIncurred - debtIncurred))
                                                for (let item of arrayCreaditSurplus) {
                                                    if (item.key == nameCurrency) {
                                                        creaditSurplus = item.value
                                                    }
                                                }
                                            } else {
                                                arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, nameCurrency, debtIncurred - creditIncurred)
                                                arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, nameCurrency, debtIncurred - creditIncurred)
                                                for (let item of arrayCreaditSurplus) {
                                                    if (item.key == nameCurrency) {
                                                        creaditSurplus = Math.round(item.value * 100) / 100
                                                    }
                                                }
                                                for (let item of arrayDebtSurplus) {
                                                    if (item.key == nameCurrency) {
                                                        debtSurplus = Math.round(item.value * 100) / 100
                                                    }
                                                }
                                            }
                                            // thu: có - GBC
                                            // chi: nợ - GBN
                                            let reason = accounting.length < 2 ? (data[i].Contents ? data[i].Contents : '') : (item.Contents ? item.Contents : '');
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
                                                reason: reason,
                                                idAccounting: item.IDAccounting ? item.IDAccounting : null,
                                                creditIncurred: creditIncurred,
                                                debtIncurred: debtIncurred,
                                                nameCurrency: nameCurrency,
                                                debtSurplus: debtSurplus,
                                                creaditSurplus: creaditSurplus,
                                                numberOfReceipt: data[i].payment ? (data[i].payment.Type == 'receipt' ? data[i].payment.CodeNumber : '') : '',
                                                numberOfPayment: data[i].payment ? (data[i].payment.Type == 'payment' ? data[i].payment.CodeNumber : '') : '',
                                                receiver: data[i].payment ? data[i].payment.ApplicantReceiverName : '',
                                                customerName: typeCus == 'supplier' ? supplierName.SupplierName : Object.keys(objCustomer).length > 0 ? objCustomer.name : '',
                                            }
                                            if (arrayIDAccount.length <= 1) {
                                                arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                                arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                                totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                array.push(obj);
                                                stt += 1;
                                            } else {
                                                if (accountName == '112' || accountName == '111') {
                                                    arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                                    arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                                    totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                    totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                    array.push(obj);
                                                    stt += 1;
                                                } else {
                                                    if (dataSearch.accountSystemID == Number(data[i].IDAccounting)) {
                                                        if (dataSearch.accountSystemOtherID && dataSearch.accountSystemOtherID == Number(item.IDAccounting)) {
                                                            arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                                            arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                                            totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                            totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                            array.push(obj);
                                                            stt += 1;
                                                        } else if (!dataSearch.accountSystemOtherID) {
                                                            arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                                            arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                                            totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                            totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                            array.push(obj);
                                                            stt += 1;
                                                        }
                                                    } else if (dataSearch.type) {
                                                        if (dataSearch.accountSystemOtherID && dataSearch.accountSystemOtherID == Number(item.IDAccounting)) {
                                                            arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                                            arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                                            totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                            totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                            array.push(obj);
                                                            stt += 1;
                                                        }

                                                    }
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                            let checkType = await mtblDMTaiKhoanKeToan(db).findOne({
                                where: {
                                    ID: dataSearch.accountSystemID
                                }
                            })
                            let arrayEndingBalanceDebit = []
                            for (let debt of arrayDebtIncurred) {
                                let objPush = {}
                                for (let credit of arrayCreditIncurred) {
                                    if (credit.key == debt.key) {
                                        objPush['key'] = debt.key
                                        objPush['value'] = debt.value - credit.value
                                    }
                                }
                                arrayEndingBalanceDebit.push(objPush)
                            }
                            let arrayEndingBalanceCredit = []
                            for (let credit of arrayCreditIncurred) {
                                let objPush = {}
                                for (let debt of arrayDebtIncurred) {
                                    if (credit.key == debt.key) {
                                        objPush['key'] = debt.key
                                        objPush['value'] = credit.value - debt.value
                                    }
                                }
                                arrayEndingBalanceCredit.push(objPush)
                            }
                            if (checkType && checkType.TypeClause == "Credit") {
                                endingBalanceCredit = arrayEndingBalanceCredit
                                endingBalanceDebit = null;
                            } else if (checkType && checkType.TypeClause == "Debt") {
                                endingBalanceCredit = null;
                                endingBalanceDebit = arrayEndingBalanceDebit;
                            } else {
                                let balanceCredit = arrayEndingBalanceCredit
                                let balanceDebit = arrayEndingBalanceDebit
                                if (openingBalanceCredit == null && openingBalanceDebit == null) {
                                    if (checkType && checkType.AccountingCode.slice(0, 1) == '1' || checkType.AccountingCode.slice(0, 1) == '2') {
                                        endingBalanceCredit = null;
                                        endingBalanceDebit = balanceDebit;
                                    }
                                    if (checkType && checkType.AccountingCode.slice(0, 1) == '3' || checkType.AccountingCode.slice(0, 1) == '4') {
                                        endingBalanceCredit = balanceCredit;
                                        endingBalanceDebit = null;
                                    }
                                } else {
                                    if (openingBalanceCredit != null) {
                                        endingBalanceCredit = balanceCredit;
                                        endingBalanceDebit = null;
                                    } else if (openingBalanceDebit != null) {
                                        endingBalanceCredit = null;
                                        endingBalanceDebit = balanceDebit;
                                    } else {
                                        endingBalanceCredit = balanceCredit;
                                        endingBalanceDebit = balanceDebit;
                                    }
                                }
                            }
                            let objCustomerRespone = {
                                stt: sttReponse,
                                customerCode: customer.customerCode,
                                customerID: customer.id,
                                customerName: customer.name,
                                type: 'customer',
                                debtAccount: checkType ? checkType.AccountingCode : '',
                                openingBalanceDebit,
                                openingBalanceCredit,
                                arrayCreditIncurred,
                                arrayDebtIncurred,
                                endingBalanceDebit,
                                endingBalanceCredit,
                            }
                            arrayResponse.push(objCustomerRespone)
                            sttReponse += 1
                        })
                    }
                    let checkAccount = await mtblDMTaiKhoanKeToan(db).findOne({
                        where: {
                            ID: dataSearch.accountSystemID
                        }
                    })
                    if (checkAccount.AccountingCode == '331')
                        await mtblDMNhaCungCap(db).findAll().then(async supplier => {
                            for (let suppliers of supplier) {
                                let accountName = '';
                                var arrayIDAccount = []
                                let checkAccount111 = await mtblDMTaiKhoanKeToan(db).findOne({
                                    where: {
                                        AccountingCode: '111'
                                    }
                                })
                                let checkAccount112 = await mtblDMTaiKhoanKeToan(db).findOne({
                                    where: {
                                        AccountingCode: '112'
                                    }
                                })
                                let accountBooks;
                                if (dataSearch.type && dataSearch.type == 'cash') {
                                    if (dataSearch.currencyID) {
                                        let objAccount = await mtblDMTaiKhoanKeToan(db).findOne({
                                            where: {
                                                CurrencyID: dataSearch.currencyID,
                                                IDLevelAbove: checkAccount111.ID,
                                            }
                                        })
                                        if (objAccount) {
                                            accountBooks = await mtblDMTaiKhoanKeToan(db).findOne({
                                                where: {
                                                    ID: objAccount.ID
                                                }
                                            })
                                            accountName = objAccount.AccountingCode
                                            arrayIDAccount.push(objAccount.ID)
                                        }
                                    }
                                } else if (dataSearch.type && dataSearch.type == 'bank') {
                                    if (dataSearch.currencyID) {
                                        let objAccount = await mtblDMTaiKhoanKeToan(db).findOne({
                                            where: {
                                                CurrencyID: dataSearch.currencyID,
                                                IDLevelAbove: checkAccount112.ID,
                                            }
                                        })
                                        if (objAccount) {
                                            accountName = objAccount.AccountingCode
                                            arrayIDAccount.push(objAccount.ID)
                                            accountBooks = await mtblDMTaiKhoanKeToan(db).findOne({
                                                where: {
                                                    ID: objAccount.ID
                                                }
                                            })
                                        }
                                    }
                                } else {
                                    if (dataSearch.accountSystemID)
                                        accountBooks = await mtblDMTaiKhoanKeToan(db).findOne({
                                            where: {
                                                ID: dataSearch.accountSystemID
                                            }
                                        })
                                    if (dataSearch.accountSystemID) {
                                        arrayIDAccount.push(dataSearch.accountSystemID)
                                    }
                                    if (dataSearch.accountSystemOtherID)
                                        arrayIDAccount.push(dataSearch.accountSystemOtherID)
                                }
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
                                    dataSearch.dateTo = moment(dataSearch.dateTo).add(30, 'hours').format('YYYY-MM-DD HH:MM:ss')
                                    dataSearch.dateFrom = moment(dataSearch.dateFrom).add(7, 'hours').format('YYYY-MM-DD HH:MM:ss')
                                    whereOjb.push({
                                        CreateDate: {
                                            [Op.between]: [dataSearch.dateFrom, dataSearch.dateTo]
                                        }
                                    })
                                }
                                let typeCus = 'customer'
                                let arrayWhere = []
                                let supplierName = {}
                                if (suppliers.ID) {
                                    typeCus = 'supplier'
                                    console.log(12345678899);
                                    await mtblReceiptsPayment(db).findAll({
                                        where: {
                                            SupplierID: suppliers.ID
                                        }
                                    }).then(data => {
                                        for (item of data) {
                                            arrayWhere.push(item.ID)
                                        }
                                    })
                                    supplierName = await mtblDMNhaCungCap(db).findOne({
                                        where: {
                                            ID: suppliers.ID
                                        }
                                    })
                                }
                                if (dataSearch.currencyID) {
                                    await mtblReceiptsPayment(db).findAll({
                                        where: {
                                            IDCurrency: dataSearch.currencyID
                                        }
                                    }).then(data => {
                                        for (item of data) {
                                            arrayWhere.push(item.ID)
                                        }
                                    })

                                }
                                if (suppliers.ID || dataSearch.currencyID) {
                                    whereOjb.push({
                                        IDPayment: {
                                            [Op.in]: arrayWhere
                                        }
                                    })
                                }
                                let totalCreditIncurred = 0;
                                let arrayCreditIncurred = [];
                                let totalDebtIncurred = 0;
                                let arrayDebtIncurred = [];
                                let totalCreaditSurplus = 0;
                                let arrayCreaditSurplus = [];
                                let totalDebtSurplus = 0;
                                let arrayDebtSurplus = [];
                                let arisingPeriod = 0;
                                let openingBalanceCredit = 0;
                                let openingBalanceDebit = 0;
                                let endingBalanceDebit = [];
                                let endingBalanceCredit = [];
                                let stt = 1;
                                console.log(arrayDebtIncurred, 123456789);
                                let tblAccountingBooks = mtblAccountingBooks(db);
                                arisingPeriod = totalDebtIncurred - totalCreditIncurred;
                                openingBalanceDebit = accountBooks ? (accountBooks.MoneyDebit ? accountBooks.MoneyDebit : null) : null
                                openingBalanceCredit = accountBooks ? (accountBooks.MoneyCredit ? accountBooks.MoneyCredit : null) : null
                                let debtSurplus = openingBalanceDebit;
                                let creaditSurplus = openingBalanceCredit;
                                tblAccountingBooks.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDAccounting', sourceKey: 'IDAccounting', as: 'accounting' })
                                tblAccountingBooks.belongsTo(mtblReceiptsPayment(db), { foreignKey: 'IDPayment', sourceKey: 'IDPayment', as: 'payment' })
                                let tblReceiptsPayment = mtblReceiptsPayment(db);
                                tblReceiptsPayment.belongsTo(mtblCurrency(db), { foreignKey: 'IDCurrency', sourceKey: 'IDCurrency', as: 'currency' })
                                await tblAccountingBooks.findAll({
                                    offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                                    limit: Number(body.itemPerPage),
                                    where: whereOjb,
                                    order: [
                                        ['ID', 'ASC']
                                    ],
                                    include: [{
                                        model: tblReceiptsPayment,
                                        required: false,
                                        as: 'payment',
                                        include: [{
                                            model: mtblCurrency(db),
                                            required: false,
                                            as: 'currency',
                                        }]
                                    },
                                    {
                                        model: mtblDMTaiKhoanKeToan(db),
                                        required: false,
                                        as: 'accounting'
                                    }
                                    ],
                                }).then(async data => {
                                    var array = [];
                                    let checkCccountSystemOtherID;
                                    if (dataSearch.accountSystemOtherID)
                                        checkCccountSystemOtherID = await mtblDMTaiKhoanKeToan(db).findOne({
                                            where: {
                                                ID: dataSearch.accountSystemOtherID
                                            }
                                        })
                                    let nameCurrencyCheck = 'VND'
                                    if (dataSearch.currencyID) {
                                        await mtblCurrency(db).findOne({
                                            where: {
                                                ID: dataSearch.currencyID
                                            }
                                        }).then(data => {
                                            if (data)
                                                nameCurrencyCheck = data.ShortName
                                        })
                                    }
                                    // Chỉ để demo sau sẽ có sửa
                                    arrayCreditIncurred.push({
                                        key: nameCurrencyCheck,
                                        value: debtSurplus
                                    })
                                    arrayDebtIncurred.push({
                                        key: nameCurrencyCheck,
                                        value: 0
                                    })
                                    arrayDebtSurplus.push({
                                        key: nameCurrencyCheck,
                                        value: debtSurplus
                                    })
                                    arrayCreaditSurplus.push({
                                        key: nameCurrencyCheck,
                                        value: creaditSurplus
                                    })
                                    let arrayCurrency = []
                                    arrayCurrency.push(nameCurrencyCheck)
                                    for (var i = 0; i < data.length; i++) {
                                        var arrayWhere = []
                                        let nameCurrency = data[i].payment ? (data[i].payment.currency ? data[i].payment.currency.ShortName : 'VND') : 'VND'
                                        if (data[i].IDPayment) {
                                            arrayWhere.push({
                                                IDPayment: data[i].IDPayment
                                            })
                                            if (!checkDuplicate(arrayCurrency, data[i].payment.currency.ShortName)) {
                                                arrayCurrency.push(data[i].payment.currency.ShortName)
                                                arrayCreditIncurred.push({
                                                    key: data[i].payment.currency.ShortName,
                                                    value: 0
                                                })
                                                arrayDebtIncurred.push({
                                                    key: data[i].payment.currency.ShortName,
                                                    value: 0
                                                })
                                                arrayDebtSurplus.push({
                                                    key: data[i].payment.currency.ShortName,
                                                    value: 0
                                                })
                                                arrayCreaditSurplus.push({
                                                    key: data[i].payment.currency.ShortName,
                                                    value: 0
                                                })
                                            }
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
                                                    let typeCheck = 'Biexual';
                                                    let creditIncurred = accounting.length < 2 ? (data[i].CreditIncurred ? data[i].CreditIncurred : 0) : (item.DebtIncurred ? item.DebtIncurred : 0);
                                                    let debtIncurred = accounting.length < 2 ? (data[i].DebtIncurred ? data[i].DebtIncurred : 0) : (item.CreditIncurred ? item.CreditIncurred : 0);
                                                    if (checkTypeClause && checkTypeClause.TypeClause == 'Biexual') {
                                                        typeCheck = 'Biexual'
                                                        //  nếu là tài khoản đầu 1,2 : bên nợ
                                                        //  nếu là tài khoản đầu 3,4 : bên có
                                                        if (openingBalanceCredit == null && openingBalanceDebit == null) {
                                                            if (checkTypeClause.AccountingCode.slice(0, 1) == '1' || checkTypeClause.AccountingCode.slice(0, 1) == '2') {
                                                                arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, nameCurrency, (debtIncurred - creditIncurred))
                                                                for (let item of arrayDebtSurplus) {
                                                                    if (item.key == nameCurrency) {
                                                                        debtSurplus = item.value
                                                                    }
                                                                }
                                                                creaditSurplus = null;
                                                            }
                                                            if (checkTypeClause.AccountingCode.slice(0, 1) == '3' || checkTypeClause.AccountingCode.slice(0, 1) == '4') {
                                                                debtSurplus = null;
                                                                arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, nameCurrency, (creditIncurred - debtIncurred))
                                                                for (let item of arrayCreaditSurplus) {
                                                                    if (item.key == nameCurrency) {
                                                                        creaditSurplus = item.value
                                                                    }
                                                                }

                                                            }
                                                        } else {
                                                            if (openingBalanceCredit != null) {
                                                                debtSurplus = null;
                                                                arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, nameCurrency, (creditIncurred - debtIncurred))
                                                                for (let item of arrayCreaditSurplus) {
                                                                    if (item.key == nameCurrency) {
                                                                        creaditSurplus = item.value
                                                                    }
                                                                }
                                                            } else if (openingBalanceDebit != null) {
                                                                arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, nameCurrency, (debtIncurred - creditIncurred))
                                                                for (let item of arrayDebtSurplus) {
                                                                    if (item.key == nameCurrency) {
                                                                        debtSurplus = item.value
                                                                    }
                                                                }
                                                                creaditSurplus = null;
                                                            } else {
                                                                arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, nameCurrency, (creditIncurred - debtIncurred))
                                                                arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, nameCurrency, (debtIncurred - creditIncurred))
                                                                for (let item of arrayCreaditSurplus) {
                                                                    if (item.key == nameCurrency) {
                                                                        creaditSurplus = item.value
                                                                    }
                                                                }
                                                                for (let item of arrayDebtSurplus) {
                                                                    if (item.key == nameCurrency) {
                                                                        debtSurplus = item.value
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    } else if (checkTypeClause && checkTypeClause.TypeClause == 'Debt') {
                                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, nameCurrency, (debtIncurred - creditIncurred))
                                                        for (let item of arrayDebtSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                debtSurplus = item.value
                                                            }
                                                        }
                                                        creaditSurplus += 0;
                                                        typeCheck = 'Debt'
                                                    } else if (checkTypeClause && checkTypeClause.TypeClause == 'Credit') {
                                                        typeCheck = 'Credit'
                                                        debtSurplus += 0;
                                                        arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, nameCurrency, (creditIncurred - debtIncurred))
                                                        for (let item of arrayCreaditSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                creaditSurplus = item.value
                                                            }
                                                        }
                                                    } else {
                                                        arrayCreaditSurplus = await addValueOfArray(arrayCreaditSurplus, nameCurrency, debtIncurred - creditIncurred)
                                                        arrayDebtSurplus = await addValueOfArray(arrayDebtSurplus, nameCurrency, debtIncurred - creditIncurred)
                                                        for (let item of arrayCreaditSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                creaditSurplus = Math.round(item.value * 100) / 100
                                                            }
                                                        }
                                                        for (let item of arrayDebtSurplus) {
                                                            if (item.key == nameCurrency) {
                                                                debtSurplus = Math.round(item.value * 100) / 100
                                                            }
                                                        }
                                                    }
                                                    // thu: có - GBC
                                                    // chi: nợ - GBN
                                                    let reason = accounting.length < 2 ? (data[i].Contents ? data[i].Contents : '') : (item.Contents ? item.Contents : '');
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
                                                        reason: reason,
                                                        idAccounting: item.IDAccounting ? item.IDAccounting : null,
                                                        creditIncurred: creditIncurred,
                                                        debtIncurred: debtIncurred,
                                                        nameCurrency: nameCurrency,
                                                        debtSurplus: debtSurplus,
                                                        creaditSurplus: creaditSurplus,
                                                        numberOfReceipt: data[i].payment ? (data[i].payment.Type == 'receipt' ? data[i].payment.CodeNumber : '') : '',
                                                        numberOfPayment: data[i].payment ? (data[i].payment.Type == 'payment' ? data[i].payment.CodeNumber : '') : '',
                                                        receiver: data[i].payment ? data[i].payment.ApplicantReceiverName : '',
                                                        customerName: typeCus == 'supplier' ? supplierName.SupplierName : Object.keys(objCustomer).length > 0 ? objCustomer.name : '',
                                                    }
                                                    if (arrayIDAccount.length <= 1) {
                                                        arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                                        arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                                        totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                        totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                        array.push(obj);
                                                        stt += 1;
                                                    } else {
                                                        if (accountName == '112' || accountName == '111') {
                                                            arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                                            arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                                            totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                            totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                            array.push(obj);
                                                            stt += 1;
                                                        } else {
                                                            if (dataSearch.accountSystemID == Number(data[i].IDAccounting)) {
                                                                if (dataSearch.accountSystemOtherID && dataSearch.accountSystemOtherID == Number(item.IDAccounting)) {
                                                                    arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                                                    arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                                                    totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                                    totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                                    array.push(obj);
                                                                    stt += 1;
                                                                } else if (!dataSearch.accountSystemOtherID) {
                                                                    arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                                                    arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                                                    totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                                    totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                                    array.push(obj);
                                                                    stt += 1;
                                                                }
                                                            } else if (dataSearch.type) {
                                                                if (dataSearch.accountSystemOtherID && dataSearch.accountSystemOtherID == Number(item.IDAccounting)) {
                                                                    arrayDebtIncurred = await addValueOfArray(arrayDebtIncurred, nameCurrency, Number(obj.debtIncurred ? obj.debtIncurred : 0))
                                                                    arrayCreditIncurred = await addValueOfArray(arrayCreditIncurred, nameCurrency, Number(obj.creditIncurred ? obj.creditIncurred : 0))
                                                                    totalCreaditSurplus += (obj.creaditSurplus ? obj.creaditSurplus : 0);
                                                                    totalDebtSurplus += (obj.debtSurplus ? obj.debtSurplus : 0);
                                                                    array.push(obj);
                                                                    stt += 1;
                                                                }

                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        })
                                    }
                                    let checkType = await mtblDMTaiKhoanKeToan(db).findOne({
                                        where: {
                                            ID: dataSearch.accountSystemID
                                        }
                                    })
                                    let arrayEndingBalanceDebit = []
                                    for (let debt of arrayDebtIncurred) {
                                        let objPush = {}
                                        for (let credit of arrayCreditIncurred) {
                                            if (credit.key == debt.key) {
                                                objPush['key'] = debt.key
                                                objPush['value'] = debt.value - credit.value
                                            }
                                        }
                                        arrayEndingBalanceDebit.push(objPush)
                                    }
                                    let arrayEndingBalanceCredit = []
                                    for (let credit of arrayCreditIncurred) {
                                        let objPush = {}
                                        for (let debt of arrayDebtIncurred) {
                                            if (credit.key == debt.key) {
                                                objPush['key'] = debt.key
                                                objPush['value'] = credit.value - debt.value
                                            }
                                        }
                                        arrayEndingBalanceCredit.push(objPush)
                                    }
                                    if (checkType && checkType.TypeClause == "Credit") {
                                        endingBalanceCredit = arrayEndingBalanceCredit
                                        endingBalanceDebit = null;
                                    } else if (checkType && checkType.TypeClause == "Debt") {
                                        endingBalanceCredit = null;
                                        endingBalanceDebit = arrayEndingBalanceDebit;
                                    } else {
                                        let balanceCredit = arrayEndingBalanceCredit
                                        let balanceDebit = arrayEndingBalanceDebit
                                        if (openingBalanceCredit == null && openingBalanceDebit == null) {
                                            if (checkType && checkType.AccountingCode.slice(0, 1) == '1' || checkType.AccountingCode.slice(0, 1) == '2') {
                                                endingBalanceCredit = null;
                                                endingBalanceDebit = balanceDebit;
                                            }
                                            if (checkType && checkType.AccountingCode.slice(0, 1) == '3' || checkType.AccountingCode.slice(0, 1) == '4') {
                                                endingBalanceCredit = balanceCredit;
                                                endingBalanceDebit = null;
                                            }
                                        } else {
                                            if (openingBalanceCredit != null) {
                                                endingBalanceCredit = balanceCredit;
                                                endingBalanceDebit = null;
                                            } else if (openingBalanceDebit != null) {
                                                endingBalanceCredit = null;
                                                endingBalanceDebit = balanceDebit;
                                            } else {
                                                endingBalanceCredit = balanceCredit;
                                                endingBalanceDebit = balanceDebit;
                                            }
                                        }
                                    }
                                    let objCustomerRespone = {
                                        stt: sttReponse,
                                        customerCode: suppliers.SupplierCode,
                                        customerID: suppliers.ID,
                                        customerName: suppliers.SupplierName,
                                        type: 'supplier',
                                        debtAccount: checkType ? checkType.AccountingCode : '',
                                        openingBalanceDebit,
                                        openingBalanceCredit,
                                        arrayCreditIncurred,
                                        arrayDebtIncurred,
                                        endingBalanceDebit,
                                        endingBalanceCredit,
                                    }
                                    arrayResponse.push(objCustomerRespone)
                                    sttReponse += 1
                                })
                            }
                        })
                    var result = {
                        array: arrayResponse,
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
    // get_child_accounts_of_account
    getChildAccountsOfAccount: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let array = []
                    mtblDMTaiKhoanKeToan(db).findOne({
                        where: {
                            AccountingCode: body.accountingCode
                        }
                    }).then(async account => {
                        if (account) {
                            var arrayChildern2 = []
                            arrayChildern2 = await findAcountingFollowLevel(db, 2, account.ID)
                            if (arrayChildern2.length > 0) {
                                for (var c2 = 0; c2 < arrayChildern2.length; c2++) {
                                    var arrayChildern3 = []
                                    arrayChildern3 = await findAcountingFollowLevel(db, 3, arrayChildern2[c2].id)
                                    if (arrayChildern3.length > 0) {
                                        arrayChildern2[c2]['children'] = arrayChildern3
                                        for (var c3 = 0; c3 < arrayChildern3.length; c3++) {
                                            var arrayChildern4 = []
                                            arrayChildern4 = await findAcountingFollowLevel(db, 4, arrayChildern3[c3].id)
                                            if (arrayChildern4.length > 0) {
                                                arrayChildern3[c3]['children'] = arrayChildern4
                                                for (var c4 = 0; c4 < arrayChildern4.length; c4++) {
                                                    var arrayChildern5 = []
                                                    arrayChildern5 = await findAcountingFollowLevel(db, 5, arrayChildern4[c4].id)
                                                    arrayChildern4[c4]['children'] = arrayChildern5
                                                }
                                            } else {
                                                obj = {
                                                    id: data[i].ID,
                                                    accountingName: data[i].AccountingName ? data[i].AccountingName : '',
                                                    accountingCode: data[i].AccountingCode ? data[i].AccountingCode : '',
                                                    idLoaiTaiKhoanKeToan: data[i].IDLoaiTaiKhoanKeToan ? data[i].IDLoaiTaiKhoanKeToan : '',
                                                    nameTypeAcounting: data[i].Loai ? data[i].Loai.TypeName : '',
                                                    idLevelAbove: data[i].IDLevelAbove ? data[i].IDLevelAbove : '',
                                                    levels: data[i].Levels ? data[i].Levels : '',
                                                    moneyCredit: data[i].MoneyCredit ? data[i].MoneyCredit : 0,
                                                    moneyDebit: data[i].MoneyDebit ? data[i].MoneyDebit : 0,
                                                    typeClause: data[i].TypeClause ? data[i].TypeClause : 'Unknown',
                                                    children: arrayChildern2
                                                }
                                            }
                                        }
                                    } else {
                                        obj = {
                                            id: data[i].ID,
                                            accountingName: data[i].AccountingName ? data[i].AccountingName : '',
                                            accountingCode: data[i].AccountingCode ? data[i].AccountingCode : '',
                                            idLoaiTaiKhoanKeToan: data[i].IDLoaiTaiKhoanKeToan ? data[i].IDLoaiTaiKhoanKeToan : '',
                                            nameTypeAcounting: data[i].Loai ? data[i].Loai.TypeName : '',
                                            idLevelAbove: data[i].IDLevelAbove ? data[i].IDLevelAbove : '',
                                            levels: data[i].Levels ? data[i].Levels : '',
                                            moneyCredit: data[i].MoneyCredit ? data[i].MoneyCredit : 0,
                                            moneyDebit: data[i].MoneyDebit ? data[i].MoneyDebit : 0,
                                            typeClause: data[i].TypeClause ? data[i].TypeClause : 'Unknown',
                                            children: arrayChildern2
                                        }
                                    }
                                }
                            } else {
                                obj = {
                                    id: data[i].ID,
                                    accountingName: data[i].AccountingName ? data[i].AccountingName : '',
                                    accountingCode: data[i].AccountingCode ? data[i].AccountingCode : '',
                                    idLoaiTaiKhoanKeToan: data[i].IDLoaiTaiKhoanKeToan ? data[i].IDLoaiTaiKhoanKeToan : '',
                                    nameTypeAcounting: data[i].Loai ? data[i].Loai.TypeName : '',
                                    idLevelAbove: data[i].IDLevelAbove ? data[i].IDLevelAbove : '',
                                    levels: data[i].Levels ? data[i].Levels : '',
                                    moneyCredit: data[i].MoneyCredit ? data[i].MoneyCredit : 0,
                                    moneyDebit: data[i].MoneyDebit ? data[i].MoneyDebit : 0,
                                    typeClause: data[i].TypeClause ? data[i].TypeClause : 'Unknown',
                                    children: arrayChildern2
                                }
                            }
                            array.push(obj)
                        }
                        var result = {
                            array: array,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        res.json(result);
                    })
                } catch (error) {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },

}