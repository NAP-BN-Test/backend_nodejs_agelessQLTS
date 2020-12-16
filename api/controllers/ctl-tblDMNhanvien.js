const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMChiNhanh = require('../tables/constants/tblDMChiNhanh')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblTaiSanBanGiao = require('../tables/qlnb/tblTaiSanBanGiao')
var mtblTaiSanHistory = require('../tables/qlnb/tblTaiSanHistory')
var mtblTaiSan = require('../tables/qlnb/tblTaiSan')
var mtblDMHangHoa = require('../tables/qlnb/tblDMHangHoa');
var mtblDMUser = require('../tables/constants/tblDMUser');
var mtblYeuCauMuaSam = require('../tables/qlnb/tblYeuCauMuaSam')
var mtblTaiSanBanGiao = require('../tables/qlnb/tblTaiSanBanGiao')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')

var database = require('../database');
async function deleteRelationshiptblDMNhanvien(db, listID) {
    await mtblDMBoPhan(db).update({
        IDNhanVienBanGiao: null,
    }, { where: { IDNhanVienBanGiao: { [Op.in]: listID } } })
    await mtblTaiSanBanGiao(db).update({
        IDNhanVienBanGiao: null,
    }, { where: { IDNhanVienBanGiao: { [Op.in]: listID } } })
    await mtblTaiSanBanGiao(db).update({
        IDNhanVienSoHuu: null,
    }, { where: { IDNhanVienSoHuu: { [Op.in]: listID } } })
    await mtblYeuCauMuaSam(db).update({
        IDNhanvien: null,
    }, { where: { IDNhanvien: { [Op.in]: listID } } })
    await mtblYeuCauMuaSam(db).update({
        IDPheDuyet1: null,
    }, { where: { IDPheDuyet1: { [Op.in]: listID } } })
    await mtblYeuCauMuaSam(db).update({
        IDPheDuyet2: null,
    }, { where: { IDPheDuyet2: { [Op.in]: listID } } })
    await mtblDMUser(db).update({
        IDNhanvien: null,
    }, { where: { IDNhanvien: { [Op.in]: listID } } })
    await mtblDMNhanvien(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblDMNhanvien,
    // add_tbl_dmnhanvien
    addtblDMNhanvien: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMNhanvien(db).create({
                        StaffCode: body.staffCode ? body.staffCode : '',
                        StaffName: body.staffName ? body.staffName : '',
                        CMNDNumber: body.cmndNumber ? body.cmndNumber : '',
                        Address: body.address ? body.address : '',
                        IDNation: body.idNation ? body.idNation : null,
                        PhoneNumber: body.phoneNumber ? body.phoneNumber : '',
                        Gender: body.gender ? body.gender : '',
                        IDBoPhan: body.idBoPhan ? body.idBoPhan : null,
                        IDChucVu: body.idChucVu ? body.idChucVu : null,
                        TaxCode: body.taxCode ? body.taxCode : '',
                        BankNumber: body.bankNumber ? body.bankNumber : '',
                        BankName: body.bankName ? body.bankName : '',
                        Birthday: body.birthday ? body.birthday : '',
                        Degree: body.degree ? body.degree : '',
                        DermanentResidence: body.permanentResidence ? body.permanentResidence : '',
                        ProbationaryDate: body.probationaryDate ? body.probationaryDate : '',
                        probationarySalary: body.probationarySalary ? body.probationarySalary : null,
                        WorkingDate: body.workingDate ? body.workingDate : null,
                        WorkingSalary: body.workingSalary ? body.workingSalary : null,
                        BHXHSalary: body.bhxhSalary ? body.bhxhSalary : null,
                        ContactUrgent: body.contactUrgent ? body.contactUrgent : '',
                        IDMayChamCong: body.idMayChamCong ? body.idMayChamCong : null,
                        Email: body.email ? body.email : '',
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
    // update_tbl_dmnhanvien
    updatetblDMNhanvien: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.staffCode || body.staffCode === '')
                        update.push({ key: 'StaffCode', value: body.staffCode });
                    if (body.staffName || body.staffName === '')
                        update.push({ key: 'StaffName', value: body.staffName });
                    if (body.cmndumber || body.cmndumber === '')
                        update.push({ key: 'CMNDumber', value: body.cmndumber });
                    if (body.address || body.address === '')
                        update.push({ key: 'Address', value: body.address });
                    if (body.idNation || body.idNation === '') {
                        if (body.idNation === '')
                            update.push({ key: 'IDNation', value: null });
                        else
                            update.push({ key: 'IDNation', value: body.idNation });
                    }
                    if (body.phoneNumber || body.phoneNumber === '')
                        update.push({ key: 'PhoneNumber', value: body.phoneNumber });
                    if (body.gender || body.gender === '')
                        update.push({ key: 'Gender', value: body.gender });
                    if (body.idBoPhan || body.idBoPhan === '') {
                        if (body.idBoPhan === '')
                            update.push({ key: 'IDBoPhan', value: null });
                        else
                            update.push({ key: 'IDBoPhan', value: body.idBoPhan });
                    }
                    if (body.idChucVu || body.idChucVu === '') {
                        if (body.idChucVu === '')
                            update.push({ key: 'IDChucVu', value: null });
                        else
                            update.push({ key: 'IDChucVu', value: body.idChucVu });
                    }
                    if (body.taxCode || body.taxCode === '')
                        update.push({ key: 'TaxCode', value: body.taxCode });
                    if (body.bankNumber || body.bankNumber === '')
                        update.push({ key: 'BankNumber', value: body.bankNumber });
                    if (body.bankName || body.bankName === '')
                        update.push({ key: 'BankName', value: body.bankName });
                    if (body.birthday || body.birthday === '') {
                        if (body.birthday === '')
                            update.push({ key: 'Birthday', value: null });
                        else
                            update.push({ key: 'Birthday', value: body.birthday });
                    }
                    if (body.degree || body.degree === '')
                        update.push({ key: 'Degree', value: body.degree });
                    if (body.dermanentResidence || body.dermanentResidence === '')
                        update.push({ key: 'DermanentResidence', value: body.dermanentResidence });
                    if (body.probationaryDate || body.probationaryDate === '') {
                        if (body.probationaryDate === '')
                            update.push({ key: 'ProbationaryDate', value: null });
                        else
                            update.push({ key: 'ProbationaryDate', value: body.probationaryDate });
                    }
                    if (body.probationarySalary || body.probationarySalary === '') {
                        if (body.probationarySalary === '')
                            update.push({ key: 'probationarySalary', value: null });
                        else
                            update.push({ key: 'probationarySalary', value: body.probationarySalary });
                    }
                    if (body.workingDate || body.workingDate === '') {
                        if (body.workingDate === '')
                            update.push({ key: 'WorkingDate', value: null });
                        else
                            update.push({ key: 'WorkingDate', value: body.workingDate });
                    }
                    if (body.workingSalary || body.workingSalary === '') {
                        if (body.workingSalary === '')
                            update.push({ key: 'WorkingSalary', value: null });
                        else
                            update.push({ key: 'WorkingSalary', value: body.workingSalary });
                    }
                    if (body.bhxhSalary || body.bhxhSalary === '') {
                        if (body.bhxhSalary === '')
                            update.push({ key: 'BHXHSalary', value: null });
                        else
                            update.push({ key: 'BHXHSalary', value: body.bhxhSalary });
                    }
                    if (body.contactUrgent || body.contactUrgent === '')
                        update.push({ key: 'ContactUrgent', value: body.contactUrgent });
                    if (body.email || body.email === '')
                        update.push({ key: 'Email', value: body.email });
                    if (body.idMayChamCong || body.idMayChamCong === '') {
                        if (body.idMayChamCong === '')
                            update.push({ key: 'IDMayChamCong', value: null });
                        else
                            update.push({ key: 'IDMayChamCong', value: body.idMayChamCong });
                    }
                    database.updateTable(update, mtblDMNhanvien(db), body.id).then(response => {
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
    // delete_tbl_dmnhanvien
    deletetblDMNhanvien: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            let body = req.body;
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDMNhanvien(db, listID);
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
    // get_list_tbl_dmnhanvien
    getListtblDMNhanvien: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let whereOjb = []
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            where = [
                                { StaffCode: { [Op.like]: '%' + data.search + '%' } },
                                { StaffName: { [Op.like]: '%' + data.search + '%' } },
                                { Address: { [Op.like]: '%' + data.search + '%' } },
                            ];
                        } else {
                            where = [
                                { StaffName: { [Op.ne]: '%%' } },
                            ];
                        }
                        whereOjb = { [Op.or]: where };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'MÃ NHÂN VIÊN') {
                                    userFind['StaffCode'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                                if (data.items[i].fields['name'] === 'TÊN NHÂN VIÊN') {
                                    userFind['Address'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                                if (data.items[i].fields['name'] === 'ĐỊA CHỈ') {
                                    userFind['StaffCode'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                                if (data.items[i].fields['name'] === 'EMAIL') {
                                    userFind['Email'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                                if (data.items[i].fields['name'] === 'PHÒNG BAN/BỘ PHẬN') {
                                    var list = [];
                                    await mtblDMBoPhan(db).findAll({
                                        where: {
                                            [Op.or]: [
                                                { DepartmentCode: { [Op.like]: '%' + data.items[i]['searchFields'] + '%' } },
                                                { DepartmentName: { [Op.like]: '%' + data.items[i]['searchFields'] + '%' } }
                                            ]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.ID);
                                        })
                                    })
                                    userFind['IDBoPhan'] = { [Op.in]: list }
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
                    let tblDMNhanvien = mtblDMNhanvien(db);
                    tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bophan' })
                    let tblDMBoPhan = mtblDMBoPhan(db);
                    tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh' })
                    let all = await tblDMNhanvien.count({ where: whereOjb, })
                    tblDMNhanvien.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [
                            {
                                model: tblDMBoPhan,
                                required: false,
                                as: 'bophan',
                                include: [{
                                    model: mtblDMChiNhanh(db)
                                }]
                            },
                        ],
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                staffCode: element.StaffCode ? element.StaffCode : '',
                                staffName: element.StaffName ? element.StaffName : '',
                                cmndNumber: element.CMNDNumber ? element.CMNDNumber : '',
                                address: element.Address ? element.Address : '',
                                idNation: element.IDNation ? element.IDNation : null,
                                phoneNumber: element.PhoneNumber ? element.PhoneNumber : '',
                                gender: element.Gender ? element.Gender : '',
                                idBoPhan: element.IDBoPhan ? element.IDBoPhan : null,
                                departmentName: element.bophan ? element.bophan.DepartmentName : null,
                                departmentCode: element.bophan ? element.bophan.DepartmentCode : null,
                                branchCode: element.bophan ? element.bophan.tblDMChiNhanh ? element.bophan.tblDMChiNhanh.BranchCode : null : null,
                                branchName: element.bophan ? element.bophan.tblDMChiNhanh ? element.bophan.tblDMChiNhanh.BranchName : null : null,
                                idChucVu: element.IDChucVu ? element.IDChucVu : null,
                                baxCode: element.TaxCode ? element.TaxCode : '',
                                bankNumber: element.BankNumber ? element.BankNumber : '',
                                bankName: element.BankName ? element.BankName : '',
                                birthday: element.Birthday ? element.Birthday : '',
                                degree: element.Degree ? element.Degree : '',
                                dermanentResidence: element.DermanentResidence ? element.DermanentResidence : '',
                                probationaryDate: element.ProbationaryDate ? element.ProbationaryDate : '',
                                probationarySalary: element.ProbationarySalary ? element.ProbationarySalary : null,
                                workingDate: element.WorkingDate ? element.WorkingDate : null,
                                workingSalary: element.WorkingSalary ? element.WorkingSalary : null,
                                bhxhSalary: element.BHXHSalary ? element.BHXHSalary : null,
                                contactUrgent: element.ContactUrgent ? element.ContactUrgent : '',
                                idMayChamCong: element.IDMayChamCong ? element.IDMayChamCong : null,
                                email: element.Email ? element.Email : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var result = {
                            array: array,
                            all: all,
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
    // get_list_name_tbl_dmnhanvien
    getListNametblDMNhanvien: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMNhanvien(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                staffCode: element.StaffCode ? element.StaffCode : '',
                                staffName: element.StaffName ? element.StaffName : '',
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
    // get_list_history_nhanvien
    getListHistoryNhanVien: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblTaiSanBanGiao = mtblTaiSanBanGiao(db);
                    let stt = 1;
                    await tblTaiSanBanGiao.findAll({ where: { IDNhanVienSoHuu: body.idNhanVien }, }).then(async data => {
                        var array = [];
                        var result = {
                            array: array,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        if (data) {
                            for (var i = 0; i < data.length; i++) {
                                let tblTaiSan = mtblTaiSan(db);
                                tblTaiSan.belongsTo(mtblDMHangHoa(db), { foreignKey: 'IDDMHangHoa', sourceKey: 'IDDMHangHoa', as: 'hanghoa' })
                                let tblTaiSanHistory = mtblTaiSanHistory(db);
                                tblTaiSanHistory.belongsTo(tblTaiSan, { foreignKey: 'IDTaiSan', sourceKey: 'IDTaiSan', as: 'taisan' })
                                var date = data[i].Date
                                var id = data[i].ID
                                await tblTaiSanHistory.findAll({
                                    where: {
                                        IDTaiSanBanGiao: data[i].ID,
                                    },
                                    include: [
                                        {
                                            model: tblTaiSan,
                                            required: false,
                                            as: 'taisan',
                                            include: [
                                                {
                                                    model: mtblDMHangHoa(db),
                                                    required: false,
                                                    as: 'hanghoa'
                                                },
                                            ],
                                        },
                                    ],
                                }).then(tsht => {
                                    if (tsht)
                                        for (var j = 0; j < tsht.length; j++) {
                                            array.push({
                                                stt: stt,
                                                id: id,
                                                codeDevice: tsht[j].taisan ? tsht[j].taisan.TSNBCode : '',
                                                nameDevice: tsht[j].taisan ? tsht[j].taisan.hanghoa ? tsht[j].taisan.hanghoa.Name : '' : '',
                                                dateFrom: date,
                                                dateTo: tsht[j].DateThuHoi,
                                            })
                                            stt += 1;
                                        }
                                })
                            }
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
    //get_employee_from_department
    getEmployeeFromDepartment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let whereOjb = [{
                        IDBoPhan: body.idBoPhan,
                    }]
                    let stt = 1;
                    let tblDMNhanvien = mtblDMNhanvien(db);
                    tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bophan' })
                    let tblDMBoPhan = mtblDMBoPhan(db);
                    tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh' })
                    let all = await tblDMNhanvien.count({ where: whereOjb, })
                    tblDMNhanvien.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [
                            {
                                model: tblDMBoPhan,
                                required: false,
                                as: 'bophan',
                                include: [{
                                    model: mtblDMChiNhanh(db)
                                }]
                            },
                        ],
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                staffCode: element.StaffCode ? element.StaffCode : '',
                                staffName: element.StaffName ? element.StaffName : '',
                                cmndNumber: element.CMNDNumber ? element.CMNDNumber : '',
                                address: element.Address ? element.Address : '',
                                idNation: element.IDNation ? element.IDNation : null,
                                phoneNumber: element.PhoneNumber ? element.PhoneNumber : '',
                                gender: element.Gender ? element.Gender : '',
                                idBoPhan: element.IDBoPhan ? element.IDBoPhan : null,
                                departmentName: element.bophan ? element.bophan.DepartmentName : null,
                                departmentCode: element.bophan ? element.bophan.DepartmentCode : null,
                                branchCode: element.bophan ? element.bophan.tblDMChiNhanh ? element.bophan.tblDMChiNhanh.BranchCode : null : null,
                                branchName: element.bophan ? element.bophan.tblDMChiNhanh ? element.bophan.tblDMChiNhanh.BranchName : null : null,
                                idChucVu: element.IDChucVu ? element.IDChucVu : null,
                                baxCode: element.TaxCode ? element.TaxCode : '',
                                bankNumber: element.BankNumber ? element.BankNumber : '',
                                bankName: element.BankName ? element.BankName : '',
                                birthday: element.Birthday ? element.Birthday : '',
                                degree: element.Degree ? element.Degree : '',
                                dermanentResidence: element.DermanentResidence ? element.DermanentResidence : '',
                                probationaryDate: element.ProbationaryDate ? element.ProbationaryDate : '',
                                probationarySalary: element.ProbationarySalary ? element.ProbationarySalary : null,
                                workingDate: element.WorkingDate ? element.WorkingDate : null,
                                workingSalary: element.WorkingSalary ? element.WorkingSalary : null,
                                bhxhSalary: element.BHXHSalary ? element.BHXHSalary : null,
                                contactUrgent: element.ContactUrgent ? element.ContactUrgent : '',
                                idMayChamCong: element.IDMayChamCong ? element.IDMayChamCong : null,
                                email: element.Email ? element.Email : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var result = {
                            array: array,
                            all: all,
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