const axios = require('axios');
const Result = require('../constants/result');
const Constant = require('../constants/constant');
var mtblInvoice = require('../tables/financemanage/tblInvoice')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblCurrency = require('../tables/financemanage/tblCurrency')
var mtblRate = require('../tables/financemanage/tblRate')
var moment = require('moment');
const Op = require('sequelize').Op;
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')
var mtblPaymentRInvoice = require('../tables/financemanage/tblPaymentRInvoice')
var mtblInvoiceRCurrency = require('../tables/financemanage/tblInvoiceRCurrency')
var mtblDMUser = require('../tables/constants/tblDMUser');
var mtblDMChiNhanh = require('../tables/constants/tblDMChiNhanh')
var mtblDMTaiKhoanKeToan = require('../tables/financemanage/tblDMTaiKhoanKeToan')
var mtblCurrency = require('../tables/financemanage/tblCurrency')
var mtblRate = require('../tables/financemanage/tblRate')

function checkDuplicate(array, elm) {
    var check = false;
    array.forEach(item => {
        if (item === elm) check = true;
    })
    return check;
}
var database = require('../database');
var mtblDMNhaCungCap = require('../tables/qlnb/tblDMNhaCungCap');

async function calculateTheTotalForCredit(array) {
    let arrayResult = []
    let total = 0
    for (let i = 0; i < array.length; i++) {
        total += Number(array[i].total)
    }
    arrayResult.push({
        type: 'VND',
        total: total
    })
    return arrayResult
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
async function getCustomerOfPMCM(page = null, itemPerPage = null, searchKey = null) {
    let obj = {
        "paging": {
            "pageSize": itemPerPage ? itemPerPage : 1000,
            "currentPage": page ? page : 1,
            "rowsCount": 0
        },
    }
    if (searchKey)
        obj["search"] = searchKey
    let objResult = {}
    console.log(obj);
    console.log('------------------------Đợi api pmcm----------------------------- ');
    await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/address_book/list_pmtc`, obj).then(async data => {
        if (data.data.data) {
            objResult['data'] = data.data.data.list;
            objResult['count'] = data.data.data.pager.rowsCount;
        } else {
            console.log(data.data);
        }
    })
    return objResult
}
async function getDetailCustomerOfPMCM(idCustomer) {
    let objResult = {}
    await axios.get(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/address_book/get_by_id_pmtc?id=` + idCustomer).then(async data => {
        if (data.data.data) {
            objResult['data'] = data.data.data;
        }
    })
    return objResult
}
async function getInvoiceOrCreditOfPMCM(page, itemPerPage, type, status = null, customerID = null, paymentID = null) {
    console.log(page, itemPerPage, type, status, customerID, paymentID);
    let typeRes = 1;
    if (type == 'credit')
        typeRes = 2
    let obj = {
        "type": typeRes,
        "paging": {
            "pageSize": itemPerPage,
            "currentPage": page,
            "rowsCount": 0
        }
    }
    if (status) {
        obj["status"] = converStatusPMCM(status)
    }
    if (customerID)
        obj["addressBookId"] = customerID
    let objResult = {}
    let totalMoneyVND = 0
    await database.connectDatabase().then(async db => {
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/list_pmtc`, obj).then(async data => {
            if (data.data.data) {
                let arrayResult = []
                if (paymentID)
                    await mtblPaymentRInvoice(db).findAll({
                        where: {
                            IDPayment: paymentID
                        }
                    }).then(async PayRInv => {
                        for (let item of PayRInv) {
                            let objInvPMCM = await getDetailInvCreOfPMCM(item.IDSpecializedSoftware)
                            data.data.data.list.push(objInvPMCM.data)
                        }
                    })
                for (let item of data.data.data.list) {
                    let refName = ''
                    if (item.refDetailModels)
                        for (let ref = 0; ref < item.refDetailModels.length; ref++) {
                            if (item.refDetailModels[ref].agelessRef) {
                                if (ref < item.refDetailModels.length - 1)
                                    refName += item.refDetailModels[ref].agelessRef + ', ';
                                else
                                    refName += item.refDetailModels[ref].agelessRef;
                            }
                        }
                    let typeMoney = item.grandTotal[0] ? convertypeMoneyPMCM(item.grandTotal[0].unit) : 'VND';
                    let arrayMoney = [{
                        total: item.grandTotal[0] ? item.grandTotal[0].total : 0,
                        typeMoney: typeMoney
                    }];
                    let departmentName = '';
                    let address = '';
                    let branchName = '';
                    let employeeName = '';
                    let staffCode = '';
                    let nameAccounting = '';
                    let payments = '';
                    let payDate = '';
                    let exchangeRate = 1;
                    let totalMoneyDisplay = item.grandTotal[0] ? item.grandTotal[0].total : 0;
                    let paidAmount = 0;
                    let remainingAmount = 0;
                    let paymentAmount = 0;
                    let remainingAmountArray = [{
                        key: typeMoney,
                        value: item.grandTotal[0] ? item.grandTotal[0].total : 0,
                    }];
                    let paidAmountArray = [];
                    if (typeMoney != '')
                        totalMoneyVND += await calculateMoneyFollowVND(db, typeMoney, item.grandTotal[0] ? item.grandTotal[0].total : 0, item.createDate)
                    if (item.userName) {
                        let tblDMUser = mtblDMUser(db);
                        let tblDMNhanvien = mtblDMNhanvien(db);
                        let tblDMBoPhan = mtblDMBoPhan(db);
                        tblDMUser.belongsTo(tblDMNhanvien, { foreignKey: 'IDNhanvien', sourceKey: 'IDNhanvien', as: 'staff' })
                        tblDMNhanvien.belongsTo(tblDMBoPhan, { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'department' })
                        tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh', as: 'branch' })
                        await tblDMUser.findOne({
                            where: {
                                Username: item.userName
                            },
                            include: [{
                                model: tblDMNhanvien,
                                required: false,
                                as: 'staff',
                                include: [{
                                    model: tblDMBoPhan,
                                    required: false,
                                    as: 'department',
                                    include: [{
                                        model: mtblDMChiNhanh(db),
                                        required: false,
                                        as: 'branch'
                                    }, ],
                                }, ],
                            }, ],
                        }).then(user => {
                            departmentName = user.staff ? (user.staff.department ? user.staff.department.DepartmentName : '') : ''
                            branchName = user.staff ? (user.staff.department ? (user.staff.department.branch ? user.staff.department.branch.BranchName : '') : '') : ''
                            address = user.staff ? user.staff.Address : ''
                            employeeName = user.staff ? user.staff.StaffName : ''
                            staffCode = user.staff ? user.staff.StaffCode : ''
                        })
                    }
                    if (item.recondingTxName) {
                        await mtblDMTaiKhoanKeToan(db).findOne({
                            where: {
                                AccountingCode: item.recondingTxName
                            }
                        }).then(account => {
                            if (account) {
                                nameAccounting = account.AccountingName
                            } else {
                                nameAccounting = 'Không có tài khoản này trên hệ thống. Vui lòng cấu hình vào hệ thống!'
                            }
                        })
                    }
                    await mtblInvoice(db).findOne({
                        where: {
                            IDSpecializedSoftware: item.id ? item.id : null
                        }
                    }).then(async invoice => {
                        if (invoice) {
                            payments = invoice.Payments ? invoice.Payments : null;
                            payDate = invoice.PayDate ? moment(invoice.PayDate).format('DD-MM-YYYY') : null;
                            paidAmountArray = [{
                                key: typeMoney,
                                value: invoice.PaidAmount ? invoice.PaidAmount : 0,
                            }]
                            paidAmount = invoice.PaidAmount ? invoice.PaidAmount : 0;
                            await mtblPaymentRInvoice(db).findOne({
                                where: {
                                    IDPayment: paymentID,
                                    IDSpecializedSoftware: item.id ? item.id : null,
                                }
                            }).then(payRInv => {
                                paymentAmount = payRInv ? payRInv.Amount : 0
                            })
                        }
                    })
                    await mtblCurrency(db).findOne({
                            where: {
                                ShortName: typeMoney
                            }
                        }).then(async curency => {
                            if (curency)
                                await mtblRate(db).findOne({
                                    where: {
                                        Date: {
                                            [Op.substring]: moment(item.createDate).format('DD-MM-YYYY')
                                        },
                                        IDCurrency: curency.ID
                                    }
                                }).then(rate => {
                                    if (rate)
                                        exchangeRate = rate.ExchangeRate
                                })
                        })
                        // Số tiền còn lại bằng tổng tiền trừ số tiền đã thanh toán
                    remainingAmount = totalMoneyDisplay - paidAmount;
                    let obj = {
                        id: item.id,
                        createdDate: item.createDate ? moment(item.createDate).format('DD-MM-YYYY') : null,
                        refNumber: refName,
                        address: address,
                        invoiceNumber: item.no ? item.no : '',
                        arrayMoney: arrayMoney,
                        statusName: converStatusPMCM(item.status),
                        idCustomer: item.addressBookId,
                        customerName: item.addressBookName,
                        customerCode: item.code,
                        content: item.note,
                        request: item.status == 3 ? 'Yêu cầu sửa' : (item.status == 4 ? 'Yêu cầu xóa' : ''),
                        departmentName: departmentName,
                        branchName: branchName,
                        accounting: item.recondingTxName ? item.recondingTxName : '',
                        nameAccounting: nameAccounting,
                        employeeName: employeeName,
                        staffName: employeeName,
                        staffcode: staffCode,
                        payDate: payDate,
                        payments: payments,
                        remainingAmountArray: remainingAmountArray,
                        paidAmountArray: paidAmountArray,
                        typeMoney: typeMoney,
                        exchangeRate: exchangeRate,
                        totalMoneyDisplay: totalMoneyDisplay,
                        total: totalMoneyDisplay,
                        paidAmount: paidAmount,
                        remainingAmount: remainingAmount,
                        paymentAmount: paymentAmount,
                    }
                    arrayResult.push(obj)
                }
                objResult['data'] = arrayResult;
                objResult['count'] = data.data.data.pager.rowsCount;
            }
        })
    })

    let totalMoney = await calculateTheTotalAmountOfEachCurrency(objResult['data'] ? objResult['data'] : [])
    var result = {
        array: objResult['data'],
        arrayCreate: objResult['data'],
        arrayUpdate: objResult['data'],
        status: Constant.STATUS.SUCCESS,
        message: Constant.MESSAGE.ACTION_SUCCESS,
        all: objResult['count'],
        totalMoneyVND: totalMoneyVND,
        totalMoney: totalMoney,
    }
    return result
}
async function getDetailInvCreOfPMCM(idInvCre) {
    let objResult = {}
    await axios.get(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/get_by_id_pmtc?id=` + idInvCre).then(async data => {
        if (data.data.data) {
            objResult['data'] = data.data.data;
        }
    })
    return objResult
}
async function paidPMCM(arrayInvCre) {
    await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/paid_pmtc`, arrayInvCre).then(data => {
        console.log(arrayInvCre, data.data, 'result PMCM');
    })
}

function converStatusPMCM(status) {
    let result = status
    if (status == 2)
        result = 'Chờ thanh toán'
    if (status == 3)
        result = 'Yêu cầu sửa'
    if (status == 4)
        result = 'Yêu cầu xóa'
    if (status == 5)
        result = 'Yêu cầu thanh toán'
    if (status == 6)
        result = 'Đã thanh toán'
    if (status == 'Chờ thanh toán')
        result = 5
    if (status == 'Yêu cầu sửa')
        result = 3
    if (status == 'Yêu cầu xóa')
        result = 4
    if (status == 'Yêu cầu thanh toán')
        result = 5
    if (status == 'Đã thanh toán')
        result = 6
    return result
}

function convertypeMoneyPMCM(type) {
    let result = 'VND'
    if (type == 1)
        result = 'USD'
    if (type == 2)
        result = 'EURO'
    if (type == 3)
        result = 'FRANCE'
    if (type == 4)
        result = 'VND'
    return result
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
                    else {

                    }
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
async function getListReceiptOfPMCM(page = null, itemPerPage = null) {
    let obj = {
        "paging": {
            "pageSize": itemPerPage ? itemPerPage : 10000000,
            "currentPage": page ? page : 1,
            "rowsCount": 0
        }
    }
    let objResult = {}
    await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/receipt/list_pmtc`, obj).then(async data => {
        if (data.data.data) {
            let array = []
            for (let item of data.data.data.list) {
                let obj = {
                    id: item.id,
                    invoiceNumber: item.invoiceNo ? item.invoiceNo : '',
                    paymentSACode: item.no ? item.no : '',
                    paymentSAName: item.agelessRef ? item.agelessRef : '',
                    customerName: 'Công ty tnhh Is Tech Vina',
                    partnerID: '2',
                    createdDate: item.createDate ? moment(item.createDate).format('DD-MM-YYYY') : null,
                    content: item.agelessRef ? item.agelessRef : '',
                    total: item.total ? item.total : '',
                    unit: 'VND',
                    statusName: 'Chờ thanh toán',
                    fileAttach: '',
                    // typeVoucher: 'Phiếu chi',
                    // numberVoucher: 'PC0012',
                    note: item.note ? item.note : '',
                }
                array.push(obj)
            }

            objResult['data'] = array;
            objResult['count'] = data.data.data.pager.rowsCount;
        }
    })
    return objResult
}
module.exports = {
    paidPMCM,
    getCustomerOfPMCM,
    getListReceiptOfPMCM,
    getDetailCustomerOfPMCM,
    getDetailInvCreOfPMCM,
    getInvoiceOrCreditOfPMCM,
    test: async(req, res) => {
        let body = req.body;
        try {
            let result = await getListReceiptOfPMCM()
            res.json(result);
        } catch (error) {
            console.log(error);
        }
    },
    // change_customer_data
    changeCustomerData: async(req, res) => {
        let body = req.body;
        try {
            console.log(12345, body);
            var result = {
                status: Constant.STATUS.SUCCESS,
            }
            res.json(result);
        } catch (error) {
            console.log(error);
        }
    },
    // change_invoice_or_credit_data
    changeInvoiceOrCreditData: async(req, res) => {
        let body = req.body;
        try {
            console.log(12345, body);
            var result = {
                status: Constant.STATUS.SUCCESS,
            }
            res.json(result);
        } catch (error) {
            console.log(error);
        }
    },
    // get_list_department
    getListDepartment: async(req, res) => {
        await axios.get(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/department/share`).then(data => {
            if (data) {
                var result = {
                    array: data.data.data,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    all: data.data.data.length
                }
                res.json(result);
            } else {
                ``
                res.json(Result.SYS_ERROR_RESULT)
            }
            // console.log(data.data);
        })
    },
    // get_list_partner
    getListPartner: async(req, res) => {
        // await axios.get(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/address_book/share`).then(data => {
        // console.log(data.data);
        if (dataPartner) {
            var result = {
                array: [],
                // array: data.data.data,
                status: Constant.STATUS.SUCCESS,
                message: Constant.MESSAGE.ACTION_SUCCESS,
                // all: data.data.data.length
                all: 10
            }
            res.json(result);
        } else {
            res.json(Result.SYS_ERROR_RESULT)
        }
        // console.log(data.data);
        // })
    },
    // get_list_customer
    getListCustomer: async(req, res) => {
        let dataCustomer = await getCustomerOfPMCM()
        if (dataCustomer) {
            var result = {
                array: dataCustomer,
                status: Constant.STATUS.SUCCESS,
                message: Constant.MESSAGE.ACTION_SUCCESS,
                all: 10
            }
            res.json(result);
        } else {
            res.json(Result.SYS_ERROR_RESULT)
        }
    },
    // get_list_user
    getListUser: async(req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblDMNhanvien = mtblDMNhanvien(db);
                    tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bp' })

                    tblDMNhanvien.findAll({
                        include: [{
                            model: mtblDMBoPhan(db),
                            required: false,
                            as: 'bp'
                        }, ],
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                staffCode: element.StaffCode ? element.StaffCode : '',
                                fullName: element.StaffName ? element.StaffName : '',
                                departmentName: element.bp ? element.bp.DepartmentName : '',
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
    },
    // get_all_object
    getAllObject: async(req, res) => {
        let body = req.body;
        console.log(body);
        let dataSearch = body.dataSearch ? JSON.parse(body.dataSearch) : {}
        database.connectDatabase().then(async db => {
            if (db) {
                let array = []
                let dataCustomer = await getCustomerOfPMCM(body.page ? body.page : 1, body.itemPerPage ? body.itemPerPage : 100, dataSearch.search ? dataSearch.search : null)
                for (c = 0; c < dataCustomer.data.length; c++) {
                    array.push({
                        name: dataCustomer.data[c].name,
                        address: dataCustomer.data[c].address,
                        code: dataCustomer.data[c].code,
                        displayName: dataCustomer.data[c].code ? '[' + dataCustomer.data[c].code + '] ' + dataCustomer.data[c].name : dataCustomer.data[c].name,
                        id: dataCustomer.data[c].id,
                        type: 'customer',
                    })
                }
                await mtblDMNhanvien(db).findAll().then(data => {
                    data.forEach(element => {
                        array.push({
                            name: element.StaffName,
                            code: element.StaffCode,
                            displayName: '[' + element.StaffCode + '] ' + element.StaffName,
                            address: element.Address,
                            id: element.ID,
                            type: 'staff',
                        })
                    })
                })
                await mtblDMNhaCungCap(db).findAll().then(data => {
                    data.forEach(element => {
                        array.push({
                            name: element.SupplierName,
                            code: element.SupplierCode,
                            displayName: '[' + element.SupplierCode + '] ' + element.SupplierName,
                            address: element.Address,
                            id: element.ID,
                            type: 'supplier',
                        })
                    })
                })
                array.push({
                    name: "Cơ quan nhà nước",
                    code: "CQNN",
                    displayName: `['CQNN'] Cơ Quan Nhà Nước`,
                    address: null,
                    id: null,
                    type: 'CQNN',
                })
                var result = {
                    array: array,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    all: 10
                }
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })

    },

    // Invoice follow customer ------------------------------------------------------------------------------------------------------------------
    // get_list_invoice_from_customer
    getListInvoiceFromCustomer: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page, body.itemPerPage, 'invoice', null, body.idCustomer ? body.idCustomer : null)
        res.json(result)
    },
    // get_list_invoice_wait_for_pay_from_customer
    getListInvoiceWaitForPayFromCustomer: async(req, res) => {
        var body = req.body
        if (body.currencyID) {
            body.page = 1;
            body.itemPerPage = 1000000000;
        }
        console.log(body);
        let result = await getInvoiceOrCreditOfPMCM(body.page ? body.page : 1, body.itemPerPage ? body.itemPerPage : 10, 'invoice', 'Yêu cầu thanh toán', body.idCustomer ? body.idCustomer : null, body.idReceiptPayment ? body.idReceiptPayment : null)
        res.json(result)
    },
    // get_list_invoice_paid_from_customer
    getListInvoicePaidFromCustomer: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page, body.itemPerPage, 'invoice', 'Đã thanh toán', body.idCustomer ? body.idCustomer : null)
        res.json(result)
    },

    // Credit follow customer ------------------------------------------------------------------------------------------------------------------
    // get_list_credit_from_customer
    getListCreditFromCustomer: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page, body.itemPerPage, 'credit', null, body.idCustomer ? body.idCustomer : null)
        res.json(result)
    },
    // get_list_credit_wait_for_pay_from_customer
    getListCreditWaitForPayFromCustomer: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page == 'null' ? 1 : body.page, body.itemPerPage ? body.itemPerPage : 10000, 'credit', 'Yêu cầu thanh toán', body.idCustomer ? body.idCustomer : null)
        res.json(result)
    },
    // get_list_credit_paid_from_customer
    getListCreditPaidFromCustomer: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page, body.itemPerPage, 'credit', 'Đã thanh toán', body.idCustomer ? body.idCustomer : null)
        res.json(result)
    },


    // ------------------------------------------------------------------------------------------------------------------------------------------
    // get_list_invoice_from_partner
    getListInvoiceFromPartner: async(req, res) => {
        var body = req.body
        var obj = {
            "paging": {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
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
    // invoice-------------------------------------------------------------------------------------------------------------------------------------
    // get_list_tbl_invoice
    getListtblInvoice: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page, body.itemPerPage, 'invoice')
        res.json(result)
    },
    // get_list_invoice_wait_for_pay
    getListInvoiceWaitForPay: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page, body.itemPerPage, 'invoice', 'Chờ thanh toán')
        res.json(result)
    },
    // get_list_invoice_paid
    getListInvoicePaid: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page, body.itemPerPage, 'invoice', 'Đã thanh toán')
        res.json(result)
    },
    // get_list_invoice_edit_request
    getListInvoiceEditRequest: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page, body.itemPerPage, 'invoice', 'Yêu cầu sửa')
        res.json(result)
    },
    // get_list_invoice_delete_request
    getListInvoiceDeleteRequest: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page, body.itemPerPage, 'invoice', 'Yêu cầu xóa')
        res.json(result)
    },
    // get_list_invoice_payment_request
    getListInvoicePaymentRequest: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page, body.itemPerPage, 'invoice', 'Yêu thanh toán')
        res.json(result)
    },
    // credit-------------------------------------------------------------------------------------------------------------------------------------
    // get_list_credit
    getListCredit: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page ? body.page : 1, body.itemPerPage ? body.itemPerPage : 10, 'credit')
        res.json(result)
    },
    // get_list_credit_wait_for_pay
    getListCreditWaitForPay: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page ? body.page : 1, body.itemPerPage ? body.itemPerPage : 10, 'credit', 'Chờ thanh toán')
        res.json(result)
    },
    // get_list_credit_paid
    getListCreditPaid: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page ? body.page : 1, body.itemPerPage ? body.itemPerPage : 10, 'credit', 'Đã thanh toán')
        res.json(result)
    },
    // get_list_credit_edit_request
    getListCreditEditRequest: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page ? body.page : 1, body.itemPerPage ? body.itemPerPage : 10, 'credit', 'Yêu cầu sửa')
        res.json(result)
    },
    // get_list_credit_delete_request
    getListCreditDeleteRequest: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page ? body.page : 1, body.itemPerPage ? body.itemPerPage : 10, 'credit', 'Yêu cầu xóa')
        res.json(result)
    },
    // get_list_credit_payment_request
    getListCreditPaymentRequest: async(req, res) => {
        var body = req.body
        let result = await getInvoiceOrCreditOfPMCM(body.page ? body.page : 1, body.itemPerPage ? body.itemPerPage : 10, 'credit', 'Yêu cầu thanh toán')
        res.json(result)
    },
    //  api waiting SoftWare
    // -----------------------------------------------------------------------------------INVOICE-------------------------------------------------------------------------------
    // approval_invoice_and_credit
    approvalInvoiceAndCredit: async(req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                let obj = {
                    "id": body.id,
                    "approve": true,
                    "reason": ""
                }
                await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/approve_pmtc`, obj).then(data => {
                    if (data) {
                        var result = {
                            status: Constant.STATUS.SUCCESS,
                            message: 'Đã phê duyệt thành công',
                        }
                        res.json(result);
                    }
                })
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // refuse_invoice_and_credit
    refuseInvoiceAndCredit: async(req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                let obj = {
                    "id": body.id,
                    "approve": false,
                    "reason": body.reason ? body.reason : ''
                }
                await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/approve_pmtc`, obj).then(data => {
                    if (data) {
                        var result = {
                            status: Constant.STATUS.SUCCESS,
                            message: 'Đã từ chối thành công',
                        }
                        res.json(result);
                    }
                })
            } else {
                res.json(Result.SYS_ERROR_RESULT)

            }
        })

    },
}