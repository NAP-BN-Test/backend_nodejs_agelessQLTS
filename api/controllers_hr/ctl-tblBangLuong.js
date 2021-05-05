const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblBangLuong = require('../tables/hrmanage/tblBangLuong')
var mtblChamCong = require('../tables/hrmanage/tblChamCong')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblMucDongBaoHiem = require('../tables/hrmanage/tblMucDongBaoHiem')
var mtblDMGiaDinh = require('../tables/hrmanage/tblDMGiaDinh')
var mtblNghiPhep = require('../tables/hrmanage/tblNghiPhep')
var mModules = require('../constants/modules');
var mtblNghiLe = require('../tables/hrmanage/tblNghiLe')
const axios = require('axios');
var mtblConfigWorkday = require('../tables/hrmanage/tblConfigWorkday')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblMinWageConfig = require('../tables/hrmanage/tblMinWageConfig')

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
// tìm ngày trong dữ liệu chấm công
async function filterByDate(userID, dateFinal, array, month, year) {
    var arrayResult = [];
    for (var i = 0; i < array.length; i++) {
        var date = moment(array[i]['Verify Date']).format("YYYY-MM-DD hh:mm:ss")
        if (Number(date.slice(5, 7)) == month && Number(date.slice(0, 4)) == year) {
            if (array[i]['User ID'] == userID && Number(date.slice(8, 10)) == dateFinal) {
                arrayResult.push(array[i]['Verify Date'].slice(9, 22))
            }
        }

    }
    return arrayResult;
}
async function getUserIDExits(array) {
    var arrayUserID = [];
    for (var i = 0; i < array.length; i++) {
        if (!checkDuplicate(arrayUserID, array[i]['User ID']))
            arrayUserID.push(array[i]['User ID'])
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
async function roundNumberMinutes(number) {
    var result = 0;
    let h = Math.floor(number / 3600)
    var remainder = Math.floor((number - (h * 3600)) / 60)
    var minnutes = Math.floor((remainder / 5)) * 5
    result = Number(h) * 60 + Number(minnutes)
    return (result / 240).toFixed(3);
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
async function getDateTakeLeave(db, month, year, idNhanVien) {
    var array = [];
    var yearMonth = year + '-' + await convertNumber(month);
    await mtblNghiPhep(db).findAll({
        where: {
            [Op.or]: {
                DateStart: { [Op.substring]: yearMonth },
                DateEnd: { [Op.substring]: yearMonth },
            },
            [Op.and]: {
                IDNhanVien: idNhanVien,
            },
        }
    }).then(data => {
        if (data) {
            data.forEach(element => {
                array.push(moment(element.DateStart).date())
                array.push(moment(element.DateEnd).date())
            })
        }
    })
    return array

}
async function getDateholiday(db, month, year) {
    var array = [];
    var yearMonth = year + '-' + await convertNumber(month);
    await mtblNghiLe(db).findAll({
        where: {
            [Op.or]: {
                DateStartHoliday: { [Op.substring]: yearMonth },
                DateEndHoliday: { [Op.substring]: yearMonth },
            }
        }
    }).then(data => {
        if (data) {
            data.forEach(element => {
                for (var i = moment(element.DateStartHoliday).date(); i <= moment(element.DateEndHoliday).date(); i++) {
                    array.push(i)
                }
            })
        }
    })
    return array

}
var mtblNghiPhep = require('../tables/hrmanage/tblNghiPhep')
var mtblDecidedInsuranceSalary = require('../tables/hrmanage/tblDecidedInsuranceSalary')

module.exports = {
    deleteRelationshiptblBangLuong,
    // get_list_tbl_bangluong
    getListtblBangLuong: (req, res) => {
        let body = req.body;
        console.log(12);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    let tblBangLuong = mtblBangLuong(db);
                    // let tblDMNhanvien = mtblDMNhanvien(db)
                    var date = body.date + '-01 17:00:00.000'
                    let tblDMNhanvien = mtblDMNhanvien(db);
                    tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'department' })
                    tblBangLuong.belongsTo(tblDMNhanvien, { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
                    tblBangLuong.findAll({
                        include: [
                            {
                                model: tblDMNhanvien,
                                required: false,
                                as: 'nv',
                                include: [
                                    {
                                        model: mtblDMBoPhan(db),
                                        required: false,
                                        as: 'department'
                                    },
                                ],
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: {
                            [Op.or]: [
                                {
                                    Date: { [Op.lte]: date },
                                    DateEnd: { [Op.gte]: date },
                                },
                                {
                                    Date: { [Op.lte]: date },
                                    DateEnd: null,
                                }
                            ]
                        },
                    }).then(async data => {
                        var array = [];
                        var minimumWage = 0;
                        var objInsurance = {};
                        await mtblMucDongBaoHiem(db).findOne({
                            order: [
                                ['ID', 'DESC']
                            ],
                        }).then(data => {
                            if (data) {
                                minimumWage = data.MinimumWage ? data.MinimumWage : 0;
                                objInsurance['staffBHXH'] = data.StaffBHXH ? data.StaffBHXH : 0
                                objInsurance['staffBHYT'] = data.StaffBHYT
                                objInsurance['staffBHTN'] = data.StaffBHTN
                                objInsurance['union'] = data.StaffUnion ? data.StaffUnion : 0;
                            }
                        })
                        let totalRealField = 0;
                        for (var i = 0; i < data.length; i++) {
                            var reduce = 0;
                            await mtblDMGiaDinh(db).findAll({
                                where: { IDNhanVien: data[i].IDNhanVien }
                            }).then(family => {
                                family.forEach(element => {
                                    reduce += Number(element.Reduce);
                                });
                            })
                            var coefficientsSalary = 0;
                            coefficientsSalary = data[i].nv ? data[i].nv.CoefficientsSalary ? data[i].nv.CoefficientsSalary : 0 : 0
                            let totalReduce = (minimumWage * coefficientsSalary * objInsurance['staffBHXH'] / 100) - (minimumWage * coefficientsSalary * objInsurance['staffBHYT'] / 100) - (minimumWage * coefficientsSalary * objInsurance['staffBHTN'] / 100) - (minimumWage * coefficientsSalary * objInsurance['union'] / 100) - reduce
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                idStaff: data[i].IDNhanVien ? data[i].IDNhanVien : null,
                                staffName: data[i].IDNhanVien ? data[i].nv.StaffName : null,
                                staffCode: data[i].IDNhanVien ? data[i].nv.StaffCode : null,
                                departmentName: data[i].IDNhanVien ? data[i].nv.department ? data[i].nv.department.DepartmentName : '' : '',
                                workingSalary: data[i].WorkingSalary ? data[i].WorkingSalary : 0,
                                bhxhSalary: minimumWage * coefficientsSalary,
                                staffBHXH: minimumWage * coefficientsSalary * objInsurance['staffBHXH'] / 100,
                                staffBHYT: minimumWage * coefficientsSalary * objInsurance['staffBHYT'] / 100,
                                staffBHTN: minimumWage * coefficientsSalary * objInsurance['staffBHTN'] / 100,
                                union: minimumWage * coefficientsSalary * objInsurance['union'] / 100,
                                personalTax: (data[i].nv ? data[i].nv.ProductivityWages : 0) - totalReduce,
                                personalTaxSalary: (data[i].nv ? data[i].nv.ProductivityWages : 0) - totalReduce,
                                reduce: reduce,
                                totalReduce: totalReduce,
                                realField: minimumWage * coefficientsSalary - totalReduce,
                                productivityWages: data[i].nv ? data[i].nv.ProductivityWages ? data[i].nv.ProductivityWages : 0 : 0,
                            }
                            totalRealField += minimumWage * coefficientsSalary - totalReduce;
                            if (data[i].nv.Status == 'Lương và bảo hiểm' || data[i].nv.Status == 'Hưởng lương') {
                                array.push(obj);
                                stt += 1;
                            }
                        }
                        var count = await mtblBangLuong(db).count({ where: { Date: { [Op.substring]: body.date } }, })
                        var result = {
                            objInsurance: objInsurance,
                            totalRealField: totalRealField,
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
                    let stt = 1;
                    let tblBangLuong = mtblBangLuong(db);
                    let tblDMNhanvien = mtblDMNhanvien(db)
                    tblBangLuong.belongsTo(tblDMNhanvien, { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
                    tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bp' })
                    tblBangLuong.findAll({
                        include: [
                            {
                                model: tblDMNhanvien,
                                required: false,
                                as: 'nv',
                                include: [
                                    {
                                        model: mtblDMBoPhan(db),
                                        required: false,
                                        as: 'bp'
                                    },
                                ],
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: { Date: { [Op.substring]: body.date.slice(0, 4) } },
                    }).then(async data => {
                        var array = [];
                        var objInsurance = {};
                        var minimumWage = 0;
                        await mtblMinWageConfig(db).findOne({
                            order: [
                                ['ID', 'DESC']
                            ]
                        }).then(data => {
                            minimumWage = data.MinimumWage
                        })
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
                                objInsurance['staffBHTNLD'] = data.StaffBHTNLD ? data.StaffBHTNLD : 0
                            }
                        })
                        for (var i = 0; i < data.length; i++) {
                            var reduce = 0;
                            await mtblDMGiaDinh(db).findAll({
                                where: { IDNhanVien: data[i].IDNhanVien }
                            }).then(family => {
                                family.forEach(element => {
                                    reduce += Number(element.Reduce);
                                });
                            })
                            let insuranceSalaryIncrease = await mtblDecidedInsuranceSalary(db).findOne({
                                where: { IDStaff: data[i].IDNhanVien },
                                order: [
                                    ['ID', 'DESC']
                                ],
                            })
                            var coefficientsSalary = data[i].IDNhanVien ? data[i].nv.CoefficientsSalary ? data[i].nv.CoefficientsSalary : 0 : 0;
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                idStaff: data[i].IDNhanVien ? data[i].IDNhanVien : null,
                                nameStaff: data[i].IDNhanVien ? data[i].nv.StaffName : null,
                                nameDepartment: data[i].IDNhanVien ? data[i].nv.bp ? data[i].nv.bp.DepartmentName : '' : '',
                                staffCode: data[i].IDNhanVien ? data[i].nv.StaffCode : null,
                                productivityWages: data[i].IDNhanVien ? data[i].nv.ProductivityWages : 0,
                                workingSalary: data[i].WorkingSalary ? data[i].WorkingSalary : 0,
                                bhxhSalary: coefficientsSalary * minimumWage + ((insuranceSalaryIncrease ? insuranceSalaryIncrease.Increase : 0) * coefficientsSalary),
                                reduce: Number(reduce),
                                insuranceSalaryIncrease: insuranceSalaryIncrease ? insuranceSalaryIncrease.Increase : 0,
                                coefficientsSalary: coefficientsSalary
                            }
                            if (data[i].nv.Status == 'Lương và bảo hiểm' || data[i].nv.Status == 'Đóng bảo hiểm') {
                                array.push(obj);
                                stt += 1;
                            }

                        }
                        var count = await mtblBangLuong(db).count({ where: { Date: { [Op.substring]: body.date } }, })
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
    dataTimekeeping: async (req, res) => {
        let body = req.body;
        let arrayData = [
            // 01 ----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-1-1 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-1-1 18:00:30",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-1-1 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-1-1 16:20:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -06 ----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-1-6 9:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-1-6 17:10:28",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-1-6 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-1-6 17:00:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -07 ----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-1-7 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-1-7 9:20:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-1-7 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-1-7 17:00:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
        ]
        database.connectDatabase().then(async db => {
            // await axios.get(`http://192.168.23.13:1333/dulieuchamcong/`).then(data => {
            //     if (data.length > 0)
            //         arrayData = JSON.parse(data)
            // })
            if (db) {
                try {
                    var whereobj = {};
                    if (body.departmentID) {
                        whereobj = { IDBoPhan: body.departmentID }
                    }
                    var array = [];
                    var month = Number(body.date.slice(5, 7)); // January
                    var year = Number(body.date.slice(0, 4));
                    var date = new Date(year, month, 0);
                    var dateFinal = Number(date.toISOString().slice(8, 10))
                    dateFinal += 1
                    var arrayUserID = await getUserIDExits(arrayData);
                    var arrayHoliday = await getDateholiday(db, month, year)
                    var yearMonth = year + '-' + await convertNumber(month);
                    var timeKeeping = await mtblChamCong(db).findOne({
                        where: [
                            { Date: { [Op.substring]: '%' + yearMonth + '%' } },
                        ]
                    })
                    var arrayDays = [];
                    let checkFor = 0;
                    if (!timeKeeping) {
                        if (arrayUserID.length > 0) {
                            for (var i = 0; i < arrayUserID.length; i++) {
                                let seventeenH = 3600 * 17
                                let eightH = 3600 * 8
                                let twelveH = 3600 * 12
                                let thirteenH = 3600 * 13
                                var statusMorning = '';
                                var statusAfternoon = '';
                                var staff = await mtblDMNhanvien(db).findOne({ where: { IDMayChamCong: arrayUserID[i] } })
                                if (staff) {
                                    var yearMonth = year + '-' + await convertNumber(month);
                                    for (var j = 1; j <= dateFinal; j++) {
                                        var summaryEndDateS = 0;
                                        var summaryEndDateC = 0;
                                        if (!checkDuplicate(arrayHoliday, j)) {
                                            let arrayTimeOfDate = await filterByDate(arrayUserID[i], j, arrayData, month, year)
                                            let maxTime = await maxTimeArray(arrayTimeOfDate);
                                            let minTime = await minTimeArray(arrayTimeOfDate);
                                            if (arrayTimeOfDate.length == 1) {
                                                if (minTime > twelveH) {
                                                    // check chiều
                                                    if (thirteenH < maxTime) {
                                                        statusAfternoon = await converFromSecondsToHourLate(maxTime - thirteenH)
                                                        summaryEndDateC = await roundNumberMinutes(maxTime - thirteenH)
                                                    }
                                                    else {
                                                        statusAfternoon = ''
                                                    }
                                                    statusMorning = '0.5'
                                                    summaryEndDateS = 0.5
                                                } else {
                                                    // check sáng
                                                    if (minTime > eightH) {
                                                        statusMorning = await converFromSecondsToHourLate(minTime - eightH)
                                                        summaryEndDateS = await roundNumberMinutes(minTime - eightH)
                                                    }
                                                    else {
                                                        statusMorning = ''
                                                    }
                                                    statusAfternoon = '0.5'
                                                    summaryEndDateC = 0.5
                                                }
                                            }
                                            if (arrayTimeOfDate.length > 1) {
                                                if (maxTime <= twelveH) {
                                                    // check sáng
                                                    if (minTime > eightH) {
                                                        statusMorning = await converFromSecondsToHourLate(minTime - eightH)
                                                        summaryEndDateS = await roundNumberMinutes(minTime - eightH)

                                                    }
                                                    else {
                                                        if (twelveH > maxTime) {
                                                            statusMorning = await converFromSecondsToHourAftersoon(twelveH - maxTime)
                                                            summaryEndDateS = await roundNumberMinutes(twelveH - maxTime)
                                                        }
                                                        else {
                                                            statusMorning = ''
                                                        }
                                                    }
                                                    statusAfternoon = '0.5'
                                                    summaryEndDateC = 0.5
                                                }
                                                else {
                                                    if (minTime >= thirteenH) {
                                                        statusMorning = '0.5'
                                                        summaryEndDateS = 0.5
                                                        // check chiều
                                                        if (thirteenH < minTime) {
                                                            statusAfternoon = await converFromSecondsToHourLate(minTime - thirteenH)
                                                            summaryEndDateC = await roundNumberMinutes(minTime - thirteenH)
                                                        }
                                                        else {
                                                            if (seventeenH > maxTime) {
                                                                statusAfternoon = await converFromSecondsToHourAftersoon(seventeenH - maxTime)
                                                                summaryEndDateC = await roundNumberMinutes(seventeenH - maxTime)
                                                            }
                                                            else {
                                                                statusAfternoon = ''
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        // check sáng
                                                        if (minTime > eightH) {
                                                            statusMorning = await converFromSecondsToHourLate(minTime - eightH)
                                                            summaryEndDateS = await roundNumberMinutes(minTime - eightH)
                                                        }
                                                        else {
                                                            statusMorning = ''
                                                        }
                                                        // check chiều
                                                        if (seventeenH > maxTime) {
                                                            statusAfternoon = await converFromSecondsToHourAftersoon(seventeenH - maxTime)
                                                            summaryEndDateC = await roundNumberMinutes(seventeenH - maxTime)

                                                        }
                                                        else {
                                                            statusAfternoon = ''
                                                        }
                                                    }
                                                }
                                            }
                                            if (arrayTimeOfDate.length >= 1) {
                                                await mtblChamCong(db).create({
                                                    IDNhanVien: staff ? staff.ID : null,
                                                    Date: moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS'),
                                                    Time: null,
                                                    Status: statusMorning ? statusMorning : null,
                                                    Reason: '',
                                                    Type: true,
                                                    SummaryEndDate: summaryEndDateS,
                                                })
                                                await mtblChamCong(db).create({
                                                    IDNhanVien: staff ? staff.ID : null,
                                                    Date: moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS'),
                                                    Time: null,
                                                    Status: statusAfternoon ? statusAfternoon : null,
                                                    Reason: '',
                                                    Type: false,
                                                    SummaryEndDate: summaryEndDateC,
                                                })
                                            } else {
                                                await mtblChamCong(db).create({
                                                    IDNhanVien: staff ? staff.ID : null,
                                                    Date: moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS'),
                                                    Time: null,
                                                    Status: '1',
                                                    Reason: 'Nghỉ không phép',
                                                    Type: true,
                                                    SummaryEndDate: summaryEndDateS,
                                                })
                                                await mtblChamCong(db).create({
                                                    IDNhanVien: staff ? staff.ID : null,
                                                    Date: moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS'),
                                                    Time: null,
                                                    Status: '1',
                                                    Reason: 'Nghỉ không phép',
                                                    Type: false,
                                                    SummaryEndDate: summaryEndDateC,
                                                })
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }
                    // lấy dữ liệu từ database
                    var array7th = [];
                    var array7thDB = [];
                    await mtblDMNhanvien(db).findAll({ where: whereobj }).then(async staff => {
                        for (var j = 1; j <= dateFinal; j++) {
                            var datetConvert = mModules.toDatetimeDay(moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(j)).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
                            if (datetConvert.slice(0, 8) == 'Chủ nhật') {
                                arrayHoliday.push(j)
                            }
                            if (datetConvert.slice(0, 5) == 'Thứ 7') {
                                array7th.push(j)
                            }
                        }
                        await mtblConfigWorkday(db).findAll({
                            where: { Date: { [Op.substring]: year + '-' + await convertNumber(month) } },
                            order: [
                                ['Date', 'DESC']
                            ],
                        }).then(data => {
                            if (data.length > 0)
                                data.forEach(element => {
                                    if (!checkDuplicate(array7th, element))
                                        array7thDB.push(Number(element.Date.slice(8, 10)))
                                });
                        })
                        array7th.forEach(element => {
                            if (!checkDuplicate(array7thDB, element)) {
                                arrayHoliday.push(element)
                            }
                        })
                        yearMonth = year + '-' + await convertNumber(month);
                        for (var i = 0; i < staff.length; i++) {
                            let objWhere = {};
                            let arraySearchAnd = [];
                            let arraySearchOr = [];
                            let arraySearchNot = [];
                            if (body.date) {
                                arraySearchAnd.push({ IDNhanVien: staff[i].ID });
                                arraySearchAnd.push({ Date: { [Op.substring]: '%' + yearMonth + '%' } });
                            }
                            if (arraySearchOr.length > 0)
                                objWhere[Op.or] = arraySearchOr
                            if (arraySearchAnd.length > 0)
                                objWhere[Op.and] = arraySearchAnd
                            if (arraySearchNot.length > 0)
                                objWhere[Op.not] = arraySearchNot
                            var summary = 0;
                            if (arrayDays.length > 0)
                                checkFor = 1;
                            var freeBreak = 0;
                            var workingDay = 0;
                            var obj = {}
                            var arrayTakeLeave = await getDateTakeLeave(db, month, year, staff[i].ID)
                            var timeKeeping = await mtblChamCong(db).findOne({
                                where: objWhere,
                            })
                            if (timeKeeping) {
                                for (var j = 1; j <= dateFinal; j++) {
                                    if (!checkDuplicate(arrayHoliday, j)) {
                                        var timeKeepingM = await mtblChamCong(db).findOne({
                                            where: [
                                                { IDNhanVien: staff[i].ID },
                                                { Date: moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS'), },
                                                { Type: true },
                                            ]
                                        })
                                        var timeKeepingA = await mtblChamCong(db).findOne({
                                            where: [
                                                { IDNhanVien: staff[i].ID },
                                                { Date: moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS'), },
                                                { Type: false },
                                            ]
                                        })
                                        if (timeKeepingM) {
                                            if (timeKeepingM.Status == '1') {
                                                if (checkDuplicate(arrayTakeLeave, j)) {
                                                    if (checkFor == 0)
                                                        arrayDays.push(await convertNumber(j) + "/" + await convertNumber(month))
                                                    let objDay = {};
                                                    objDay['S'] = timeKeepingM ? timeKeepingM.Status ? timeKeepingM.Status : '' : ' ';
                                                    objDay['idS'] = timeKeepingM ? timeKeepingM.ID : ' ';
                                                    objDay['C'] = ' ';
                                                    objDay['idC'] = timeKeepingA ? timeKeepingA.ID : ' ';
                                                    objDay['status'] = 'H';
                                                    obj[await convertNumber(j) + "/" + await convertNumber(month)] = objDay;
                                                    freeBreak += 1;
                                                }
                                                else {
                                                    if (checkFor == 0)
                                                        arrayDays.push(await convertNumber(j) + "/" + await convertNumber(month))
                                                    let objDay = {};
                                                    objDay['S'] = timeKeepingM ? timeKeepingM.Status ? timeKeepingM.Status : '' : ' ';
                                                    objDay['idS'] = timeKeepingM ? timeKeepingM.ID : ' ';
                                                    objDay['C'] = ' ';
                                                    objDay['idC'] = timeKeepingA ? timeKeepingA.ID : ' ';
                                                    objDay['status'] = 'F';
                                                    obj[await convertNumber(j) + "/" + await convertNumber(month)] = objDay;
                                                    freeBreak += 1;
                                                }
                                            } else {
                                                if (checkFor == 0)
                                                    arrayDays.push(await convertNumber(j) + "/" + await convertNumber(month))
                                                let objDay = {};
                                                objDay['S'] = timeKeepingM ? timeKeepingM.Status ? timeKeepingM.Status : '' : ' ';
                                                objDay['idS'] = timeKeepingM ? timeKeepingM.ID : ' ';
                                                objDay['C'] = timeKeepingA ? timeKeepingA.Status ? timeKeepingA.Status : '' : ' ';
                                                objDay['idC'] = timeKeepingA ? timeKeepingA.ID : ' ';
                                                workingDay += 1
                                                obj[await convertNumber(j) + "/" + await convertNumber(month)] = objDay;
                                            }
                                        }
                                        // lấy ngày nghỉ tính theo 3 con số theo yêu cầu
                                        if (timeKeepingM) {
                                            summary += timeKeepingM.SummaryEndDate
                                        }
                                        if (timeKeepingA) {
                                            summary += timeKeepingA.SummaryEndDate
                                        }
                                    }
                                }
                            }
                            obj['takeLeave'] = arrayTakeLeave ? arrayTakeLeave.length : 0;
                            obj['holiday'] = arrayHoliday ? arrayHoliday.length : 0;
                            obj['freeBreak'] = freeBreak;
                            obj['workingDay'] = workingDay;
                            obj['dayOff'] = Number(Number(summary) + Number(freeBreak)).toFixed(3);
                            obj['staffName'] = staff[i] ? staff[i].StaffName : '';
                            obj['staffCode'] = staff[i] ? staff[i].StaffCode : '';
                            let departmentName = '';
                            await mtblDMBoPhan(db).findOne({
                                where: {
                                    ID: staff[i].IDBoPhan
                                }
                            }).then(data => {
                                if (data)
                                    departmentName = data.DepartmentName
                            })
                            obj['departmentName'] = departmentName;
                            array.push(obj)
                        }
                    })
                    var result = {
                        array: array,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        arrayDays
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
    // update_timekeeping
    updateTimekeeping: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    body.array = JSON.parse(body.array);
                    for (var i = 0; i < body.array.length; i++) {
                        if (body.array[i].id)
                            mtblChamCong(db).update({
                                Status: body.array[i].status
                            }, {
                                where: {
                                    ID: body.array[i].id
                                }
                            })
                    }
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
    // data_export_excel
    dataExportExcel: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            try {
                var array = [];
                var month = Number(body.date.slice(5, 7)); // January
                var year = Number(body.date.slice(0, 4));
                var date = new Date(year, month, 0);
                var dateFinal = Number(date.toISOString().slice(8, 10))
                dateFinal += 1
                var takeLeave = 0;
                var holiday = 0;
                var count = 0;
                let checkFor = 0;
                var arrayHoliday = await getDateholiday(db, month, year)
                var obj = [];
                if (body.idNhanVien) {
                    obj.push({ ID: body.idNhanVien })
                }
                await mtblDMNhanvien(db).findAll({ where: obj }).then(async staff => {
                    for (var i = 0; i < staff.length; i++) {
                        if (count > 0)
                            checkFor = 1;
                        var freeBreak = 0;
                        var workingDay = 0;
                        var arrayTakeLeave = await getDateTakeLeave(db, month, year, staff[i].ID)
                        var yearMonth = year + '-' + await convertNumber(month);
                        var timeKeeping = await mtblChamCong(db).findOne({
                            where: [
                                { IDNhanVien: staff[i].ID },
                                { Date: { [Op.substring]: '%' + yearMonth + '%' } },
                            ]
                        })
                        let objMorning = {};
                        let objAfternoon = {};
                        objAfternoon['Tên nhân viên'] = staff[i] ? staff[i].StaffName : '';
                        objAfternoon['Buổi'] = 'Chiều';
                        objMorning['Tên nhân viên'] = staff[i] ? staff[i].StaffName : '';
                        objMorning['Buổi'] = 'Sáng';
                        if (timeKeeping) {
                            for (var j = 1; j <= dateFinal; j++) {
                                if (!checkDuplicate(arrayHoliday, j)) {
                                    var timeKeepingM = await mtblChamCong(db).findOne({
                                        where: [
                                            { IDNhanVien: staff[i].ID },
                                            { Date: moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS'), },
                                            { Type: true },
                                        ]
                                    })
                                    var timeKeepingA = await mtblChamCong(db).findOne({
                                        where: [
                                            { IDNhanVien: staff[i].ID },
                                            { Date: moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS'), },
                                            { Type: false },
                                        ]
                                    })
                                    if (timeKeepingM) {
                                        workingDay += 1
                                        if (checkFor == 0)
                                            count += 1;
                                        objMorning[await convertNumber(j) + "/" + await convertNumber(month)] = timeKeepingM ? timeKeepingM.Status ? timeKeepingM.Status : '' : ' ';
                                        objAfternoon[await convertNumber(j) + "/" + await convertNumber(month)] = timeKeepingA ? timeKeepingA.Status ? timeKeepingA.Status : '' : ' ';
                                    }
                                    else {
                                        if (checkDuplicate(arrayTakeLeave, j)) {
                                            if (checkFor == 0)
                                                count += 1;

                                            objMorning[await convertNumber(j) + "/" + await convertNumber(month)] = 1;
                                            objAfternoon[await convertNumber(j) + "/" + await convertNumber(month)] = '';
                                            freeBreak += 1;
                                        }
                                        else {
                                            if (checkFor == 0)
                                                count += 1;
                                            objMorning[await convertNumber(j) + "/" + await convertNumber(month)] = 1;
                                            objAfternoon[await convertNumber(j) + "/" + await convertNumber(month)] = '';
                                            freeBreak += 1;
                                        }
                                    }
                                }
                            }
                        }
                        array.push(objMorning)
                        array.push(objAfternoon)
                    }
                })
                var result = {
                    array: array,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    count: count + 7,
                }
                res.json(result);
            } catch (error) {
                console.log(error);
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // delete_all_timekeeping
    deleteAllTimekeeping: async (req, res) => {
        let body = req.body;
        await axios.get(`http://192.168.23.13:1333/dulieuchamcong/deleteall`).then(data => {
            if (data == 'done') {
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                }
                res.json(result);
            }
        })
    },
    // synthetic_information_monthly
    syntheticInformationMonthly: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let array = [];
                    let obj = {}
                    if (body.departmentID) {
                        obj = {
                            IDBoPhan: body.departmentID,
                        }
                    }
                    let tblDMNhanvien = mtblDMNhanvien(db);
                    tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'department' })

                    await tblDMNhanvien.findAll({
                        include: [
                            {
                                model: mtblDMBoPhan(db),
                                required: false,
                                as: 'department'
                            },
                        ],
                        where: obj,
                    }).then(async data => {
                        for (var i = 0; i < data.length; i++) {
                            let overtime = 0; // số ngày lm thêm giờ
                            let remainingPreviousYear = 0; // số ngày được ứng của năm trước
                            let numberHoliday = 0; // số ngày nghỉ trong tháng
                            let remaining = 0; // số phép còn lại
                            let freeBreak = 0;
                            let lateDay = 0;
                            // Tính ngày thời gian thêm giờ
                            await mtblNghiPhep(db).findAll({
                                where: {
                                    Type: 'SignUp',
                                    IDNhanVien: data[i].ID,
                                }
                            }).then(leave => {
                                leave.forEach(item => {
                                    var hour = Number(item.Time.slice(0, 2));
                                    var minute = Number(item.Time.slice(3, 5));
                                    overtime += minute + hour * 60
                                })
                            })
                            // lấy số ngày được ứng của tháng trước và phép còn lại
                            await mtblNghiPhep(db).findOne({
                                order: [
                                    ['ID', 'DESC']
                                ],
                                where: {
                                    Type: 'TakeLeave',
                                    IDNhanVien: data[i].ID,
                                }
                            }).then(data => {
                                if (data) {
                                    remaining = data.AdvancePayment - data.UsedLeave - data.NumberHoliday
                                    remainingPreviousYear = data.RemainingPreviousYear
                                }
                            })
                            // tính số ngày nghỉ trong tháng
                            await mtblNghiPhep(db).findAll({
                                order: [
                                    ['ID', 'DESC']
                                ],
                                where: {
                                    Type: 'TakeLeave',
                                    IDNhanVien: data[i].ID,
                                }
                            }).then(data => {
                                if (data)
                                    data.forEach(item => {
                                        numberHoliday += item.NumberHoliday
                                    })
                            })
                            // tính số ngày đi muộn, nghỉ tự do
                            await mtblChamCong(db).findAll({
                                order: [
                                    ['ID', 'DESC']
                                ],
                                where: {
                                    IDNhanVien: data[i].ID,
                                }
                            }).then(data => {
                                if (data)
                                    data.forEach(item => {
                                        if (item.status == '1') {
                                            freeBreak += 1
                                        } else if (item.status != null) {
                                            lateDay += 1
                                        }
                                    })
                            })
                            array.push({
                                staffName: data[i].StaffName ? data[i].StaffName : '',
                                staffCode: data[i].StaffCode ? data[i].StaffCode : '',
                                departmentName: data[i].department ? data[i].department.DepartmentName : '',
                                overtime: overtime,
                                remaining: remaining,
                                remainingPreviousYear: remainingPreviousYear,
                                numberHoliday: numberHoliday,
                                freeBreak: freeBreak,
                                lateDay: lateDay,
                            })
                        }
                    })
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