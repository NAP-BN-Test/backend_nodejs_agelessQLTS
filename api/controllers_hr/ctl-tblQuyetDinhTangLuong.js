const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblQuyetDinhTangLuong = require('../tables/hrmanage/tblQuyetDinhTangLuong')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblHopDongNhanSu = require('../tables/hrmanage/tblHopDongNhanSu')
var mtblIncreaseSalariesAndStaff = require('../tables/hrmanage/tblIncreaseSalariesAndStaff')
var mtblBangLuong = require('../tables/hrmanage/tblBangLuong')
var mModules = require('../constants/modules');
var mtblFileAttach = require('../tables/constants/tblFileAttach');
// wsEngine cho phép gọi vào hàm
// var io = require("socket.io")(server, {
//     cors: {
//         wsEngine: 'eiows',
//         origin: ["http://dbdev.namanphu.vn:8692", "http://localhost:4200"],
//         methods: ["GET", "POST"],
//         credentials: true,
//     }
// })
async function deleteRelationshiptblQuyetDinhTangLuong(db, listID) {
    await mtblIncreaseSalariesAndStaff(db).destroy({
        where: {
            IncreaseSalariesID: {
                [Op.in]: listID
            }
        }
    })
    await mtblQuyetDinhTangLuong(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
module.exports = {
    deleteRelationshiptblQuyetDinhTangLuong,
    //  get_detail_tbl_quyetdinh_tangluong
    detailtblQuyetDinhTangLuong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    let tblQuyetDinhTangLuong = mtblQuyetDinhTangLuong(db);
                    tblQuyetDinhTangLuong.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'employee' })
                    tblQuyetDinhTangLuong.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDEmployeeApproval', sourceKey: 'IDEmployeeApproval', as: 'employeeApproval' })
                    tblQuyetDinhTangLuong.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: { IDNhanVien: body.idNhanVien },
                        include: [{
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'employee'
                            },
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'employeeApproval'
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                decisionCode: element.DecisionCode ? element.DecisionCode : '',
                                decisionDate: element.DecisionDate ? moment(element.DecisionDate).format('DD/MM/YYYY') : null,
                                increaseDate: element.IncreaseDate ? moment(element.IncreaseDate).format('DD/MM/YYYY') : null,
                                stopDate: element.StopDate ? moment(element.StopDate).format('DD/MM/YYYY') : null,
                                stopReason: element.StopReason ? element.StopReason : '',
                                idNhanVien: element.IDNhanVien ? element.IDNhanVien : null,
                                nameNhanVien: element.IDNhanVien ? element.employee.StaffName : null,
                                salaryIncrease: element.SalaryIncrease ? element.SalaryIncrease : '',
                                status: element.Status ? element.Status : '',
                                reason: element.Reason ? element.Reason : '',
                                statusDecision: element.StatusDecision ? element.StatusDecision : '',
                                idStaffApproval: element.IDEmployeeApproval ? element.IDEmployeeApproval : null,
                                increase: element.Increase ? element.Increase : null,
                                nameStaffApproval: element.employeeApproval ? element.employeeApproval.StaffName : null,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblQuyetDinhTangLuong(db).count({ IDNhanVien: body.idNhanVien })
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
    // add_tbl_quyetdinh_tangluong
    addtblQuyetDinhTangLuong: (req, res) => {
        let body = req.body;
        body.idNhanVien = JSON.parse(body.idNhanVien);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblQuyetDinhTangLuong(db).create({
                        DecisionCode: await mModules.automaticCode(mtblQuyetDinhTangLuong(db), 'DecisionCode', 'QDTL'),
                        DecisionDate: body.decisionDate ? body.decisionDate : null,
                        IncreaseDate: body.increaseDate ? body.increaseDate : null,
                        StopDate: body.stopDate ? body.stopDate : null,
                        StopReason: body.stopReason ? body.stopReason : '',
                        // IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                        IDEmployeeApproval: body.idStaffApproval ? body.idStaffApproval : null,
                        SalaryIncrease: body.salaryIncrease ? body.salaryIncrease : '',
                        StatusDecision: body.statusDecision ? body.statusDecision : '',
                        Increase: body.increase ? body.increase : '',
                        Status: 'Chờ phê duyệt',
                    }).then(async data => {
                        if (data) {
                            if (body.fileAttach) {
                                body.fileAttach = JSON.parse(body.fileAttach)
                                if (body.fileAttach.length > 0)
                                    for (var j = 0; j < body.fileAttach.length; j++)
                                        await mtblFileAttach(db).update({
                                            IDIncreaseSlary: data.ID,
                                        }, {
                                            where: {
                                                ID: body.fileAttach[j].id
                                            }
                                        })
                            }
                            for (let staff = 0; staff < body.idNhanVien.length; staff++) {
                                await mtblIncreaseSalariesAndStaff(db).create({
                                    StaffID: body.idNhanVien[staff].id,
                                    IncreaseSalariesID: data.ID,
                                })
                            }

                        }
                        // var hd = await mtblHopDongNhanSu(db).findOne({
                        //     where: {
                        //         IDNhanVien: body.idNhanVien
                        //     },
                        //     order: [
                        //         ['ID', 'DESC']
                        //     ],
                        // })
                        // if (hd)
                        //     await mtblHopDongNhanSu(db).update({
                        //         workingSalary: body.salaryIncrease,
                        //         SalaryNumber: body.salaryIncrease,
                        //     }, {
                        //         where: {
                        //             ID: hd.ID
                        //         },
                        //     })
                        // salary = body.workingSalary ? body.workingSalary : 0
                        // let bl = await mtblBangLuong(db).findOne({ where: { IDNhanVien: body.idNhanVien } })
                        // if (bl)
                        //     await mtblBangLuong(db).update({
                        //         Date: body.decisionDate ? body.decisionDate : null,
                        //         WorkingSalary: body.salaryIncrease ? body.salaryIncrease : 0,
                        //         SalaryNumber: body.salaryIncrease ? body.salaryIncrease : 0,
                        //         DateEnd: body.stopDate ? body.stopDate : null,
                        //     }, {
                        //         where: { IDNhanVien: body.idNhanVien, }
                        //     })
                        // else
                        //     await mtblBangLuong(db).create({
                        //         Date: body.decisionDate ? body.decisionDate : null,
                        //         WorkingSalary: body.salaryIncrease ? body.salaryIncrease : 0,
                        //         SalaryNumber: body.salaryIncrease ? body.salaryIncrease : 0,
                        //         DateEnd: body.stopDate ? body.stopDate : null,
                        //         IDNhanVien: body.idNhanVien,
                        //     })
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
    // update_tbl_quyetdinh_tangluong
    updatetblQuyetDinhTangLuong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.fileAttach) {
                        body.fileAttach = JSON.parse(body.fileAttach)
                        if (body.fileAttach.length > 0)
                            for (var j = 0; j < body.fileAttach.length; j++)
                                await mtblFileAttach(db).update({
                                    IDIncreaseSlary: body.id,
                                }, {
                                    where: {
                                        ID: body.fileAttach[j].id
                                    }
                                })
                    }
                    if (body.decisionDate || body.decisionDate === '') {
                        if (body.decisionDate === '')
                            update.push({ key: 'DecisionDate', value: null });
                        else
                            update.push({ key: 'DecisionDate', value: body.decisionDate });
                    }
                    if (body.increaseDate || body.increaseDate === '') {
                        if (body.increaseDate === '')
                            update.push({ key: 'IncreaseDate', value: null });
                        else
                            update.push({ key: 'IncreaseDate', value: body.increaseDate });
                    }
                    if (body.stopDate || body.stopDate === '') {
                        if (body.stopDate === '')
                            update.push({ key: 'StopDate', value: null });
                        else
                            update.push({ key: 'StopDate', value: body.stopDate });
                    }
                    if (body.idNhanVien || body.idNhanVien === '') {
                        if (body.idNhanVien === '')
                            update.push({ key: 'IDNhanVien', value: null });
                        else
                            update.push({ key: 'IDNhanVien', value: body.idNhanVien });
                    }
                    if (body.idEmployeeApproval || body.idEmployeeApproval === '') {
                        if (body.idEmployeeApproval === '')
                            update.push({ key: 'IDEmployeeApproval', value: null });
                        else
                            update.push({ key: 'IDEmployeeApproval', value: body.idEmployeeApproval });
                    }
                    if (body.increase || body.increase === '') {
                        if (body.increase === '')
                            update.push({ key: 'Increase', value: null });
                        else
                            update.push({ key: 'Increase', value: body.increase });
                    }
                    if (body.decisionCode || body.decisionCode === '')
                        update.push({ key: 'DecisionCode', value: body.decisionCode });
                    if (body.stopReason || body.stopReason === '')
                        update.push({ key: 'StopReason', value: body.stopReason });
                    if (body.salaryIncrease || body.salaryIncrease === '') {
                        var staff = await mtblQuyetDinhTangLuong(db).findOne({ where: { ID: body.id } })
                        var hd = await mtblHopDongNhanSu(db).findOne({
                            where: {
                                IDNhanVien: staff.IDNhanVien
                            },
                            order: [
                                ['ID', 'DESC']
                            ],
                        })
                        if (hd)
                            await mtblHopDongNhanSu(db).update({
                                workingSalary: body.salaryIncrease,
                                SalaryNumber: body.salaryIncrease,
                            }, {
                                where: {
                                    ID: hd.ID
                                },
                            })
                        update.push({ key: 'SalaryIncrease', value: body.salaryIncrease });
                        let bl = await mtblBangLuong(db).findOne({
                            where: { IDNhanVien: staff.IDNhanVien },
                            order: [
                                ['ID', 'DESC']
                            ],
                        })
                        if (bl)
                            await mtblBangLuong(db).update({
                                Date: body.decisionDate ? body.decisionDate : null,
                                WorkingSalary: body.salaryIncrease ? body.salaryIncrease : 0,
                                SalaryNumber: body.salaryIncrease ? body.salaryIncrease : 0,
                                DateEnd: body.stopDate ? body.stopDate : null,
                            }, {
                                where: { ID: bl.ID },
                            })
                        else
                            await mtblBangLuong(db).create({
                                Date: body.decisionDate ? body.decisionDate : null,
                                WorkingSalary: body.salaryIncrease ? body.salaryIncrease : 0,
                                SalaryNumber: body.salaryIncrease ? body.salaryIncrease : 0,
                                DateEnd: body.stopDate ? body.stopDate : null,
                                IDNhanVien: staff.IDNhanVien,
                            })
                    }
                    if (body.status || body.status === '')
                        update.push({ key: 'Status', value: body.status });

                    database.updateTable(update, mtblQuyetDinhTangLuong(db), body.id).then(response => {
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
    // delete_tbl_quyetdinh_tangluong
    deletetblQuyetDinhTangLuong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblQuyetDinhTangLuong(db, listID);
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
    // get_list_tbl_quyetdinh_tangluong
    getListtblQuyetDinhTangLuong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            where = [{
                                    DecisionCode: {
                                        [Op.like]: '%' + data.search + '%'
                                    }
                                },
                                {
                                    Status: {
                                        [Op.like]: '%' + data.search + '%'
                                    }
                                },
                            ];
                        } else {
                            where = [{
                                DecisionCode: {
                                    [Op.ne]: '%%'
                                }
                            }, ];
                        }
                        whereOjb = {
                            [Op.and]: [{
                                [Op.or]: where
                            }],
                            [Op.or]: [{
                                ID: {
                                    [Op.ne]: null
                                }
                            }],
                        };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'SỐ QUYẾT ĐỊNH') {
                                    userFind['DecisionCode'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'TÌNH TRẠNG QUYẾT ĐỊNH') {
                                    userFind['Status'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                            }
                        }
                    }
                    let stt = 1;
                    let tblQuyetDinhTangLuong = mtblQuyetDinhTangLuong(db);
                    tblQuyetDinhTangLuong.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'employee' })
                    tblQuyetDinhTangLuong.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDEmployeeApproval', sourceKey: 'IDEmployeeApproval', as: 'employeeApp' })
                    tblQuyetDinhTangLuong.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [{
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'employee'
                            },
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'employeeApp'
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        for (let i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                decisionCode: data[i].DecisionCode ? data[i].DecisionCode : '',
                                decisionDate: data[i].DecisionDate ? moment(data[i].DecisionDate).format('DD/MM/YYYY') : null,
                                increaseDate: data[i].IncreaseDate ? data[i].IncreaseDate : null,
                                stopDate: data[i].StopDate ? moment(data[i].StopDate).format('DD/MM/YYYY') : null,
                                stopReason: data[i].StopReason ? data[i].StopReason : '',
                                // idNhanVien: data[i].IDNhanVien ? data[i].IDNhanVien : null,
                                nameNhanVien: data[i].IDNhanVien ? data[i].employee.StaffName : '',
                                idStaffApproval: data[i].IDEmployeeApproval ? data[i].IDEmployeeApproval : null,
                                nameStaffApproval: data[i].employeeApp ? data[i].employeeApp.StaffName : '',
                                statusDecision: data[i].StatusDecision ? data[i].StatusDecision : '',
                                reason: data[i].Reason ? data[i].Reason : '',
                                salaryIncrease: data[i].SalaryIncrease ? data[i].SalaryIncrease : '',
                                status: data[i].Status ? data[i].Status : '',
                                increase: data[i].Increase ? data[i].Increase : '',
                            }
                            let arrayStaff = []
                            let tblIncreaseSalariesAndStaff = mtblIncreaseSalariesAndStaff(db);
                            tblIncreaseSalariesAndStaff.belongsTo(mtblDMNhanvien(db), { foreignKey: 'StaffID', sourceKey: 'StaffID', as: 'staff' })
                            await tblIncreaseSalariesAndStaff.findAll({
                                where: { IncreaseSalariesID: data[i].ID },
                                include: [{
                                    model: mtblDMNhanvien(db),
                                    required: false,
                                    as: 'staff'
                                }, ],
                            }).then(inc => {
                                inc.forEach(item => {
                                    arrayStaff.push({
                                        id: item.staff.ID,
                                        staffName: item.staff.StaffName,
                                        staffCode: item.staff.StaffCode,
                                    })
                                })
                            })
                            obj['staffIDs'] = arrayStaff
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblQuyetDinhTangLuong(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_quyetdinh_tangluong
    getListNametblQuyetDinhTangLuong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblQuyetDinhTangLuong(db).findAll().then(data => {
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
    // approval_decision
    approvalDecision: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            let body = req.body;
            if (db) {
                try {
                    await mtblQuyetDinhTangLuong(db).update({
                        Status: 'Đã phê duyệt',
                    }, { where: { ID: body.id } })
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
    // refuse_decision
    refuseDecisoon: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblQuyetDinhTangLuong(db).update({
                        Reason: body.reason,
                        Status: 'Đã từ chối',
                    }, { where: { ID: body.id } })
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