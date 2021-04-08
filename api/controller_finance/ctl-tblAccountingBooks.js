const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblAccountingBooks = require('../tables/financemanage/tblAccountingBooks')
var database = require('../database');
async function deleteRelationshiptblAccountingBooks(db, listID) {
    await mtblAccountingBooks(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
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
        console.log(body);
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
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    whereOjb.push({ IDAccounting: { [Op.in]: arrayIDAccount } })
                    let stt = 1;
                    mtblAccountingBooks(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                numberReceipts: element.NumberReceipts ? element.NumberReceipts : '',
                                createDate: element.CreateDate ? element.CreateDate : null,
                                entryDate: element.EntryDate ? element.EntryDate : null,
                                number: element.Number ? element.Number : '',
                                reason: element.Reason ? element.Reason : '',
                                idAccounting: element.IDAccounting ? element.IDAccounting : null,
                                debtIncurred: element.DebtIncurred ? element.DebtIncurred : null,
                                creditIncurred: element.CreditIncurred ? element.CreditIncurred : null,
                                debtSurplus: element.DebtSurplus ? element.DebtSurplus : null,
                                creaditSurplus: element.CreaditSurplus ? element.CreaditSurplus : null,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblAccountingBooks(db).count({ where: whereOjb, })
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