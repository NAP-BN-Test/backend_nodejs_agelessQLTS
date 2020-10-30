const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mBranchManagement = require('../tables/branch-management')
var database = require('../database');
async function deleteRelationshipBranchManagement(db, listID) {
    await mBranchManagement(db).destroy({
        where: {
            IDLaborBook: { [Op.in]: listID }
        }
    })
}
module.exports = {
    // add_branch_management
    addBranchManagement: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    mBranchManagement(db).create({
                        Brand: body.brand ? body.brand : '',
                        Teams: body.teams ? body.teams : '',
                        ProductionLine: body.productionLine ? body.productionLine : '',
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
    // update_branch_management
    updateBranchManagement: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.brand || body.brand === '')
                        update.push({ key: 'Brand', value: body.brand });
                    if (body.teams || body.teams === '')
                        update.push({ key: 'Teams', value: body.teams });
                    if (body.productionLine || body.productionLine === '')
                        update.push({ key: 'ProductionLine', value: body.productionLine });
                    database.updateTable(update, mBranchManagement(db), body.id).then(response => {
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
    // delete_branch_management
    deleteBranchManagement: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            let body = req.body;
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshipBranchManagement(db, listID);
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
    // get_list_branch_management
    getListBranchManagement: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    mBranchManagement(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                brand: element.Brand ? element.Brand : '',
                                teams: element.Teams ? element.Teams : '',
                                productionLine: element.ProductionLine ? element.ProductionLine : '',
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