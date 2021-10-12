const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblInvoice = require('../tables/financemanage/tblInvoice')
var database = require('../database');
const axios = require('axios');
var mtblCurrency = require('../tables/financemanage/tblCurrency')
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
    accountingDebt: '131',
    nameAccountingDebt: 'Phải thu khách hàng',
    accountingCredit: '511',
    nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
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
    accountingDebt: '131',
    nameAccountingDebt: 'Phải thu khách hàng',
    accountingCredit: '511',
    nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
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
    accountingDebt: '131',
    nameAccountingDebt: 'Phải thu khách hàng',
    accountingCredit: '511',
    nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
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
    accountingDebt: '131',
    nameAccountingDebt: 'Phải thu khách hàng',
    accountingCredit: '511',
    nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
},
];

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
                Date: { [Op.substring]: date },
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
                        Date: { [Op.substring]: searchNow },
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
    getListtblInvoice: async (req, res) => {
        var body = req.body
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
            accountingDebt: '131',
            nameAccountingDebt: 'Phải thu khách hàng',
            accountingCredit: '511',
            nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
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
            accountingDebt: '131',
            nameAccountingDebt: 'Phải thu khách hàng',
            accountingCredit: '511',
            nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
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
            accountingDebt: '131',
            nameAccountingDebt: 'Phải thu khách hàng',
            accountingCredit: '511',
            nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
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
            accountingDebt: '131',
            nameAccountingDebt: 'Phải thu khách hàng',
            accountingCredit: '511',
            nameAccountingCredit: 'Doanh thu bán hàng và cung cấp dịch vụ',
        },
        ];
        database.connectDatabase().then(async db => {
            var obj = {
                "paging": {
                    "pageSize": body.itemPerPage ? body.itemPerPage : 0,
                    "currentPage": body.page ? body.page : 0
                },
                "type": body.type
            }
            // await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(async data => {
            //     if (data) {
            //         if (data.data.status_code == 200) {
            if (data) {
                let totalMoney = await calculateTheTotalAmountOfEachCurrency(data)
                for (let i = 0; i < data.length; i++) {
                    let check = await mtblInvoice(db).findOne({
                        where: { IDSpecializedSoftware: data[i].id }
                    })
                    if (!check) {
                        await mtblInvoice(db).create({
                            IDSpecializedSoftware: data[i].id,
                            Status: data[i].statusName,
                            Request: data[i].request
                        })
                    } else {
                        data[i].statusName = check.Status
                        data[i].request = check.Request
                    }
                    let totalMoneyVND = 0
                    let arrayExchangeRate = []
                    for (let m = 0; m < data[i].arrayMoney.length; m++) {
                        totalMoneyVND += await calculateMoneyFollowVND(db, data[i].arrayMoney[m].typeMoney, (data[i].arrayMoney[m].total ? data[i].arrayMoney[m].total : 0), moment(data[i].createdDate).format('YYYY-DD-MM'))
                        arrayExchangeRate.push(await getExchangeRateFromDate(db, data[i].arrayMoney[m].typeMoney, moment(data[i].createdDate).format('YYYY-DD-MM')))
                    }
                    data[i]['totalMoneyVND'] = totalMoneyVND
                    data[i]['arrayExchangeRate'] = arrayExchangeRate
                    data[i]['payDate'] = check ? moment(check.PayDate).format('DD/MM/YYYY') : ''
                    data[i]['payments'] = check ? check.Payments : ''
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