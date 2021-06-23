const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMTaiKhoanKeToan = require('../tables/financemanage/tblDMTaiKhoanKeToan')
var mtblDMLoaiTaiKhoanKeToan = require('../tables/financemanage/tblDMLoaiTaiKhoanKeToan')
var database = require('../database');
var mtblCreditsAccounting = require('../tables/financemanage/tblCreditsAccounting')
var mtblPaymentAccounting = require('../tables/financemanage/tblPaymentAccounting')
var mtblAccountingBooks = require('../tables/financemanage/tblAccountingBooks')
async function deleteRelationshiptblDMTaiKhoanKeToan(db, listID) {
    let IDLevelAbove = []
    await mtblDMTaiKhoanKeToan(db).findAll({
        where: {
            IDLevelAbove: listID
        }
    }).then(data => {
        data.forEach(item => {
            IDLevelAbove.push(Number(item.ID))
        })
    })
    await mtblCreditsAccounting(db).update({
        IDAccounting: null
    }, {
        where: {
            IDAccounting: listID
        }
    })
    await mtblCreditsAccounting(db).update({
        IDAccounting: null
    }, {
        where: {
            IDAccounting: { [Op.in]: IDLevelAbove }
        }
    })
    await mtblPaymentAccounting(db).update({
        IDAccounting: null
    }, {
        where: {
            IDAccounting: listID
        }
    })
    await mtblPaymentAccounting(db).update({
        IDAccounting: null
    }, {
        where: {
            IDAccounting: { [Op.in]: IDLevelAbove }
        }
    })
    await mtblAccountingBooks(db).destroy({
        where: {
            IDAccounting: { [Op.in]: IDLevelAbove }
        }
    })
    await mtblAccountingBooks(db).destroy({
        where: {
            IDAccounting: listID
        }
    })
    await mtblDMTaiKhoanKeToan(db).destroy({
        where: {
            IDLevelAbove: listID
        }
    })
    await mtblDMTaiKhoanKeToan(db).destroy({
        where: {
            ID: listID
        }
    })
}

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
            ['ID', 'DESC']
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
            })
        }
    })
    return result
}

module.exports = {
    deleteRelationshiptblDMTaiKhoanKeToan,
    // add_tbl_dm_taikhoanketoan
    addtblDMTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let check = await mtblDMTaiKhoanKeToan(db).findOne({
                        where: {
                            AccountingCode: body.accountingCode,
                        }
                    })
                    if (check) {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: "Mã tài khoản kế toán đã tồn tại. Vui lòng kiểm tra lại !",
                        }
                        res.json(result);
                        return
                    }
                    mtblDMTaiKhoanKeToan(db).create({
                        AccountingCode: body.accountingCode ? body.accountingCode : '',
                        AccountingName: body.accountingName ? body.accountingName : '',
                        IDLoaiTaiKhoanKeToan: body.idLoaiTaiKhoanKeToan ? body.idLoaiTaiKhoanKeToan : null,
                        Levels: body.levels ? body.levels : 1,
                        IDLevelAbove: body.idLevelAbove ? body.idLevelAbove : null,
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
    // update_tbl_dm_taikhoanketoan
    updatetblDMTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.accountingCode || body.accountingCode === '')
                        update.push({ key: 'AccountingCode', value: body.accountingCode });
                    if (body.accountingName || body.accountingName === '')
                        update.push({ key: 'AccountingName', value: body.accountingName });
                    if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
                        if (body.idLoaiTaiKhoanKeToan === '')
                            update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
                        else
                            update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
                    }
                    database.updateTable(update, mtblDMTaiKhoanKeToan(db), body.id).then(response => {
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
    // delete_tbl_dm_taikhoanketoan
    deletetblDMTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await deleteRelationshiptblDMTaiKhoanKeToan(db, body.listID);
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
    // get_list_tbl_dm_taikhoanketoan
    getListtblDMTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereObj = {};
                    let arraySearchAnd = [];
                    let arraySearchOr = [];
                    let arraySearchNot = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)
                        var list = [];
                        await mtblDMLoaiTaiKhoanKeToan(db).findAll({
                            order: [
                                ['ID', 'DESC']
                            ],
                            where:
                            {
                                TypeName: {
                                    [Op.like]: '%' + data.search + '%'
                                }
                            }
                        }).then(data => {
                            data.forEach(item => {
                                list.push(item.ID);
                            })
                        })
                        if (data.search) {
                            where = {
                                [Op.or]: [{
                                    IDLoaiTaiKhoanKeToan: {
                                        [Op.in]: list
                                    }
                                },
                                {
                                    AccountingName: {
                                        [Op.like]: '%' + data.search + '%'
                                    }
                                },
                                {
                                    AccountingCode: {
                                        [Op.like]: '%' + data.search + '%'
                                    }
                                }
                                ]
                            };
                        } else {
                            where = [{
                                ID: {
                                    [Op.ne]: null
                                }
                            },];
                        }
                        whereObj[Op.and] = where
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'TÊN TÀI KHOẢN') {
                                    userFind['AccountingName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'MÃ TÀI KHOẢN') {
                                    userFind['AccountingCode'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'LOẠI TÀI KHOẢN') {
                                    userFind['IDLoaiTaiKhoanKeToan'] = data.items[i]['searchFields'].id
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                            }
                        }
                        arraySearchAnd.push({ Levels: 1 })
                        if (arraySearchOr.length > 0)
                            whereObj[Op.or] = arraySearchOr
                        if (arraySearchAnd.length > 0)
                            whereObj[Op.and] = arraySearchAnd
                        if (arraySearchNot.length > 0)
                            whereObj[Op.not] = arraySearchNot
                    }
                    let stt = 1;
                    let tblDMTaiKhoanKeToan = mtblDMTaiKhoanKeToan(db);
                    tblDMTaiKhoanKeToan.belongsTo(mtblDMLoaiTaiKhoanKeToan(db), { foreignKey: 'IDLoaiTaiKhoanKeToan', sourceKey: 'IDLoaiTaiKhoanKeToan', as: 'Loai' })
                    tblDMTaiKhoanKeToan.findAll({
                        include: [
                            {
                                model: mtblDMLoaiTaiKhoanKeToan(db),
                                required: false,
                                as: 'Loai'
                            },
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereObj,
                        order: [
                            ['ID', 'ASC']
                        ],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            var arrayChildern2 = []
                            arrayChildern2 = await findAcountingFollowLevel(db, 2, data[i].ID)
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
                                    children: arrayChildern2
                                }
                            }
                            array.push(obj)

                        }
                        var count = await mtblDMTaiKhoanKeToan(db).count({ where: whereObj, })
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
    // get_list_name_tbl_dm_taikhoanketoan
    getListNametblDMTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMTaiKhoanKeToan(db).findAll({
                        order: [
                            ['ID', 'ASC']
                        ],
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                accountingName: element.AccountingName ? element.AccountingName : '',
                                accountingCode: element.AccountingCode ? element.AccountingCode : '',
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
    // get_list_loan_advance_accounting
    getListAdvanceLoanAccouting: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMTaiKhoanKeToan(db).findAll({
                        order: [
                            ['ID', 'ASC']
                        ],
                        where: {
                            AccountingCode: { [Op.in]: ['111', '112', '152'] }
                        }
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                accountingName: element.AccountingName ? element.AccountingName : '',
                                accountingCode: element.AccountingCode ? element.AccountingCode : '',
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
    // get_list_reimbursement_accounting
    getListReimbursementAccouting: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMTaiKhoanKeToan(db).findAll({
                        order: [
                            ['ID', 'ASC']
                        ],
                        where: {
                            AccountingCode: { [Op.in]: ['111', '334', '152'] }
                        }
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                accountingName: element.AccountingName ? element.AccountingName : '',
                                accountingCode: element.AccountingCode ? element.AccountingCode : '',
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