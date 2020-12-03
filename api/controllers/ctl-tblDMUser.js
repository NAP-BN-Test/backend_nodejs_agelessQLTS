const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMUser = require('../tables/tblDMUser');
var mtblDMNhanvien = require('../tables/tblDMNhanvien');
var mtblDMPermission = require('../tables/tblDMPermission');
var database = require('../database');
let jwt = require('jsonwebtoken');

async function deleteRelationshiptblDMUser(db, listID) {
    await mtblDMUser(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblDMUser,
    // add_tbl_dmuser
    addtblDMUser: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMUser(db).create({
                        Username: body.username ? body.username : '',
                        Password: body.password ? body.password : '123456a$',
                        IDNhanvien: body.idNhanvien ? body.idNhanvien : null,
                        Active: body.active ? body.active : '',
                        IDPermission: body.idPermission ? body.idPermission : null,
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
    // update_tbl_dmuser
    updatetblDMUser: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.username || body.username === '')
                        update.push({ key: 'Username', value: body.username });
                    if (body.password || body.password === '')
                        update.push({ key: 'Password', value: body.password });
                    if (body.idNhanvien || body.idNhanvien === '') {
                        if (body.idNhanvien === '')
                            update.push({ key: 'IDNhanvien', value: null });
                        else
                            update.push({ key: 'IDNhanvien', value: body.idNhanvien });
                    }
                    if (body.idPermission || body.idPermission === '') {
                        if (body.idPermission === '')
                            update.push({ key: 'IDPermission', value: null });
                        else
                            update.push({ key: 'IDPermission', value: body.idPermission });
                    }
                    if (body.active || body.active === '')
                        update.push({ key: 'Active', value: body.active });
                    database.updateTable(update, mtblDMUser(db), body.id).then(response => {
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
    // delete_tbl_dmuser
    deletetblDMUser: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            let body = req.body;
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDMUser(db, listID);
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
    // get_list_tbl_dmuser
    getListtblDMUser: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let whereOjb = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            where = [
                                { Username: { [Op.like]: '%' + data.search + '%' } },
                                { Password: { [Op.like]: '%' + data.search + '%' } },
                            ];
                        } else {
                            where = [
                                { Username: { [Op.ne]: '%%' } },
                            ];
                        }
                        whereOjb = { [Op.or]: where };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'TÊN ĐĂNG NHẬP') {
                                    userFind['Username'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                                if (data.items[i].fields['name'] === 'TRẠNG THÁI') {
                                    userFind['Active'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                    // Một nhiều
                    let tblDMUser = mtblDMUser(db); // bắt buộc
                    tblDMUser.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanvien', sourceKey: 'IDNhanvien' })
                    tblDMUser.belongsTo(mtblDMPermission(db), { foreignKey: 'IDPermission', sourceKey: 'IDPermission' })
                    tblDMUser.findAll({
                        include: [
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                            },
                            {
                                model: mtblDMPermission(db),
                                required: false,
                            }
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                username: element.Username ? element.Username : '',
                                password: element.Password ? element.Password : '',
                                idNhanvien: element.IDNhanvien ? element.IDNhanvien : null,
                                nameNhanvien: element.tblDMNhanvien ? element.tblDMNhanvien.StaffName : null,
                                active: element.Active ? element.Active : '',
                                idPermission: element.IDPermission ? element.IDPermission : null,
                                namePermission: element.tblDMPermission ? element.tblDMPermission.PermissionName : null,
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
    // get_list_name_tbl_dmuser
    getListNametblDMUser: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMUser(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                username: element.Username ? element.Username : '',
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
    login: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            try {
                var data = await mtblDMUser(db).findOne({
                    where: { UserName: body.userName, Password: body.password },
                })
                if (data) {
                    if (!data.Active) {
                        return res.json(Result.LOGIN_FAIL)
                    }
                    var obj = {
                        id: data.ID,
                        name: data.Name,
                        userName: data.UserName,
                        password: data.Password,
                        // list: data.tblPrices
                    }
                    payload = {
                        "Username": req.body.userName,
                        // standard fields
                        // - Xác thực người tạo
                        "iss": "Tungnn",
                    }
                    let token = jwt.sign(payload,
                        'abcdxys',
                        {
                            algorithm: "HS256",
                            expiresIn: '24h' // expires in 24 hours
                        }
                    );
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: '',
                        obj: obj,
                        token: token
                    }
                    res.json(result);
                } else {
                    res.json(Result.LOGIN_FAIL)

                }
            } catch (error) {
                console.log(error);
                res.json(Result.SYS_ERROR_RESULT)
            }
        }, error => {
            res.json(error)
        })
    },
}