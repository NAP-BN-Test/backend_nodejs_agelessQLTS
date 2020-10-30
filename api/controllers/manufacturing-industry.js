const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mManufacuringIndustry = require('../tables/manufacturing-industry')
var mBusinessInformation = require('../tables/business-information');
var database = require('../database');
async function deleteRelationshipManufacuringIndustry(db, listID) {
    // chưa xong
    await mManufacuringIndustry(db).destroy({
        where: {
            IDLaborBook: { [Op.in]: listID }
        }
    })
}
module.exports = {
    // add_manufacuring_industry
    addManufacuringIndustry: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    mManufacuringIndustry(db).create({
                        Code: body.code ? body.code : '',
                        Name: body.name ? body.name : '',
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
    // update_manufacuring_industry
    updateManufacuringIndustry: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.code || body.code === '')
                        update.push({ key: 'Code', value: body.code });
                    if (body.name || body.name === '')
                        update.push({ key: 'Name', value: body.name });
                    database.updateTable(update, mManufacuringIndustry(db), body.id).then(response => {
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
    // delete_manufacuring_industry
    deleteManufacuringIndustry: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            let body = req.body;
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshipManufacuringIndustry(db, listID);
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
    // get_list_manufacuring_industry
    getListManufacuringIndustry: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    // nhiều một
                    let ManufacuringIndustry = mManufacuringIndustry(db);
                    ManufacuringIndustry.hasMany(mBusinessInformation(db), { foreignKey: 'IDManufacturingIndustry' })
                    ManufacuringIndustry.findAll({
                        include: [
                            {
                                model: mBusinessInformation(db),
                                required: false,
                            },
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                name: element.Name ? element.Name : '',
                                code: element.Code ? element.Code : '',
                                array: element.BusinessInformations,
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