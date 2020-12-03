const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMBoPhan = require('../tables/tblDMBoPhan')
var database = require('../database');
async function deleteRelationshiptblDMBoPhan(db, listID) {
    await mtblDMBoPhan(db).destroy({
        where: {
            IDLaborBook: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblDMBoPhan,
    // add_tbl_dm_bophan
    addtblDMBoPhan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMBoPhan(db).create({
                        DepartmentCode: body.departmentCode ? body.departmentCode : '',
                        DepartmentName: body.departmentName ? body.departmentName : '',
                        IDChiNhanh: body.idChiNhanh ? body.idChiNhanh : null,
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
    // update_tbl_dm_bophan
    updatetblDMBoPhan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.departmentCode || body.departmentCode === '')
                        update.push({ key: 'DepartmentCode', value: body.departmentCode });
                    if (body.departmentName || body.departmentName === '')
                        update.push({ key: 'DepartmentName', value: body.departmentName });
                    if (body.idChiNhanh || body.idChiNhanh === '') {
                        if (body.idChiNhanh === '')
                            update.push({ key: 'IDChiNhanh', value: null });
                        else
                            update.push({ key: 'IDChiNhanh', value: body.idChiNhanh });
                    }
                    database.updateTable(update, mtblDMBoPhan(db), body.id).then(response => {
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
    // delete_tbl_dm_bophan
    deletetblDMBoPhan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDMBoPhan(db, listID);
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
    // get_list_tbl_dm_bophan
    getListtblDMBoPhan: (req, res) => {
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
                    mtblDMBoPhan(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                departmentCode: element.DepartmentCode ? element.DepartmentCode : '',
                                departmentName: element.DepartmentName ? element.DepartmentName : '',
                                idChiNhanh: element.IDChiNhanh ? element.IDChiNhanh : null,
                            }
                            array.push(obj);
                        });
                        var count = await mtblDMBoPhan(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_dm_bophan
    getListNametblDMBoPhan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMBoPhan(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                departmentName: element.DepartmentName ? element.DepartmentName : '',
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