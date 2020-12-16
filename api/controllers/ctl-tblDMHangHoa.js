const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMHangHoa = require('../tables/qlnb/tblDMHangHoa');
var mtblDMLoaiTaiSan = require('../tables/qlnb/tblDMLoaiTaiSan');
var database = require('../database');
const tblTaiSan = require('../tables/qlnb/tblTaiSan');
var mtblYeuCauMuaSamDetail = require('../tables/qlnb/tblYeuCauMuaSamDetail')

async function deleteRelationshiptblDMHangHoa(db, listID) {
    // tblYeuCauMuaSamDetail
    await mtblYeuCauMuaSamDetail(db).update({
        IDDMHangHoa: null
    }, {
        where: {
            IDDMHangHoa: { [Op.in]: listID }
        }
    })
    await tblTaiSan(db).update({
        IDDMHangHoa: null
    }, {
        where: {
            IDDMHangHoa: { [Op.in]: listID }
        }
    })
    await mtblDMHangHoa(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblDMHangHoa,
    // add_tbl_dmhanghoa
    addtblDMHangHoa: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMHangHoa(db).create({
                        Code: body.code ? body.code : '',
                        Name: body.name ? body.name : '',
                        Unit: body.unit ? body.unit : '',
                        IDDMLoaiTaiSan: body.idDMLoaiTaiSan ? body.idDMLoaiTaiSan : '',
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
    // update_tbl_dmhanghoa
    updatetblDMHangHoa: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.code || body.code === '')
                        update.push({ key: 'Code', value: body.code });
                    if (body.name || body.name === '')
                        update.push({ key: 'Name', value: body.name });
                    if (body.unit || body.unit === '')
                        update.push({ key: 'Unit', value: body.unit });
                    if (body.idDMLoaiTaiSan || body.idDMLoaiTaiSan === '') {
                        if (body.idDMLoaiTaiSan === '')
                            update.push({ key: 'IDDMLoaiTaiSan', value: null });
                        else
                            update.push({ key: 'IDDMLoaiTaiSan', value: body.idDMLoaiTaiSan });
                    }
                    database.updateTable(update, mtblDMHangHoa(db), body.id).then(response => {
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
    // delete_tbl_dmhanghoa
    deletetblDMHangHoa: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDMHangHoa(db, listID);
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
    // get_list_tbl_dmhanghoa
    getListtblDMHangHoa: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = []
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            where = [
                                { Name: { [Op.like]: '%' + data.search + '%' } },
                                { Code: { [Op.like]: '%' + data.search + '%' } },
                            ];
                        } else {
                            where = [
                                { Name: { [Op.ne]: '%%' } },
                            ];
                        }
                        let whereOjb = { [Op.or]: where };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'MÃ HÀNG HÓA') {
                                    userFind['Code'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                                if (data.items[i].fields['name'] === 'TÊN HÀNG HÓA') {
                                    userFind['Name'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                    let stt = 1;
                    var tblDMHangHoa = mtblDMHangHoa(db);
                    tblDMHangHoa.belongsTo(mtblDMLoaiTaiSan(db), { foreignKey: 'IDDMLoaiTaiSan', sourceKey: 'IDDMLoaiTaiSan' })
                    tblDMHangHoa.findAll({
                        include: [
                            {
                                model: mtblDMLoaiTaiSan(db),
                                required: false,
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
                                name: element.Name ? element.Name : '',
                                code: element.Code ? element.Code : '',
                                unit: element.Unit ? element.Unit : '',
                                idDMLoaiTaiSan: element.IDDMLoaiTaiSan ? element.IDDMLoaiTaiSan : null,
                                nameDMLoaiTaiSan: element.tblDMLoaiTaiSan ? element.tblDMLoaiTaiSan.Name : null,
                            }
                            stt += 1;
                            array.push(obj);
                        });
                        var count = await tblDMHangHoa.count({ where: whereOjb })
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
    // get_list_name_tbl_dmhanghoa
    getListNametblDMHangHoa: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMHangHoa(db).findAll().then(data => {
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
    },
    // get_list_goods_from_asset
    getListAssetFromGoods: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    let tblDMHangHoa = mtblDMHangHoa(db);
                    tblDMHangHoa.hasMany(tblTaiSan(db), { foreignKey: 'IDDMHangHoa', as: 'taisan' })
                    tblDMHangHoa.findOne({
                        where: { ID: body.id },
                        include: [
                            {
                                model: tblTaiSan(db),
                                required: false,
                                as: 'taisan'
                            },
                        ],
                    }).then(async data => {
                        if (data.taisan) {
                            var array = [];
                            data.taisan.forEach(item => {
                                if (item.TSNBCode)
                                    array.push({
                                        id: Number(item.ID),
                                        tsnbCode: item.TSNBCode,
                                        tsnbCode: item.TSNBCode,
                                        guaranteeMonth: item.GuaranteeMonth ? item.GuaranteeMonth : '',
                                    })
                            })
                        }
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
}