const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDeNghiThanhToan = require('../tables/qlnb/tblDeNghiThanhToan')
var database = require('../database');
var mtblFileAttach = require('../tables/constants/tblFileAttach');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMUser = require('../tables/constants/tblDMUser');

async function deleteRelationshiptblDeNghiThanhToan(db, listID) {
    await mtblDeNghiThanhToan(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblDeNghiThanhToan,
    // add_tbl_denghi_thanhtoan
    addtblDeNghiThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDeNghiThanhToan(db).create({
                        IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                        Contents: body.contents ? body.contents : '',
                        Cost: body.cost ? body.cost : null,
                        IDNhanVienKTPD: body.idNhanVienKTPD ? body.idNhanVienKTPD : null,
                        TrangThaiPheDuyetKT: body.trangThaiPheDuyetKT ? body.trangThaiPheDuyetKT : '',
                        IDNhanVienLDPD: body.idNhanVienLDPD ? body.idNhanVienLDPD : null,
                        TrangThaiPheDuyetLD: body.trangThaiPheDuyetLD ? body.trangThaiPheDuyetLD : '',
                    }).then(async data => {
                        if (body.fileAttach.length > 0)
                            for (var j = 0; j < body.fileAttach.length; j++)
                                await mtblFileAttach(db).create({
                                    Name: body.fileAttach[j].fileName,
                                    Link: body.fileAttach[j].link,
                                    IDDeNghiThanhToan: data.ID,
                                })
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
    // update_tbl_denghi_thanhtoan
    updatetblDeNghiThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    if (body.fileAttach.length > 0)
                        for (var j = 0; j < body.fileAttach.length; j++)
                            await mtblFileAttach(db).update({
                                Name: body.fileAttach[j].fileName,
                                Link: body.fileAttach[j].link,
                            }, {
                                where: { ID: body.fileAttach[j].idFileAttach }
                            })
                    let update = [];
                    if (body.idNhanvien || body.idNhanvien === '') {
                        if (body.idNhanvien === '')
                            update.push({ key: 'IDNhanvien', value: null });
                        else
                            update.push({ key: 'IDNhanvien', value: body.idNhanvien });
                    }
                    if (body.contents || body.contents === '')
                        update.push({ key: 'Contents', value: body.contents });
                    if (body.cost || body.cost === '') {
                        if (body.cost === '')
                            update.push({ key: 'Cost', value: null });
                        else
                            update.push({ key: 'Cost', value: body.cost });
                    }
                    if (body.idNhanVienKTPD || body.idNhanVienKTPD === '') {
                        if (body.idNhanVienKTPD === '')
                            update.push({ key: 'IDNhanVienKTPD', value: null });
                        else
                            update.push({ key: 'IDNhanVienKTPD', value: body.idNhanVienKTPD });
                    }
                    if (body.TrangThaiPheDuyetKT || body.TrangThaiPheDuyetKT === '')
                        update.push({ key: 'TrangThaiPheDuyetKT', value: body.TrangThaiPheDuyetKT });
                    if (body.idNhanVienLDPD || body.idNhanVienLDPD === '') {
                        if (body.idNhanVienLDPD === '')
                            update.push({ key: 'IDNhanVienLDPD', value: null });
                        else
                            update.push({ key: 'IDNhanVienLDPD', value: body.idNhanVienLDPD });
                    }
                    if (body.trangThaiPheDuyetLD || body.trangThaiPheDuyetLD === '')
                        update.push({ key: 'TrangThaiPheDuyetLD', value: body.trangThaiPheDuyetLD });
                    database.updateTable(update, mtblDeNghiThanhToan(db), body.id).then(response => {
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
    // delete_tbl_denghi_thanhtoan
    deletetblDeNghiThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDeNghiThanhToan(db, listID);
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
    // get_list_tbl_denghi_thanhtoan
    getListtblDeNghiThanhToan: (req, res) => {
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
                    let stt = 1;
                    let tblDeNghiThanhToan = mtblDeNghiThanhToan(db);
                    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
                    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'idNhanVienKTPD', sourceKey: 'idNhanVienKTPD', as: 'KTPD' })
                    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'idNhanVienLDPD', sourceKey: 'idNhanVienLDPD', as: 'LDPD' })
                    tblDeNghiThanhToan.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'NhanVien'
                            },
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'KTPD'
                            },
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'LDPD'
                            },
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                idNhanVien: element.IDNhanVien ? element.IDNhanVien : null,
                                nameNhanVien: element.NhanVien ? element.NhanVien.StaffName : '',
                                contents: element.Contents ? element.Contents : '',
                                cost: element.Cost ? element.Cost : null,
                                idNhanVienKTPD: element.IDNhanVienKTPD ? element.IDNhanVienKTPD : null,
                                nameNhanVienKTPD: element.KTPD ? element.KTPD.StaffName : '',
                                trangThaiPheDuyetKT: element.trangThaiPheDuyetKT ? element.trangThaiPheDuyetKT : '',
                                idNhanVienLDPD: element.IDNhanVienLDPD ? element.IDNhanVienLDPD : null,
                                nameNhanVienLDPD: element.LDPD ? element.LDPD.StaffName : '',
                                trangThaiPheDuyetLD: element.trangThaiPheDuyetLD ? element.trangThaiPheDuyetLD : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblDeNghiThanhToan(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_denghi_thanhtoan
    getListNametblDeNghiThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDeNghiThanhToan(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                contents: element.Contents ? element.Contents : '',
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
    // approval_denghi_thanhtoan
    approvalDeNghiThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMUser(db).findOne({
                        where: { ID: body.userID }
                    }).then(data => {
                        if (data)
                            mtblDMNhanvien(db).findOne({
                                where: { ID: data.IDNhanVien }
                            }).then(nhanvien => {
                                if (nhanvien)
                                    mtblDeNghiThanhToan(db).findOne({
                                        where: { ID: body.idDeNghiThanhToan }
                                    }).then(async denghi => {
                                        if (denghi) {
                                            if (denghi.idNhanVienKTPD = nhanvien.ID) {
                                                await mtblDeNghiThanhToan(db).update({
                                                    TrangThaiPheDuyetKT: 'Đã phê duyệt'
                                                }, {
                                                    where: { ID: denghi.ID }
                                                })
                                            }
                                            else if (denghi.idNhanVienLDPD = nhanvien.ID) {
                                                await mtblDeNghiThanhToan(db).update({
                                                    trangThaiPheDuyetLD: 'Đã phê duyệt'
                                                }, {
                                                    where: { ID: denghi.ID }
                                                })
                                            }
                                            var result = {
                                                status: Constant.STATUS.SUCCESS,
                                                message: Constant.MESSAGE.ACTION_SUCCESS,
                                            }
                                            res.json(result);
                                        }
                                    })
                            })
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