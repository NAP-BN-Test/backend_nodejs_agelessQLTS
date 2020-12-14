const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblYeuCauMuaSam = require('../tables/qlnb/tblYeuCauMuaSam')
var mtblYeuCauMuaSamDetail = require('../tables/qlnb/tblYeuCauMuaSamDetail')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMHangHoa = require('../tables/qlnb/tblDMHangHoa');

var database = require('../database');
async function deleteRelationshiptblYeuCauMuaSam(db, listID) {
    await mtblYeuCauMuaSam(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblYeuCauMuaSam,
    // add_tbl_yeucaumuasam
    addtblYeuCauMuaSam: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblYeuCauMuaSam(db).create({
                        IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                        IDPhongBan: body.idPhongBan ? body.idPhongBan : null,
                        RequireDate: body.requireDate ? body.requireDate : null,
                        Reason: body.reason ? body.reason : '',
                        Status: body.status ? body.status : '',
                        IDPheDuyet1: body.idPheDuyet1 ? body.idPheDuyet1 : null,
                        IDPheDuyet2: body.idPheDuyet2 ? body.idPheDuyet2 : null,
                    }).then(async data => {
                        body.fileAttach = JSON.parse(body.fileAttach)
                        if (body.fileAttach.length > 0)
                            for (var j = 0; j < body.fileAttach.length; j++)
                                await mtblFileAttach(db).create({
                                    Name: body.fileAttach[j].fileName,
                                    Link: body.fileAttach[j].link,
                                    IDVanPhongPham: data.ID,
                                })
                        body.line = JSON.parse(body.line)
                        if (body.line.length > 0)
                            for (var i = 0; i < body.line.length; i++) {
                                await mtblYeuCauMuaSamDetail(db).create({
                                    IDYeuCauMuaSam: data.ID,
                                    IDDMHangHoa: body.line[i].idDMHangHoa,
                                    Amount: body.line[i].amount
                                })
                            }
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
    // update_tbl_yeucaumuasam
    updatetblYeuCauMuaSam: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.idNhanVien || body.idNhanVien === '') {
                        if (body.idNhanVien === '')
                            update.push({ key: 'IDNhanVien', value: null });
                        else
                            update.push({ key: 'IDNhanVien', value: body.idNhanVien });
                    }
                    if (body.idPhongBan || body.idPhongBan === '') {
                        if (body.idPhongBan === '')
                            update.push({ key: 'IDPhongBan', value: null });
                        else
                            update.push({ key: 'IDPhongBan', value: body.idPhongBan });
                    }
                    if (body.requireDate || body.requireDate === '') {
                        if (body.requireDate === '')
                            update.push({ key: 'RequireDate', value: null });
                        else
                            update.push({ key: 'RequireDate', value: body.requireDate });
                    }
                    if (body.fileAttach.length > 0)
                        for (var j = 0; j < body.fileAttach.length; j++)
                            await mtblFileAttach(db).update({
                                Name: body.fileAttach[j].fileName,
                                Link: body.fileAttach[j].link,
                            }, {
                                where: { ID: body.fileAttach[j].idFileAttach }
                            })
                    if (body.line.length > 0)
                        for (var i = 0; i < body.line.length; i++) {
                            await mtblYeuCauMuaSamDetail(db).update({
                                IDYeuCauMuaSam: data.ID,
                                IDDMHangHoa: body.line[i].idDMHangHoa,
                                Amount: body.line[i].amount
                            }, {
                                where: { ID: body.line[i].idLine }
                            })
                        }
                    if (body.reason || body.reason === '')
                        update.push({ key: 'Reason', value: body.reason });
                    if (body.status || body.status === '')
                        update.push({ key: 'Status', value: body.status });
                    if (body.idPheDuyet2 || body.idPheDuyet2 === '') {
                        if (body.idPheDuyet2 === '')
                            update.push({ key: 'IDPheDuyet2', value: null });
                        else
                            update.push({ key: 'IDPheDuyet2', value: body.idPheDuyet2 });
                    }
                    if (body.idPheDuyet1 || body.idPheDuyet1 === '') {
                        if (body.idPheDuyet1 === '')
                            update.push({ key: 'IDPheDuyet1', value: null });
                        else
                            update.push({ key: 'IDPheDuyet1', value: body.idPheDuyet1 });
                    }
                    database.updateTable(update, mtblYeuCauMuaSam(db), body.id).then(response => {
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
    // delete_tbl_yeucaumuasam
    deletetblYeuCauMuaSam: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            let body = req.body;
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblYeuCauMuaSam(db, listID);
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
    // get_list_tbl_yeucaumuasam
    getListtblYeuCauMuaSam: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let whereOjb = []
                    whereOjb.push({ Status: body.status })
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            where = [
                                // { TSName: { [Op.like]: '%' + data.search + '%' } },

                            ];
                        } else {
                            where = [
                                // { TSName: { [Op.ne]: '%%' } },
                            ];
                        }
                        whereOjb = { [Op.or]: where };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                // if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                                //     userFind['TSName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                //     if (data.items[i].conditionFields['name'] == 'And') {
                                //         whereOjb[Op.and] = userFind
                                //     }
                                //     if (data.items[i].conditionFields['name'] == 'Or') {
                                //         whereOjb[Op.or] = userFind
                                //     }
                                //     if (data.items[i].conditionFields['name'] == 'Not') {
                                //         whereOjb[Op.not] = userFind
                                //     }
                                // }
                            }
                        }
                    }
                    let stt = 1;
                    let tblYeuCauMuaSam = mtblYeuCauMuaSam(db); // bắt buộc
                    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
                    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet1', sourceKey: 'IDPheDuyet1', as: 'PheDuyet1' })
                    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet2', sourceKey: 'IDPheDuyet2', as: 'PheDuyet2' })
                    tblYeuCauMuaSam.hasMany(mtblYeuCauMuaSamDetail(db), { foreignKey: 'IDYeuCauMuaSam', as: 'line' })
                    // tblYeuCauMuaSam.belongsTo(mtblDMHangHoa(db), { foreignKey: 'IDDMHangHoa', sourceKey: 'IDDMHangHoa', as: 'HangHoa' })
                    tblYeuCauMuaSam.findAll({
                        include: [
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'NhanVien'
                            },
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'PheDuyet1',
                            },
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'PheDuyet2',
                            },
                            {
                                model: mtblYeuCauMuaSamDetail(db),
                                required: false,
                                as: 'line',
                            },
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                idIDNhanVien: element.IDNhanVien ? element.IDNhanVien : null,
                                nameIDNhanVien: element.NhanVien.StaffName ? element.NhanVien.StaffName : null,
                                idPhongBan: element.IDPhongBan ? element.IDPhongBan : null,
                                requireDate: element.RequireDate ? element.RequireDate : null,
                                reason: element.Reason ? element.Reason : '',
                                status: element.Status ? element.Status : '',
                                idPheDuyet1: element.IDPheDuyet1 ? element.IDPheDuyet1 : null,
                                namePheDuyet1: element.PheDuyet1 ? element.PheDuyet1.StaffName : null,
                                idPheDuyet2: element.IDPheDuyet2 ? element.IDPheDuyet2 : null,
                                namePheDuyet2: element.PheDuyet2 ? element.PheDuyet2.StaffName : null,
                                line: element.line,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await tblYeuCauMuaSam.count({ where: whereOjb })
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
    // get_list_name_tbl_yeucaumuasam
    // getListNametblYeuCauMuaSam: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 mtblYeuCauMuaSam(db).findAll().then(data => {
    //                     var array = [];
    //                     data.forEach(element => {
    //                         var obj = {
    //                             id: Number(element.ID),
    //                             tsName: element.TSName ? element.TSName : '',
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