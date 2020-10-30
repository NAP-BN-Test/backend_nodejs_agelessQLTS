const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mManagementJobAndHR = require('../tables/management-job-and-hr');
var mFactoryManagement = require('../tables/factory-management');
var mAdministrativeFunctions = require('../tables/administrative-functions');
var database = require('../database');
async function deleteRelationshipManagementJobHR(db, listID) {
    // await mManagementJobHR(db).destroy({
    //     where: {
    //         IDJobAndHR: { [Op.in]: listID }
    //     }
    // })
    await mManagementJobAndHR(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshipManagementJobHR,
    // add_management_job_hr
    addManagementJobHR: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    mManagementJobAndHR(db).create({
                        IDAdminfuc: body.idAdminfuc ? body.idAdminfuc : null,
                        Curator: body.curator ? body.curator : '',
                        PlaceBuildingOutSide: body.placeBuildingOutSide ? body.placeBuildingOutSide : '',
                        IDFactoryManagement: body.idFactoryManagement ? body.idFactoryManagement : null,
                        IDLaborManagement: body.idLaborManagement ? body.idLaborManagement : null,
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
    // update_management_job_hr
    updateLaborManagementJobHR: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.idAdminfuc || body.idAdminfuc === '') {
                        if (body.idAdminfuc === '')
                            update.push({ key: 'IDAdminfuc', value: null });
                        else
                            update.push({ key: 'IDAdminfuc', value: body.idAdminfuc });
                    }
                    if (body.curator || body.curator === '')
                        update.push({ key: 'Curator', value: body.curator });
                    if (body.placeBuildingOutSide || body.placeBuildingOutSide === '')
                        update.push({ key: 'PlaceBuildingOutSide', value: body.placeBuildingOutSide });
                    if (body.idFactoryManagement || body.idFactoryManagement === '') {
                        if (body.idFactoryManagement === '')
                            update.push({ key: 'IDFactoryManagement', value: null });
                        else
                            update.push({ key: 'IDFactoryManagement', value: body.idFactoryManagement });

                    }
                    if (body.idLaborManagement || body.idLaborManagement === '') {
                        if (body.idLaborManagement === '')
                            update.push({ key: 'IDLaborManagement', value: null });
                        else
                            update.push({ key: 'IDLaborManagement', value: body.idLaborManagement });
                    }
                    database.updateTable(update, mManagementJobAndHR(db), body.id).then(response => {
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
    // delete_management_job_hr
    deleteLaborManagementJobHR: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            let body = req.body;
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshipManagementJobHR(db, listID);
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
    // get_list_management_job_hr
    getListLaborManagementJobHR: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    var data = JSON.parse(body.dataSearch)

                    if (data.search) {
                        where = [
                            { Curator: { [Op.like]: '%' + data.search + '%' } },
                        ];
                    } else {
                        where = [
                            { Curator: { [Op.ne]: '%%' } },
                        ];
                    }
                    let whereOjb = { [Op.or]: where };
                    if (data.items) {
                        for (var i = 0; i < data.items.length; i++) {
                            let userFind = {};
                            if (data.items[i].fields['name'] === 'Curator') {
                                userFind['Curator'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                            if (data.items[i].fields['name'] === 'IDFactoryManagement') {
                                var factoryManagement = await mFactoryManagement(db).findAll({
                                    where: {
                                        Building: { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    }
                                })
                                var listID = [];
                                factoryManagement.forEach(item => {
                                    listID.push(item.ID)
                                })
                                userFind['IDFactoryManagement'] = { [Op.in]: listID }
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
                            if (data.items[i].fields['name'] === 'IDAdminfuc') {
                                var administrativeFunctions = await mAdministrativeFunctions(db).findAll({
                                    where: {
                                        Name: { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    }
                                })
                                var listID = [];
                                administrativeFunctions.forEach(item => {
                                    listID.push(item.ID)
                                })
                                userFind['IDAdminfuc'] = { [Op.in]: listID }
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
                    let count = mManagementJobAndHR(db).count({ where: whereOjb });
                    let managementJobAndHR = mManagementJobAndHR(db);
                    managementJobAndHR.belongsTo(mFactoryManagement(db), { foreignKey: 'IDFactoryManagement', sourceKey: 'IDFactoryManagement' })
                    managementJobAndHR.belongsTo(mAdministrativeFunctions(db), { foreignKey: 'IDAdminfuc', sourceKey: 'IDAdminfuc' })
                    managementJobAndHR.findAll({
                        where: whereOjb,
                        include: [
                            {
                                model: mFactoryManagement(db),
                                required: false,
                            },
                            {
                                model: mAdministrativeFunctions(db),
                                required: false,
                            }
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var stt = 1;
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                curator: element.Curator,
                                factoryManagement: element.FactoryManagement ? element.FactoryManagement.Building : '',
                                IDfactoryManagement: element.FactoryManagement ? element.FactoryManagement.ID : '',
                                addministrativeFunctions: element.AddministrativeFunctions ? element.AddministrativeFunctions.Name : '',
                                IDAddministrativeFunctions: element.AddministrativeFunctions ? element.AddministrativeFunctions.ID : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var result = {
                            array: array,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                            count: count,
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