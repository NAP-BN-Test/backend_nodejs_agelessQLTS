const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblBangLuong = require('../tables/hrmanage/tblBangLuong')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblMucDongBaoHiem = require('../tables/hrmanage/tblMucDongBaoHiem')
var mtblDMGiaDinh = require('../tables/hrmanage/tblDMGiaDinh')
var mModules = require('../constants/modules');

async function deleteRelationshiptblBangLuong(db, listID) {
    await mtblBangLuong(db).destroy({
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
async function filterByDate(userID, dateFinal, array) {
    var arrayResult = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].UserID == userID && Number(array[i].VerifyDate.slice(8, 10)) == dateFinal) {
            arrayResult.push(array[i].VerifyDate.slice(11, 22))
        }
    }
    return arrayResult;
}
async function getUserIDExits(array) {
    var arrayUserID = [];
    for (var i = 0; i < array.length; i++) {
        if (!checkDuplicate(arrayUserID, array[i].UserID))
            arrayUserID.push(array[i].UserID)
    }
    return arrayUserID;
}
async function maxTimeArray(array) {
    var maxTime = 0;
    for (var i = 0; i < array.length; i++) {
        if (Number(array[i].slice(0, 2))) {
            let seconrd = Number(array[i].slice(6, 8)) + Number(array[i].slice(3, 5)) * 60 + Number(array[i].slice(0, 2)) * 60 * 60
            if (seconrd > maxTime) {
                maxTime = seconrd;
            }
        }
        else {
            let seconrd = Number(array[i].slice(5, 7)) + Number(array[i].slice(2, 4)) * 60 + Number(array[i].slice(0, 1)) * 60 * 60
            if (seconrd > maxTime) {
                maxTime = seconrd;
            }
        }

    }
    return maxTime;
}
async function minTimeArray(array) {
    var minTime = 3000000000;
    for (var i = 0; i < array.length; i++) {
        if (Number(array[i].slice(0, 2))) {
            let seconrd = Number(array[i].slice(6, 8)) + Number(array[i].slice(3, 5)) * 60 + Number(array[i].slice(0, 2)) * 60 * 60;
            if (seconrd < minTime) {
                minTime = seconrd;
            }
        }
        else {
            let seconrd = Number(array[i].slice(5, 7)) + Number(array[i].slice(2, 4)) * 60 + Number(array[i].slice(0, 1)) * 60 * 60;
            if (seconrd < minTime) {
                minTime = seconrd;
            }
        }

    }
    return minTime;
}

async function convertNumber(number) {
    if (number < 10) {
        return '0' + number
    }
    else
        return number
}
module.exports = {
    deleteRelationshiptblBangLuong,
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
                                    reduce += Number(element.Reduce);
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
    // track_insurance_premiums
    trackInsurancePremiums: (req, res) => {
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
                                    reduce += Number(element.Reduce);
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
                                objInsurance['staffBHXH'] = data.StaffBHXH ? data.StaffBHXH : 0
                                objInsurance['staffBHYT'] = data.StaffBHYT ? data.StaffBHYT : 0
                                objInsurance['staffBHTN'] = data.StaffBHTN ? data.StaffBHTN : 0
                                objInsurance['companyBHXH'] = data.CompanyBHXH ? data.CompanyBHXH : 0
                                objInsurance['companyBHYT'] = data.CompanyBHYT ? data.CompanyBHYT : 0
                                objInsurance['companyBHTN'] = data.CompanyBHTN ? data.CompanyBHTN : 0
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
    // data_timekeeping
    dataTimekeeping: (req, res) => {
        let body = req.body;
        let arrayData = [
            // 01 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-01 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-01 10:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-01 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-01 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // 02 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-02 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-02 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-02 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-02 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -03 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 2,
                VerifyDate: "2021-01-03 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-03 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -04 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 2,
                VerifyDate: "2021-01-04 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-04 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -05 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-05 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-05 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-05 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-05 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -06 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-06 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-06 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-06 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-06 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -07 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-07 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-07 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-07 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-07 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -08 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-08 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-08 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-08 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-08 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -09 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-09 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-09 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-09 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-09 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -10 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-10 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-10 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-10 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-10 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -11 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-11 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-11 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-11 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-11 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -12 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-12 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-12 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-12 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-12 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -13 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-13 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-13 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-13 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-13 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -14 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-14 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-14 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-14 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-14 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -15 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-15 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-15 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-15 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-15 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -16 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-16 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-16 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-16 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-16 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -17 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-17 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-17 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-17 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-17 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -18 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-18 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-18 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-18 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-18 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -19 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-19 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-19 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-19 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-19 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -20 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-20 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-20 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-20 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-20 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -21 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-21 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-21 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-21 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-21 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -22 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-22 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-22 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-22 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-22 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -23 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-23 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-23 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-23 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-23 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -24 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-24 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-24 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-24 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-24 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -25 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-25 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-25 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-25 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-25 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -26 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-26 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-26 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-26 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-26 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -27 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-27 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-27 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-27 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-27 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -28 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-28 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-28 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-28 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-28 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -29 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-29 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-29 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-29 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-29 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -30 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-30 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-30 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-30 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-30 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -31 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-31 8:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-31 17:00:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-31 8:00:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-02 17:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
        ]
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var array = [];
                    var month = 2; // January
                    var year = 2008;
                    var date = new Date(year, month, 0);
                    var dateFinal = Number(date.toISOString().slice(8, 10))
                    var arrayUserID = await getUserIDExits(arrayData);

                    for (var i = 0; i < arrayUserID.length; i++) {
                        var arrayUser = [];
                        var takeLeave = 0;
                        var holiday = 0;
                        var freeBreak = 0;
                        var workingDay = 0;

                        for (var j = 1; j <= dateFinal; j++) {
                            let arrayTimeOfDate = await filterByDate(arrayUserID[i], j, arrayData)
                            if (arrayTimeOfDate.length > 1) {
                                let maxTime = await maxTimeArray(arrayTimeOfDate);
                                let minTime = await minTimeArray(arrayTimeOfDate);
                                var status;
                                if (((maxTime - minTime) / 3600) >= 8) {
                                    status = 'lv'
                                    workingDay += 1
                                }
                                else {
                                    status = 'dsvm'
                                    workingDay += 1
                                }
                            }
                            else {
                                var datetConvert = mModules.toDatetimeDay(moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(j)).subtract(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
                                if (datetConvert.slice(0, 8) == 'Chủ nhật' || datetConvert.slice(0, 5) == 'Thứ 7') {
                                    status = 't.7, cn'
                                    takeLeave += 1
                                }
                                else {
                                    status = 'Nghỉ không lý do'
                                    freeBreak += 1
                                }
                            }

                            arrayUser.push({
                                date: year + '-' + await convertNumber(month) + '-' + await convertNumber(j),
                                status: status,
                                userID: arrayUserID[i],
                            })
                        }
                        array.push({
                            takeLeave: takeLeave,
                            holiday: holiday,
                            freeBreak: freeBreak,
                            workingDay: workingDay,
                            arrayUser: arrayUser,

                        })
                    }
                    var result = {
                        array: array,
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