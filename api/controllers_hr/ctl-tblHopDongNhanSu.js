const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblHopDongNhanSu = require('../tables/hrmanage/tblHopDongNhanSu')
var database = require('../database');
var mtblLoaiHopDong = require('../tables/hrmanage/tblLoaiHopDong')

async function deleteRelationshiptblHopDongNhanSu(db, listID) {
    await mtblHopDongNhanSu(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblHopDongNhanSu,
    //  get_detail_tbl_hopdong_nhansu
    detailtblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblHopDongNhanSu(db).findOne({ where: { ID: body.id } }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                contractCode: data.ContractCode ? data.ContractCode : '',
                                signDate: data.Date ? moment(data.Date).format('DD-MM-YYYY') : null,
                                idLoaiHopDong: data.IDLoaiHopDong ? data.IDLoaiHopDong : '',
                                salaryNumber: data.SalaryNumber ? data.SalaryNumber : '',
                                salaryText: data.SalaryText ? data.SalaryText : '',
                                contractDateEnd: data.ContractDateEnd ? moment(data.contractDateEnd).format('DD-MM-YYYY') : '',
                                contractDateStart: data.ContractDateStart ? moment(data.ContractDateStart).format('DD-MM-YYYY') : null,
                                unitSalary: 'VND',
                                status: data.Status ? data.Status : '',
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
    // add_tbl_hopdong_nhansu
    addtblHopDongNhanSu: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblHopDongNhanSu(db).create({
                        IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                        ContractCode: body.contractCode ? body.contractCode : '',
                        Date: body.signDate ? body.signDate : null,
                        IDLoaiHopDong: body.idLoaiHopDong ? body.idLoaiHopDong : '',
                        SalaryNumber: body.salaryNumber ? body.salaryNumber : '',
                        SalaryText: body.salaryNumber ? body.salaryNumber : '',
                        ContractDateEnd: body.contractDateEnd ? body.contractDateEnd : null,
                        ContractDateStart: body.signDate ? body.signDate : null,
                        UnitSalary: 'VND',
                        WorkingPlace: '',
                        Status: body.status ? body.status : '',
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
    // update_tbl_hopdong_nhansu
    updatetblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.contractCode || body.contractCode === '')
                        update.push({ key: 'ContractCode', value: body.contractCode });
                    if (body.signDate || body.signDate === '') {
                        if (body.signDate === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.signDate });
                    }
                    if (body.idLoaiHopDong || body.idLoaiHopDong === '') {
                        if (body.idLoaiHopDong === '')
                            update.push({ key: 'IDLoaiHopDong', value: null });
                        else
                            update.push({ key: 'IDLoaiHopDong', value: body.idLoaiHopDong });
                    }
                    if (body.salaryNumber || body.salaryNumber === '') {
                        if (body.salaryNumber === '')
                            update.push({ key: 'SalaryNumber', value: null });
                        else
                            update.push({ key: 'SalaryNumber', value: body.salaryNumber });
                    }
                    if (body.contractDateEnd || body.contractDateEnd === '')
                        update.push({ key: 'ContractDateEnd', value: body.contractDateEnd });
                    if (body.contractDateStart || body.contractDateStart === '')
                        update.push({ key: 'ContractDateStart', value: body.contractDateStart });
                    if (body.status || body.status === '')
                        update.push({ key: 'Status', value: body.status });
                    database.updateTable(update, mtblHopDongNhanSu(db), body.id).then(response => {
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
    // delete_tbl_hopdong_nhansu
    deletetblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblHopDongNhanSu(db, listID);
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
    // get_list_tbl_hopdong_nhansu
    getListtblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        // var data = JSON.parse(body.dataSearch)

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
                        //         if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                        //             userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                    let stt = 1;
                    let tblHopDongNhanSu = mtblHopDongNhanSu(db);
                    tblHopDongNhanSu.belongsTo(mtblLoaiHopDong(db), { foreignKey: 'IDLoaiHopDong', sourceKey: 'IDLoaiHopDong', as: 'lhd' })
                    mtblHopDongNhanSu(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [
                            {
                                model: mtblLoaiHopDong(db),
                                required: false,
                                as: 'lhd'
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
                                contractCode: data.ContractCode ? data.ContractCode : '',
                                signDate: data.Date ? moment(data.Date).format('DD-MM-YYYY') : null,
                                idLoaiHopDong: element.IDLoaiHopDong ? element.IDLoaiHopDong : '',
                                loaiHopDong: element.lhd ? element.lhd.TenLoaiHD : '',
                                salaryNumber: data.SalaryNumber ? data.SalaryNumber : '',
                                salaryText: data.SalaryText ? data.SalaryText : '',
                                contractDateEnd: data.ContractDateEnd ? moment(data.contractDateEnd).format('DD-MM-YYYY') : '',
                                contractDateStart: data.ContractDateStart ? moment(data.ContractDateStart).format('DD-MM-YYYY') : null,
                                unitSalary: 'VND',
                                status: data.Status ? data.Status : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblHopDongNhanSu(db).count({ where: whereOjb, })
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
    // get_list_tbl_hopdong_nhansu_detail
    getListtblHopDongNhanSuDetail: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        // var data = JSON.parse(body.dataSearch)

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
                        //         if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                        //             userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                    let stt = 1;
                    let tblHopDongNhanSu = mtblHopDongNhanSu(db);
                    tblHopDongNhanSu.belongsTo(mtblLoaiHopDong(db), { foreignKey: 'IDLoaiHopDong', sourceKey: 'IDLoaiHopDong', as: 'lhd' })

                    tblHopDongNhanSu.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: { IDNhanVien: body.idNhanVien },
                        include: [
                            {
                                model: mtblLoaiHopDong(db),
                                required: false,
                                as: 'lhd'
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
                                contractCode: element.ContractCode ? element.ContractCode : '',
                                signDate: element.Date ? moment(delement.Date).format('DD-MM-YYYY') : null,
                                idLoaiHopDong: element.IDLoaiHopDong ? element.IDLoaiHopDong : '',
                                loaiHopDong: element.lhd ? element.lhd.TenLoaiHD : '',
                                salaryNumber: element.SalaryNumber ? element.SalaryNumber : '',
                                salaryText: element.SalaryText ? element.SalaryText : '',
                                contractDateEnd: element.ContractDateEnd ? moment(element.ContractDateEnd).format('DD-MM-YYYY') : null,
                                contractDateStart: element.ContractDateStart ? moment(element.ContractDateStart).format('DD-MM-YYYY') : null,
                                unitSalary: 'VND',
                                status: element.Status ? element.Status : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblHopDongNhanSu(db).count({ where: { IDNhanVien: body.idNhanVien } })
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
    // get_list_name_tbl_hopdong_nhansu
    getListNametblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblHopDongNhanSu(db).findAll().then(data => {
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
    }
}