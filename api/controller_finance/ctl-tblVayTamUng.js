const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblVayTamUng = require('../tables/financemanage/tblVayTamUng')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblDMChiNhanh = require('../tables/constants/tblDMChiNhanh')
var mtblDMTaiKhoanKeToan = require('../tables/financemanage/tblDMLoaiTaiKhoanKeToan')

async function deleteRelationshiptblVayTamUng(db, listID) {
    await mtblVayTamUng(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblVayTamUng,
    //  get_detail_tbl_vaytamung
    detailtblVayTamUng: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblVayTamUng = mtblVayTamUng(db);
                    let tblDMBoPhan = mtblDMBoPhan(db);
                    tblVayTamUng.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDTaiKhoanKeToanCost', sourceKey: 'IDTaiKhoanKeToanCost', as: 'tkkt' })
                    tblVayTamUng.findOne({
                        where: { ID: body.id },
                        include: [
                            {
                                model: mtblDMTaiKhoanKeToan(db),
                                required: false,
                                as: 'tkkt'
                            },
                        ],
                    }).then(data => {
                        if (data) {
                            var obj = {
                                id: Number(data.ID),
                                advanceCode: data.AdvanceCode ? data.AdvanceCode : '',
                                idNhanVienCreate: data.IDNhanVienCreate ? data.IDNhanVienCreate : null,
                                nameNhanVienCreate: 'chưa có dữ liệu',
                                idBoPhanNVCreate: data.IDBoPhanNVCreate ? data.IDBoPhanNVCreate : null,
                                nameBoPhanNVCreate: 'chưa có dữ liệu',
                                nameChiNhanhCreate: 'chưa có dữ liệu',
                                idNhanVienAdvance: data.IDNhanVienAdvance ? data.IDNhanVienAdvance : null,
                                nameNhanVienAdvance: 'chưa có dữ liệu',
                                idBoPhanNVAdvance: data.IDBoPhanNVAdvance ? data.IDBoPhanNVAdvance : null,
                                nameBoPhanNVAdvance: 'chưa có dữ liệu',
                                date: data.Date ? data.Date : null,
                                contents: data.Contents ? data.Contents : '',
                                cost: data.Cost ? data.Cost : null,
                                idTaiKhoanKeToanCost: data.IDTaiKhoanKeToanCost ? data.IDTaiKhoanKeToanCost : null,
                                nameTaiKhoanKeToanCost: data.tkkt ? data.tkkt.AccountingName : '',
                                idNhanVienLD: data.IDNhanVienLD ? data.IDNhanVienLD : null,
                                nameNhanVienLD: 'chưa có dữ liệu',
                                trangThaiPheDuyetLD: data.TrangThaiPheDuyetLD ? data.TrangThaiPheDuyetLD : '',
                                idNhanVienPD: data.IDNhanVienPD ? data.IDNhanVienPD : null,
                                nameNhanVienPD: 'chưa có dữ liệu',
                                trangThaiPheDuyetPD: data.TrangThaiPheDuyetPD ? data.TrangThaiPheDuyetPD : '',
                                reason: data.Reason ? data.Reason : '',
                                refunds: data.Refunds ? data.Refunds : true,
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
    // add_tbl_vaytamung
    addtblVayTamUng: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblVayTamUng(db).create({
                        AdvanceCode: body.advanceCode ? body.advanceCode : '',
                        IDNhanVienCreate: body.idNhanVienCreate ? body.idNhanVienCreate : null,
                        IDBoPhanNVCreate: body.idBoPhanNVCreate ? body.idBoPhanNVCreate : null,
                        IDNhanVienAdvance: body.idNhanVienAdvance ? body.idNhanVienAdvance : null,
                        IDBoPhanNVAdvance: body.idBoPhanNVAdvance ? body.idBoPhanNVAdvance : null,
                        Date: body.date ? body.date : null,
                        Contents: body.contents ? body.contents : '',
                        Cost: body.cost ? body.cost : null,
                        IDTaiKhoanKeToanCost: body.idTaiKhoanKeToanCost ? body.idTaiKhoanKeToanCost : null,
                        IDNhanVienLD: body.idNhanVienLD ? body.idNhanVienLD : null,
                        TrangThaiPheDuyetLD: body.trangThaiPheDuyetLD ? body.trangThaiPheDuyetLD : '',
                        IDNhanVienPD: body.idNhanVienPD ? body.idNhanVienPD : null,
                        TrangThaiPheDuyetPD: body.trangThaiPheDuyetPD ? body.trangThaiPheDuyetPD : '',
                        Reason: body.reason ? body.reason : '',
                        Refunds: body.refunds ? body.refunds : true,
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
    // update_tbl_vaytamung
    updatetblVayTamUng: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.advanceCode || body.advanceCode === '')
                        update.push({ key: 'AdvanceCode', value: body.advanceCode });
                    if (body.idNhanVienCreate || body.idNhanVienCreate === '') {
                        if (body.idNhanVienCreate === '')
                            update.push({ key: 'IDNhanVienCreate', value: null });
                        else
                            update.push({ key: 'IDNhanVienCreate', value: body.idNhanVienCreate });
                    }
                    if (body.idBoPhanNVCreate || body.idBoPhanNVCreate === '') {
                        if (body.idBoPhanNVCreate === '')
                            update.push({ key: 'IDBoPhanNVCreate', value: null });
                        else
                            update.push({ key: 'IDBoPhanNVCreate', value: body.idBoPhanNVCreate });
                    }
                    if (body.idNhanVienAdvance || body.idNhanVienAdvance === '') {
                        if (body.idNhanVienAdvance === '')
                            update.push({ key: 'IDNhanVienAdvance', value: null });
                        else
                            update.push({ key: 'IDNhanVienAdvance', value: body.idNhanVienAdvance });
                    }
                    if (body.idBoPhanNVAdvance || body.idBoPhanNVAdvance === '') {
                        if (body.idBoPhanNVAdvance === '')
                            update.push({ key: 'IDBoPhanNVAdvance', value: null });
                        else
                            update.push({ key: 'IDBoPhanNVAdvance', value: body.idBoPhanNVAdvance });
                    }
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    if (body.contents || body.contents === '')
                        update.push({ key: 'Contents', value: body.contents });
                    if (body.cost || body.cost === '') {
                        if (body.cost === '')
                            update.push({ key: 'Cost', value: null });
                        else
                            update.push({ key: 'Cost', value: body.cost });
                    }
                    if (body.idTaiKhoanKeToanCost || body.idTaiKhoanKeToanCost === '') {
                        if (body.idTaiKhoanKeToanCost === '')
                            update.push({ key: 'IDTaiKhoanKeToanCost', value: null });
                        else
                            update.push({ key: 'IDTaiKhoanKeToanCost', value: body.idTaiKhoanKeToanCost });
                    }
                    if (body.idNhanVienLD || body.idNhanVienLD === '') {
                        if (body.idNhanVienLD === '')
                            update.push({ key: 'IDNhanVienLD', value: null });
                        else
                            update.push({ key: 'IDNhanVienLD', value: body.idNhanVienLD });
                    }
                    if (body.trangThaiPheDuyetLD || body.trangThaiPheDuyetLD === '')
                        update.push({ key: 'TrangThaiPheDuyetLD', value: body.trangThaiPheDuyetLD });
                    if (body.idNhanVienpd || body.idNhanVienpd === '') {
                        if (body.idNhanVienpd === '')
                            update.push({ key: 'IDNhanVienpd', value: null });
                        else
                            update.push({ key: 'IDNhanVienpd', value: body.idNhanVienpd });
                    }
                    if (body.trangThaiPheDuyetPD || body.trangThaiPheDuyetPD === '')
                        update.push({ key: 'TrangThaiPheDuyetPD', value: body.trangThaiPheDuyetPD });
                    if (body.reason || body.reason === '')
                        update.push({ key: 'Reason', value: body.reason });
                    if (body.refunds || body.refunds === '') {
                        if (body.refunds === '')
                            update.push({ key: 'Refunds', value: true });
                        else
                            update.push({ key: 'Refunds', value: body.refunds });
                    }
                    database.updateTable(update, mtblVayTamUng(db), body.id).then(response => {
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
    // delete_tbl_vaytamung
    deletetblVayTamUng: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblVayTamUng(db, listID);
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
    // get_list_tbl_vaytamung
    getListtblVayTamUng: (req, res) => {
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
                    //  }
                    let stt = 1;
                    let tblVayTamUng = mtblVayTamUng(db);
                    tblVayTamUng.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDTaiKhoanKeToanCost', sourceKey: 'IDTaiKhoanKeToanCost', as: 'tkkt' })
                    tblVayTamUng.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        order: [
                            ['ID', 'DESC']
                        ],
                        include: [
                            {
                                model: mtblDMTaiKhoanKeToan(db),
                                required: false,
                                as: 'tkkt'
                            },
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                advanceCode: element.AdvanceCode ? element.AdvanceCode : '',
                                idNhanVienCreate: element.IDNhanVienCreate ? element.IDNhanVienCreate : null,
                                nameNhanVienCreate: 'chưa có dữ liệu',
                                idBoPhanNVCreate: element.IDBoPhanNVCreate ? element.IDBoPhanNVCreate : null,
                                nameBoPhanNVCreate: 'chưa có dữ liệu',
                                nameChiNhanhCreate: 'chưa có dữ liệu',
                                idNhanVienAdvance: element.IDNhanVienAdvance ? element.IDNhanVienAdvance : null,
                                nameNhanVienAdvance: 'chưa có dữ liệu',
                                idBoPhanNVAdvance: element.IDBoPhanNVAdvance ? element.IDBoPhanNVAdvance : null,
                                nameBoPhanNVAdvance: 'chưa có dữ liệu',
                                date: element.Date ? element.Date : null,
                                contents: element.Contents ? element.Contents : '',
                                cost: element.Cost ? element.Cost : null,
                                idTaiKhoanKeToanCost: element.IDTaiKhoanKeToanCost ? element.IDTaiKhoanKeToanCost : null,
                                nameTaiKhoanKeToanCost: element.tkkt ? element.tkkt.AccountingName : '',
                                idNhanVienLD: element.IDNhanVienLD ? element.IDNhanVienLD : null,
                                nameNhanVienLD: 'chưa có dữ liệu',
                                trangThaiPheDuyetLD: element.TrangThaiPheDuyetLD ? element.TrangThaiPheDuyetLD : '',
                                idNhanVienPD: element.IDNhanVienPD ? element.IDNhanVienPD : null,
                                nameNhanVienPD: 'chưa có dữ liệu',
                                trangThaiPheDuyetPD: element.TrangThaiPheDuyetPD ? element.TrangThaiPheDuyetPD : '',
                                reason: element.Reason ? element.Reason : '',
                                refunds: element.Refunds ? element.Refunds : true,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblVayTamUng(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_vaytamung
    getListNametblVayTamUng: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblVayTamUng(db).findAll().then(data => {
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