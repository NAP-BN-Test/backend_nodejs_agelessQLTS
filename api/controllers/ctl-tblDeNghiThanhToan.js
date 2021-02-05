const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDeNghiThanhToan = require('../tables/qlnb/tblDeNghiThanhToan')
var database = require('../database');
var mtblFileAttach = require('../tables/constants/tblFileAttach');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMUser = require('../tables/constants/tblDMUser');
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblDMChiNhanh = require('../tables/constants/tblDMChiNhanh')
var mtblYeuCauMuaSam = require('../tables/qlnb/tblYeuCauMuaSam')

async function deleteRelationshiptblDeNghiThanhToan(db, listID) {
    await mtblFileAttach(db).destroy({
        where: {
            IDDeNghiThanhToan: { [Op.in]: listID }
        }
    })
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
                        TrangThaiPheDuyetKT: 'Chờ phê duyệt',
                        IDNhanVienLDPD: body.idNhanVienLDPD ? body.idNhanVienLDPD : null,
                        Description: body.description ? body.description : '',
                        TrangThaiPheDuyetLD: 'Chờ phê duyệt',
                    }).then(async data => {
                        body.fileAttach = JSON.parse(body.fileAttach)
                        if (body.fileAttach.length > 0)
                            for (var j = 0; j < body.fileAttach.length; j++)
                                await mtblFileAttach(db).update({
                                    IDDeNghiThanhToan: data.ID,
                                }, {
                                    where: {
                                        ID: body.fileAttach[j].id
                                    }
                                })
                        if (body.listID) {
                            body.listID = JSON.parse(body.listID)
                            if (body.listID.length > 0)
                                for (var i = 0; i < body.listID.length; i++)
                                    await mtblYeuCauMuaSam(db).update({
                                        Status: 'Đang thanh toán',
                                        IDPaymentOrder: data.ID
                                    }, { where: { ID: body.listID[i] } })
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
    // update_tbl_denghi_thanhtoan
    updatetblDeNghiThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    body.fileAttach = JSON.parse(body.fileAttach)
                    if (body.fileAttach.length > 0)
                        for (var j = 0; j < body.fileAttach.length; j++)
                            await mtblFileAttach(db).update({
                                IDDeNghiThanhToan: body.id,
                            }, {
                                where: {
                                    ID: body.fileAttach[j].id
                                }
                            })
                    let update = [];
                    if (body.idNhanVien || body.idNhanVien === '') {
                        if (body.idNhanVien === '')
                            update.push({ key: 'IDNhanVien', value: null });
                        else
                            update.push({ key: 'IDNhanVien', value: body.idNhanVien });
                    }
                    if (body.contents || body.contents === '')
                        update.push({ key: 'Contents', value: body.contents });
                    if (body.description || body.description === '')
                        update.push({ key: 'Description', value: body.description });
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
                    await mtblYeuCauMuaSam(db).update({
                        Status: 'Đã mua',
                        IDPaymentOrder: null
                    }, { where: { IDPaymentOrder: { [Op.in]: listID } } })
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
                    var whereObj = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            var list = [];
                            await mtblDMNhanvien(db).findAll({
                                order: [
                                    ['ID', 'DESC']
                                ],
                                where: {
                                    [Op.or]: [
                                        { StaffCode: { [Op.like]: '%' + data.search + '%' } },
                                        { StaffName: { [Op.like]: '%' + data.search + '%' } }
                                    ]
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    list.push(item.ID);
                                })
                            })
                            where = [
                                { IDNhanVien: { [Op.in]: list } },
                            ];
                        } else {
                            where = [
                                { Contents: { [Op.ne]: '%%' } },
                            ];
                        }
                        let whereO = { [Op.or]: where };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'NGƯỜI ĐỀ NGHỊ') {
                                    var list = [];
                                    await mtblDMNhanvien(db).findAll({
                                        order: [
                                            ['ID', 'DESC']
                                        ],
                                        where: {
                                            [Op.or]: [
                                                { StaffCode: { [Op.like]: '%' + data.items[i]['searchFields'] + '%' } },
                                                { StaffName: { [Op.like]: '%' + data.items[i]['searchFields'] + '%' } }
                                            ]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.ID);
                                        })
                                    })
                                    userFind['IDNhanVien'] = { [Op.in]: list }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereO[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereO[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereO[Op.not] = userFind
                                    }
                                }
                            }
                        }
                        let userObj = [];
                        if (body.userID) {
                            let staff = await mtblDMUser(db).findOne({
                                where: { ID: body.userID }
                            })
                            if (staff && staff.Username.toUpperCase() != 'ADMIN') {
                                userObj.push({ IDNhanVien: staff.IDNhanvien })
                                userObj.push({ IDNhanVienKTPD: staff.IDNhanvien })
                                userObj.push({ IDNhanVienLDPD: staff.IDNhanvien })
                            }

                        }
                        if (userObj.length > 0)

                            whereObj = {
                                // [Op.or]: where,
                                [Op.and]: [{ [Op.or]: userObj }, { [Op.or]: whereO }],
                            }
                        else
                            whereObj = {
                                // [Op.or]: where,
                                [Op.and]: [{ [Op.or]: whereO }],
                            }
                    }
                    let stt = 1;
                    let tblDeNghiThanhToan = mtblDeNghiThanhToan(db);
                    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
                    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'idNhanVienKTPD', sourceKey: 'idNhanVienKTPD', as: 'KTPD' })
                    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'idNhanVienLDPD', sourceKey: 'idNhanVienLDPD', as: 'LDPD' })
                    tblDeNghiThanhToan.findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereObj,
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
                            let statusKT;
                            if (element.TrangThaiPheDuyetKT === 'Đã phê duyệt')
                                statusKT = element.KTPD ? element.KTPD.StaffName : '';
                            else if (element.TrangThaiPheDuyetKT === 'Từ chối')
                                statusKT = element.ReasonRejectKTPD ? element.ReasonRejectKTPD : '';
                            else
                                statusKT = element.TrangThaiPheDuyetKT ? element.TrangThaiPheDuyetKT : '';
                            let statusLD;
                            if (element.TrangThaiPheDuyetLD === 'Đã phê duyệt')
                                statusLD = element.LDPD ? element.LDPD.StaffName : '';
                            else if (element.TrangThaiPheDuyetLD === 'Từ chối')
                                statusLD = element.ReasonRejectLDPD ? element.ReasonRejectLDPD : '';
                            else
                                statusLD = element.TrangThaiPheDuyetLD ? element.TrangThaiPheDuyetLD : '';
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                idNhanVien: element.IDNhanVien ? element.IDNhanVien : null,
                                nameNhanVien: element.NhanVien ? element.NhanVien.StaffName : '',
                                contents: element.Contents ? element.Contents : '',
                                cost: element.Cost ? element.Cost : null,
                                idNhanVienKTPD: element.IDNhanVienKTPD ? element.IDNhanVienKTPD : null,
                                nameNhanVienKTPD: element.KTPD ? element.KTPD.StaffName : '',
                                trangThaiPheDuyetKT: statusKT,
                                idNhanVienLDPD: element.IDNhanVienLDPD ? element.IDNhanVienLDPD : null,
                                nameNhanVienLDPD: element.LDPD ? element.LDPD.StaffName : '',
                                trangThaiPheDuyetLD: statusLD,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        for (var i = 0; i < array.length; i++) {
                            var arrayFile = []
                            await mtblFileAttach(db).findAll({ where: { IDDeNghiThanhToan: array[i].id } }).then(file => {
                                if (file.length > 0) {
                                    for (var e = 0; e < file.length; e++) {
                                        arrayFile.push({
                                            name: file[e].Name ? file[e].Name : '',
                                            link: file[e].Link ? file[e].Link : '',
                                        })
                                    }
                                }
                            })
                            array[i]['arrayFile'] = arrayFile;
                            await mtblYeuCauMuaSam(db).findOne({ where: { IDPaymentOrder: array[i].id } }).then(data => {
                                if (data)
                                    array[i]['check'] = true;
                                else
                                    array[i]['check'] = false;
                            })
                        }
                        var count = await mtblDeNghiThanhToan(db).count({ where: whereObj, })
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
    // detail_tbl_denghi_thanhtoan
    detailtblDeNghiThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    let tblDeNghiThanhToan = mtblDeNghiThanhToan(db);
                    let tblDMNhanvien = mtblDMNhanvien(db);
                    let tblDMBoPhan = mtblDMBoPhan(db);
                    tblDMNhanvien.belongsTo(tblDMBoPhan, { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bophan' })
                    tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh', as: 'chinhanh' })

                    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
                    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'idNhanVienKTPD', sourceKey: 'idNhanVienKTPD', as: 'KTPD' })
                    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'idNhanVienLDPD', sourceKey: 'idNhanVienLDPD', as: 'LDPD' })
                    tblDeNghiThanhToan.findOne({
                        where: { ID: body.id },
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        include: [
                            {
                                model: tblDMNhanvien,
                                required: false,
                                as: 'NhanVien',
                                include: [
                                    {
                                        model: tblDMBoPhan,
                                        required: false,
                                        as: 'bophan',
                                        include: [
                                            {
                                                model: mtblDMChiNhanh(db),
                                                required: false,
                                                as: 'chinhanh'
                                            },
                                        ],
                                    },
                                ],
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
                        var obj = {
                            stt: stt,
                            id: Number(data.ID),
                            idNhanVien: data.IDNhanVien ? Number(data.IDNhanVien) : null,
                            nameNhanVien: data.NhanVien ? data.NhanVien.StaffName : '',
                            contents: data.Contents ? data.Contents : '',
                            cost: data.Cost ? data.Cost : null,
                            idNhanVienKTPD: data.IDNhanVienKTPD ? Number(data.IDNhanVienKTPD) : null,
                            nameNhanVienKTPD: data.KTPD ? data.KTPD.StaffName : '',
                            trangThaiPheDuyetKT: data.trangThaiPheDuyetKT ? data.trangThaiPheDuyetKT : '',
                            idNhanVienLDPD: data.IDNhanVienLDPD ? Number(data.IDNhanVienLDPD) : null,
                            description: data.Description ? data.Description : '',
                            nameNhanVienLDPD: data.LDPD ? data.LDPD.StaffName : '',
                            trangThaiPheDuyetLD: data.trangThaiPheDuyetLD ? data.trangThaiPheDuyetLD : '',
                            idPhongBan: {
                                id: data.NhanVien ? data.NhanVien.bophan ? Number(data.NhanVien.bophan.ID) : '' : '',
                                departmentName: data.NhanVien ? data.NhanVien.bophan ? data.NhanVien.bophan.DepartmentName : '' : '',
                                departmentCode: data.NhanVien ? data.NhanVien.bophan ? data.NhanVien.bophan.DepartmentCode : '' : '',
                            },
                            branchID: data.NhanVien ? data.NhanVien.bophan ? data.NhanVien.bophan.chinhanh ? Number(data.NhanVien.bophan.chinhanh.ID) : null : null : null,
                            branchName: data.NhanVien ? data.NhanVien.bophan ? data.NhanVien.bophan.chinhanh ? data.NhanVien.bophan.chinhanh.BranchName : '' : '' : '',
                            branchCode: data.NhanVien ? data.NhanVien.bophan ? data.NhanVien.bophan.chinhanh ? data.NhanVien.bophan.chinhanh.BranchCode : '' : '' : '',
                        }
                        stt += 1;
                        var arrayFile = []
                        await mtblFileAttach(db).findAll({ where: { IDDeNghiThanhToan: obj.id } }).then(file => {
                            if (file.length > 0) {
                                for (var e = 0; e < file.length; e++) {
                                    arrayFile.push({
                                        name: file[e].Name ? file[e].Name : '',
                                        link: file[e].Link ? file[e].Link : '',
                                        id: file[e].ID,
                                    })
                                }
                            }
                        })

                        obj['arrayFile'] = arrayFile;
                        var result = {
                            obj: obj,
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
    // approval_employee_accountant
    approvalNhanVienKTPD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblDeNghiThanhToan(db).update({
                        TrangThaiPheDuyetKT: 'Đã phê duyệt'
                    }, {
                        where: { ID: body.id }
                    })
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
    // approval_employee_leader
    approvalNhanVienLDPD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblDeNghiThanhToan(db).update({
                        TrangThaiPheDuyetLD: 'Đã phê duyệt'
                    }, {
                        where: { ID: body.id }
                    })
                    await mtblYeuCauMuaSam(db).update({
                        Status: 'Hoàn thành',
                    }, { where: { IDPaymentOrder: body.id } })
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
    //  refuse_employee_accountant
    refuseNhanVienKTPD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblDeNghiThanhToan(db).update({
                        TrangThaiPheDuyetKT: 'Từ chối',
                        ReasonRejectKTPD: body.reason ? body.reason : '',
                    }, {
                        where: { ID: body.id }
                    })
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
    //  refuse_employee_leader
    refuseNhanVienLDPD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblDeNghiThanhToan(db).update({
                        TrangThaiPheDuyetLD: 'Từ chối',
                        ReasonRejectLDPD: body.reason ? body.reason : '',
                    }, {
                        where: { ID: body.id }
                    })
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
}