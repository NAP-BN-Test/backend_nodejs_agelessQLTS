const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblBangLuong = require('../tables/hrmanage/tblBangLuong')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblMucDongBaoHiem = require('../tables/hrmanage/tblMucDongBaoHiem')
var mtblDMGiaDinh = require('../tables/hrmanage/tblDMGiaDinh')

async function deleteRelationshiptblBangLuong(db, listID) {
    await mtblBangLuong(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblBangLuong,
    // //  get_detail_tbl_bangluong
    // detailtblBangLuong: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 mtblBangLuong(db).findOne({ where: { ID: body.id } }).then(data => {
    //                     if (data) {
    //                         var obj = {
    //                             id: data.ID,
    //                             name: data.Name,
    //                             code: data.Code,
    //                         }
    //                         var result = {
    //                             obj: obj,
    //                             status: Constant.STATUS.SUCCESS,
    //                             message: Constant.MESSAGE.ACTION_SUCCESS,
    //                         }
    //                         res.json(result);
    //                     } else {
    //                         res.json(Result.NO_DATA_RESULT)

    //                     }

    //                 })
    //             } catch (error) {
    //                 res.json(Result.SYS_ERROR_RESULT)
    //             }
    //         } else {
    //             res.json(Constant.MESSAGE.USER_FAIL)
    //         }
    //     })
    // },
    // // add_tbl_bangluong
    // addtblBangLuong: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 mtblBangLuong(db).create({
    //                     Code: body.code ? body.code : 'null',
    //                     Name: body.name ? body.name : '',
    //                 }).then(data => {
    //                     var result = {
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
    // },
    // // update_tbl_bangluong
    // updatetblBangLuong: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 let update = [];
    //                 if (body.code || body.code === '')
    //                     update.push({ key: 'Code', value: body.code });
    //                 if (body.name || body.name === '')
    //                     update.push({ key: 'Name', value: body.name });
    //                 database.updateTable(update, mtblBangLuong(db), body.id).then(response => {
    //                     if (response == 1) {
    //                         res.json(Result.ACTION_SUCCESS);
    //                     } else {
    //                         res.json(Result.SYS_ERROR_RESULT);
    //                     }
    //                 })
    //             } catch (error) {
    //                 console.log(error);
    //                 res.json(Result.SYS_ERROR_RESULT)
    //             }
    //         } else {
    //             res.json(Constant.MESSAGE.USER_FAIL)
    //         }
    //     })
    // },
    // // delete_tbl_bangluong
    // deletetblBangLuong: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 let listID = JSON.parse(body.listID);
    //                 await deleteRelationshiptblBangLuong(db, listID);
    //                 var result = {
    //                     status: Constant.STATUS.SUCCESS,
    //                     message: Constant.MESSAGE.ACTION_SUCCESS,
    //                 }
    //                 res.json(result);
    //             } catch (error) {
    //                 console.log(error);
    //                 res.json(Result.SYS_ERROR_RESULT)
    //             }
    //         } else {
    //             res.json(Constant.MESSAGE.USER_FAIL)
    //         }
    //     })
    // },
    // get_list_tbl_bangluong
    getListtblBangLuong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    let stt = 1;
                    let tblBangLuong = mtblBangLuong(db);
                    // let tblDMNhanvien = mtblDMNhanvien(db)
                    tblBangLuong.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
                    tblBangLuong.findAll({
                        include: [
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'nv'
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: { Date: { [Op.substring]: body.date } },
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            var reduce = 0;
                            await mtblDMGiaDinh(db).findAll({
                                where: { IDNhanVien: data[i].IDNhanVien }
                            }).then(family => {
                                family.forEach(element => {
                                    reduce += element.Reduce;
                                });
                            })
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                idStaff: data[i].IDNhanVien ? data[i].IDNhanVien : null,
                                nameStaff: data[i].IDNhanVien ? data[i].nv.StaffName : null,
                                workingSalary: data[i].WorkingSalary ? data[i].WorkingSalary : '',
                                bhxhSalary: data[i].BHXHSalary ? data[i].BHXHSalary : '',
                                reduce: Number(reduce),
                            }
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblBangLuong(db).count({ where: { Date: { [Op.substring]: body.date } }, })
                        var objInsurance = {};
                        await mtblMucDongBaoHiem(db).findOne({
                            order: [
                                ['ID', 'DESC']
                            ],
                        }).then(data => {
                            if (data) {
                                objInsurance['staffBHXH'] = data.StaffBHXH ? data.StaffBHXH : ''
                                objInsurance['staffBHYT'] = data.StaffBHYT
                                objInsurance['staffBHTN'] = data.StaffBHTN
                            }
                        })
                        var result = {
                            objInsurance: objInsurance,
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
    // // get_list_name_tbl_bangluong
    // getListNametblBangLuong: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 mtblBangLuong(db).findAll().then(data => {
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
    // },
}