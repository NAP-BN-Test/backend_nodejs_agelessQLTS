const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblPhanPhoiVPP = require('../tables/tblPhanPhoiVPP')
var mtblDMBoPhan = require('../tables/tblDMBoPhan')
var mtblDMNhanvien = require('../tables/tblDMNhanvien');
var database = require('../database');
var mtblVanPhongPham = require('../tables/tblVanPhongPham')
async function deleteRelationshipTBLPhanPhoiVPP(db, listID) {
    await mtblPhanPhoiVPP(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshipTBLPhanPhoiVPP,
    // add_tbl_them_vpp
    addTBLPhanPhoiVPP: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblPhanPhoiVPP(db).create({
                        IDVanPhongPham: body.idVanPhongPham ? body.idVanPhongPham : null,
                        IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                        IDBoPhan: body.idBoPhan ? body.idBoPhan : null,
                        Date: body.date ? body.date : null,
                        Amount: body.amount ? body.amount : null,
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
    // update_tbl_them_vpp
    updateTBLPhanPhoiVPP: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.idVanPhongPham || body.idVanPhongPham === '') {
                        if (body.idVanPhongPham === '')
                            update.push({ key: 'IDVanPhongPham', value: null });
                        else
                            update.push({ key: 'IDVanPhongPham', value: body.idVanPhongPham });
                    }
                    if (body.idNhanVien || body.idNhanVien === '') {
                        if (body.idNhanVien === '')
                            update.push({ key: 'IDNhanVien', value: null });
                        else
                            update.push({ key: 'IDNhanVien', value: body.idNhanVien });
                    }
                    if (body.idBoPhan || body.idBoPhan === '') {
                        if (body.idBoPhan === '')
                            update.push({ key: 'IDBoPhan', value: null });
                        else
                            update.push({ key: 'IDBoPhan', value: body.idBoPhan });
                    }
                    if (body.amount || body.amount === '') {
                        if (body.amount === '')
                            update.push({ key: 'Amount', value: null });
                        else
                            update.push({ key: 'Amount', value: body.amount });
                    }
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    database.updateTable(update, mtblPhanPhoiVPP(db), body.id).then(response => {
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
    // delete_tbl_them_vpp
    deleteTBLPhanPhoiVPP: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshipTBLPhanPhoiVPP(db, listID);
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
    // get_list_tbl_them_vpp
    getListTBLPhanPhoiVPP: (req, res) => {
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
                    let tblPhanPhoiVPP = mtblPhanPhoiVPP(db);
                    tblPhanPhoiVPP.belongsTo(mtblVanPhongPham(db), { foreignKey: 'IDVanPhongPham', sourceKey: 'IDVanPhongPham', as: 'vpp' })
                    tblPhanPhoiVPP.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
                    tblPhanPhoiVPP.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bp' })
                    tblPhanPhoiVPP.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [
                            {
                                model: mtblVanPhongPham(db),
                                required: false,
                                as: 'vpp'
                            },
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'nv'
                            },
                            {
                                model: mtblDMBoPhan(db),
                                required: false,
                                as: 'bp'
                            },
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                idVanPhongPham: element.IDVanPhongPham ? element.IDVanPhongPham : null,
                                nameVanPhongPham: element.vpp.VPPName ? element.vpp.VPPName : null,
                                idNhanVien: element.IDNhanVien ? element.IDNhanVien : null,
                                nameNhanVien: element.nv.StaffName ? element.nv.StaffName : null,
                                idBoPhan: element.IDBoPhan ? element.IDBoPhan : null,
                                nameBoPhan: element.bp.DepartmentName ? element.bp.DepartmentName : null,
                                date: element.Date ? element.Date : null,
                                amount: element.Amount ? element.Amount : null,
                            }
                            array.push(obj);
                        });
                        var count = await mtblPhanPhoiVPP(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_them_vpp
    getListNameTBLPhanPhoiVPP: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblPhanPhoiVPP(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                amount: element.amount ? element.amount : null,
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