const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mConfigCodeEmployee = require('../tables/config-code-employee')
var database = require('../database');
async function deleteRelationshipConfigCodeEmployee(db, listID) {
    await mConfigCodeEmployee(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    // add_config_code_employee
    addConfigCodeEmployee: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    mConfigCodeEmployee(db).create({
                        PreviousCharacter: body.previousCharacter ? body.previousCharacter : 'null',
                        AfterCharacter: body.afterCharacter ? body.afterCharacter : '',
                        BetweenCharacter: body.betweenCharacter ? body.betweenCharacter : '',
                        AutoIncreasesCode: body.autoIncreasesCode ? body.autoIncreasesCode : '',
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
    // update_config_code_employee
    updateConfigCodeEmployee: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            try {
                let check = await mConfigCodeEmployee(db).count()
                if (check <= 0) {
                    mConfigCodeEmployee(db).create({
                        PreviousCharacter: body.previousCharacter ? body.previousCharacter : 'null',
                        AfterCharacter: body.afterCharacter ? body.afterCharacter : '',
                        BetweenCharacter: body.betweenCharacter ? body.betweenCharacter : '',
                        AutoIncreasesCode: body.autoIncreasesCode ? body.autoIncreasesCode : '',
                    }).then(data => {
                        var result = {
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        res.json(result);
                    })
                } else {
                    let update = [];
                    if (body.previousCharacter || body.previousCharacter === '')
                        update.push({ key: 'PreviousCharacter', value: body.previousCharacter });
                    if (body.afterCharacter || body.afterCharacter === '')
                        update.push({ key: 'AfterCharacter', value: body.afterCharacter });
                    if (body.betweenCharacter || body.betweenCharacter === '')
                        update.push({ key: 'BetweenCharacter', value: body.betweenCharacter });
                    if (body.autoIncreasesCode || body.autoIncreasesCode === '')
                        update.push({ key: 'AutoIncreasesCode', value: body.autoIncreasesCode });
                    database.updateTable(update, mConfigCodeEmployee(db), body.id).then(response => {
                        if (response == 1) {
                            res.json(Result.ACTION_SUCCESS);
                        } else {
                            res.json(Result.SYS_ERROR_RESULT);
                        }
                    })
                }
            } catch (error) {
                console.log(error);
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // delete_config_code_employee
    deleteConfigCodeEmployee: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            let body = req.body;
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshipConfigCodeEmployee(db, listID);
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
    // get_list_config_code_employee
    getListConfigCodeEmployee: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    mConfigCodeEmployee(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                previousCharacter: element.PreviousCharacter ? element.PreviousCharacter : '',
                                afterCharacter: element.AfterCharacter ? element.AfterCharacter : '',
                                betweenCharacter: element.BetweenCharacter ? element.BetweenCharacter : '',
                                autoIncreasesCode: element.AutoIncreasesCode ? element.AutoIncreasesCode : '',
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
}