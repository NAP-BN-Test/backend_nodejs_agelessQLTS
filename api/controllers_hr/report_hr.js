const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMChiNhanh = require('../tables/constants/tblDMChiNhanh')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblTaiSanBanGiao = require('../tables/qlnb/tblTaiSanBanGiao')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblHopDongNhanSu = require('../tables/hrmanage/tblHopDongNhanSu')
const Sequelize = require('sequelize');
var mtblLoaiHopDong = require('../tables/hrmanage/tblLoaiHopDong')

let ctlBangLuong = require('./ctl-tblBangLuong')

var database = require('../database');
var mtblRewardPunishment = require('../tables/hrmanage/tblRewardPunishment')
var mtblRewardPunishmentRStaff = require('../tables/hrmanage/tblRewardPunishmentRStaff')
async function totalRewardPunishment(db, month, departmentID) {
    let total = 0;
    let arrayStaff = []
    await mtblDMNhanvien(db).findAll({
        where: {
            IDBoPhan: departmentID
        }
    }).then(data => {
        data.forEach(item => {
            arrayStaff.push(item.ID)
        })
    })
    let tblRewardPunishment = mtblRewardPunishment(db);
    tblRewardPunishment.hasMany(mtblRewardPunishmentRStaff(db), { foreignKey: 'RewardPunishmentID', as: 'rp' })
    await tblRewardPunishment.findAll({
        where: {
            Date: { [Op.substring]: month },
            IDStaff: { [Op.in]: arrayStaff },
        },
        include: [
            {
                model: mtblRewardPunishmentRStaff(db),
                required: false,
                as: 'rp'
            },
        ],
    }).then(data => {
        for (let r = 0; r < data.length; r++) {
            total += (data[r].rp.length * data[r].SalaryIncrease)
        }
    })
    return total
}
async function convertNumber(number) {
    if (number < 10) {
        return '0' + number
    } else
        return number
}
var mModules = require('../constants/modules');

async function numberStaffInYear(db, year, departmentID) {
    var dateStart = year + '-' + '12-30 07:00:00.000';
    let obj = {
        ContractDateStart: { [Op.lte]: dateStart },
    }
    if (departmentID) {
        let arrayStaff = []
        await mtblDMNhanvien(db).findAll({
            where: {
                IDBoPhan: departmentID
            }
        }).then(data => {
            data.forEach(item => {
                arrayStaff.push(item.ID)
            })
        })
        obj['IDNhanVien'] = { [Op.in]: arrayStaff }
    }
    let arrayStaff = []
    await mtblHopDongNhanSu(db).findAll({
        where: obj
    }).then(contract => {
        for (let c = 0; c < contract.length; c++) {
            if (!mModules.checkDuplicate(arrayStaff, contract[c].IDNhanVien)) {
                arrayStaff.push(contract[c].IDNhanVien)
            }
        }
    })
    return arrayStaff.length
}

module.exports = {
    // report_personnel_structure
    reportPersonnelStructure: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let obj = {}
                    let array1 = []
                    let array2 = []
                    let count1 = 0
                    let count2 = 0
                    await mtblDMBoPhan(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async department => {
                        for (let d = 0; d < department.length; d++) {
                            await mtblDMNhanvien(db).findAll({
                                where: {
                                    IDBoPhan: department[d].ID
                                }
                            }).then(async staff => {
                                let count = 0
                                if (body.dateStart) {
                                    var date = body.dateStart + '-01 07:00:00.000';
                                    for (let s = 0; s < staff.length; s++) {
                                        await mtblHopDongNhanSu(db).findOne({
                                            where: {
                                                IDNhanVien: staff[s].ID,
                                                Date: { [Op.lte]: date }
                                            },
                                            order: [
                                                ['ID', 'ASC']
                                            ],
                                        }).then(data => {
                                            if (data) {
                                                count += 1
                                            }
                                        })
                                    }
                                    array1.push({
                                        departmentName: department[d].DepartmentName ? department[d].DepartmentName : '',
                                        departmentCode: department[d].DepartmentCode ? department[d].DepartmentCode : '',
                                        numberEmployees: count,
                                    })
                                    count1 += count
                                }
                                if (body.dateEnd) {
                                    var dateEnd = body.dateEnd + '-01 07:00:00.000';
                                    for (let s = 0; s < staff.length; s++) {
                                        await mtblHopDongNhanSu(db).findOne({
                                            where: {
                                                IDNhanVien: staff[s].ID,
                                                Date: { [Op.lte]: dateEnd }
                                            },
                                            order: [
                                                ['ID', 'ASC']
                                            ],
                                        }).then(data => {
                                            if (data) {
                                                count += 1
                                            }
                                        })
                                    }
                                    array2.push({
                                        departmentName: department[d].DepartmentName ? department[d].DepartmentName : '',
                                        departmentCode: department[d].DepartmentCode ? department[d].DepartmentCode : '',
                                        numberEmployees: count,
                                    })
                                    count2 += count

                                }

                            })
                        }
                    })
                    var monthStart;
                    var dateStart;
                    if (body.dateStart) {
                        monthStart = Number(body.dateStart.slice(5, 7)); // January
                        dateStart = Number(body.dateStart.slice(0, 4));
                    }
                    var monthEnd;
                    var dateEnd;
                    if (body.dateEnd) {
                        monthEnd = Number(body.dateEnd.slice(5, 7)); // January
                        dateEnd = Number(body.dateEnd.slice(0, 4));
                    }

                    obj['array1'] = array1
                    obj['count1'] = count1
                    obj['dateStart'] = body.dateStart ? (await convertNumber(monthStart) + '/' + dateStart) : ''
                    obj['array2'] = array2
                    obj['count2'] = count2
                    obj['dateEnd'] = body.dateEnd ? (await convertNumber(monthEnd) + '/' + dateEnd) : ''
                    var result = {
                        obj: obj,
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
    // report_types_of_contracts
    reportTypesOfContracts: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let obj = {}
                    let array1 = []
                    let array2 = []
                    let count1 = 0
                    let count2 = 0
                    await mtblLoaiHopDong(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async contractType => {
                        for (let c = 0; c < contractType.length; c++) {
                            if (body.dateStart) {
                                let countInForce;
                                let countExpiredContract;
                                var date = body.dateStart + '-30 07:00:00.000';
                                countInForce = await mtblHopDongNhanSu(db).count({
                                    where: {
                                        IDLoaiHopDong: contractType[c].ID,
                                        Status: 'Có hiệu lực',
                                        ContractDateStart: { [Op.lte]: date },
                                        ContractDateEnd: { [Op.gte]: date }
                                    }
                                })
                                countExpiredContract = await mtblHopDongNhanSu(db).count({
                                    where: {
                                        IDLoaiHopDong: contractType[c].ID,
                                        Status: 'Hết hiệu lực',
                                        ContractDateStart: { [Op.gte]: date },
                                        ContractDateEnd: { [Op.lte]: date }
                                    }
                                })
                                count1 += (countInForce ? countInForce : 0)
                                array1.push({
                                    contractTypeName: contractType[c].TenLoaiHD ? contractType[c].TenLoaiHD : '',
                                    contractTypeCode: contractType[c].MaLoaiHD ? contractType[c].MaLoaiHD : '',
                                    numberOfContractsInForce: countInForce ? countInForce : 0,
                                    numberOfExpiredContracts: countExpiredContract ? countExpiredContract : 0,
                                })
                            }
                            if (body.dateEnd) {
                                let countInForce;
                                let countExpiredContract;
                                var date = body.dateEnd + '-30 07:00:00.000';
                                countInForce = await mtblHopDongNhanSu(db).count({
                                    where: {
                                        IDLoaiHopDong: contractType[c].ID,
                                        Status: 'Có hiệu lực',
                                        ContractDateStart: { [Op.lte]: date },
                                        ContractDateEnd: { [Op.gte]: date }
                                    }
                                })
                                countExpiredContract = await mtblHopDongNhanSu(db).count({
                                    where: {
                                        IDLoaiHopDong: contractType[c].ID,
                                        Status: 'Hết hiệu lực',
                                        ContractDateStart: { [Op.gte]: date },
                                        ContractDateEnd: { [Op.lte]: date }
                                    }
                                })
                                count2 += (countInForce ? countInForce : 0)
                                array2.push({
                                    contractTypeName: contractType[c].TenLoaiHD ? contractType[c].TenLoaiHD : '',
                                    contractTypeCode: contractType[c].MaLoaiHD ? contractType[c].MaLoaiHD : '',
                                    numberOfContractsInForce: countInForce ? countInForce : 0,
                                    numberOfExpiredContracts: countExpiredContract ? countExpiredContract : 0,
                                })
                            }
                        }
                    })
                    var monthStart;
                    var dateStart;
                    if (body.dateStart) {
                        monthStart = Number(body.dateStart.slice(5, 7)); // January
                        dateStart = Number(body.dateStart.slice(0, 4));
                    }
                    var monthEnd;
                    var dateEnd;
                    if (body.dateEnd) {
                        monthEnd = Number(body.dateEnd.slice(5, 7)); // January
                        dateEnd = Number(body.dateEnd.slice(0, 4));
                    }
                    obj['array1'] = array1
                    obj['count1'] = count1
                    obj['dateStart'] = body.dateStart ? (await convertNumber(monthStart) + '/' + dateStart) : ''
                    obj['array2'] = array2
                    obj['count2'] = count2
                    obj['dateEnd'] = body.dateEnd ? (await convertNumber(monthEnd) + '/' + dateEnd) : ''
                    var result = {
                        obj: obj,
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
    // report_salary_bonus_chart
    reportSalaryAndBonusChart: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var monthStart;
                    var dateStart;
                    if (body.dateStart) {
                        monthStart = Number(body.dateStart.slice(5, 7)); // January
                        dateStart = Number(body.dateStart.slice(0, 4));
                    }
                    var monthEnd;
                    var dateEnd;
                    if (body.dateEnd) {
                        monthEnd = Number(body.dateEnd.slice(5, 7)); // January
                        dateEnd = Number(body.dateEnd.slice(0, 4));
                    }
                    let obj = {};
                    let count1 = 0
                    let count2 = 0
                    let countSalary1 = 0
                    let countSalary2 = 0
                    let array1 = []
                    let array2 = []
                    await mtblDMBoPhan(db).findAll().then(async department => {
                        for (let d = 0; d < department.length; d++) {
                            if (body.dateStart) {
                                let totalSalary = await ctlBangLuong.getDetailPayrollForMonthYear(db, body.dateStart, department[d].ID)
                                let rewardPunishment = await totalRewardPunishment(db, body.dateStart, department[d].ID)
                                array1.push({
                                    departmentName: department[d].DepartmentName ? department[d].DepartmentName : '',
                                    totalSalary: Number(totalSalary.totalFooter.totalRealField),
                                    totalRewardPunishment: rewardPunishment,
                                })
                                countSalary1 += Number(totalSalary.totalFooter.totalRealField)
                                count1 += Number(rewardPunishment)
                            }
                            if (body.dateEnd) {
                                let totalSalary = await ctlBangLuong.getDetailPayrollForMonthYear(db, body.dateEnd, department[d].ID)
                                let rewardPunishment = await totalRewardPunishment(db, body.dateEnd, department[d].ID)
                                array2.push({
                                    departmentName: department[d].DepartmentName ? department[d].DepartmentName : '',
                                    totalSalary: Number(totalSalary.totalFooter.totalRealField),
                                    totalRewardPunishment: rewardPunishment,
                                })
                                countSalary2 += Number(totalSalary.totalFooter.totalRealField)
                                count2 += Number(rewardPunishment)
                            }
                        }
                        obj['array1'] = array1
                        obj['totalRewardPunishment1'] = count1
                        obj['countSalary1'] = countSalary1
                        obj['array2'] = array2
                        obj['totalRewardPunishment2'] = count2
                        obj['countSalary2'] = countSalary2
                        obj['dateStart'] = body.dateStart ? (await convertNumber(monthStart) + '/' + dateStart) : ''
                        obj['dateEnd'] = body.dateEnd ? (await convertNumber(monthEnd) + '/' + dateEnd) : ''
                    })
                    var result = {
                        obj: obj,
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
    // report_personnel_development
    reportPersonnelDevelopment: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let arrayResult = []
                    let arrayYear = []
                    if (!body.dateEnd) {
                        arrayYear.push(body.dateStart ? body.dateStart : '2021')
                        await mtblDMBoPhan(db).findAll().then(async department => {
                            for (let d = 0; d < department.length; d++) {
                                let array = []
                                let arrayPercent = []
                                let total = await numberStaffInYear(db, body.dateStart ? body.dateStart : '2021', null)
                                let obj = await numberStaffInYear(db, body.dateStart ? body.dateStart : '2021', department[d].ID)
                                array.push(obj)
                                arrayPercent.push((obj / (total != 0 ? total : 1)) * 100);
                                let objResult = {
                                    data: array,
                                    dataPercent: arrayPercent,
                                    label: department[d].DepartmentName ? department[d].DepartmentName : '',
                                    stack: 'a',
                                }
                                console.log(objResult);
                                arrayResult.push(objResult)
                            }

                        })
                    } else {
                        for (let y = Number(body.dateStart); y <= Number(body.dateEnd); y++) {
                            arrayYear.push(y)
                        }
                        await mtblDMBoPhan(db).findAll().then(async department => {
                            for (let d = 0; d < department.length; d++) {
                                let array = []
                                let arrayPercent = []
                                for (let y = Number(body.dateStart); y <= Number(body.dateEnd); y++) {
                                    let obj = await numberStaffInYear(db, y, department[d].ID)
                                    let total = await numberStaffInYear(db, y, null)
                                    arrayPercent.push((obj / (total != 0 ? total : 1)) * 100);
                                    array.push(obj)
                                }
                                let objResult = {
                                    data: array,
                                    dataPercent: arrayPercent,
                                    label: department[d].DepartmentName ? department[d].DepartmentName : '',
                                    stack: 'a',
                                }
                                arrayResult.push(objResult)
                            }
                        })
                    }
                    var result = {
                        arrayYear: arrayYear,
                        arrayResult: arrayResult,
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
    // report_types_of_contracts_column_chart
    reportTypesOfContractsColumnChart: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let arrayResult = []
                    let arrayYear = []
                    await mtblLoaiHopDong(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async contractType => {
                        if (!body.dateEnd && body.dateStart) {
                            arrayYear.push(body.dateStart)
                            for (let c = 0; c < contractType.length; c++) {
                                let array = []
                                let arrayPercent = []
                                let countInForce;
                                var date = body.dateStart + '-12-30 07:00:00.000';
                                countInForce = await mtblHopDongNhanSu(db).count({
                                    where: {
                                        IDLoaiHopDong: contractType[c].ID,
                                        Status: 'Có hiệu lực',
                                        ContractDateStart: { [Op.lte]: date },

                                    }
                                })
                                let total = await mtblHopDongNhanSu(db).count({
                                    where: {
                                        // IDLoaiHopDong: contractType[c].ID,
                                        Status: 'Có hiệu lực',
                                        ContractDateStart: { [Op.lte]: date },

                                    }
                                })
                                countExpiredContract = await mtblHopDongNhanSu(db).count({
                                    where: {
                                        IDLoaiHopDong: contractType[c].ID,
                                        Status: 'Hết hiệu lực',
                                        ContractDateStart: { [Op.gte]: date },

                                    }
                                })
                                array.push(countInForce ? countInForce : 0)
                                arrayPercent.push((countInForce / (total != 0 ? total : 1)).toFixed(4) * 100)
                                let objResult = {
                                    // total: total,
                                    data: array,
                                    dataPercent: arrayPercent,
                                    label: contractType[c].TenLoaiHD ? contractType[c].TenLoaiHD : '',
                                    stack: 'a',
                                }
                                arrayResult.push(objResult)
                            }
                        } else if (body.dateEnd && body.dateStart) {
                            for (let year = Number(body.dateStart); year <= Number(body.dateEnd); year++) {
                                arrayYear.push(year)
                            }
                            for (let c = 0; c < contractType.length; c++) {
                                let array = []
                                let arrayPercent = []
                                for (let y = Number(body.dateStart); y <= Number(body.dateEnd); y++) {
                                    let countInForce;
                                    var date = y + '-12-30 07:00:00.000';
                                    countInForce = await mtblHopDongNhanSu(db).count({
                                        where: {
                                            IDLoaiHopDong: contractType[c].ID,
                                            Status: 'Có hiệu lực',
                                            ContractDateStart: { [Op.lte]: date },

                                        }
                                    })
                                    let total = await mtblHopDongNhanSu(db).count({
                                        where: {
                                            // IDLoaiHopDong: contractType[c].ID,
                                            Status: 'Có hiệu lực',
                                            ContractDateStart: { [Op.lte]: date },

                                        }
                                    })
                                    countExpiredContract = await mtblHopDongNhanSu(db).count({
                                        where: {
                                            IDLoaiHopDong: contractType[c].ID,
                                            Status: 'Hết hiệu lực',
                                            ContractDateStart: { [Op.gte]: date },

                                        }
                                    })
                                    array.push(countInForce ? countInForce : 0)
                                    arrayPercent.push((countInForce / (total != 0 ? total : 1)).toFixed(4) * 100)
                                }
                                let objResult = {
                                    data: array,
                                    dataPercent: arrayPercent,
                                    label: contractType[c].TenLoaiHD ? contractType[c].TenLoaiHD : '',
                                    stack: 'a',
                                }
                                arrayResult.push(objResult)
                            }
                        }

                    })
                    var result = {
                        arrayYear: arrayYear,
                        arrayResult: arrayResult,
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
    // report_time_attendance_summary
    reportTimeAttendanceSummary: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let arrayResult = []
                    arrayResult = await ctlBangLuong.getDetailSyntheticTimkeeping(db, null, body.dateStart, body.dateEnd)
                    var result = {
                        arrayResult: arrayResult,
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