const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblNghiPhep = require('../tables/hrmanage/tblNghiPhep')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblLoaiChamCong = require('../tables/hrmanage/tblLoaiChamCong')

async function deleteRelationshiptblNghiPhep(db, listID) {
    await mtblNghiPhep(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblNghiPhep,
    // add_tbl_nghiphep
    addtblNghiPhep: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblNghiPhep(db).create({
                        DateStart: body.dateStart ? body.dateStart : null,
                        DateEnd: body.dateEnd ? body.dateEnd : null,
                        IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                        IDLoaiChamCong: body.idLoaiChamCong ? body.idLoaiChamCong : null,
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
    // update_tbl_nghiphep
    updatetblNghiPhep: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.dateEnd || body.dateEnd === '') {
                        if (body.dateEnd === '')
                            update.push({ key: 'DateEnd', value: null });
                        else
                            update.push({ key: 'DateEnd', value: body.dateEnd });
                    }
                    if (body.dateStart || body.dateStart === '') {
                        if (body.dateStart === '')
                            update.push({ key: 'DateStart', value: null });
                        else
                            update.push({ key: 'DateStart', value: body.dateStart });
                    }
                    if (body.idNhanVien || body.idNhanVien === '') {
                        if (body.idNhanVien === '')
                            update.push({ key: 'IDNhanVien', value: null });
                        else
                            update.push({ key: 'IDNhanVien', value: body.idNhanVien });
                    }
                    if (body.idLoaiChamCong || body.idLoaiChamCong === '') {
                        if (body.idLoaiChamCong === '')
                            update.push({ key: 'IDLoaiChamCong', value: null });
                        else
                            update.push({ key: 'IDLoaiChamCong', value: body.idLoaiChamCong });
                    }
                    database.updateTable(update, mtblNghiPhep(db), body.id).then(response => {
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
    // delete_tbl_nghiphep
    deletetblNghiPhep: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblNghiPhep(db, listID);
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
    // get_list_tbl_nghiphep
    getListtblNghiPhep: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    // if (body.dataSearch) {
                    //     var data = JSON.parse(body.dataSearch)

                    //     if (data.search) {
                    //         where = [
                    //             { FullName: { [Op.like]: '%' + data.search + '%' } },
                    //             { Address: { [Op.like]: '%' + data.search + '%' } },
                    //             { CMND: { [Op.like]: '%' + data.search + '%' } },
                    //             { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
                    //         ];
                    //     } else {
                    //         where = [
                    //             { FullName: { [Op.ne]: '%%' } },
                    //         ];
                    //     }
                    //     whereOjb = {
                    //         [Op.and]: [{ [Op.or]: where }],
                    //         [Op.or]: [{ ID: { [Op.ne]: null } }],
                    //     };
                    //     if (data.items) {
                    //         for (var i = 0; i < data.items.length; i++) {
                    //             let userFind = {};
                    //             if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                    //                 userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                    let tblNghiPhep = mtblNghiPhep(db);
                    tblNghiPhep.belongsTo(mtblLoaiChamCong(db), { foreignKey: 'IDLoaiChamCong', sourceKey: 'IDLoaiChamCong', as: 'loaiChamCong' })
                    tblNghiPhep.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
                    tblNghiPhep.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [
                            {
                                model: mtblLoaiChamCong(db),
                                required: false,
                                as: 'loaiChamCong'
                            },
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'nv'
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
                                dateEnd: element.DateEnd ? element.DateEnd : '',
                                dateStart: element.DateStart ? element.DateStart : '',
                                idLoaiChamCong: element.loaiChamCong ? element.loaiChamCong.ID : '',
                                nameLoaiChamCong: element.loaiChamCong ? element.loaiChamCong.Name : '',
                                codeLoaiChamCong: element.loaiChamCong ? element.loaiChamCong.Code : '',
                                idNhanVien: element.IDNhanVien ? element.IDNhanVien : '',
                                staffCode: element.nv ? element.nv.StaffCode : '',
                                staffName: element.nv ? element.nv.StaffName : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblNghiPhep(db).count({ where: whereOjb, })
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
    // // get_list_name_tbl_nghiphep
    // getListNametblNghiPhep: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 mtblNghiPhep(db).findAll().then(data => {
    //                     var array = [];
    //                     data.forEach(element => {
    //                         var obj = {
    //                             id: Number(element.ID),
    //                             name: element.Name ? element.Name : '',
    //                         }
    //                         array.push(obj);
    //                     });
    //                     var result = {
    //                         array: array,
    //                         status: Constant.STATUS.SUCCESS,
    //                         message: Constant.MESSAGE.ACTION_SUCCESS,
    //                     }
    //                     res.json(result);
    //                 })

    //             } catch (error) {
    //                 console.log(error);
    //                 res.json(Result.SYS_ERROR_RESULT)
    //             }
    //         } else {
    //             res.json(Constant.MESSAGE.USER_FAIL)
    //         }
    //     })
    // }
}