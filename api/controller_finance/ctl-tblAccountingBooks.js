const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblAccountingBooks = require('../tables/financemanage/tblAccountingBooks')
var database = require('../database');
var mModules = require('../constants/modules');
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')
var mtblCreditDebtnotices = require('../tables/financemanage/tblCreditDebtnotices')

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
                            await tblAccountingBooks.findAll({
                                where: {
                                    [Op.and]: [{
                                        [Op.or]: arrayWhere
                                    },
                                    {
                                        ID: {
                                            [Op.ne]: data[i].ID
                                        }
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
                            }).then(accounting => {
                                if (accounting) {
                                    accounting.forEach(item => {
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
                                            creditIncurred: item.CreditIncurred ? item.CreditIncurred : null,
                                            debtIncurred: item.DebtIncurred ? item.DebtIncurred : null,
                                            debtSurplus: item.DebtSurplus ? item.DebtSurplus : null,
                                            creaditSurplus: item.CreaditSurplus ? item.CreaditSurplus : null,
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
                                    })
                                }
                            })
                        }
                        let accountBooks = await mtblDMTaiKhoanKeToan(db).findOne({
                            where: {
                                ID: dataSearch.accountSystemID
                            }
                        })
                        console.log(dataSearch.accountSystemID, accountBooks);
                        var count = await mtblAccountingBooks(db).count({ where: whereOjb, })
                        arisingPeriod = totalDebtIncurred - totalCreditIncurred;
                        openingBalanceDebit = accountBooks ? accountBooks.MoneyDebit : 0
                        openingBalanceCredit = accountBooks ? accountBooks.MoneyCredit : 0
                        endingBalanceDebit = openingBalanceDebit + (totalDebtIncurred - totalCreditIncurred)
                        endingBalanceCredit = openingBalanceCredit + (totalDebtIncurred - totalCreditIncurred)
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

}