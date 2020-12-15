const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblTaiSan = require('../tables/qlnb/tblTaiSan')
var mtblTaiSanADD = require('../tables/qlnb/tblTaiSanADD')
var mtblDMHangHoa = require('../tables/qlnb/tblDMHangHoa');
var mtblDMLoaiTaiSan = require('../tables/qlnb/tblDMLoaiTaiSan');
var mtblTaiSanBanGiao = require('../tables/qlnb/tblTaiSanBanGiao')
var mtblTaiSanHistory = require('../tables/qlnb/tblTaiSanHistory')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');

var database = require('../database');
async function deleteRelationshiptblTaiSanADD(db, listID) {
    await mtblTaiSanHistory(db).update({
        IDTaiSan: null,
    }, {
        where: { IDTaiSan: { [Op.in]: listID } }
    })
    await mtblTaiSan(db).destroy({
        where: {
            IDTaiSanADD: { [Op.in]: listID }
        }
    })
    await mtblTaiSanADD(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
function checkDuplicate(array, elm) {
    var check = false;
    array.forEach(item => {
        if (item === elm) check = true;
    })
    return check;
}
module.exports = {
    deleteRelationshiptblTaiSanADD,
    // add_tbl_TaiSanADD
    addtblTaiSanADD: (req, res) => {
        let body = req.body;
        console.log(body);
        body.taisan = JSON.parse(body.taisan)
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblTaiSanADD(db).create({
                        IDNhaCungCap: body.idNhaCungCap ? body.idNhaCungCap : null,
                        Date: moment(body.date).format('YYYY-MM-DD HH:mm:ss.SSS') ? body.date : null,
                    }).then(async data => {
                        if (body.fileAttach > 0)
                            await mtblFileAttach(db).create({
                                Name: body.fileAttach.fileName,
                                Link: body.fileAttach.link,
                                IDTaiSanADD: data.ID,
                            })
                        for (var i = 0; i < body.taisan.length; i++) {
                            mtblTaiSan(db).create({
                                IDDMHangHoa: body.taisan[i].idDMHangHoa ? body.taisan[i].idDMHangHoa : null,
                                OriginalPrice: body.taisan[i].originalPrice ? body.taisan[i].originalPrice : null,
                                // IDLoaiTaiSan: body.taisan[i].idLoaiTaiSan ? body.taisan[i].idLoaiTaiSan : '',
                                Unit: body.taisan[i].unit ? body.taisan[i].unit : '',
                                Specifications: body.taisan[i].specifications ? body.taisan[i].specifications : '',
                                GuaranteeMonth: body.taisan[i].guaranteeMonth ? body.taisan[i].guaranteeMonth : null,
                                IDTaiSanDiKem: body.taisan[i].idTaiSanDiKem ? body.taisan[i].idTaiSanDiKem : null,
                                SerialNumber: body.taisan[i].serialNumber ? body.taisan[i].serialNumber : '',
                                Describe: body.taisan[i].describe ? body.taisan[i].describe : '',
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
    // update_tbl_TaiSanADD
    updatetblTaiSanADD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.idNhaCungCap || body.idNhaCungCap === '') {
                        if (body.idNhaCungCap === '')
                            update.push({ key: 'IDNhaCungCap', value: null });
                        else
                            update.push({ key: 'IDNhaCungCap', value: body.idNhaCungCap });
                    }
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    body.taisan = JSON.parse(body.taisan)
                    if (body.taisan.length > 0)
                        for (var i = 0; i < body.taisan.length; i++) {
                            mtblTaiSan(db).update({
                                IDDMHangHoa: body.taisan[i].idDMHangHoa ? body.taisan[i].idDMHangHoa : null,
                                OriginalPrice: body.taisan[i].originalPrice ? body.taisan[i].originalPrice : null,
                                Unit: body.taisan[i].unit ? body.taisan[i].unit : '',
                                IDTaiSanADD: body.id ? body.id : '',
                                Specifications: body.taisan[i].specifications ? body.taisan[i].specifications : '',
                                GuaranteeMonth: body.taisan[i].guaranteeMonth ? body.taisan[i].guaranteeMonth : null,
                                IDTaiSanDiKem: body.taisan[i].idTaiSanDiKem ? body.taisan[i].idTaiSanDiKem : null,
                                SerialNumber: body.taisan[i].serialNumber ? body.taisan[i].serialNumber : '',
                                Describe: body.taisan[i].describe ? body.taisan[i].describe : '',
                            }, { where: { ID: body.taisan[i].idTaiSanADD } })
                        }
                    if (body.fileAttach.length > 0)
                        for (var j = 0; j < body.fileAttach.length; j++)
                            await mtblFileAttach(db).update({
                                Name: body.fileAttach[j].fileName,
                                Link: body.fileAttach[j].link,
                            }, { where: { where: { ID: body.fileAttach[j].idFileAttach } } })
                    database.updateTable(update, mtblTaiSanADD(db), body.id).then(response => {
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
    // delete_tbl_TaiSanADD
    deletetblTaiSanADD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            let body = req.body;
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblTaiSanADD(db, listID);
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
    // get_list_tbl_TaiSanADD
    getListtblTaiSanADD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let whereOjb = []
                    if (body.type != 'TSCSD') {
                        let listIDTaiSan = [];
                        await mtblTaiSanHistory(db).findAll({
                            where: [
                                {
                                    DateThuHoi: { [Op.ne]: null }
                                }
                            ]
                        }).then(data => {
                            data.forEach(item => {
                                if (item.IDTaiSan) {
                                    if (!checkDuplicate(listIDTaiSan, item.IDTaiSan))
                                        listIDTaiSan.push(item.IDTaiSan)
                                }
                            })
                        })
                        let listIDTaiSanADD = [];
                        await mtblTaiSan(db).findAll({
                            where: [
                                {
                                    ID: { [Op.in]: listIDTaiSan }
                                }
                            ]
                        }).then(data => {
                            data.forEach(item => {
                                if (item.IDTaiSanADD) {
                                    if (!checkDuplicate(listIDTaiSanADD, item.IDTaiSanADD))
                                        listIDTaiSanADD.push(item.IDTaiSanADD)
                                }
                            })
                        })
                        whereOjb.push({
                            ID: { [Op.in]: listIDTaiSanADD }
                        })
                    }
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
                    //     whereOjb = { [Op.or]: where };
                    //     if (data.items) {
                    //         for (var i = 0; i < data.items.length; i++) {
                    //             let userFind = {};
                    //             if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                    //                 userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                    //                 if (data.items[i].conditionFields['name'] == 'And') {
                    //                     whereOjb[Op.and] = userFind
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Or') {
                    //                     whereOjb[Op.or] = userFind
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Not') {
                    //                     whereOjb[Op.not] = userFind
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                    let stt = 1;
                    let tblTaiSanADD = mtblTaiSanADD(db);
                    tblTaiSanADD.hasMany(mtblTaiSan(db), { foreignKey: 'IDTaiSanADD', as: 'add' })
                    tblTaiSanADD.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [
                            {
                                model: mtblTaiSan(db),
                                required: false,
                                as: 'add'
                            },
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                idNhaCungCap: element.IDNhaCungCap ? element.IDNhaCungCap : null,
                                date: element.Date ? element.Date : null,
                                line: element.add
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblTaiSan(db).count({ where: whereOjb })
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
    // get_list_tbl_TaiSan_ChuaSuDung
    getListtblTaiSanChuaSuDung: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let whereOjb = []

                    let listIDTaiSan = [];
                    await mtblTaiSanHistory(db).findAll({
                        where: [
                            {
                                DateThuHoi: { [Op.ne]: null }
                            }
                        ]
                    }).then(data => {
                        data.forEach(item => {
                            if (item.IDTaiSan) {
                                if (!checkDuplicate(listIDTaiSan, item.IDTaiSan))
                                    listIDTaiSan.push(item.IDTaiSan)
                            }
                        })
                    })
                    whereOjb.push({
                        ID: { [Op.in]: listIDTaiSan }
                    })

                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        // if (data.search) {
                        //     where = [
                        //         { FullName: { [Op.like]: '%' + data.search + '%' } },
                        //         { Address: { [Op.like]: '%' + data.search + '%' } },
                        //         { CMND: { [Op.like]: '%' + data.search + '%' } },
                        //         { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
                        //     ];
                        // } else {
                        //     where = [
                        //         { FullName: { [Op.ne]: '%%' } },
                        //     ];
                        // }
                        // whereOjb = { [Op.or]: where };
                        // if (data.items) {
                        //     for (var i = 0; i < data.items.length; i++) {
                        //         let userFind = {};
                        //         if (data.items[i].fields['name'] === 'MÃ TÀI SẢN') {
                        //             userFind['SerialNumber'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                        //             if (data.items[i].conditionFields['name'] == 'And') {
                        //                 whereOjb[Op.and] = userFind
                        //             }
                        //             if (data.items[i].conditionFields['name'] == 'Or') {
                        //                 whereOjb[Op.or] = userFind
                        //             }
                        //             if (data.items[i].conditionFields['name'] == 'Not') {
                        //                 whereOjb[Op.not] = userFind
                        //             }
                        //         }
                        //     }
                        // }
                    }
                    let tblTaiSan = mtblTaiSan(db);
                    tblTaiSan.belongsTo(mtblTaiSanADD(db), { foreignKey: 'IDTaiSanADD', sourceKey: 'IDTaiSanADD', as: 'taisan' })
                    tblTaiSan.belongsTo(mtblDMHangHoa(db), { foreignKey: 'IDDMHangHoa', sourceKey: 'IDDMHangHoa', as: 'hanghoa' })
                    let tblDMHangHoa = mtblDMHangHoa(db);
                    tblDMHangHoa.belongsTo(mtblDMLoaiTaiSan(db), { foreignKey: 'IDDMLoaiTaiSan', sourceKey: 'IDDMLoaiTaiSan', as: 'loaitaisan' })

                    tblTaiSan.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [
                            {
                                model: mtblTaiSanADD(db),
                                required: false,
                                as: 'taisan'
                            },
                            {
                                model: tblDMHangHoa,
                                required: false,
                                as: 'hanghoa',
                                include: [
                                    {
                                        model: mtblDMLoaiTaiSan(db),
                                        required: false,
                                        as: 'loaitaisan'
                                    },
                                ],
                            },
                        ],
                    }).then(async data => {
                        var array = [];
                        var stt = 1;
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                idDMHangHoa: element.IDDMHangHoa ? element.IDDMHangHoa : null,
                                nameDMHangHoa: element.hanghoa ? element.hanghoa.Name : '',
                                codeDMHangHoa: element.hanghoa ? element.hanghoa.Code : '',
                                idLoaiTaiSan: element.hanghoa ? element.hanghoa.loaitaisan ? element.hanghoa.loaitaisan.ID : '' : null,
                                nameLoaiTaiSan: element.hanghoa ? element.hanghoa.loaitaisan ? element.hanghoa.loaitaisan.Name : '' : null,
                                codeLoaiTaiSan: element.loaitaisan ? element.loaitaisan.Code : '',
                                unit: element.Unit ? element.Unit : null,
                                serialNumber: element.SerialNumber ? element.SerialNumber : null,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblTaiSan(db).count({ where: whereOjb })
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
    // get_list_tbl_TaiSan_TheoDoi
    getListtblTaiSanTheoDoi: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let whereOjb = []

                    let listIDTaiSan = [];
                    await mtblTaiSanHistory(db).findAll({
                        where: [
                            {
                                DateThuHoi: { [Op.ne]: null }
                            }
                        ]
                    }).then(data => {
                        data.forEach(item => {
                            if (item.IDTaiSan) {
                                if (!checkDuplicate(listIDTaiSan, item.IDTaiSan))
                                    listIDTaiSan.push(item.IDTaiSan)
                            }
                        })
                    })
                    whereOjb.push({
                        ID: { [Op.notIn]: listIDTaiSan }
                    })

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
                    //     whereOjb = { [Op.or]: where };
                    //     if (data.items) {
                    //         for (var i = 0; i < data.items.length; i++) {
                    //             let userFind = {};
                    //             if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                    //                 userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                    //                 if (data.items[i].conditionFields['name'] == 'And') {
                    //                     whereOjb[Op.and] = userFind
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Or') {
                    //                     whereOjb[Op.or] = userFind
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Not') {
                    //                     whereOjb[Op.not] = userFind
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                    let tblTaiSan = mtblTaiSan(db);
                    tblTaiSan.belongsTo(mtblTaiSanADD(db), { foreignKey: 'IDTaiSanADD', sourceKey: 'IDTaiSanADD', as: 'taisan' })
                    tblTaiSan.belongsTo(mtblDMHangHoa(db), { foreignKey: 'IDDMHangHoa', sourceKey: 'IDDMHangHoa', as: 'hanghoa' })
                    let tblDMHangHoa = mtblDMHangHoa(db);
                    tblDMHangHoa.belongsTo(mtblDMLoaiTaiSan(db), { foreignKey: 'IDDMLoaiTaiSan', sourceKey: 'IDDMLoaiTaiSan', as: 'loaitaisan' })
                    tblTaiSan.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [
                            {
                                model: mtblTaiSanADD(db),
                                required: false,
                                as: 'taisan'
                            },
                            {
                                model: tblDMHangHoa,
                                required: false,
                                as: 'hanghoa',
                                include: [
                                    {
                                        model: mtblDMLoaiTaiSan(db),
                                        required: false,
                                        as: 'loaitaisan'
                                    },
                                ],
                            },
                            // {
                            //     model: mtblDMLoaiTaiSan(db),
                            //     required: false,
                            //     as: 'loaitaisan'
                            // },
                        ],
                    }).then(async data => {
                        var array = [];
                        var stt = 1;
                        let tblTaiSanBanGiao = mtblTaiSanBanGiao(db);
                        tblTaiSanBanGiao.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVienSoHuu', sourceKey: 'IDNhanVienSoHuu', as: 'nhanvien' })
                        tblTaiSanBanGiao.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhanSoHuu', sourceKey: 'IDBoPhanSoHuu', as: 'bophan' })
                        for (var i = 0; i < data.length; i++) {
                            var history = await mtblTaiSanHistory(db).findOne({ where: { IDTaiSan: data[i].ID } })
                            var bangiao;
                            if (history) {
                                bangiao = await tblTaiSanBanGiao.findOne({
                                    where: { ID: history.IDTaiSanBanGiao },
                                    include: [
                                        {
                                            model: mtblDMNhanvien(db),
                                            required: false,
                                            as: 'nhanvien'
                                        },
                                        {
                                            model: mtblDMBoPhan(db),
                                            required: false,
                                            as: 'bophan'
                                        },
                                    ],
                                })
                            }
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                idDMHangHoa: data[i].IDDMHangHoa ? data[i].IDDMHangHoa : null,
                                nameDMHangHoa: data[i].hanghoa ? data[i].hanghoa.Name : '',
                                codeDMHangHoa: data[i].hanghoa ? data[i].hanghoa.Code : '',
                                idLoaiTaiSan: data[i].hanghoa ? data[i].hanghoa.loaitaisan ? data[i].hanghoa.loaitaisan.ID : '' : null,
                                nameLoaiTaiSan: data[i].hanghoa ? data[i].hanghoa.loaitaisan ? data[i].hanghoa.loaitaisan.Name : '' : null,
                                codeLoaiTaiSan: data[i].hanghoa ? data[i].hanghoa.loaitaisan ? data[i].hanghoa.loaitaisan.Code : '' : null,
                                unit: data[i].Unit ? data[i].Unit : null,
                                employeeName: bangiao ? bangiao.nhanvien ? bangiao.nhanvien.StaffName : '' : '',
                                departmentName: bangiao ? bangiao.bophan ? bangiao.bophan.DepartmentName : '' : '',
                            }
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblTaiSan(db).count({ where: whereOjb })
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
