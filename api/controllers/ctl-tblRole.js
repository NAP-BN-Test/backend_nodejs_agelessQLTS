const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblRole = require('../tables/constants/tblRole')
var mtblRRoleUser = require('../tables/constants/tblRRoleUser')
var database = require('../database');
var mtbltblRPermissionRole = require('../tables/constants/tblRPermissionRole');
var mtblDMPermission = require('../tables/constants/tblDMPermission');

async function deleteRelationshiptblRole(db, listID) {
    await mtblRRoleUser(db).destroy({
        where: {
            RoleID: {
                [Op.in]: listID
            }
        }
    })
    await mtblRole(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
module.exports = {
    deleteRelationshiptblRole,
    //  get_detail_tbl_role
    detailtblRole: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblRole(db).findOne({ where: { ID: body.id } }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                name: data.Name,
                                code: data.Code,
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
    // add_tbl_role
    addtblRole: (req, res) => {
        let body = req.body;
        console.log(body);
        let permissionIDs = JSON.parse(body.permissionIDs)
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let check = await mtblRole(db).findOne({
                        Code: body.code
                    })
                    if (!check)
                        mtblRole(db).create({
                            Code: body.code ? body.code : '',
                            Name: body.name ? body.name : '',
                        }).then(async data => {
                            for (let i = 0; i < permissionIDs.length; i++) {
                                await mtbltblRPermissionRole({
                                    RoleID: data.ID,
                                    PermissionID: permissionIDs[i],
                                })
                            }
                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                            }
                            res.json(result);
                        })
                    else {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: 'Mã quyền đã tồn tại. Vui lòng kiểm tra lại!',
                        }
                        res.json(result);
                    }
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // update_tbl_role
    updatetblRole: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    let check = await mtblRole(db).findOne({
                        Code: body.code
                    })
                    let permissionIDs = JSON.parse(body.permissionIDs)
                    for (let i = 0; i < permissionIDs.length; i++) {
                        await mtbltblRPermissionRole({
                            RoleID: body.id,
                            PermissionID: permissionIDs[i],
                        })
                    }
                    if (!check) {
                        if (body.code || body.code === '')
                            update.push({ key: 'Code', value: body.code });
                        if (body.name || body.name === '')
                            update.push({ key: 'Name', value: body.name });
                        database.updateTable(update, mtblRole(db), body.id).then(response => {
                            if (response == 1) {
                                res.json(Result.ACTION_SUCCESS);
                            } else {
                                res.json(Result.SYS_ERROR_RESULT);
                            }
                        })
                    } else {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: 'Mã quyền đã tồn tại. Vui lòng kiểm tra lại!',
                        }
                        res.json(result);
                    }

                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // delete_tbl_role
    deletetblRole: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblRole(db, listID);
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
    // get_list_tbl_role
    getListtblRole: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    // if (body.dataSearch) {
                    //     var data = JSON.parse(body.dataSearch)

                    //     if (data.search) {
                    //         where = [{
                    //                 FullName: {
                    //                     [Op.like]: '%' + data.search + '%'
                    //                 }
                    //             },
                    //             {
                    //                 Address: {
                    //                     [Op.like]: '%' + data.search + '%'
                    //                 }
                    //             },
                    //             {
                    //                 CMND: {
                    //                     [Op.like]: '%' + data.search + '%'
                    //                 }
                    //             },
                    //             {
                    //                 EmployeeCode: {
                    //                     [Op.like]: '%' + data.search + '%'
                    //                 }
                    //             },
                    //         ];
                    //     } else {
                    //         where = [{
                    //             FullName: {
                    //                 [Op.ne]: '%%'
                    //             }
                    //         }, ];
                    //     }
                    //     whereOjb = {
                    //         [Op.and]: [{
                    //             [Op.or]: where
                    //         }],
                    //         [Op.or]: [{
                    //             ID: {
                    //                 [Op.ne]: null
                    //             }
                    //         }],
                    //     };
                    //     if (data.items) {
                    //         for (var i = 0; i < data.items.length; i++) {
                    //             let userFind = {};
                    //             if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                    //                 userFind['FullName'] = {
                    //                     [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'And') {
                    //                     whereOjb[Op.and].push(userFind)
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Or') {
                    //                     whereOjb[Op.or].push(userFind)
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Not') {
                    //                     whereOjb[Op.not] = userFind
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                    let stt = 1;
                    mtblRole(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        for (let i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                name: data[i].Name ? data[i].Name : '',
                                code: data[i].Code ? data[i].Code : '',
                            }
                            let tbltblRPermissionRole = mtbltblRPermissionRole(db);
                            tbltblRPermissionRole.belongsTo(mtblDMPermission(db), { foreignKey: 'PermissionID', sourceKey: 'PermissionID', as: 'permission' })
                            await tbltblRPermissionRole.findAll({
                                where: { RoleID: data[i].ID },
                                include: [{
                                    model: mtblDMPermission(db),
                                    required: false,
                                    as: 'permission'
                                }, ],
                            }).then(per => {
                                let pers = []
                                for (let p = 0; p < per.length; p++) {
                                    pers.push({
                                        id: per[p].PermissionID,
                                        permissionName: per[p].PermissionID ? per[p].permission.PermissionName : '',
                                    })
                                }
                                obj['permissionIDs'] = pers
                            })
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblRole(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_role
    getListNametblRole: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblRole(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                name: element.Name ? element.Name : '',
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