const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Sequelize = require('sequelize');

const Result = require('../constants/result');
var moment = require('moment');
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var fs = require('fs');
var xl = require('excel4node');
var database = require('../database');
var mtblCurrency = require('../tables/financemanage/tblCurrency')
var mtblRate = require('../tables/financemanage/tblRate')

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
    createdDate: '02/05/2020',
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
    createdDate: '03/05/2020',
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
    createdDate: '04/05/2020',
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
    createdDate: '07/05/2020',
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
function convertNumber(number) {
    if (number < 10) {
        return '0' + number
    } else
        return number
}
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
async function getDataInvoiceFromDepartmentFollowYear(db, departmentID, year) {
    let dataResult = []
    for (let d = 0; d < data.length; d++) {
        let checkMonth = data[d].createdDate.slice(3, 10)
        if (data[d].departmentID == departmentID && checkMonth == year) {
            dataResult.push(data[d])
        }
    }
    let totalMoney = await calculateTheTotalAmountOfEachCurrency(dataResult)
    let totalMoneyVND = 0
    for (let a = 0; a < totalMoney.length; a++) {
        totalMoneyVND += await calculateMoneyFollowVND(db, totalMoney[a].type, totalMoney[a].total, totalMoney[a].date)
    }
    return totalMoneyVND
}
module.exports = {
    // get_data_report_aggregate_revenue_shtt
    getDataReportAggregateRevenueSHTT: async (req, res) => {
        var body = req.body
        var obj = {
            "paging": {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        // console.log(body);
        // await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
        database.connectDatabase().then(async db => {
            if (db) {
                if (data) {
                    let arrayResult = []
                    let arrayHeader = []
                    arrayHeader.push('STT')
                    arrayHeader.push('NỘI DUNG')
                    for (let month = 1; month <= 12; month++) {
                        arrayHeader.push('THÁNG ' + convertNumber(month) + '/' + body.year)
                    }
                    let stt = 1
                    await mtblDMBoPhan(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async department => {
                        for (let dp = 0; dp < department.length; dp++) {
                            let obj = {};
                            for (let month = 1; month <= 12; month++) {
                                let objElement = {}
                                let year = await getDataInvoiceFromDepartmentFollowYear(db, department[dp].ID, convertNumber(month) + '/' + body.year)
                                let lastYear = await getDataInvoiceFromDepartmentFollowYear(db, department[dp].ID, convertNumber(month) + '/' + (Number(body.year) - 1))
                                objElement[convertNumber(month) + '/' + body.year] = year;
                                objElement[convertNumber(month) + '/' + (Number(body.year) - 1)] = lastYear;
                                objElement['difference'] = year - lastYear;
                                objElement['ratio'] = lastYear ? (year - lastYear) / lastYear : 0;
                                obj['THÁNG ' + convertNumber(month) + '/' + body.year] = objElement;
                            }
                            arrayResult.push({
                                stt: stt,
                                departmentName: department[dp].DepartmentName,
                                obj: obj,
                            })
                            stt += 1
                        }
                    })
                    let result = {
                        arrayResult: arrayResult,
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
}