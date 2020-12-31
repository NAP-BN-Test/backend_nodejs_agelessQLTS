const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblQuyetDinhTangLuong = require('../tables/hrmanage/tblQuyetDinhTangLuong')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');

async function deleteRelationshiptblQuyetDinhTangLuong(db, listID) {
    await mtblQuyetDinhTangLuong(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblQuyetDinhTangLuong,
    //  get_detail_tbl_quyetdinh_tangluong
    detailtblQuyetDinhTangLuong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    let tblQuyetDinhTangLuong = mtblQuyetDinhTangLuong(db);
                    tblQuyetDinhTangLuong.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'employee' })
                    tblQuyetDinhTangLuong.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: { IDNhanVien: body.idNhanVien },
                        include: [
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'employee'
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                decisionCode: element.DecisionCode ? element.DecisionCode : '',
                                decisionDate: element.DecisionDate ? element.DecisionDate : null,
                                increaseDate: element.IncreaseDate ? element.IncreaseDate : null,
                                stopDate: element.StopDate ? element.StopDate : null,
                                stopReason: element.StopReason ? element.StopReason : '',
                                idNhanVien: element.IDNhanVien ? element.IDNhanVien : null,
                                nameNhanVien: element.IDNhanVien ? element.employee.StaffName : null,
                                salaryIncrease: element.SalaryIncrease ? element.SalaryIncrease : '',
                                status: element.Status ? element.Status : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblQuyetDinhTangLuong(db).count({ IDNhanVien: body.idNhanVien })
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
    // add_tbl_quyetdinh_tangluong
    addtblQuyetDinhTangLuong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblQuyetDinhTangLuong(db).create({
                        DecisionCode: body.decisionCode ? body.decisionCode : '',
                        DecisionDate: body.decisionDate ? body.decisionDate : null,
                        IncreaseDate: body.increaseDate ? body.increaseDate : null,
                        StopDate: body.stopDate ? body.stopDate : null,
                        StopReason: body.stopReason ? body.stopReason : '',
                        IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                        SalaryIncrease: body.salaryIncrease ? body.salaryIncrease : '',
                        Status: body.status ? body.status : '',
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
    // update_tbl_quyetdinh_tangluong
    updatetblQuyetDinhTangLuong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.decisionDate || body.decisionDate === '') {
                        if (body.decisionDate === '')
                            update.push({ key: 'DecisionDate', value: null });
                        else
                            update.push({ key: 'DecisionDate', value: body.decisionDate });
                    }
                    if (body.increaseDate || body.increaseDate === '') {
                        if (body.increaseDate === '')
                            update.push({ key: 'IncreaseDate', value: null });
                        else
                            update.push({ key: 'IncreaseDate', value: body.increaseDate });
                    }
                    if (body.stopDate || body.stopDate === '') {
                        if (body.stopDate === '')
                            update.push({ key: 'StopDate', value: null });
                        else
                            update.push({ key: 'StopDate', value: body.stopDate });
                    }
                    if (body.idNhanVien || body.idNhanVien === '') {
                        if (body.idNhanVien === '')
                            update.push({ key: 'IDNhanVien', value: null });
                        else
                            update.push({ key: 'IDNhanVien', value: body.idNhanVien });
                    }
                    if (body.decisionCode || body.decisionCode === '')
                        update.push({ key: 'DecisionCode', value: body.decisionCode });
                    if (body.stopReason || body.stopReason === '')
                        update.push({ key: 'StopReason', value: body.stopReason });
                    if (body.salaryIncrease || body.salaryIncrease === '')
                        update.push({ key: 'SalaryIncrease', value: body.salaryIncrease });
                    if (body.status || body.status === '')
                        update.push({ key: 'Status', value: body.status });
                    database.updateTable(update, mtblQuyetDinhTangLuong(db), body.id).then(response => {
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
    // delete_tbl_quyetdinh_tangluong
    deletetblQuyetDinhTangLuong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblQuyetDinhTangLuong(db, listID);
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
    // get_list_tbl_quyetdinh_tangluong
    getListtblQuyetDinhTangLuong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            where = [
                                { DecisionCode: { [Op.like]: '%' + data.search + '%' } },
                                { Status: { [Op.like]: '%' + data.search + '%' } },
                            ];
                        } else {
                            where = [
                                { DecisionCode: { [Op.ne]: '%%' } },
                            ];
                        }
                        whereOjb = {
                            [Op.and]: [{ [Op.or]: where }],
                            [Op.or]: [{ ID: { [Op.ne]: null } }],
                        };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'SỐ QUYẾT ĐỊNH') {
                                    userFind['DecisionCode'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'TÌNH TRẠNG QUYẾT ĐỊNH') {
                                    userFind['Status'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                            }
                        }
                    }
                    let stt = 1;
                    let tblQuyetDinhTangLuong = mtblQuyetDinhTangLuong(db);
                    tblQuyetDinhTangLuong.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'employee' })
                    tblQuyetDinhTangLuong.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'employee'
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                decisionCode: element.DecisionCode ? element.DecisionCode : '',
                                decisionDate: element.DecisionDate ? element.DecisionDate : null,
                                increaseDate: element.IncreaseDate ? element.IncreaseDate : null,
                                stopDate: element.StopDate ? element.StopDate : null,
                                stopReason: element.StopReason ? element.StopReason : '',
                                idNhanVien: element.IDNhanVien ? element.IDNhanVien : null,
                                nameNhanVien: element.IDNhanVien ? element.employee.StaffName : null,
                                salaryIncrease: element.SalaryIncrease ? element.SalaryIncrease : '',
                                status: element.Status ? element.Status : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblQuyetDinhTangLuong(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_quyetdinh_tangluong
    getListNametblQuyetDinhTangLuong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblQuyetDinhTangLuong(db).findAll().then(data => {
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