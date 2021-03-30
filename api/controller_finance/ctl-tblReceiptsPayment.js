const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')
var mtblPaymentAccounting = require('../tables/financemanage/tblPaymentAccounting')
var database = require('../database');
var mtblDMTaiKhoanKeToan = require('../tables/financemanage/tblDMTaiKhoanKeToan')

async function deleteRelationshiptblReceiptsPayment(db, listID) {
    await mtblPaymentAccounting(db).destroy({ where: { IDReceiptsPayment: { [Op.in]: listID } } })

    await mtblReceiptsPayment(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
async function handleCodeNumber(str) {
    var endCode = '';
    if ((Number(str.slice(2, 10)) + 1) < 10)
        endCode = '000' + (Number(str.slice(2, 10)) + 1)
    if ((Number(str.slice(2, 10)) + 1) >= 10 && (Number(str.slice(2, 10)) + 1) < 100)
        endCode = '00' + (Number(str.slice(2, 10)) + 1)
    if ((Number(str.slice(2, 10)) + 1) >= 100 && (Number(str.slice(2, 10)) + 1) < 1000)
        endCode = '0' + (Number(str.slice(2, 10)) + 1)
    if ((Number(str.slice(2, 10)) + 1) >= 1000)
        endCode = '' + (Number(str.slice(2, 10)) + 1)

    return str.slice(0, 2) + endCode
}

module.exports = {
    deleteRelationshiptblReceiptsPayment,
    //  get_detail_tbl_receipts_payment
    detailtblReceiptsPayment: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblReceiptsPayment(db).findOne({ where: { ID: body.id } }).then(async data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                type: data.Type ? data.Type : '',
                                codeNumber: data.CodeNumber ? data.CodeNumber : '',
                                idCurrency: data.IDCurrency ? data.IDCurrency : null,
                                date: data.Date ? data.Date : null,
                                idCustomer: data.IDCustomer ? data.IDCustomer : null,
                                address: data.Address ? data.Address : '',
                                amount: data.Amount ? data.Amount : null,
                                amountWords: data.AmountWords ? data.AmountWords : '',
                                reason: data.Reason ? data.Reason : '',
                                idManager: data.IDManager ? data.IDManager : null,
                                idAccountant: data.IDAccountant ? data.IDAccountant : null,
                                idTreasurer: data.IDTreasurer ? data.IDTreasurer : null,
                                idEstablishment: data.IDEstablishment ? data.IDEstablishment : null,
                                idSubmitter: data.IDSubmitter ? data.IDSubmitter : null,
                                licenseNumber: data.LicenseNumber ? data.LicenseNumber : '',
                                licenseDate: data.LicenseDate ? data.LicenseDate : null,
                            }
                            let arrayCredit = []
                            let arraydebit = []
                            let tblPaymentAccounting = mtblPaymentAccounting(db);
                            tblPaymentAccounting.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDAccounting', sourceKey: 'IDAccounting', as: 'acc' })
                            await tblPaymentAccounting.findAll({
                                include: [
                                    {
                                        model: mtblDMTaiKhoanKeToan(db),
                                        required: false,
                                        as: 'acc'
                                    },
                                ],
                                where: {
                                    IDReceiptsPayment: data.ID,
                                    type: "CREDIT"
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    arrayCredit.push({
                                        nameAccount: acc.AccountingCode,
                                        amountOfMoney: item.Amount,
                                    })
                                })
                            })
                            tblPaymentAccounting.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDAccounting', sourceKey: 'IDAccounting', as: 'acc' })
                            await tblPaymentAccounting.findAll({
                                include: [
                                    {
                                        model: mtblDMTaiKhoanKeToan(db),
                                        required: false,
                                        as: 'acc'
                                    },
                                ],
                                where: {
                                    IDReceiptsPayment: data.ID,
                                    type: "DEBIT"
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    arraydebit.push({
                                        nameAccount: acc.AccountingCode,
                                        amountOfMoney: item.Amount,
                                    })
                                })
                            })
                            obj['arrayCredit'] = arrayCredit
                            obj['arraydebit'] = arraydebit
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
    // add_tbl_receipts_payment
    addtblReceiptsPayment: (req, res) => {
        let body = req.body;
        var listCredit = JSON.parse(body.listCredit)
        var listDebit = JSON.parse(body.listDebit)
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    if (body.licenseNumber)
                        var check = await mtblReceiptsPayment(db).findOne({
                            where: { VoucherNumber: body.voucherNumber }
                        })
                    if (check) {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: "Số chứng từ đã tồn tại",
                        }
                        res.json(result);
                        return
                    }
                    var check = await mtblReceiptsPayment(db).findOne({
                        order: [
                            ['CodeNumber', 'ASC']
                        ],
                        where: {
                            Type: body.type,
                        }
                    })
                    var codeNumber = '';
                    var automaticCode = '';
                    if (!check && body.type == 'receipt') {
                        codeNumber = 'PT0001'
                    } else if (!check && body.type == 'payment') {
                        codeNumber = 'PC0001'
                    } else {
                        automaticCode = await handleCodeNumber(check.CodeNumber)
                    }
                    mtblReceiptsPayment(db).create({
                        Type: body.type ? body.type : '',
                        CodeNumber: automaticCode,
                        IDCurrency: body.idCurrency ? body.idCurrency : null,
                        Date: body.date ? body.date : null,
                        IDCustomer: body.idCustomer ? body.idCustomer : null,
                        Address: body.address ? body.address : '',
                        Amount: body.amount ? body.amount : null,
                        AmountWords: body.amountWords ? body.amountWords : '',
                        Reason: body.reason ? body.reason : '',
                        IDManager: body.idManager ? body.idManager : null,
                        IDAccountant: body.idAccountant ? body.idAccountant : null,
                        IDTreasurer: body.idTreasurer ? body.idTreasurer : null,
                        IDEstablishment: body.idEstablishment ? body.idEstablishment : null,
                        IDSubmitter: body.idSubmitter ? body.idSubmitter : null,
                        VoucherNumber: body.voucherNumber ? body.voucherNumber : null,
                        VoucherDate: body.voucherDate ? body.voucherDate : null,
                    }).then(async data => {
                        for (var i = 0; i < listCredit.length; i++) {
                            await mtblPaymentAccounting(db).create({
                                IDReceiptsPayment: data.ID,
                                IDAccounting: listCredit[i].hasAccount.id,
                                Type: "CREDIT",
                                Amount: listCredit[i].amountOfMoney ? listCredit[i].amountOfMoney : 0,
                            })
                        }
                        for (var j = 0; j < listDebit.length; j++) {
                            await mtblPaymentAccounting(db).create({
                                IDReceiptsPayment: data.debtAccount.ID,
                                IDAccounting: listDebit[j].hasAccount.id,
                                Type: "DEBIT",
                                Amount: listDebit[j].amountOfMoney ? listDebit[j].amountOfMoney : 0,
                            })
                        }
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
    // update_tbl_receipts_payment
    updatetblReceiptsPayment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    var listCredit = JSON.parse(body.listCredit)
                    var listDebit = JSON.parse(body.listDebit)
                    if (listCredit.length > 0 && listDebit > 0) {
                        await mtblPaymentAccounting(db).destroy({ where: { IDReceiptsPayment: body.id } })
                        for (var i = 0; i < listCredit.length; i++) {
                            await mtblPaymentAccounting(db).create({
                                IDReceiptsPayment: body.id,
                                IDAccounting: listCredit[i].hasAccount.id,
                                Type: "CREDIT",
                                Amount: listCredit[i].amountOfMoney ? listCredit[i].amountOfMoney : 0,
                            })
                        }
                        for (var j = 0; j < listDebit.length; j++) {
                            await mtblPaymentAccounting(db).create({
                                IDReceiptsPayment: body.id,
                                IDAccounting: listDebit[j].debtAccount.id,
                                Type: "DEBIT",
                                Amount: listDebit[j].amountOfMoney ? listDebit[j].amountOfMoney : 0,
                            })
                        }
                    }
                    if (body.licenseNumber)
                        var check = await mtblReceiptsPayment(db).findOne({
                            LicenseNumber: body.licenseNumber
                        })
                    if (check) {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: "Số chứng từ đã tồn tại",
                        }
                        res.json(result);
                        return
                    }
                    if (body.type || body.type === '')
                        update.push({ key: 'Type', value: body.type });
                    if (body.voucherNumber || body.voucherNumber === '')
                        update.push({ key: 'VoucherNumber', value: body.voucherNumber });
                    if (body.address || body.address === '')
                        update.push({ key: 'Address', value: body.address });
                    if (body.amountWords || body.amountWords === '')
                        update.push({ key: 'AmountWords', value: body.amountWords });
                    if (body.reason || body.reason === '')
                        update.push({ key: 'Reason', value: body.reason });
                    if (body.idCurrency || body.idCurrency === '') {
                        if (body.idCurrency === '')
                            update.push({ key: 'IDCurrency', value: null });
                        else
                            update.push({ key: 'IDCurrency', value: body.idCurrency });
                    }
                    if (body.voucherDate || body.voucherDate === '') {
                        if (body.voucherDate === '')
                            update.push({ key: 'VoucherDate', value: null });
                        else
                            update.push({ key: 'VoucherDate', value: body.voucherDate });
                    }
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    if (body.idCustomer || body.idCustomer === '') {
                        if (body.idCustomer === '')
                            update.push({ key: 'IDCustomer', value: null });
                        else
                            update.push({ key: 'IDCustomer', value: body.idCustomer });
                    }
                    if (body.amount || body.amount === '') {
                        if (body.amount === '')
                            update.push({ key: 'Amount', value: null });
                        else
                            update.push({ key: 'Amount', value: body.amount });
                    }
                    if (body.idManager || body.idManager === '') {
                        if (body.idManager === '')
                            update.push({ key: 'IDManager', value: null });
                        else
                            update.push({ key: 'IDManager', value: body.idManager });
                    }
                    if (body.idAccountant || body.idAccountant === '') {
                        if (body.idAccountant === '')
                            update.push({ key: 'IDAccountant', value: null });
                        else
                            update.push({ key: 'IDAccountant', value: body.idAccountant });
                    }
                    if (body.idTreasurer || body.idTreasurer === '') {
                        if (body.idTreasurer === '')
                            update.push({ key: 'IDTreasurer', value: null });
                        else
                            update.push({ key: 'IDTreasurer', value: body.idTreasurer });
                    }
                    if (body.idEstablishment || body.idEstablishment === '') {
                        if (body.idEstablishment === '')
                            update.push({ key: 'IDEstablishment', value: null });
                        else
                            update.push({ key: 'IDEstablishment', value: body.idEstablishment });
                    }
                    if (body.idSubmitter || body.idSubmitter === '') {
                        if (body.idSubmitter === '')
                            update.push({ key: 'IDSubmitter', value: null });
                        else
                            update.push({ key: 'IDSubmitter', value: body.idSubmitter });
                    }
                    database.updateTable(update, mtblReceiptsPayment(db), body.id).then(response => {
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
    // delete_tbl_receipts_payment
    deletetblReceiptsPayment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblReceiptsPayment(db, listID);
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
    // get_list_tbl_receipts_payment
    getListtblReceiptsPayment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    // if (body.dataSearch) {
                    //     var data = JSON.parse(body.dataSearch)

                    //     if (data.search) {
                    //         where = [
                    //             { FullName: { [Op.like]: '%' + data.search + '%' } },
                    //             { Address: { [Op.like]: '%' + data.search + '%' } },
                    //             { CMND: { [Op.like]: '%' + data.search + '%' } },
                    //             { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
                    //         ];
                    //     } else {
                    //         where = [
                    //             { FullName: { [Op.ne]: '%%' } },
                    //         ];
                    //     }
                    //     whereOjb = {
                    //         [Op.and]: [{ [Op.or]: where }],
                    //         [Op.or]: [{ ID: { [Op.ne]: null } }],
                    //     };
                    //     if (data.items) {
                    //         for (var i = 0; i < data.items.length; i++) {
                    //             let userFind = {};
                    //             if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                    //                 userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                    //                 if (data.items[i].conditionFields['name'] == 'And') {
                    //                     whereOjb[Op.and].push(userFind)
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Or') {
                    //                     whereOjb[Op.or].push(userFind)
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Not') {
                    //                     whereOjb[Op.not] = userFind
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                    let stt = 1;
                    mtblReceiptsPayment(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        // where: { Type: body.type },
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                type: data[i].Type ? data[i].Type : '',
                                codeNumber: data[i].CodeNumber ? data[i].CodeNumber : '',
                                voucherNumber: data[i].VoucherNumber ? data[i].VoucherNumber : '',
                                voucherDate: data[i].VoucherDate ? data[i].VoucherDate : null,
                                idCurrency: data[i].IDCurrency ? data[i].IDCurrency : null,
                                date: data[i].Date ? data[i].Date : null,
                                idCustomer: data[i].IDCustomer ? data[i].IDCustomer : null,
                                nameSpecializedSoftware: '',
                                address: data[i].Address ? data[i].Address : '',
                                amount: data[i].Amount ? data[i].Amount : null,
                                amountWords: data[i].AmountWords ? data[i].AmountWords : '',
                                reason: data[i].Reason ? data[i].Reason : '',
                                idManager: data[i].IDManager ? data[i].IDManager : null,
                                idManager: '',
                                idAccountant: data[i].IDAccountant ? data[i].IDAccountant : null,
                                nameAccountant: '',
                                idTreasurer: data[i].IDTreasurer ? data[i].IDTreasurer : null,
                                nameTreasurer: '',
                                idEstablishment: data[i].IDEstablishment ? data[i].IDEstablishment : null,
                                nameEstablishment: '',
                                idSubmitter: data[i].IDSubmitter ? data[i].IDSubmitter : null,
                                nameSubmitter: '',
                            }
                            let arrayCredit = []
                            let arraydebit = []
                            let tblPaymentAccounting = mtblPaymentAccounting(db);
                            tblPaymentAccounting.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDAccounting', sourceKey: 'IDAccounting', as: 'acc' })
                            await tblPaymentAccounting.findAll({
                                include: [
                                    {
                                        model: mtblDMTaiKhoanKeToan(db),
                                        required: false,
                                        as: 'acc'
                                    },
                                ],
                                where: {
                                    IDReceiptsPayment: data[i].ID,
                                    type: "CREDIT"
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    arrayCredit.push({
                                        nameAccount: item.acc ? item.acc.AccountingCode : '',
                                        amountOfMoney: item.Amount,
                                    })
                                })
                            })
                            await tblPaymentAccounting.findAll({
                                include: [
                                    {
                                        model: mtblDMTaiKhoanKeToan(db),
                                        required: false,
                                        as: 'acc'
                                    },
                                ],
                                where: {
                                    IDReceiptsPayment: data[i].ID,
                                    type: "DEBIT"
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    arraydebit.push({
                                        nameAccount: item.acc ? item.acc.AccountingCode : '',
                                        amountOfMoney: item.Amount,
                                    })
                                })
                            })
                            obj['arrayCredit'] = arrayCredit
                            obj['arraydebit'] = arraydebit
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblReceiptsPayment(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_receipts_payment
    getListNametblReceiptsPayment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblReceiptsPayment(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                Reason: element.Reason ? element.Reason : '',
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
    // get_list_receipts_payment_unknown
    getListReceiptsPaymentUnknown: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    mtblReceiptsPayment(db).findAll({
                        where: { IDCustomer: body.idCustomer },
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                codeNumber: data[i].CodeNumber ? data[i].CodeNumber : '',
                                amount: data[i].Amount ? data[i].Amount : '',
                                type: "Phiếu thu",
                            }
                            array.push(obj);
                            stt += 1;
                        }
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
}