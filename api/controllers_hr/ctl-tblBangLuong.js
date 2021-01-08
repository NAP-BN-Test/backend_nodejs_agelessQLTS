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
async function sortArrayDESC(array) {
    let arraySort = [];
    for (var i = 0; i < array.length; i++) {
        if (Number(array[i].slice(0, 2))) {
            let seconrd = Number(array[i].slice(6, 8)) + Number(array[i].slice(3, 5)) * 60 + Number(array[i].slice(0, 2)) * 60 * 60
            arraySort.push(seconrd)
        }
        else {
            let seconrd = Number(array[i].slice(5, 7)) + Number(array[i].slice(2, 4)) * 60 + Number(array[i].slice(0, 1)) * 60 * 60
            arraySort.push(seconrd)
        }
    }
    return arraySort.sort();
}
async function converFromSecondsToHourLate(number) {
    var result = '';
    let h = Math.floor(number / 3600)
    if (h > 0) {
        result = 'M' + h + 'h'
        var remainder = Math.floor((number - (h * 3600)) / 60)
        if (remainder > 0) {
            result += (Math.floor((remainder / 5)) * 5 + "'")
        }
    } else {
        var remainder = Math.floor((number - (h * 3600)) / 60)
        if (remainder > 0) {
            result += ('M' + Math.floor((remainder / 5)) * 5 + "'")
        }
    }

    return result;
}
async function converFromSecondsToHourAftersoon(number) {
    var result = '';
    let h = Math.floor(number / 3600)
    if (h > 0) {
        result = h + 'h'
    }
    var remainder = Math.floor((number - (h * 3600)) / 60)
    if (remainder > 0) {
        result += (Math.floor((remainder / 5)) * 5 + "'")
    }
    return result;
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
                VerifyDate: "2021-01-01 08:25:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-01 08:25:00",
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
                VerifyDate: "2021-01-02 10:24:00",
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
            // -05 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-05 09:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-05 13:00:28",
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
                VerifyDate: "2021-01-06 08:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-06 12:00:28",
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
                VerifyDate: "2021-01-07 08:00:00",
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
                VerifyDate: "2021-01-08 08:00:00",
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
                VerifyDate: "2021-01-09 12:55:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // {
            //     UserID: 1,
            //     VerifyDate: "2021-01-09 17:00:28",
            //     VerifyType: 1,
            //     VerifyState: 1,
            //     WorkCode: 1
            // },
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
                VerifyDate: "2021-01-10 08:00:00",
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
            // -12 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-12 08:40:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-12 17:30:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-12 13:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -13 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-13 08:00:00",
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
                VerifyDate: "2021-01-14 10:00:00",
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
                VerifyDate: "2021-01-14 14:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -15 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-15 14:10:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-15 8:15:16",
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
                VerifyDate: "2021-01-16 08:00:00",
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
                VerifyDate: "2021-01-17 08:00:00",
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
                VerifyDate: "2021-01-18 08:40:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-18 8:25:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -19 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-19 13:00:28",
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
                VerifyDate: "2021-01-20 08:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-20 08:35:16",
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
                VerifyDate: "2021-01-21 08:00:00",
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
                VerifyDate: "2021-01-21 8:40:16",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-21 14:00:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -22 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-22 08:00:00",
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
                VerifyDate: "2021-01-23 08:10:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-23 17:10:28",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 2,
                VerifyDate: "2021-01-23 8:30:16",
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
                VerifyDate: "2021-01-24 08:00:00",
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
                VerifyDate: "2021-01-25 08:00:00",
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
                VerifyDate: "2021-01-26 08:00:00",
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
                VerifyDate: "2021-01-27 08:00:00",
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
                VerifyDate: "2021-01-28 08:00:00",
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
                VerifyDate: "2021-01-29 08:30:00",
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
                VerifyDate: "2021-01-29 8:30:16",
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
                VerifyDate: "2021-01-30 08:00:00",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            {
                UserID: 1,
                VerifyDate: "2021-01-30 16:00:28",
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
                VerifyDate: "2021-01-30 16:30:20",
                VerifyType: 1,
                VerifyState: 1,
                WorkCode: 1
            },
            // -31 ----------------------------------------------------------------------------------------------------------------------------------
            {
                UserID: 1,
                VerifyDate: "2021-01-31 08:00:00",
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
                        var takeLeave = 0;
                        var holiday = 0;
                        var freeBreak = 0;
                        var workingDay = 0;
                        var obj = {}
                        let seventeenH = 3600 * 17
                        let eightH = 3600 * 8
                        let twelveH = 3600 * 12
                        let thirteenH = 3600 * 13
                        var statusMorning = '';
                        var statusAfternoon = '';
                        for (var j = 1; j <= dateFinal; j++) {
                            let arrayTimeOfDate = await filterByDate(arrayUserID[i], j, arrayData)
                            let arraySort = await sortArrayDESC(arrayTimeOfDate);
                            let maxTime = await maxTimeArray(arrayTimeOfDate);
                            let minTime = await minTimeArray(arrayTimeOfDate);
                            if (arrayTimeOfDate.length == 1) {
                                if (minTime > twelveH) {
                                    statusMorning = ''
                                    // check chiều
                                    if (thirteenH > maxTime) {
                                        statusAfternoon = await converFromSecondsToHourLate(thirteenH - maxTime)
                                    }
                                    else {
                                        statusAfternoon = '0.5'
                                    }
                                } else {
                                    // check sáng
                                    if (minTime > eightH) {
                                        statusMorning = await converFromSecondsToHourLate(minTime - eightH)
                                    }
                                    else {
                                        statusMorning = '0.5'
                                    }
                                    statusAfternoon = ''
                                }
                                workingDay += 1
                            }
                            if (arrayTimeOfDate.length > 1) {
                                if (maxTime <= twelveH) {
                                    // check sáng
                                    if (minTime > eightH) {
                                        statusMorning = await converFromSecondsToHourLate(minTime - eightH)
                                    }
                                    else {
                                        statusMorning = '0.5'
                                    }
                                    statusAfternoon = ''
                                    workingDay += 1
                                }
                                else {
                                    // check sáng
                                    if (minTime > eightH) {
                                        statusMorning = await converFromSecondsToHourLate(minTime - eightH)
                                    }
                                    else {
                                        statusMorning = ''
                                    }
                                    // check chiều
                                    if (seventeenH > maxTime) {
                                        statusAfternoon = await converFromSecondsToHourAftersoon(seventeenH - maxTime)
                                    }
                                    else {
                                        statusAfternoon = ''
                                    }
                                    workingDay += 1
                                }
                            }
                            if (arrayTimeOfDate.length >= 1) {
                                let objDay = {
                                    S: statusMorning,
                                    C: statusAfternoon,
                                };
                                obj[await convertNumber(j) + "/" + await convertNumber(month)] = objDay
                            }
                        }
                        obj['takeLeave'] = takeLeave;
                        obj['holiday'] = holiday;
                        obj['freeBreak'] = freeBreak;
                        obj['workingDay'] = workingDay / 2;
                        obj['dayOff'] = holiday + freeBreak + takeLeave;
                        obj['staffName'] = 'test/00' + i;
                        array.push(obj)
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