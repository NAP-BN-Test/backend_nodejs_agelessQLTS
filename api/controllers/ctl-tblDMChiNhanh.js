const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMChiNhanh = require('../tables/tblDMChiNhanh')
var mtblDMBoPhan = require('../tables/tblDMBoPhan')
var database = require('../database');
async function deleteRelationshiptblDMChiNhanh(db, listID) {
    await mtblDMBoPhan(db).update({
        IDChiNhanh: null
    }, {
        where: {
            IDChiNhanh: { [Op.in]: listID }
        }
    })
    await mtblDMChiNhanh(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblDMChiNhanh,
    // add_tbl_dm_chinhanh
    addtblDMChiNhanh: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMChiNhanh(db).create({
                        BranchCode: body.branchCode ? body.branchCode : '',
                        BranchName: body.branchName ? body.branchName : '',
                        Address: body.address ? body.address : '',
                        PhoneNumber: body.phoneNumber ? body.phoneNumber : '',
                        FaxNumber: body.faxNumber ? body.faxNumber : '',
                        Email: body.email ? body.email : '',
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
    // update_tbl_dm_chinhanh
    updatetblDMChiNhanh: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.branchCode || body.branchCode === '')
                        update.push({ key: 'BranchCode', value: body.branchCode });
                    if (body.branchName || body.branchName === '')
                        update.push({ key: 'BranchName', value: body.branchName });
                    if (body.address || body.address === '')
                        update.push({ key: 'Address', value: body.address });
                    if (body.phoneNumber || body.phoneNumber === '')
                        update.push({ key: 'PhoneNumber', value: body.phoneNumber });
                    if (body.faxNumber || body.faxNumber === '')
                        update.push({ key: 'FaxNumber', value: body.faxNumber });
                    if (body.email || body.email === '')
                        update.push({ key: 'Email', value: body.email });
                    database.updateTable(update, mtblDMChiNhanh(db), body.id).then(response => {
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
    // delete_tbl_dm_chinhanh
    deletetblDMChiNhanh: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDMChiNhanh(db, listID);
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
    // get_list_tbl_dm_chinhanh
    getListtblDMChiNhanh: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            where = [
                                { FullName: { [Op.like]: '%' + data.search + '%' } },
                                { Address: { [Op.like]: '%' + data.search + '%' } },
                                { CMND: { [Op.like]: '%' + data.search + '%' } },
                                { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
                            ];
                        } else {
                            where = [
                                { FullName: { [Op.ne]: '%%' } },
                            ];
                        }
                        let whereOjb = { [Op.or]: where };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                                    userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                            }
                        }
                    }
                    mtblDMChiNhanh(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                branchCode: body.BranchCode ? body.BranchCode : '',
                                branchName: body.BranchName ? body.BranchName : '',
                                address: body.Address ? body.Address : '',
                                phoneNumber: body.PhoneNumber ? body.PhoneNumber : '',
                                faxNumber: body.FaxNumber ? body.FaxNumber : '',
                                email: body.Email ? body.Email : '',
                            }
                            array.push(obj);
                        });
                        var count = await mtblDMChiNhanh(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_dm_chinhanh
    getListNametblDMChiNhanh: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMChiNhanh(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                branchName: element.BranchName ? element.BranchName : '',
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