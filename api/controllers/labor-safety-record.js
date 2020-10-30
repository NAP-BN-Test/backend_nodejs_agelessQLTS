const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mLaborSafetyRecord = require('../tables/labor-safety-record')
var database = require('../database');
async function deleteRelationshipLaborSafetyRecord(db, listID) {
    await mLaborSafetyRecord(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    // add_labor_safety_record
    addLaborSafetyRecord: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    mLaborSafetyRecord(db).create({
                        ProfileName: body.profileName ? body.profileName : 'null',
                        Description: body.description ? body.description : '',
                        Code: body.code ? body.code : '',
                        NumberEmployees: body.numberEmployees ? body.numberEmployees : 0,
                        IDProFManufacturing: body.idProFManufacturing ? body.idProFManufacturing : null,
                        NumberFullTimeStaff: body.numberFullTimeStaff ? body.numberFullTimeStaff : 0,
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
    // update_labor_safety_record
    updateLaborSafetyRecord: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.profileName || body.profileName === '')
                        update.push({ key: 'ProfileName', value: body.profileName });
                    if (body.description || body.description === '')
                        update.push({ key: 'Description', value: body.description });
                    if (body.code || body.code === '')
                        update.push({ key: 'Code', value: body.code });
                    if (body.numberEmployees || body.numberEmployees === '')
                        update.push({ key: 'NumberEmployees', value: body.numberEmployees });
                    if (body.idProFManufacturing || body.idProFManufacturing === '') {
                        if (body.idProFManufacturing === '')
                            update.push({ key: 'IDProFManufacturing', value: null });
                        else
                            update.push({ key: 'IDProFManufacturing', value: body.idProFManufacturing });
                    }
                    if (body.numberFullTimeStaff || body.numberFullTimeStaff === '')
                        update.push({ key: 'NumberFullTimeStaff', value: body.numberFullTimeStaff });
                    database.updateTable(update, mLaborSafetyRecord(db), body.id).then(response => {
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
    // delete_labor_safety_record
    deleteLaborSafetyRecord: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            let body = req.body;
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshipLaborSafetyRecord(db, listID);
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
    // get_list_labor_safety_record
    getListLaborSafetyRecord: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    var data = JSON.parse(body.dataSearch)

                    if (data.search) {
                        where = [
                            { ProfileName: { [Op.like]: '%' + data.search + '%' } },
                            { Description: { [Op.like]: '%' + data.search + '%' } },
                        ];
                    } else {
                        where = [
                            { ProfileName: { [Op.ne]: '%%' } },
                        ];
                    }
                    let whereOjb = { [Op.or]: where };
                    if (data.items) {
                        for (var i = 0; i < data.items.length; i++) {
                            let userFind = {};
                            if (data.items[i].fields['name'] === 'ProfileName') {
                                userFind['ProfileName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                            if (data.items[i].fields['name'] === 'Description') {
                                userFind['Description'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                    let count = mLaborSafetyRecord(db).count({ where: whereOjb });
                    mLaborSafetyRecord(db).findAll({
                        where: whereOjb,
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                profileName: element.ProfileName ? element.ProfileName : '',
                                description: element.Description ? element.Description : '',
                            }
                            array.push(obj);
                        });
                        var result = {
                            array: array,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                            count: count
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