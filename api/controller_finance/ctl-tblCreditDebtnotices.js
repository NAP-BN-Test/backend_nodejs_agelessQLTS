const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblCreditDebtnotices = require('../tables/financemanage/tblCreditDebtnotices')
var mtblCreditsAccounting = require('../tables/financemanage/tblCreditsAccounting')
var database = require('../database');
async function deleteRelationshiptblCreditDebtnotices(db, listID) {
    await mtblCreditsAccounting(db).destroy({ where: { IDCreditDebtnotices: { [Op.in]: listID } } })

    await mtblCreditDebtnotices(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblCreditDebtnotices,
    //  get_detail_tbl_credit_debt_notices
    detailtblCreditDebtnotices: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblCreditDebtnotices(db).findOne({ where: { ID: body.id } }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                type: data.Type ? data.Type : '',
                                idCurrency: data.IDCurrency ? data.IDCurrency : null,
                                date: data.Date ? data.Date : null,
                                voucherNumber: data.VoucherNumber ? data.VoucherNumber : '',
                                idCustomer: data.IDCustomer ? data.IDCustomer : null,
                                amount: data.Amount ? data.Amount : null,
                                amountWords: data.AmountWords ? data.AmountWords : '',
                                reason: data.Reason ? data.Reason : '',
                                idManager: data.IDManager ? data.IDManager : null,
                                idAccountant: data.IDAccountant ? data.IDAccountant : null,
                                idTreasurer: data.IDTreasurer ? data.IDTreasurer : null,
                                idEstablishment: data.IDEstablishment ? data.IDEstablishment : null,
                                idSubmitter: data.IDSubmitter ? data.IDSubmitter : null,
                                idPartner: data.IDPartner ? data.IDPartner : null,
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
    // add_tbl_credit_debt_notices
    addtblCreditDebtnotices: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var listCredit = JSON.parse(body.listCredit)
                    var listDebit = JSON.parse(body.listDebit)
                    mtblCreditDebtnotices(db).create({
                        Type: body.type ? body.type : '',
                        IDCurrency: body.idCurrency ? body.idCurrency : null,
                        Date: body.date ? body.date : null,
                        VoucherNumber: body.voucherNumber ? body.voucherNumber : '',
                        IDCustomer: body.idCustomer ? body.idCustomer : null,
                        Amount: body.amount ? body.amount : null,
                        AmountWords: body.amountWords ? body.amountWords : '',
                        Reason: body.reason ? body.reason : '',
                        IDManager: body.idManager ? body.idManager : null,
                        IDAccountant: body.idAccountant ? body.idAccountant : null,
                        IDTreasurer: body.idTreasurer ? body.idTreasurer : null,
                        IDEstablishment: body.idEstablishment ? body.idEstablishment : null,
                        IDSubmitter: body.idSubmitter ? body.idSubmitter : null,
                        IDPartner: body.idPartner ? body.idPartner : null,
                    }).then(async data => {
                        for (var i = 0; i < listCredit.length; i++) {
                            await mtblCreditsAccounting(db).create({
                                IDCreditDebtnotices: data.ID,
                                IDAccounting: listCredit[i].id,
                                Type: "CREDIT",
                                Amount: listCredit[i].amount ? listCredit[i].amount : 0,
                            })
                        }
                        for (var j = 0; j < listDebit.length; j++) {
                            await mtblCreditsAccounting(db).create({
                                IDCreditDebtnotices: data.ID,
                                IDAccounting: listDebit[j].id,
                                Type: "DEBIT",
                                Amount: listDebit[j].amount ? listDebit[j].amount : 0,
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
    // update_tbl_credit_debt_notices
    updatetblCreditDebtnotices: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    var listCredit = JSON.parse(body.listCredit)
                    var listDebit = JSON.parse(body.listDebit)
                    if (listCredit.length > 0 && listDebit > 0) {
                        await mtblCreditsAccounting(db).destroy({ where: { IDCreditDebtnotices: body.id } })
                        for (var i = 0; i < listCredit.length; i++) {
                            await mtblCreditsAccounting(db).create({
                                IDCreditDebtnotices: body.id,
                                IDAccounting: listCredit[i].id,
                                Type: "CREDIT",
                                Amount: listCredit[i].amount ? listCredit[i].amount : 0,
                            })
                        }
                        for (var j = 0; j < listDebit.length; j++) {
                            await mtblCreditsAccounting(db).create({
                                IDCreditDebtnotices: body.id,
                                IDAccounting: listDebit[j].id,
                                Type: "DEBIT",
                                Amount: listDebit[j].amount ? listDebit[j].amount : 0,
                            })
                        }
                    }
                    if (body.type || body.type === '')
                        update.push({ key: 'Type', value: body.type });
                    if (body.voucherNumber || body.voucherNumber === '')
                        update.push({ key: 'VoucherNumber', value: body.voucherNumber });
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
                    if (body.idPartner || body.idPartner === '') {
                        if (body.idPartner === '')
                            update.push({ key: 'IDPartner', value: null });
                        else
                            update.push({ key: 'IDPartner', value: body.idPartner });
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
                    database.updateTable(update, mtblCreditDebtnotices(db), body.id).then(response => {
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
    // delete_tbl_credit_debt_notices
    deletetblCreditDebtnotices: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblCreditDebtnotices(db, listID);
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
    // get_list_tbl_credit_debt_notices
    getListtblCreditDebtnotices: (req, res) => {
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
                    mtblCreditDebtnotices(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                type: data[i].Type ? data[i].Type : '',
                                idCurrency: data[i].IDCurrency ? data[i].IDCurrency : null,
                                date: data[i].Date ? data[i].Date : null,
                                voucherNumber: data[i].VoucherNumber ? data[i].VoucherNumber : '',
                                idCustomer: data[i].IDCustomer ? data[i].IDCustomer : null,
                                amount: data[i].Amount ? data[i].Amount : null,
                                amountWords: data[i].AmountWords ? data[i].AmountWords : '',
                                reason: data[i].Reason ? data[i].Reason : '',
                                idManager: data[i].IDManager ? data[i].IDManager : null,
                                idAccountant: data[i].IDAccountant ? data[i].IDAccountant : null,
                                idTreasurer: data[i].IDTreasurer ? data[i].IDTreasurer : null,
                                idEstablishment: data[i].IDEstablishment ? data[i].IDEstablishment : null,
                                idSubmitter: data[i].IDSubmitter ? data[i].IDSubmitter : null,
                                idPartner: data[i].IDPartner ? data[i].IDPartner : null,
                            }
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblCreditDebtnotices(db).count({ where: whereOjb, })
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
}