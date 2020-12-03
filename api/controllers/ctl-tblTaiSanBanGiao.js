const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblTaiSanBanGiao = require('../tables/tblTaiSanBanGiao')
var mtblTaiSanHistory = require('../tables/tblTaiSanHistory')
var database = require('../database');
async function deleteRelationshiptblTaiSanBanGiao(db, listID) {
    await mtblTaiSanBanGiao(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblTaiSanBanGiao,
    // add_tbl_taisan_bangiao
    addtblTaiSanBanGiao: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // {
                    //     idNhanVienBanGiao,
                    //     idNhanVienSoHuu,
                    //     idBoPhanSoHuu,
                    //     date,
                    //     listHistory: [
                    //         {
                    //            idTaiSan,
                    //            dateThuHoi
                    //         }
                    //     ]

                    // }
                    mtblTaiSanBanGiao(db).create({
                        IDNhanVienBanGiao: body.idNhanVienBanGiao ? body.idNhanVienBanGiao : null,
                        IDNhanVienSoHuu: body.idNhanVienSoHuu ? body.idNhanVienSoHuu : '',
                        IDBoPhanSoHuu: body.idBoPhanSoHuu ? body.idBoPhanSoHuu : '',
                        Date: body.date ? body.date : '',
                    }).then(async data => {
                        for (var i = 0; i < body.listHistory; i++) {
                            await mtblTaiSanHistory(db).create({
                                IDTaiSan: body.listHistory[i].idTaiSan,
                                IDTaiSanBanGiao: data.ID,
                                DateThuHoi: body.listHistory[i].dateThuHoi,
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
    // update_tbl_taisan_bangiao
    updatetblTaiSanBanGiao: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                // {
                //     idNhanVienBanGiao,
                //     idNhanVienSoHuu,
                //     idBoPhanSoHuu,
                //     date,
                //     id,
                //     listHistory: [
                //         {
                //            idTaiSan,
                //            dateThuHoi,
                //            idHistory
                //         }
                //     ]

                // }
                try {
                    let update = [];
                    if (body.idNhanVienBanGiao || body.idNhanVienBanGiao === '') {
                        if (body.idNhanVienBanGiao === '')
                            update.push({ key: 'IDNhanVienBanGiao', value: null });
                        else
                            update.push({ key: 'IDNhanVienBanGiao', value: body.idNhanVienBanGiao });
                    }
                    if (body.idNhanVienSoHuu || body.idNhanVienSoHuu === '') {
                        if (body.idNhanVienSoHuu === '')
                            update.push({ key: 'IDNhanVienSoHuu', value: null });
                        else
                            update.push({ key: 'IDNhanVienSoHuu', value: body.idNhanVienSoHuu });
                    }
                    if (body.idBoPhanSoHuu || body.idBoPhanSoHuu === '') {
                        if (body.idBoPhanSoHuu === '')
                            update.push({ key: 'IDBoPhanSoHuu', value: null });
                        else
                            update.push({ key: 'IDBoPhanSoHuu', value: body.idBoPhanSoHuu });
                    }
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    for (var i = 0; i < body.listHistory; i++) {
                        await mtblTaiSanHistory(db).update({
                            IDTaiSan: body.listHistory[i].idTaiSan,
                            IDTaiSanBanGiao: body.id,
                            DateThuHoi: body.listHistory[i].dateThuHoi,
                        }, { where: { ID: body.listHistory[i].idHistory } })
                    }
                    database.updateTable(update, mtblTaiSanBanGiao(db), body.id).then(response => {
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
    // delete_tbl_taisan_bangiao
    deletetblTaiSanBanGiao: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblTaiSanBanGiao(db, listID);
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
    // get_list_tbl_taisan_bangiao
    getListtblTaiSanBanGiao: (req, res) => {
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
                    let tblTaiSanBanGiao = mtblTaiSanBanGiao(db);
                    tblTaiSanBanGiao.hasMany(mtblTaiSanHistory(db), { foreignKey: 'IDTaiSanBanGiao', as: 'history' })

                    tblTaiSanBanGiao.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [
                            {
                                model: mtblTaiSanHistory(db),
                                required: false,
                                as: 'history'
                            },
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                date: element.Date ? element.Date : '',
                                history: element.history
                            }
                            array.push(obj);
                        });
                        var count = await mtblTaiSanBanGiao(db).count({ where: whereOjb, })
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
}