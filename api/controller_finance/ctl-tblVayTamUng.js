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
            ID: listID
        }
    })
}
dataStaff = [
    {
        id: '1',
        staffCode: 'NV001',
        fullName: 'NGUYỄN THỊ THU',
        gender: 'Nữ',
        birthday: '20/03/1992',
        cmndNumber: '125457789',
        address: 'Số 13 Hoàng Mai Hà Nội',
        mobile: '065817845',
        email: 'thu123@gmail.com',
        departmentName: 'Ban MKT',
        branchName: 'Việt Nam',
    },
    {
        id: '2',
        staffCode: 'NV002',
        fullName: 'Nguyễn Anh Tuấn',
        gender: 'Nam',
        birthday: '15/04/1994',
        cmndNumber: '123789210',
        address: 'Số 21A Kim Ngưu Hoàng Mai Hai Bà Trưng Hà Nội',
        mobile: '067812345',
        email: 'tuanna@gmail.com',
        departmentName: 'Ban sáng chế',
        branchName: 'Việt Nam',
    },
    {
        id: '3',
        staffCode: 'NV003',
        fullName: 'NGUYỄN THỊ THU HUYỀN',
        gender: 'Nữ',
        birthday: '25/09/2021',
        cmndNumber: '126412031',
        address: 'Số 204 Nguyễn Văn Cừ Long Biên Hà Nội',
        mobile: '036784521',
        email: 'thuhuyen@gmail.com',
        departmentName: 'Ban NH1',
        branchName: 'Việt Nam',
    },
    {
        id: '4',
        staffCode: 'NV004',
        fullName: 'Phạm Đức Anh',
        gender: 'Nam',
        birthday: '10/05/1985',
        cmndNumber: '121012351',
        address: 'Số 2 Đào Tấn Hà Nội',
        mobile: '0365412784',
        email: 'anhduc12@gmail.com',
        departmentName: 'Ban sáng chế',
        branchName: 'Việt Nam',
    },
    {
        id: '5',
        staffCode: 'NV005',
        fullName: 'Trần Quỳnh Trang',
        gender: 'Nữ',
        birthday: '18/03/1991',
        cmndNumber: '125317451',
        address: 'Số 23 Tam Trinh Hoàng Mai Hà Nội',
        mobile: '0368451274',
        email: 'trang123@gmail.com',
        departmentName: 'Ban NH1',
        branchName: 'Việt Nam',
    },
    {
        id: '6',
        staffCode: 'NV006',
        fullName: 'Nguyễn Thị Thu Trang',
        gender: 'Nữ',
        birthday: '20/09/1988',
        cmndNumber: '12612468',
        address: 'Số 1B Ngõ 286 Lĩnh Nam Hoàng Mai Hà Nội',
        mobile: '098714521',
        email: 'thutrang@gmail.com',
        departmentName: 'Ban Kế toán',
        branchName: 'Việt Nam',
    },
    {
        id: '7',
        staffCode: 'NV007',
        fullName: 'Vũ Văn Chiến',
        gender: 'Nam',
        birthday: '16/06/1990',
        cmndNumber: '125781423',
        address: 'Số 25 Ngọc Lâm Long Biên Hà Nội',
        mobile: '083654127',
        email: 'vvchien@gmail.com',
        departmentName: 'Ban Sáng chế',
        branchName: 'Việt Nam',
    },
    {
        id: '8',
        staffCode: 'NV008',
        fullName: 'lê Thị Ngọc Diệp',
        gender: 'Nữ',
        birthday: '25/10/1996',
        cmndNumber: '125021342',
        address: 'Số 3B Hàng Mã Hà Nội',
        mobile: '012784125',
        email: 'diephn@gmail.com',
        departmentName: 'Ban Sáng chế',
        branchName: 'Việt Nam',
    },
    {
        id: '9',
        staffCode: 'NV009',
        fullName: 'Vũ Quang Minh',
        gender: 'Nam',
        birthday: '06/06/1980',
        cmndNumber: '126120412',
        address: 'Số 86 Thái Hà Hà Nội',
        mobile: '086234517',
        email: 'vuminh@gmail.com',
        departmentName: 'Ban NH2',
        branchName: 'Việt Nam',
    },
    {
        id: '10',
        staffCode: 'NV010',
        fullName: 'Nguyễn Thị Thu Hà',
        gender: 'Nữ',
        birthday: '14/02/1985',
        cmndNumber: '121453245',
        address: 'Số 26 Hàng Chiếu Hà Nội',
        mobile: '089631242',
        email: 'thuha12@gmail.com',
        departmentName: 'Ban Kế toán',
        branchName: 'Việt Nam',
    },
    {
        id: '1',
        staffCode: 'NV001',
        fullName: 'NGUYỄN THỊ THU',
        gender: 'Nữ',
        birthday: '20/03/1992',
        cmndNumber: '125457789',
        address: 'Số 13 Hoàng Mai Hà Nội',
        mobile: '',
        email: '',
        departmentName: '',
        branchName: '',
    }
]
async function getDetailStaff(id) {
    var nameStaff;
    for (var i = 0; i < dataStaff.length; i++) {
        if (id == dataStaff[i].id) {
            nameStaff = dataStaff[i].fullName
            break
        }
    }
    // console.log(nameStaff);
    return nameStaff
}
async function getDepartmentFromStaff(id) {
    var departmentStaff;
    for (var i = 0; i < dataStaff.length; i++) {
        if (id == dataStaff[i].id) {
            departmentStaff = dataStaff[i].departmentName
            break
        }
    }
    return departmentStaff
}
async function getBranchFromStaff(id) {
    var branchStaff;
    for (var i = 0; i < dataStaff.length; i++) {
        if (id == dataStaff[i].id) {
            branchStaff = dataStaff[i].branchName
            break
        }
    }
    return branchStaff
}
var mModules = require('../constants/modules');

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
                    }).then(async data => {
                        if (data) {
                            var obj = {
                                id: Number(data.ID),
                                advanceCode: data.AdvanceCode ? data.AdvanceCode : '',
                                idNhanVienCreate: data.IDNhanVienCreate ? data.IDNhanVienCreate : null,
                                nameNhanVienCreate: await getDetailStaff(data.IDNhanVienCreate),
                                idBoPhanNVCreate: data.IDBoPhanNVCreate ? data.IDBoPhanNVCreate : null,
                                nameBoPhanNVCreate: await getDepartmentFromStaff(data.IDNhanVienCreate),
                                nameChiNhanhCreate: await getBranchFromStaff(data.IDNhanVienCreate),
                                idNhanVienAdvance: data.IDNhanVienAdvance ? data.IDNhanVienAdvance : null,
                                nameNhanVienAdvance: await getDetailStaff(data.IDNhanVienAdvance),
                                idBoPhanNVAdvance: data.IDBoPhanNVAdvance ? data.IDBoPhanNVAdvance : null,
                                nameBoPhanNVAdvance: await getDepartmentFromStaff(data.IDNhanVienAdvance),
                                date: data.Date ? data.Date : null,
                                contents: data.Contents ? data.Contents : '',
                                cost: data.Cost ? data.Cost : null,
                                idTaiKhoanKeToanCost: data.IDTaiKhoanKeToanCost ? data.IDTaiKhoanKeToanCost : null,
                                nameTaiKhoanKeToanCost: data.tkkt ? data.tkkt.AccountingName : '',
                                idNhanVienLDPD: data.IDNhanVienLD ? data.IDNhanVienLD : null,
                                nameNhanVienLDPD: await getDetailStaff(data.IDNhanVienLD),
                                trangThaiPheDuyetPDLD: data.TrangThaiPheDuyetLD ? data.TrangThaiPheDuyetLD : '',
                                idNhanVienKTPD: data.IDNhanVienPD ? data.IDNhanVienPD : null,
                                nameNhanVienKTPD: await getDetailStaff(data.IDNhanVienPD),
                                trangThaiPheDuyetKTPD: data.TrangThaiPheDuyetPD ? data.TrangThaiPheDuyetPD : '',
                                reason: data.Reason ? data.Reason : '',
                                refunds: data.Refunds ? data.Refunds : true,
                                status: data.Status ? data.Status : true,
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
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblVayTamUng(db).create({
                        AdvanceCode: await mModules.automaticCode(mtblVayTamUng(db), 'AdvanceCode', 'TU'),
                        IDNhanVienCreate: body.idNhanVienCreate ? body.idNhanVienCreate : null,
                        IDBoPhanNVCreate: body.idBoPhanNVCreate ? body.idBoPhanNVCreate : null,
                        IDNhanVienAdvance: body.idNhanVienAdvance ? body.idNhanVienAdvance : null,
                        IDBoPhanNVAdvance: body.idBoPhanNVAdvance ? body.idBoPhanNVAdvance : null,
                        Date: body.date ? body.date : null,
                        Contents: body.contents ? body.contents : '',
                        Cost: body.cost ? body.cost : null,
                        IDTaiKhoanKeToanCost: body.idTaiKhoanKeToanCost ? body.idTaiKhoanKeToanCost : null,
                        IDNhanVienLD: body.idNhanVienLDPD ? body.idNhanVienLDPD : null,
                        TrangThaiPheDuyetLD: 'Chờ phê duyệt',
                        IDNhanVienPD: body.idNhanVienKTPD ? body.idNhanVienKTPD : null,
                        TrangThaiPheDuyetPD: 'Chờ phê duyệt',
                        Reason: body.reason ? body.reason : '',
                        Refunds: body.refunds ? body.refunds : true,
                        Status: 'Chờ phê duyệt'
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
                    if (body.idNhanVienLDPD || body.idNhanVienLDPD === '') {
                        if (body.idNhanVienLDPD === '')
                            update.push({ key: 'IDNhanVienLD', value: null });
                        else
                            update.push({ key: 'IDNhanVienLD', value: body.idNhanVienLDPD });
                    }
                    if (body.idNhanVienKTPD || body.idNhanVienKTPD === '') {
                        if (body.idNhanVienKTPD === '')
                            update.push({ key: 'IDNhanVienPD', value: null });
                        else
                            update.push({ key: 'IDNhanVienPD', value: body.idNhanVienKTPD });
                    }
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
                    if (!body.listID || body.listID == '') {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: 'Không thể xóa bản ghi. Vui lòng kiểm tra lại !',
                        }
                        res.json(result);
                        return
                    }
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
        let dataSearch = JSON.parse(body.dataSearch)
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
                    whereOjb = {
                        [Op.and]: [
                            { Status: { [Op.ne]: 'Chờ hoàn ứng' } },
                            { Status: { [Op.ne]: 'Đã hoàn ứng' } }
                        ]
                    }
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
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                advanceCode: data[i].AdvanceCode ? data[i].AdvanceCode : '',
                                idNhanVienCreate: data[i].IDNhanVienCreate ? data[i].IDNhanVienCreate : null,
                                nameNhanVienCreate: await getDetailStaff(data[i].IDNhanVienCreate),
                                idBoPhanNVCreate: data[i].IDBoPhanNVCreate ? data[i].IDBoPhanNVCreate : null,
                                nameBoPhanNVCreate: await getDepartmentFromStaff(data[i].IDNhanVienCreate),
                                nameChiNhanhCreate: 'chưa có dữ liệu',
                                idNhanVienAdvance: data[i].IDNhanVienAdvance ? data[i].IDNhanVienAdvance : null,
                                nameNhanVienAdvance: await getDetailStaff(data[i].IDNhanVienAdvance),
                                idBoPhanNVAdvance: data[i].IDBoPhanNVAdvance ? data[i].IDBoPhanNVAdvance : null,
                                nameBoPhanNVAdvance: 'chưa có dữ liệu',
                                date: data[i].Date ? moment(data[i].Date).format('DD/MM/YYYY') : null,
                                contents: data[i].Contents ? data[i].Contents : '',
                                cost: data[i].Cost ? data[i].Cost : null,
                                idTaiKhoanKeToanCost: data[i].IDTaiKhoanKeToanCost ? data[i].IDTaiKhoanKeToanCost : null,
                                nameTaiKhoanKeToanCost: data[i].tkkt ? data[i].tkkt.AccountingName : '',
                                idNhanVienLDPD: data[i].IDNhanVienLD ? data[i].IDNhanVienLD : null,
                                nameNhanVienLDPD: await getDetailStaff(data[i].IDNhanVienLD),
                                trangThaiPheDuyetLD: data[i].TrangThaiPheDuyetLD ? data[i].TrangThaiPheDuyetLD : '',
                                idNhanVienKTPD: data[i].IDNhanVienPD ? data[i].IDNhanVienPD : null,
                                nameNhanVienKTPD: await getDetailStaff(data[i].IDNhanVienPD),
                                trangThaiPheDuyetKT: data[i].TrangThaiPheDuyetPD ? data[i].TrangThaiPheDuyetPD : '',
                                reason: data[i].Reason ? data[i].Reason : '',
                                refunds: data[i].Refunds ? data[i].Refunds : true,
                                status: data[i].Status ? data[i].Status : '',
                            }
                            array.push(obj);
                            stt += 1;
                        }
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
    // get_list_reimbursement
    getListReimbursement: (req, res) => {
        let body = req.body;
        let dataSearch = JSON.parse(body.dataSearch)
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
                        where: {
                            [Op.or]: [
                                { Status: 'Chờ hoàn ứng' },
                                { Status: 'Đã hoàn ứng' },
                            ]
                        },
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
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                advanceCode: data[i].AdvanceCode ? data[i].AdvanceCode : '',
                                idNhanVienCreate: data[i].IDNhanVienCreate ? data[i].IDNhanVienCreate : null,
                                nameNhanVienCreate: await getDetailStaff(data[i].IDNhanVienCreate),
                                idBoPhanNVCreate: data[i].IDBoPhanNVCreate ? data[i].IDBoPhanNVCreate : null,
                                nameBoPhanNVCreate: await getDepartmentFromStaff(data.IDNhanVienCreate),
                                nameChiNhanhCreate: await getBranchFromStaff(data.IDNhanVienCreate),
                                idNhanVienAdvance: data[i].IDNhanVienAdvance ? data[i].IDNhanVienAdvance : null,
                                nameNhanVienAdvance: await getDetailStaff(data[i].IDNhanVienAdvance),
                                idBoPhanNVAdvance: data[i].IDBoPhanNVAdvance ? data[i].IDBoPhanNVAdvance : null,
                                nameBoPhanNVAdvance: await getDepartmentFromStaff(data.IDNhanVienAdvance),
                                date: data[i].Date ? moment(data[i].Date).format('DD/MM/YYYY') : null,
                                contents: data[i].Contents ? data[i].Contents : '',
                                cost: data[i].Cost ? data[i].Cost : null,
                                idTaiKhoanKeToanCost: data[i].IDTaiKhoanKeToanCost ? data[i].IDTaiKhoanKeToanCost : null,
                                nameTaiKhoanKeToanCost: data[i].tkkt ? data[i].tkkt.AccountingName : '',
                                idNhanVienLDPD: data[i].IDNhanVienLD ? data[i].IDNhanVienLD : null,
                                nameNhanVienLDPD: await getDetailStaff(data[i].IDNhanVienLD),
                                trangThaiPheDuyetLD: data[i].TrangThaiPheDuyetLD ? data[i].TrangThaiPheDuyetLD : '',
                                idNhanVienKTPD: data[i].IDNhanVienPD ? data[i].IDNhanVienPD : null,
                                nameNhanVienKTPD: await getDetailStaff(data[i].IDNhanVienPD),
                                trangThaiPheDuyetKT: data[i].TrangThaiPheDuyetPD ? data[i].TrangThaiPheDuyetPD : '',
                                reason: data[i].Reason ? data[i].Reason : '',
                                refunds: data[i].Refunds ? data[i].Refunds : true,
                                status: data[i].Status ? data[i].Status : '',
                            }
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblVayTamUng(db).count({ where: { Status: 'Hoàn ứng' }, })
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
                                advanceCode: element.AdvanceCode ? element.AdvanceCode : '',
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
    // approval_employee_accountant_kvtu
    approvalNhanVienKTPD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblVayTamUng(db).update({
                        TrangThaiPheDuyetPD: 'Đã phê duyệt'
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
    // approval_employee_leader_kvtu
    approvalNhanVienLDPD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblVayTamUng(db).update({
                        TrangThaiPheDuyetLD: 'Đã phê duyệt',
                        Status: 'Tạo phiếu chi',
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
    //  refuse_employee_accountant_kvtu
    refuseNhanVienKTPD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblVayTamUng(db).update({
                        TrangThaiPheDuyetPD: 'Từ chối',
                        Reason: body.reason ? body.reason : '',
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
    //  refuse_employee_leader_kvtu
    refuseNhanVienLDPD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblVayTamUng(db).update({
                        TrangThaiPheDuyetLD: 'Từ chối',
                        Reason: body.reason ? body.reason : '',
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
    //  reimbursement
    reimbursement: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblVayTamUng(db).update({
                        Status: 'Hoàn ứng'
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
    // get_list_loan_advance_from_staff
    getListLoanAdvanceFromStaff: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var array = [];
                    var arrayUpdate = [];
                    await mtblVayTamUng(db).findAll({
                        where: {
                            Status: 'Tạo phiếu chi',
                            IDNhanVienAdvance: body.staffID,
                        }
                    }).then(data => {
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                advanceCode: element.AdvanceCode ? element.AdvanceCode : '',
                                date: element.Date ? moment(element.Date).format('DD/MM/YYYY') : '',
                                cost: element.Cost ? element.Cost : '',
                                contents: element.Contents ? element.Contents : '',
                                reason: element.Reason ? element.Reason : '',
                            }
                            array.push(obj);
                        });
                    })
                    await mtblVayTamUng(db).findAll({
                        where: {
                            [Op.and]: [
                                {
                                    Status: { [Op.ne]: 'Tạo phiếu chi' },
                                    IDNhanVienAdvance: body.staffID,
                                },
                                {
                                    Status: { [Op.ne]: 'Chờ hoàn ứng' },
                                    IDNhanVienAdvance: body.staffID,
                                }
                            ]
                        }
                    }).then(data => {
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                advanceCode: element.AdvanceCode ? element.AdvanceCode : '',
                                date: element.Date ? element.Date : '',
                                cost: element.Cost ? element.Cost : '',
                                contents: element.Contents ? element.Contents : '',
                                reason: element.Reason ? element.Reason : '',
                            }
                            arrayUpdate.push(obj);
                        });
                    })
                    var result = {
                        arrayCreate: array,
                        arrayUpdate: arrayUpdate,
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
    // get_list_reimbursement_from_staff
    getListReimbursementFromStaff: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var array = [];
                    var arrayUpdate = [];
                    await mtblVayTamUng(db).findAll({
                        where: {
                            Status: 'Chờ hoàn ứng',
                            IDNhanVienAdvance: body.staffID,
                        }
                    }).then(data => {
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                advanceCode: element.AdvanceCode ? element.AdvanceCode : '',
                                date: element.Date ? moment(element.Date).format('DD/MM/YYYY') : '',
                                cost: element.Cost ? element.Cost : '',
                                contents: element.Contents ? element.Contents : '',
                                reason: element.Reason ? element.Reason : '',
                            }
                            array.push(obj);
                        });
                    })
                    await mtblVayTamUng(db).findAll({
                        where: {
                            [Op.or]: [
                                {
                                    Status: 'Chờ hoàn ứng',
                                    IDNhanVienAdvance: body.staffID,
                                },
                                {
                                    Status: 'Đã hoàn ứng',
                                    IDNhanVienAdvance: body.staffID,
                                },
                            ]
                        }
                    }).then(data => {
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                advanceCode: element.AdvanceCode ? element.AdvanceCode : '',
                                date: element.Date ? moment(element.Date).format('DD/MM/YYYY') : '',
                                cost: element.Cost ? element.Cost : '',
                                contents: element.Contents ? element.Contents : '',
                                reason: element.Reason ? element.Reason : '',
                            }
                            arrayUpdate.push(obj);
                        });
                    })
                    var result = {
                        arrayCreate: array,
                        arrayUpdate: arrayUpdate,
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