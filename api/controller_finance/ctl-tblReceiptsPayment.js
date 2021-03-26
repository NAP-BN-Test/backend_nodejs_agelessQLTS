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
module.exports = {
    deleteRelationshiptblReceiptsPayment,
    //  get_detail_tbl_receipts_payment
    detailtblReceiptsPayment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblReceiptsPayment(db).findOne({ where: { ID: body.id } }).then(async data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                type: data.Type ? data.Type : '',
                                idCurrency: data.IDCurrency ? data.IDCurrency : null,
                                date: data.Date ? data.Date : null,
                                idCustomer: data.IDCustomer ? data.IDCustomer : null,
                                address: data.Address ? data.Address : '',
                                amount: data.Amount ? data.Amount : null,
                                amountWords: data.AmountWords ? data.AmountWords : '',
                                reson: data.Reson ? data.Reson : '',
                                idManager: data.IDManager ? data.IDManager : null,
                                idAccountant: data.IDAccountant ? data.IDAccountant : null,
                                idTreasurer: data.IDTreasurer ? data.IDTreasurer : null,
                                idEstablishment: data.IDEstablishment ? data.IDEstablishment : null,
                                idSubmitter: data.IDSubmitter ? data.IDSubmitter : null,
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
                                        amount: item.Account,
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
                                        amount: item.Account,
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
                    mtblReceiptsPayment(db).create({
                        Type: body.type ? body.type : '',
                        IDCurrency: body.idCurrency ? body.idCurrency : null,
                        Date: body.date ? body.date : null,
                        IDCustomer: body.idCustomer ? body.idCustomer : null,
                        Address: body.address ? body.address : '',
                        Amount: body.amount ? body.amount : null,
                        AmountWords: body.amountWords ? body.amountWords : '',
                        Reson: body.reson ? body.reson : '',
                        IDManager: body.idManager ? body.idManager : null,
                        IDAccountant: body.idAccountant ? body.idAccountant : null,
                        IDTreasurer: body.idTreasurer ? body.idTreasurer : null,
                        IDEstablishment: body.idEstablishment ? body.idEstablishment : null,
                        IDSubmitter: body.idSubmitter ? body.idSubmitter : null,
                    }).then(async data => {
                        for (var i = 0; i < listCredit.length; i++) {
                            await mtblPaymentAccounting(db).create({
                                IDReceiptsPayment: data.ID,
                                IDAccounting: listCredit[i].id,
                                Type: "CREDIT",
                                Amount: listCredit[i].amount ? listCredit[i].amount : 0,
                            })
                        }
                        for (var j = 0; j < listDebit.length; j++) {
                            await mtblPaymentAccounting(db).create({
                                IDReceiptsPayment: data.ID,
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
                                IDAccounting: listCredit[i].id,
                                Type: "CREDIT",
                                Amount: listCredit[i].amount ? listCredit[i].amount : 0,
                            })
                        }
                        for (var j = 0; j < listDebit.length; j++) {
                            await mtblPaymentAccounting(db).create({
                                IDReceiptsPayment: body.id,
                                IDAccounting: listDebit[j].id,
                                Type: "DEBIT",
                                Amount: listDebit[j].amount ? listDebit[j].amount : 0,
                            })
                        }
                    }
                    if (body.type || body.type === '')
                        update.push({ key: 'Type', value: body.type });
                    if (body.address || body.address === '')
                        update.push({ key: 'Address', value: body.address });
                    if (body.amountWords || body.amountWords === '')
                        update.push({ key: 'AmountWords', value: body.amountWords });
                    if (body.reson || body.reson === '')
                        update.push({ key: 'Reson', value: body.reson });
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
                        where: whereOjb,
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
                                idCurrency: data[i].IDCurrency ? data[i].IDCurrency : null,
                                date: data[i].Date ? data[i].Date : null,
                                idCustomer: data[i].IDCustomer ? data[i].IDCustomer : null,
                                nameSpecializedSoftware: '',
                                address: data[i].Address ? data[i].Address : '',
                                amount: data[i].Amount ? data[i].Amount : null,
                                amountWords: data[i].AmountWords ? data[i].AmountWords : '',
                                reson: data[i].Reson ? data[i].Reson : '',
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
                                        nameAccount: acc.AccountingCode,
                                        amount: item.Account,
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
                                    IDReceiptsPayment: data[i].ID,
                                    type: "DEBIT"
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    arraydebit.push({
                                        nameAccount: acc.AccountingCode,
                                        amount: item.Account,
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
                                Reson: element.Reson ? element.Reson : '',
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