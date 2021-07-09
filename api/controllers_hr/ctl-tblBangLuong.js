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
var mtblNghiLe = require('../tables/hrmanage/tblNghiLe')
var mModules = require('../constants/modules');
const axios = require('axios');
var mtblConfigWorkday = require('../tables/hrmanage/tblConfigWorkday')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblMinWageConfig = require('../tables/hrmanage/tblMinWageConfig')
var mtblHopDongNhanSu = require('../tables/hrmanage/tblHopDongNhanSu')
var mtblLoaiHopDong = require('../tables/hrmanage/tblLoaiHopDong')
const Sequelize = require('sequelize');
var mtblQuyetDinhTangLuong = require('../tables/hrmanage/tblQuyetDinhTangLuong')
var mtblIncreaseSalariesAndStaff = require('../tables/hrmanage/tblIncreaseSalariesAndStaff')
var mtblLoaiChamCong = require('../tables/hrmanage/tblLoaiChamCong')
var mtblDateOfLeave = require('../tables/hrmanage/tblDateOfLeave')

var mtblTimeAttendanceSummary = require('../tables/hrmanage/tblTimeAttendanceSummary')

async function deleteRelationshiptblBangLuong(db, listID) {
    await mtblBangLuong(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
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
                arrayResult.push(array[i]['Verify Date'].slice(9, 22).trim())
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
            let seconrd = Number(array[i].slice(3, 5)) * 60 + Number(array[i].slice(0, 2)) * 60 * 60
            if (seconrd >= maxTime) {
                maxTime = seconrd;
            }
        } else {
            let seconrd = Number(array[i].slice(2, 4)) * 60 + Number(array[i].slice(0, 1)) * 60 * 60
            if (seconrd >= maxTime) {
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
            let seconrd = Number(array[i].slice(3, 5)) * 60 + Number(array[i].slice(0, 2)) * 60 * 60;
            if (seconrd < minTime) {
                minTime = seconrd;
            }
        } else {
            let seconrd = Number(array[i].slice(2, 4)) * 60 + Number(array[i].slice(0, 1)) * 60 * 60;
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
    } else
        return number
}
async function sortArrayDESC(array) {
    let arraySort = [];
    for (var i = 0; i < array.length; i++) {
        if (Number(array[i].slice(0, 2))) {
            let seconrd = Number(array[i].slice(6, 8)) + Number(array[i].slice(3, 5)) * 60 + Number(array[i].slice(0, 2)) * 60 * 60
            arraySort.push(seconrd)
        } else {
            let seconrd = Number(array[i].slice(5, 7)) + Number(array[i].slice(2, 4)) * 60 + Number(array[i].slice(0, 1)) * 60 * 60
            arraySort.push(seconrd)
        }
    }
    return arraySort.sort();
}
async function converFromSecondsToHourLate(number) {
    var result = 'M' + Math.floor(number / 60);
    if (Math.floor(number / 60) == 0)
        result = ''
    // let h = Math.floor(number / 60)
    // if (h > 0) {
    //     result = 'M' + h + 'h'
    //     var remainder = Math.floor((number - (h * 3600)) / 60)
    //     if (remainder > 0) {
    //         result += (Math.floor((remainder / 5)) * 5 + "'")
    //     }
    // } else {
    //     var remainder = Math.floor((number - (h * 3600)) / 60)
    //     if (remainder > 0) {
    //         result += ('M' + Math.floor((remainder / 5)) * 5 + "'")
    //     }
    // }

    return result;
}
var mtblConfigWorkday = require('../tables/hrmanage/tblConfigWorkday')

async function roundNumberMinutes(number) {
    var result = 0;
    let h = Math.floor(number / 3600)
    var remainder = Math.floor((number - (h * 3600)) / 60)
    var minnutes = Math.floor((remainder / 5)) * 5
    result = Number(h) * 60 + Number(minnutes)
    return (result / 240).toFixed(3);
}
async function converFromSecondsToHourAftersoon(number) {
    var result = "S" + Math.floor(number / 60);
    if (Math.floor(number / 60) == 0)
        result = ''
    // let h = Math.floor(number / 3600)
    // if (h > 0) {
    //     result = h + 'h'
    // }
    // var remainder = Math.floor((number - (h * 3600)) / 60)
    // if (remainder > 0) {
    //     result += (Math.floor((remainder / 5)) * 5 + "'")
    // }
    return result;
}
async function getDateTakeLeave(db, month, year, idNhanVien) {
    var array = [];
    var yearMonth = year + '-' + await convertNumber(month);
    await mtblNghiPhep(db).findAll({
        where: {
            [Op.or]: {
                DateStart: {
                    [Op.substring]: yearMonth
                },
                DateEnd: {
                    [Op.substring]: yearMonth
                },
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
async function getListleaveDate(db, month, year, staffID, dateFinal) {
    let objResult = {}
    var array = [];
    var arrayObj = [];
    let listID = []
    let tblNghiPhep = mtblNghiPhep(db);
    let ListSign = [];
    await tblNghiPhep.findAll({
        where: {
            IDNhanVien: staffID,
            Status: 'Hoàn thành',
        },
    }).then(leave => {
        leave.forEach(item => {
            listID.push(item.ID)
        })
    })
    for (let i = 0; i < listID.length; i++) {
        let query = `SELECT [ID], [LeaveID], [DateEnd], [DateStart], [IDLoaiChamCong] FROM [tblDateOfLeave] AS [tblDateOfLeave] 
        WHERE (DATEPART(yy, [tblDateOfLeave].[DateEnd]) = ` + year + ` AND DATEPART(mm, [tblDateOfLeave].[DateEnd]) = ` + month + `) AND ([tblDateOfLeave].[LeaveID] = N'` + listID[i] + `');`
        let date = await db.query(query)
        date = date[0]
        for (let i = 0; i < date.length; i++) {
            if (date[i].IDLoaiChamCong) {
                let signLeave = ''
                let dateStart = moment(date[i].DateStart).subtract(7, 'hours').date()
                let dateEnd = moment(date[i].DateEnd).subtract(7, 'hours').date()
                let dateEndMonth = moment(date[i].DateEnd).subtract(7, 'hours').month()
                // lấy tháng bị trừ 1
                let signObj = await mtblLoaiChamCong(db).findOne({ where: { ID: date[i].IDLoaiChamCong } })
                signLeave = signObj ? signObj.Code : ''
                dateEndMonth += 1
                if (dateEndMonth != month) {
                    dateEnd = dateFinal
                } else {
                    if (Number(moment(date[i].DateEnd).subtract(7, 'hours').format('HH') <= 8)) {
                        dateEnd -= 1
                    }
                }
                for (let d = dateStart; d <= dateEnd; d++) {
                    array.push(d)
                    arrayObj.push({
                        date: d,
                        id: date[i].ID,
                        sign: signLeave,
                    })
                }
            }

        }

    }
    objResult = {
        array: array,
        arrayObj: arrayObj,
    }
    return objResult
}
var mtblNghiPhep = require('../tables/hrmanage/tblNghiPhep')
var mtblDecidedInsuranceSalary = require('../tables/hrmanage/tblDecidedInsuranceSalary')
async function calculationPersonalUncomeTaxWay2(salary) {
    let result = 0;
    if (salary <= 5000000) {
        result = 0.05 * salary
    } else if (salary > 5000000 && salary <= 10000000) {
        result = 0.1 * salary - 250000
    } else if (salary > 10000000 && salary <= 18000000) {
        result = 0.15 * salary - 750000
    } else if (salary > 18000000 && salary <= 32000000) {
        result = 0.2 * salary - 1650000
    } else if (salary > 32000000 && salary <= 52000000) {
        result = 0.25 * salary - 3250000
    } else if (salary > 52000000 && salary <= 80000000) {
        result = 0.3 * salary - 5850000
    } else {
        result = 0.35 * salary - 9850000
    }
    return result
}
async function checkTypeContract(db, staffID, personalTax) {
    let result = 0;
    let tblHopDongNhanSu = mtblHopDongNhanSu(db);
    tblHopDongNhanSu.belongsTo(mtblLoaiHopDong(db), { foreignKey: 'IDLoaiHopDong', sourceKey: 'IDLoaiHopDong', as: 'typeContract' })
    let contract = await tblHopDongNhanSu.findOne({
        where: { IDNhanVien: staffID },
        order: [
            ['ID', 'DESC']
        ],
        include: [{
            model: mtblLoaiHopDong(db),
            required: false,
            as: 'typeContract'
        },],
    })
    if (contract)
        result = await calculationPersonalUncomeTaxWay2(personalTax)
    return result
}

async function getIncreaseSalaryOfStaff(db, staffID, date) {
    let salariesDecidedIncrease = 0
    let array = []
    await mtblQuyetDinhTangLuong(db).findAll({
        where: {
            DecisionDate: { [Op.substring]: date }
        }
    }).then(data => {
        data.forEach(element => {
            array.push(element.ID)
        })
    })
    let tblIncreaseSalariesAndStaff = mtblIncreaseSalariesAndStaff(db);
    tblIncreaseSalariesAndStaff.belongsTo(mtblQuyetDinhTangLuong(db), { foreignKey: 'IncreaseSalariesID', sourceKey: 'IncreaseSalariesID', as: 'IncreaseSalaries' })

    await tblIncreaseSalariesAndStaff.findOne({
        where: {
            StaffID: staffID,
            IncreaseSalariesID: { [Op.in]: array },
        },
        include: [{
            model: mtblQuyetDinhTangLuong(db),
            required: false,
            as: 'IncreaseSalaries'
        },],
    }).then(Increase => {
        if (Increase)
            salariesDecidedIncrease = Increase.IncreaseSalaries ? Increase.IncreaseSalaries.Increase ? Increase.IncreaseSalaries.Increase : 0 : 0
    })
    return salariesDecidedIncrease
}

async function realProductivityWageCalculation(db, staffID, date, productivityWages) {
    var month = Number(date.slice(5, 7)); // January
    var year = Number(date.slice(0, 4));
    var dateF = new Date(year, month, 0);
    var dateFinal = Number(dateF.toISOString().slice(8, 10))
    dateFinal += 1
    if (month < 10)
        month = '0' + month
    let result = 0;
    let leaveFree = 0
    let dayOff = 0
    let now = moment().add(7, 'hours').format('MM');
    let dayNow = moment().subtract(7, 'hours').format('DD');
    if (Number(now) == Number(month)) {
        dateFinal = Number(dayNow)
    }
    let work = 0;
    await mtblChamCong(db).findAll({
        where: {
            IDNhanVien: staffID,
            Date: {
                [Op.substring]: year + '-' + month
            }
        }
    }).then(async leave => {
        for (let i = 0; i < leave.length; i++) {
            if (leave[i].Status == 'KL' && leave[i].Reason == 'Nghỉ không phép') {
                leaveFree += 1
            } else if (leave[i].Status == '0.5') {
                leaveFree += 1
            }
            else if (leave[i].Status == '+') {
                work += 1
            }
        }
    })
    var array7thDB = await take7thDataToWork(db, year, Number(month), dateFinal);
    array7thDB = array7thDB.length
    let numberHoliday = await calculateNumberLeave(db, staffID, date, 'productivityWage')
    let sunSta = 0
    for (let i = 0; i < dateFinal; i++) {
        var datetConvert = mModules.toDatetimeDay(moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(i)).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
        if (datetConvert.slice(0, 8) == 'Chủ nhật' || datetConvert.slice(0, 5) == 'Thứ 7') {
            sunSta += 1
        }
    }
    let arrayDate = []
    await mtblConfigWorkday(db).findAll({
        where: { Date: { [Op.substring]: year + '-' + month } },
        order: [
            ['Date', 'DESC']
        ],
    }).then(data => {
        data.forEach(element => {
            arrayDate.push(element.Date)
        });
    })
    let workingDay = arrayDate.length
    console.log(sunSta, array7thDB);
    console.log(Number(workingDay), (dateFinal - numberHoliday - leaveFree / 2 - (sunSta - array7thDB)), numberHoliday, leaveFree / 2, work, dateFinal);
    result = productivityWages / Number(workingDay) * (dateFinal - numberHoliday - leaveFree / 2 - (sunSta - array7thDB))
    if (workingDay == 0)
        result = 0
    if (result < 0)
        result = 0
    // if (work <= 0 && (dateFinal - numberHoliday - leaveFree / 2 - (sunSta - array7thDB)) < 15)
    //     result = 0
    return result
}
async function getListHoliday(db, year, month, dateFinal) {
    let arrayResult = []
    await mtblNghiLe(db).findAll({
        where: {
            [Op.or]: {
                DateStartHoliday: {
                    [Op.substring]: year + '-' + await convertNumber(month)
                },
                DateEndHoliday: {
                    [Op.substring]: year + '-' + await convertNumber(month)
                },
            },
        }
    }).then(data => {
        data.forEach(element => {
            let dateStart = moment(element.DateStartHoliday).add(7, 'hours').date()
            let dateEnd = moment(element.DateEndHoliday).add(7, 'hours').date()
            let dateEndMonth = moment(element.DateEndHoliday).add(7, 'hours').month()
            dateEndMonth += 1
            if (dateEndMonth != month) {
                dateEnd = dateFinal
            }
            for (var i = dateStart; i <= dateEnd; i++) {
                arrayResult.push(i)
            }
        })
    })
    return arrayResult
}
async function monthDiff(d1, d2) {
    var months = 0;
    months = (Number(moment(d1).format('MM')) + (Number(moment(d1).format('YY')) * 12)) - (Number(moment(d2).format('MM')) + (12 * Number(moment(d2).format('YY'))))
    return months;
}
async function handleCalculateAdvancePayment(db, idStaff) {
    let staffData = await mtblHopDongNhanSu(db).findOne({
        where: { IDNhanVien: idStaff },
        order: [
            ['ID', 'ASC']
        ],
    })
    var diff;
    if (staffData) {
        let now = new Date()
        let dateSign = new Date(staffData.Date)
        diff = await monthDiff(now, dateSign)
    }
    return diff ? diff : 0
}
// Lấy danh sách thứ 7 đi làm
async function take7thDataToWork(db, year, month, dateRequest = 10) {
    //  lấy danh sách thứ 7 đi làm ------------------------------------
    let array7thDB = []
    var date = new Date(year, month, 0);
    var dateFinal = Number(date.toISOString().slice(8, 10))
    dateFinal += 1
    if (date != 10)
        dateFinal = dateRequest
    let dateWhere = year + '-' + await convertNumber(month) + '-' + await convertNumber(dateFinal)
    let dateMonthFirst = year + '-' + await convertNumber(month) + '-' + '01'
    dateWhere = moment(dateWhere).add(7, 'hours')
    dateMonthFirst = moment(dateMonthFirst).add(7, 'hours')
    await mtblConfigWorkday(db).findAll({
        where: {
            Date: { [Op.between]: [dateMonthFirst, dateWhere] },
        },
        order: [
            ['Date', 'DESC']
        ],
    }).then(async data => {
        if (data.length > 0)
            for (var saturday = 0; saturday < data.length; saturday++) {
                var datetConvert = mModules.toDatetimeDay(moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(Number(data[saturday].Date.slice(8, 10)))).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
                if (datetConvert.slice(0, 5) == 'Thứ 7')
                    array7thDB.push(Number(data[saturday].Date.slice(8, 10)))
            }
    })
    return array7thDB
    // ----------------------------------------------------------------------
}

// Tạo dữ liệu chấm công
async function createAttendanceData(db, staffID, date, Time, status, reason, type, SummaryEndDate) {
    await mtblChamCong(db).create({
        IDNhanVien: staffID,
        Date: date,
        Time: Time,
        Status: status,
        Reason: reason,
        Type: type,
        SummaryEndDate: SummaryEndDate,
    })

}

// check trạng thái của ngày
async function checkTheStatusOfTheDay(params) {
    let objResult = {}
    if (arrayTimeOfDate.length == 1) {
        if (minTime > twelveH) {
            // check chiều
            if (thirteenH < maxTime) {
                statusAfternoon = await converFromSecondsToHourLate(maxTime - thirteenH)
                summaryEndDateC = await roundNumberMinutes(maxTime - thirteenH)
            } else {
                statusAfternoon = ''
            }
            statusMorning = '0.5'
            summaryEndDateS = 0.5
        } else {
            // check sáng
            if (minTime > eightH) {
                statusMorning = await converFromSecondsToHourLate(minTime - eightH)
                summaryEndDateS = await roundNumberMinutes(minTime - eightH)
            } else {
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

            } else {
                if (twelveH > maxTime) {
                    statusMorning = await converFromSecondsToHourAftersoon(twelveH - maxTime)
                    summaryEndDateS = await roundNumberMinutes(twelveH - maxTime)
                } else {
                    statusMorning = ''
                }
            }
            statusAfternoon = '0.5'
            summaryEndDateC = 0.5
        } else {
            if (minTime >= thirteenH) {
                statusMorning = '0.5'
                summaryEndDateS = 0.5
                // check chiều
                if (thirteenH < minTime) {
                    statusAfternoon = await converFromSecondsToHourLate(minTime - thirteenH)
                    summaryEndDateC = await roundNumberMinutes(minTime - thirteenH)
                } else {
                    if (seventeenH > maxTime) {
                        statusAfternoon = await converFromSecondsToHourAftersoon(seventeenH - maxTime)
                        summaryEndDateC = await roundNumberMinutes(seventeenH - maxTime)
                    } else {
                        statusAfternoon = ''
                    }
                }
            } else {
                // check sáng
                if (minTime > eightH) {
                    statusMorning = await converFromSecondsToHourLate(minTime - eightH)
                    summaryEndDateS = await roundNumberMinutes(minTime - eightH)
                } else {
                    statusMorning = ''
                }
                // check chiều
                if (seventeenH > maxTime) {
                    statusAfternoon = await converFromSecondsToHourAftersoon(seventeenH - maxTime)
                    summaryEndDateC = await roundNumberMinutes(seventeenH - maxTime)

                } else {
                    statusAfternoon = ''
                }
            }
        }
    }
    objResult = {

    }
    return objResult
}
var enumerateDaysBetweenDates = function (startDate, endDate) {
    var dates = [];
    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');
    while (currDate.add(1, 'days').diff(lastDate) < 0) {
        dates.push(moment(currDate.clone().toDate()).format('YYYY-MM-DD'));
    }

    return dates;
};

// ghi dữ liệu từ máy chấm công vào database
async function writeDataFromTimekeeperToDatabase(db, userID, arrayData, month, year, date, staffID) {
    var summaryEndDateS = 0;
    var summaryEndDateC = 0;
    var statusMorning = '';
    var statusAfternoon = '';
    let seventeenH = 3600 * 17 + 30 * 60
    let eightH = 3600 * 8
    let twelveH = 3600 * 12 + 30 * 60
    let thirteenH = 3600 * 13
    let arrayTimeOfDate = await filterByDate(userID, date, arrayData, month, year)
    let maxTime = await maxTimeArray(arrayTimeOfDate);
    let minTime = await minTimeArray(arrayTimeOfDate);
    if (arrayTimeOfDate.length == 1) {
        if (minTime >= twelveH) {
            // check chiều
            if (thirteenH <= maxTime) {
                statusAfternoon = await converFromSecondsToHourLate(maxTime - thirteenH)
                summaryEndDateC = await roundNumberMinutes(maxTime - thirteenH)
            } else {
                statusAfternoon = null
            }
            statusMorning = '0.5'
            summaryEndDateS = 0.5
        } else {
            // check sáng
            if (minTime >= eightH) {
                statusMorning = await converFromSecondsToHourLate(minTime - eightH)
                summaryEndDateS = await roundNumberMinutes(minTime - eightH)
            } else {
                statusMorning = null
            }
            statusAfternoon = '0.5'
            summaryEndDateC = 0.5
        }
    }
    if (arrayTimeOfDate.length > 1) {
        if (maxTime <= twelveH) {
            // check sáng
            if (minTime >= eightH) {
                statusMorning = await converFromSecondsToHourLate(minTime - eightH)
                summaryEndDateS = await roundNumberMinutes(minTime - eightH)

            } else {
                if (twelveH >= maxTime) {
                    statusMorning = await converFromSecondsToHourLate(twelveH - maxTime)
                    summaryEndDateS = await roundNumberMinutes(twelveH - maxTime)
                } else {
                    statusMorning = null
                }
            }
            statusAfternoon = '0.5'
            summaryEndDateC = 0.5
        } else {
            if (minTime >= thirteenH) {
                statusMorning = '0.5'
                summaryEndDateS = 0.5
                // check chiều
                if (thirteenH <= minTime) {
                    statusAfternoon = await converFromSecondsToHourLate(minTime - thirteenH)
                    summaryEndDateC = await roundNumberMinutes(minTime - thirteenH)
                } else {
                    if (seventeenH >= maxTime) {
                        statusAfternoon = await converFromSecondsToHourAftersoon(seventeenH - maxTime)
                        summaryEndDateC = await roundNumberMinutes(seventeenH - maxTime)
                    } else {
                        statusAfternoon = null
                    }
                }
            } else {
                // check sáng
                if (minTime >= eightH) {
                    statusMorning = await converFromSecondsToHourLate(minTime - eightH)
                    summaryEndDateS = await roundNumberMinutes(minTime - eightH)
                } else {
                    statusMorning = null
                }
                // check chiều
                if (seventeenH >= maxTime) {
                    statusAfternoon = await converFromSecondsToHourAftersoon(seventeenH - maxTime)
                    summaryEndDateC = await roundNumberMinutes(seventeenH - maxTime)

                } else {
                    statusAfternoon = null
                }
            }
        }
    }
    let datedb = moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(date)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS')
    let statusMorningDB = statusMorning ? statusMorning : null
    let statusAfternoonDB = statusAfternoon ? statusAfternoon : null
    if (arrayTimeOfDate.length >= 1) {
        if (statusMorningDB == null && statusAfternoonDB == null) {
            await createAttendanceData(db, staffID, datedb, null, '+', '+', true, summaryEndDateS)
            await createAttendanceData(db, staffID, datedb, null, '+', '+', false, summaryEndDateC)
        } else {
            await createAttendanceData(db, staffID, datedb, null, statusMorningDB, null, true, summaryEndDateS)
            await createAttendanceData(db, staffID, datedb, null, statusAfternoonDB, null, false, summaryEndDateC)
        }

    } else {
        await createAttendanceData(db, staffID, datedb, null, 'KL', 'Nghỉ không phép', true, summaryEndDateS)
        await createAttendanceData(db, staffID, datedb, null, 'KL', 'Nghỉ không phép', false, summaryEndDateC)
    }
}
async function handleCalculateDayOff(dateStart, dateEnd) {
    let result = 0;
    let subtractHalfDay = 0;
    let days = await enumerateDaysBetweenDates(dateStart, dateEnd)
    let array7th = [];
    for (var i = 0; i < days.length; i++) {
        var datetConvert = mModules.toDatetimeDay(moment(days[i]).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
        if (datetConvert.slice(0, 8) == 'Chủ nhật') {
            array7th.push(days[i])
        }
        if (datetConvert.slice(0, 5) == 'Thứ 7') {
            array7th.push(days[i])
        }
    }
    let checkDateStart = Number(dateStart.slice(11, 13))
    let checkDateEnd = Number(dateEnd.slice(11, 13))
    if (checkDateStart < 12) {
        if (checkDateEnd <= 12)
            subtractHalfDay = 0.5
    } else {
        subtractHalfDay = 0.5
    }
    if (days.length < 1)
        if (Number(dateStart.slice(8, 10)) != Number(dateEnd.slice(8, 10)))
            if (checkDateEnd < 17)
                result = 1.5
            else
                result = 2
        else
            if (checkDateEnd < 17)
                result = 0.5
            else
                result = 1
    else
        result = days.length + 2 - array7th.length - subtractHalfDay
    return result
}
// tính thời gian làm thêm giờ
async function calculateOvertime(db, staffID, date) {
    // Tính ngày thời gian thêm giờ
    let result = 0
    var month = Number(date.slice(5, 7));
    var year = Number(date.slice(0, 4));
    await mtblNghiPhep(db).findAll({
        where: {
            Type: 'SignUp',
            IDNhanVien: staffID,
            Status: 'Hoàn thành',
        }
    }).then(async leave => {
        let thirteenH = 60 * 13 + 30
        let twelveH = 60 * 12

        for (let i = 0; i < leave.length; i++) {
            let query = `SELECT [ID], [LeaveID], [DateEnd], [DateStart], [TimeStartReal], [TimeEndReal] FROM [tblDateOfLeave] AS [tblDateOfLeave] 
            WHERE (DATEPART(yy, [tblDateOfLeave].[TimeEndReal]) = ` + year + ` AND DATEPART(mm, [tblDateOfLeave].[TimeEndReal]) = ` + month + `) AND ([tblDateOfLeave].[LeaveID] = N'` + leave[i].ID + `');`
            let date = await db.query(query)
            date = date[0]
            for (let i = 0; i < date.length; i++) {
                let minuteDateStart = 0;
                let minuteDateEnd = 0;

                if (date[i].TimeEndReal && date[i].TimeStartReal) {
                    minuteDateStartReal = Number(moment(date[i].TimeStartReal).subtract(7, 'hours').format('HH')) * 60 + Number(moment(date[i].TimeStartReal).subtract(7, 'hours').format('mm'))
                    minuteDateStart = Number(moment(date[i].DateStart).subtract(7, 'hours').format('HH')) * 60 + Number(moment(date[i].DateStart).subtract(7, 'hours').format('mm'))
                    minuteDateEndReal = Number(moment(date[i].TimeEndReal).subtract(7, 'hours').format('HH')) * 60 + Number(moment(date[i].TimeEndReal).subtract(7, 'hours').format('mm'))
                    minuteDateEnd = Number(moment(date[i].DateEnd).subtract(7, 'hours').format('HH')) * 60 + Number(moment(date[i].DateEnd).subtract(7, 'hours').format('mm'))
                }
                if ((minuteDateEnd - minuteDateStart) < (minuteDateEndReal - minuteDateStartReal))
                    if (minuteDateEnd >= thirteenH && minuteDateStart <= twelveH) {
                        result += (minuteDateEnd - minuteDateStart) / 60 - 1.5
                    } else {
                        if (minuteDateStart >= twelveH && minuteDateStart <= thirteenH)
                            minuteDateStart = thirteenH
                        if (minuteDateEnd <= thirteenH && minuteDateEnd >= twelveH)
                            minuteDateEnd = twelveH
                        if ((minuteDateEnd - minuteDateStart) <= 0)
                            result += 0
                        else
                            result += (minuteDateEnd - minuteDateStart) / 60
                    }
                else
                    if (minuteDateEndReal >= thirteenH && minuteDateStartReal <= twelveH) {
                        result += (minuteDateEndReal - minuteDateStartReal) / 60 - 1.5
                    } else {
                        if (minuteDateStartReal >= twelveH && minuteDateStartReal <= thirteenH)
                            minuteDateStartReal = thirteenH
                        if (minuteDateEndReal <= thirteenH && minuteDateEndReal >= twelveH)
                            minuteDateEndReal = twelveH
                        if ((minuteDateEndReal - minuteDateStartReal) <= 0)
                            result += 0
                        else
                            result += (minuteDateEndReal - minuteDateStartReal) / 60
                    }
            }
        }
    })
    return Number(result)
}
// tính thời gian nghỉ phép
async function calculateNumberLeave(db, staffID, date, type = 'time') {
    // Tính ngày thời gian thêm giờ
    let result = 0
    var month = Number(date.slice(5, 7));
    var year = Number(date.slice(0, 4));
    await mtblNghiPhep(db).findAll({
        where: {
            Type: 'TakeLeave',
            IDNhanVien: staffID,
            Status: 'Hoàn thành',
        }
    }).then(async leave => {
        for (let i = 0; i < leave.length; i++) {
            let query = `SELECT [ID], [LeaveID], [DateEnd], [DateStart], [IDLoaiChamCong] FROM [tblDateOfLeave] AS [tblDateOfLeave] 
                WHERE (DATEPART(yy, [tblDateOfLeave].[DateEnd]) = ` + year + ` AND DATEPART(mm, [tblDateOfLeave].[DateEnd]) = ` + month + `) AND ([tblDateOfLeave].[LeaveID] = N'` + leave[i].ID + `');`
            let date = await db.query(query)
            date = date[0]
            for (let j = 0; j < date.length; j++) {
                if (type == 'time') {
                    if (leave[i].Deducted != 0)
                        result += await handleCalculateDayOff(moment(date[j].DateStart).subtract(7, 'hours').format('YYYY-MM-DD HH:mm'), moment(date[j].DateEnd).subtract(7, 'hours').format('YYYY-MM-DD HH:mm'))
                } else {
                    let type = await mtblLoaiChamCong(db).findOne({
                        where: { ID: date[j].IDLoaiChamCong }
                    })
                    // tích là hưởng lương false
                    if (type && type.SalaryIsAllowed == false) {
                        result += await handleCalculateDayOff(moment(date[j].DateStart).subtract(7, 'hours').format('YYYY-MM-DD HH:mm'), moment(date[j].DateEnd).subtract(7, 'hours').format('YYYY-MM-DD HH:mm'))
                    }
                }
            }
        }
    })
    return result
}

// Tính số ngày tồn từ tháng trước
async function calculateRemainingPreviousYear(db, staffID, date) {
    // Tính ngày thời gian thêm giờ
    let remainingPreviousYear = 0
    let result = 0
    let freeBreak = 0;
    let lateDay = 0;
    let overtime = 0
    var month = Number(date.slice(5, 7));
    var year = Number(date.slice(0, 4));
    await mtblNghiPhep(db).findAll({
        where: {
            Type: 'TakeLeave',
            IDNhanVien: staffID,
            Status: 'Hoàn thành',
        }
    }).then(async leave => {
        for (let i = 0; i < leave.length; i++) {
            for (m = 1; m < month; m++) {
                let query = `SELECT [ID], [LeaveID], [DateEnd], [DateStart] FROM [tblDateOfLeave] AS [tblDateOfLeave] 
                WHERE (DATEPART(yy, [tblDateOfLeave].[DateEnd]) = ` + year + ` AND DATEPART(mm, [tblDateOfLeave].[DateEnd]) = ` + m + `) AND ([tblDateOfLeave].[LeaveID] = N'` + leave[i].ID + `');`
                let date = await db.query(query)
                date = date[0]
                for (let j = 0; j < date.length; j++) {
                    if (leave[i].Deducted != 0)
                        result += await handleCalculateDayOff(moment(date[j].DateStart).subtract(7, 'hours').format('YYYY-MM-DD HH:mm'), moment(date[j].DateEnd).subtract(7, 'hours').format('YYYY-MM-DD HH:mm'))
                }
            }
        }
        let freeBreakPlus = 0
        let lateDayPlus = 0
        let overtimePlus = 0
        for (m = 1; m < month; m++) {
            let dateWhere = year + '-' + await convertNumber(m)
            overtimePlus = await calculateOvertime(db, staffID, dateWhere)

            await mtblChamCong(db).findAll({
                order: [
                    ['ID', 'DESC']
                ],
                where: {
                    IDNhanVien: staffID,
                    Date: {
                        [Op.substring]: '%' + dateWhere + '%'
                    }
                }
            }).then(data => {
                if (data)
                    data.forEach(item => {
                        if (item.Status == 'KL' && item.Status == 'KL') {
                            freeBreakPlus += 1
                        } else if (item.Status != '+') {
                            if (item.Status && item.Status != '0.5' && !item.Reason) {
                                lateDayPlus += (Number(item.Status.slice(1, 10)) / 60 / 8)
                            }
                        }
                    })
            })
        }
        freeBreak += freeBreakPlus
        lateDay += lateDayPlus
        overtime += overtimePlus
    })
    lateDay = lateDay.toFixed(2)
    let advancePayment = 0
    seniority = await handleCalculateAdvancePayment(db, staffID) // thâm niên
    // var quotient = Math.floor(y / x);  // lấy nguyên
    // var remainder = y % x; // lấy dư
    if (seniority > 12) {
        advancePayment = 12 + Math.floor(seniority / 60)
    } else {
        let staffData = await mtblHopDongNhanSu(db).findOne({
            where: { IDNhanVien: staffID },
            order: [
                ['ID', 'ASC']
            ],
        })
        if (staffData) {
            let dateSign = new Date(staffData.Date)
            advancePayment = 12 - Number(moment(dateSign).format('MM'))
            if (Number(moment(dateSign).format('DD')) == 1)
                advancePayment += 1
        }
    }
    remainingPreviousYear = advancePayment + overtime / 8 - lateDay - result
    return remainingPreviousYear
}

// tính tổng hợp chấm công theo từng tháng
async function aggregateTimekeepingForEachMonth(db, staff, date) {
    let objResult = {}
    let overtime = 0; // thời gian lm thêm giờ
    let numberHoliday = 0; // số ngày nghỉ trong tháng
    let freeBreak = 0;
    let lateDay = 0;
    overtime = await calculateOvertime(db, staff.ID, date)
    numberHoliday = await calculateNumberLeave(db, staff.ID, date)
    // tính số ngày đi muộn, nghỉ tự do
    await mtblChamCong(db).findAll({
        order: [
            ['ID', 'DESC']
        ],
        where: {
            IDNhanVien: staff.ID,
            Date: {
                [Op.substring]: '%' + date + '%'
            }
        }
    }).then(data => {
        if (data)
            data.forEach(item => {
                if (item.Status == 'KL' && item.Reason == 'Nghỉ không phép') {
                    freeBreak += 1
                } else if (item.Status != '+') {
                    if (item.Status && item.Status != '0.5' && item.Status != 'Sat' && item.Status != 'Sun') {
                        if (Number(item.Status.slice(1, 10)))
                            lateDay += (Number(item.Status.slice(1, 10)) / 60 / 8)
                    }
                }
            })
    })
    if (lateDay)
        lateDay = lateDay.toFixed(2)

    objResult = {
        staffID: staff.ID,
        staffName: staff.StaffName ? staff.StaffName : '',
        staffCode: staff.StaffCode ? staff.StaffCode : '',
        departmentName: staff.department ? staff.department.DepartmentName : '',
        overtime: Number((overtime / 8).toFixed(2)),
        numberHoliday: numberHoliday,
        freeBreak: Math.round(freeBreak / 2),
        lateDay: lateDay,
    }
    return objResult
}

async function createTimeAttendanceSummary() {
    database.connectDatabase().then(async db => {
        if (db) {
            await mtblTimeAttendanceSummary(db).destroy({
                where: {
                    ID: {
                        [Op.ne]: null
                    }
                }
            })
            let now = moment().format('MM');
            let yearNow = Number(moment().format('YYYY'));
            for (let month = 1; month <= Number(now); month++) {
                var year = yearNow
                let tblDMNhanvien = mtblDMNhanvien(db);
                tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'department' })
                await tblDMNhanvien.findAll({
                    include: [{
                        model: mtblDMBoPhan(db),
                        required: false,
                        as: 'department'
                    },],
                }).then(async data => {
                    for (var i = 0; i < data.length; i++) {
                        let objResult = await aggregateTimekeepingForEachMonth(db, data[i], year + '-' + await convertNumber(month))
                        let remainingPreviousYear = await calculateRemainingPreviousYear(db, data[i].ID, year + '-' + await convertNumber(month))
                        let remaining = Number(remainingPreviousYear) + Number(objResult.overtime) - Number(objResult.lateDay) - Number(objResult.numberHoliday)
                        objResult['remaining'] = remaining.toFixed(2)
                        objResult['remainingPreviousYear'] = remainingPreviousYear.toFixed(2)
                        console.log({
                            StaffID: objResult.staffID,
                            StaffName: objResult.staffName,
                            StaffCode: objResult.staffCode,
                            DepartmentName: objResult.departmentName,
                            Overtime: objResult.overtime,
                            NumberHoliday: objResult.numberHoliday,
                            FreeBreak: objResult.freeBreak,
                            LateDay: objResult.lateDay,
                            Remaining: objResult.remaining,
                            RemainingPreviousYear: objResult.remainingPreviousYear,
                            Month: year + '-' + await convertNumber(month)
                        });
                        await mtblTimeAttendanceSummary(db).create({
                            StaffID: objResult.staffID,
                            StaffName: objResult.staffName,
                            StaffCode: objResult.staffCode,
                            DepartmentName: objResult.departmentName,
                            Overtime: objResult.overtime,
                            NumberHoliday: objResult.numberHoliday,
                            FreeBreak: objResult.freeBreak,
                            LateDay: objResult.lateDay,
                            Remaining: objResult.remaining,
                            RemainingPreviousYear: objResult.remainingPreviousYear,
                            Month: year + '-' + await convertNumber(month)
                        })
                    }
                })
            }
        }
    })
}
async function createTimeAttendanceSummaryFollowMonth(monthRespone, year, staffID) {
    database.connectDatabase().then(async db => {
        if (db) {
            let now = moment().format('MM');
            for (let month = monthRespone; month <= Number(now); month++) {
                await mtblTimeAttendanceSummary(db).destroy({
                    where: {
                        Month: {
                            [Op.like]: '%' + year + '-' + await convertNumber(month) + '%'
                        },
                        StaffID: staffID
                    }
                })
                let tblDMNhanvien = mtblDMNhanvien(db);
                tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'department' })
                await tblDMNhanvien.findAll({
                    include: [{
                        model: mtblDMBoPhan(db),
                        required: false,
                        as: 'department'
                    },],
                    where: { ID: staffID }
                }).then(async data => {
                    for (var i = 0; i < data.length; i++) {
                        let objResult = await aggregateTimekeepingForEachMonth(db, data[i], year + '-' + await convertNumber(month))
                        let remainingPreviousYear = await mtblTimeAttendanceSummary(db).findOne({
                            where: {
                                Month: {
                                    [Op.like]: '%' + year + '-' + await convertNumber(monthRespone - 1) + '%'
                                },
                                StaffID: staffID

                            }
                        })
                        remainingPreviousYear = remainingPreviousYear ? remainingPreviousYear.Remaining : 0
                        let remaining = Number(remainingPreviousYear) + Number(objResult.overtime) - Number(objResult.lateDay) - Number(objResult.numberHoliday)
                        objResult['remaining'] = remaining.toFixed(2)
                        objResult['remainingPreviousYear'] = remainingPreviousYear.toFixed(2)
                        await mtblTimeAttendanceSummary(db).create({
                            StaffID: objResult.staffID,
                            StaffName: objResult.staffName,
                            StaffCode: objResult.staffCode,
                            DepartmentName: objResult.departmentName,
                            Overtime: objResult.overtime,
                            NumberHoliday: objResult.numberHoliday,
                            FreeBreak: objResult.freeBreak,
                            LateDay: objResult.lateDay,
                            Remaining: objResult.remaining,
                            RemainingPreviousYear: objResult.remainingPreviousYear,
                            Month: year + '-' + await convertNumber(month)
                        })
                    }
                })
            }
        }
    })
}
async function getDataTimeKeeping(dateRes, departmentID) {
    let arrayData = [
        // 01 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-1 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-1 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-1 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-1 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 02 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-2 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-2 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-2 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-2 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 03 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-3 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-3 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-3 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-3 16:00:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 04 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-4 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-4 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-4 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-4 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 05 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-5 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-5 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-5 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-5 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 06 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-6 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-6 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-6 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-6 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 07 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-7 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-7 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-7 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-7 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 08 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-8 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-1 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-8 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-8 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 10 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-10 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-10 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-10 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-10 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 11 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-11 8:30:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-1 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-11 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-11 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 12 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-12 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-12 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-12 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-12 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 13 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-13 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-13 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-13 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-13 17:00:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },

        // 14 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-14 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-14 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-14 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-14 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 15 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-15 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-15 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-15 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-15 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },

        // 16 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-16 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-16 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-16 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-16 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },

        // 17 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-17 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-17 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-17 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-17 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 18 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-18 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-18 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-18 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-18 17:00:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },

        // 19 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-19 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-19 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-19 8:30:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-19 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },

        // 20 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-20 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-20 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-20 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-20 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 21 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-21 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-21 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-21 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-21 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },

        // 24 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-24 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-14 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-24 10:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-24 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },

        // 25----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-25 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-25 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-25 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-25 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 26 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-26 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-14 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-26 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-26 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },

        // 27 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-27 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-27 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-27 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-27 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },

        // 28 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-28 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-28 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-28 8:00:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-28 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        // 31 ----------------------------------------------------------------------------------------------------------------------------------
        {
            'User ID': 1,
            'Verify Date': "2021-6-31 8:00:00",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 1,
            'Verify Date': "2021-6-31 17:30:30",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        }, {
            'User ID': 2,
            'Verify Date': "2021-6-31 8:30:16",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
        {
            'User ID': 2,
            'Verify Date': "2021-6-31 17:30:20",
            'Verify Type': 1,
            'Verify State': 1,
            'Work Code': 1
        },
    ]
    var result = {}
    await database.connectDatabase().then(async db => {
        // await axios.get(`http://192.168.23.13:1333/dulieuchamcong/`).then(data => {
        //     if (data.length > 0)
        //         arrayData = JSON.parse(data)
        // })
        if (db) {
            try {
                var whereobj = {};
                if (departmentID) {
                    whereobj = { IDBoPhan: departmentID }
                }
                var array = [];
                var month = Number(dateRes.slice(5, 7)); // January
                var year = Number(dateRes.slice(0, 4));
                var date = new Date(year, month, 0);
                var dateFinal = Number(date.toISOString().slice(8, 10))
                dateFinal += 1
                let now = moment().add(7, 'hours').format('MM');
                let dayNow = moment().subtract(7, 'hours').format('DD');
                if (Number(now) == Number(month)) {
                    dateFinal = Number(dayNow)
                }
                var arrayUserID = await getUserIDExits(arrayData);
                var yearMonth = dateRes;
                var array7thDB = await take7thDataToWork(db, year, month);
                var arrayHoliday = await getListHoliday(db, year, month, dateFinal)
                if (Number(month) == Number(now)) {
                    console.log('==================================================================================================');
                    await mtblDMNhanvien(db).findAll({
                        where: {
                            [Op.or]: [
                                { IDMayChamCong: { [Op.notIn]: arrayUserID } },
                                { IDMayChamCong: null },
                            ]
                        }
                    }).then(async staff => {
                        for (let s = 0; s < staff.length; s++) {
                            var timeKeeping = await mtblChamCong(db).findOne({
                                where: [{
                                    Date: {
                                        [Op.substring]: dateRes + '-' + dayNow
                                    }
                                },
                                {
                                    IDNhanVien: staff[s].ID
                                }]
                            })
                            var timeKeepingFinal = await mtblChamCong(db).findOne({
                                where: [{
                                    Date: {
                                        [Op.substring]: dateRes
                                    }
                                },
                                {
                                    IDNhanVien: staff[s].ID
                                }],
                                order: [
                                    Sequelize.literal('max(Date) DESC'),
                                ],
                                group: ['ID', 'EditDate', 'SummaryEndDate', 'Type', 'Reason', 'Status', 'Time', 'IDNhanVien', 'Date'],
                            })
                            if (!timeKeeping) {
                                var arrayLeaveDay = await getListleaveDate(db, month, year, staff[s].ID, dateFinal)
                                if (timeKeepingFinal) {
                                    let dateFinalSave = Number(moment(timeKeepingFinal.Date).add(7, 'hours').format('DD'))
                                    if (dateFinalSave < Number(dayNow)) {
                                        console.log((dateFinalSave + 1, Number(dayNow)));
                                        for (var j = (dateFinalSave + 1); j <= Number(dayNow); j++) {
                                            var datetConvert = mModules.toDatetimeDay(moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(j)).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
                                            let date = moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS')
                                            let staffID = staff[s] ? staff[s].ID : null
                                            if (datetConvert.slice(0, 8) == 'Chủ nhật') {
                                                await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', true, 0)
                                                await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', false, 0)
                                            } else if (datetConvert.slice(0, 5) == 'Thứ 7' && !checkDuplicate(array7thDB, j)) {
                                                await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', true, 0)
                                                await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', false, 0)
                                            } else if (checkDuplicate(arrayHoliday, j)) {
                                                await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', true, 0)
                                                await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', false, 0)
                                            } else {
                                                // check xem có trong ngày nghỉ phép không ?
                                                if (checkDuplicate(arrayLeaveDay.array, j)) {
                                                    for (let i = 0; i < arrayLeaveDay.arrayObj.length; i++) {
                                                        if (arrayLeaveDay.arrayObj[i].date == j) {
                                                            await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', false, 0)
                                                            await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', true, 0)
                                                        }
                                                    }
                                                } else {
                                                    await createAttendanceData(db, staffID, date, null, 'KL', 'Nghỉ không phép', false, 0)
                                                    await createAttendanceData(db, staffID, date, null, 'KL', 'Nghỉ không phép', true, 0)
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    for (var j = 1; j <= Number(dayNow); j++) {
                                        var datetConvert = mModules.toDatetimeDay(moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(j)).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
                                        let date = moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS')
                                        let staffID = staff[s] ? staff[s].ID : null
                                        if (datetConvert.slice(0, 8) == 'Chủ nhật') {
                                            await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', false, 0)
                                        } else if (datetConvert.slice(0, 5) == 'Thứ 7' && !checkDuplicate(array7thDB, j)) {
                                            await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', false, 0)
                                        } else if (checkDuplicate(arrayHoliday, j)) {
                                            await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', false, 0)
                                        } else {
                                            // check xem có trong ngày nghỉ phép không ?
                                            if (checkDuplicate(arrayLeaveDay.array, j)) {
                                                for (let i = 0; i < arrayLeaveDay.arrayObj.length; i++) {
                                                    if (arrayLeaveDay.arrayObj[i].date == j) {
                                                        await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', false, 0)
                                                        await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', true, 0)
                                                    }
                                                }
                                            } else {
                                                await createAttendanceData(db, staffID, date, null, 'KL', 'Nghỉ không phép', false, 0)
                                                await createAttendanceData(db, staffID, date, null, 'KL', 'Nghỉ không phép', true, 0)
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    })
                    if (arrayUserID.length > 0) {
                        for (var i = 0; i < arrayUserID.length; i++) {
                            var staff = await mtblDMNhanvien(db).findOne({ where: { IDMayChamCong: arrayUserID[i] } })
                            var timeKeepingFinal = await mtblChamCong(db).findOne({
                                where: [{
                                    Date: {
                                        [Op.substring]: dateRes
                                    }
                                },
                                {
                                    IDNhanVien: staff.ID
                                }],
                                order: [
                                    Sequelize.literal('max(Date) DESC'),
                                ],
                                group: ['ID', 'EditDate', 'SummaryEndDate', 'Type', 'Reason', 'Status', 'Time', 'IDNhanVien', 'Date'],
                            })
                            var arrayLeaveDay = await getListleaveDate(db, month, year, staff.ID, dateFinal)
                            var yearMonth = year + '-' + await convertNumber(month);
                            if (timeKeepingFinal) {
                                let dateFinalSave = Number(moment(timeKeepingFinal.Date).add(7, 'hours').format('DD'))

                                if (dateFinalSave < Number(dayNow)) {
                                    for (var j = (dateFinalSave + 1); j <= Number(dayNow); j++) {
                                        var datetConvert = mModules.toDatetimeDay(moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(j)).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
                                        let date = moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS')
                                        let staffID = staff ? staff.ID : null
                                        if (datetConvert.slice(0, 8) == 'Chủ nhật') {
                                            await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', false, 0)
                                        } else if (datetConvert.slice(0, 5) == 'Thứ 7' && !checkDuplicate(array7thDB, j)) {
                                            await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', false, 0)
                                        } else if (checkDuplicate(arrayHoliday, j)) {
                                            await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', false, 0)
                                        } else {
                                            // check xem có trong ngày nghỉ phép không ?
                                            if (checkDuplicate(arrayLeaveDay.array, j)) {
                                                for (let i = 0; i < arrayLeaveDay.arrayObj.length; i++) {
                                                    if (arrayLeaveDay.arrayObj[i].date == j) {
                                                        await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', false, 0)
                                                        await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', true, 0)
                                                    }
                                                }
                                            } else {
                                                await writeDataFromTimekeeperToDatabase(db, arrayUserID[i], arrayData, month, year, j, staff.ID)
                                            }
                                        }
                                    }
                                }
                            } else {
                                for (var j = 1; j <= Number(dayNow); j++) {
                                    var datetConvert = mModules.toDatetimeDay(moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(j)).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
                                    let date = moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS')
                                    let staffID = staff ? staff.ID : null
                                    if (datetConvert.slice(0, 8) == 'Chủ nhật') {
                                        await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', true, 0)
                                        await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', false, 0)
                                    } else if (datetConvert.slice(0, 5) == 'Thứ 7' && !checkDuplicate(array7thDB, j)) {
                                        await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', true, 0)
                                        await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', false, 0)
                                    } else if (checkDuplicate(arrayHoliday, j)) {
                                        await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', true, 0)
                                        await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', false, 0)
                                    } else {
                                        // check xem có trong ngày nghỉ phép không ?
                                        if (checkDuplicate(arrayLeaveDay.array, j)) {
                                            for (let i = 0; i < arrayLeaveDay.arrayObj.length; i++) {
                                                if (arrayLeaveDay.arrayObj[i].date == j) {
                                                    await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', false, 0)
                                                    await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', true, 0)
                                                }
                                            }
                                        } else {
                                            await writeDataFromTimekeeperToDatabase(db, arrayUserID[i], arrayData, month, year, j, staff.ID)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                // lấy danh sách thứ 7 đi làm
                var arrayDays = [];
                let checkFor = 0;
                let arrayStaff = []
                let dateFirstMonth = yearMonth + '-' + dateFinal
                dateFirstMonth = moment(dateFirstMonth).add(7, 'hours')
                await mtblHopDongNhanSu(db).findAll({
                    where: {
                        Date: { [Op.lte]: dateFirstMonth },
                        Status: 'Có hiệu lực',
                    }
                }).then(staff => {
                    staff.forEach(element => {
                        arrayStaff.push(element.IDNhanVien)
                    })
                })
                // taopj cho nhân viên có id chấm công sai hoặc không có
                await mtblDMNhanvien(db).findAll({
                    where: {
                        [Op.or]: [
                            { IDMayChamCong: { [Op.notIn]: arrayUserID } },
                            { IDMayChamCong: null },
                        ]
                    }
                }).then(async staff => {
                    for (let s = 0; s < staff.length; s++) {
                        if (checkDuplicate(arrayStaff, staff[s].ID)) {
                            var timeKeeping = await mtblChamCong(db).findAll({
                                where: [{
                                    Date: {
                                        [Op.substring]: dateRes
                                    }
                                },
                                {
                                    IDNhanVien: staff[s].ID
                                }]
                            })
                            if (timeKeeping.length <= 0) {
                                var arrayHoliday = await getListHoliday(db, year, month, dateFinal)
                                if (staff[s].ID) {
                                    var arrayLeaveDay = await getListleaveDate(db, month, year, staff[s].ID, dateFinal)
                                    for (var j = 1; j <= dateFinal; j++) {
                                        var datetConvert = mModules.toDatetimeDay(moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(j)).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
                                        let date = moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS')
                                        let staffID = staff[s] ? staff[s].ID : null
                                        if (datetConvert.slice(0, 8) == 'Chủ nhật') {
                                            await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', false, 0)
                                        } else if (datetConvert.slice(0, 5) == 'Thứ 7' && !checkDuplicate(array7thDB, j)) {
                                            await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', false, 0)
                                        } else if (checkDuplicate(arrayHoliday, j)) {
                                            await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', false, 0)
                                        } else {
                                            // check xem có trong ngày nghỉ phép không ?
                                            if (checkDuplicate(arrayLeaveDay.array, j)) {
                                                for (let i = 0; i < arrayLeaveDay.arrayObj.length; i++) {
                                                    if (arrayLeaveDay.arrayObj[i].date == j) {
                                                        await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', false, 0)
                                                        await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', true, 0)
                                                    }
                                                }
                                            } else {
                                                await createAttendanceData(db, staffID, date, null, 'KL', 'Nghỉ không phép', false, 0)
                                                await createAttendanceData(db, staffID, date, null, 'KL', 'Nghỉ không phép', true, 0)
                                            }
                                        }
                                    }
                                }
                            } else {
                                var arrayHoliday = await getListHoliday(db, year, month, dateFinal)
                                if (staff[s].ID) {
                                    var arrayLeaveDay = await getListleaveDate(db, month, year, staff[s].ID, dateFinal)
                                    for (var j = 1; j <= dateFinal; j++) {
                                        var datetConvert = mModules.toDatetimeDay(moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(j)).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
                                        let date = moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS')
                                        let staffID = staff[s] ? staff[s].ID : null
                                        if (datetConvert.slice(0, 8) == 'Chủ nhật') {
                                            await mtblChamCong(db).destroy({
                                                where: {
                                                    Date: date,
                                                    IDNhanVien: staffID
                                                }
                                            })
                                            await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', false, 0)
                                        } else if (datetConvert.slice(0, 5) == 'Thứ 7' && !checkDuplicate(array7thDB, j)) {
                                            await mtblChamCong(db).destroy({
                                                where: {
                                                    Date: date,
                                                    IDNhanVien: staffID
                                                }
                                            })
                                            await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', false, 0)
                                        } else if (datetConvert.slice(0, 5) == 'Thứ 7' && checkDuplicate(array7thDB, j)) {
                                            let timeKeeping = await mtblChamCong(db).findOne({
                                                where: {
                                                    Date: date,
                                                    IDNhanVien: staffID
                                                }
                                            })
                                            if (timeKeeping && timeKeeping.Status == 'Sat') {
                                                await mtblChamCong(db).destroy({
                                                    where: {
                                                        ID: timeKeeping.ID
                                                    }
                                                })
                                                await createAttendanceData(db, staffID, date, null, 'KL', 'Nghỉ không phép', false, 0)
                                                await createAttendanceData(db, staffID, date, null, 'KL', 'Nghỉ không phép', true, 0)
                                            }
                                        } else if (checkDuplicate(arrayHoliday, j)) {

                                            await mtblChamCong(db).destroy({
                                                where: {
                                                    Date: date,
                                                    IDNhanVien: staffID
                                                }
                                            })
                                            await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', false, 0)
                                        } else {
                                            // check xem có trong ngày nghỉ phép không ?
                                            if (checkDuplicate(arrayLeaveDay.array, j)) {
                                                for (let i = 0; i < arrayLeaveDay.arrayObj.length; i++) {
                                                    if (arrayLeaveDay.arrayObj[i].date == j) {
                                                        await mtblChamCong(db).destroy({
                                                            where: {
                                                                Date: date,
                                                                IDNhanVien: staffID
                                                            }
                                                        })
                                                        await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', false, 0)
                                                        await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', true, 0)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                })
                if (arrayUserID.length > 0) {
                    for (var i = 0; i < arrayUserID.length; i++) {
                        var staff = await mtblDMNhanvien(db).findOne({ where: { IDMayChamCong: arrayUserID[i] } })
                        if (checkDuplicate(arrayStaff, staff.ID)) {
                            var timeKeeping;
                            if (staff)
                                timeKeeping = await mtblChamCong(db).findAll({
                                    where: [{
                                        Date: {
                                            [Op.substring]: '%' + yearMonth + '%'
                                        }
                                    },
                                    {
                                        IDNhanVien: staff.ID
                                    }]
                                })
                            if (timeKeeping.length <= 0) {
                                var arrayHoliday = await getListHoliday(db, year, month, dateFinal)
                                if (staff) {
                                    var arrayLeaveDay = await getListleaveDate(db, month, year, staff.ID, dateFinal)
                                    var yearMonth = year + '-' + await convertNumber(month);
                                    for (var j = 1; j <= dateFinal; j++) {
                                        var datetConvert = mModules.toDatetimeDay(moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(j)).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
                                        let date = moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS')
                                        let staffID = staff ? staff.ID : null
                                        if (datetConvert.slice(0, 8) == 'Chủ nhật') {
                                            await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', false, 0)
                                        } else if (datetConvert.slice(0, 5) == 'Thứ 7' && !checkDuplicate(array7thDB, j)) {
                                            await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', false, 0)
                                        } else if (checkDuplicate(arrayHoliday, j)) {
                                            await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', false, 0)
                                        } else {
                                            // check xem có trong ngày nghỉ phép không ?
                                            if (checkDuplicate(arrayLeaveDay.array, j)) {
                                                for (let i = 0; i < arrayLeaveDay.arrayObj.length; i++) {
                                                    if (arrayLeaveDay.arrayObj[i].date == j) {
                                                        await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', false, 0)
                                                        await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', true, 0)
                                                    }
                                                }
                                            } else {
                                                await writeDataFromTimekeeperToDatabase(db, arrayUserID[i], arrayData, month, year, j, staff.ID)
                                            }
                                        }
                                    }
                                }
                            } else {
                                var arrayHoliday = await getListHoliday(db, year, month, dateFinal)
                                var staff = await mtblDMNhanvien(db).findOne({ where: { IDMayChamCong: arrayUserID[i] } })
                                if (staff) {
                                    var arrayLeaveDay = await getListleaveDate(db, month, year, staff.ID, dateFinal)
                                    var yearMonth = year + '-' + await convertNumber(month);
                                    for (var j = 1; j <= dateFinal; j++) {
                                        var datetConvert = mModules.toDatetimeDay(moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(j)).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
                                        let date = moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS')
                                        let staffID = staff ? staff.ID : null
                                        if (datetConvert.slice(0, 8) == 'Chủ nhật') {
                                            await mtblChamCong(db).destroy({
                                                where: {
                                                    Date: date,
                                                    IDNhanVien: staffID
                                                }
                                            })
                                            await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Sun', 'Nghỉ chủ nhật', false, 0)
                                        } else if (datetConvert.slice(0, 5) == 'Thứ 7' && !checkDuplicate(array7thDB, j)) {
                                            await mtblChamCong(db).destroy({
                                                where: {
                                                    Date: date,
                                                    IDNhanVien: staffID
                                                }
                                            })
                                            await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Sat', 'Nghỉ thứ bảy', false, 0)
                                        } else if (datetConvert.slice(0, 5) == 'Thứ 7' && checkDuplicate(array7thDB, j)) {
                                            let timeKeeping = await mtblChamCong(db).findOne({
                                                where: {
                                                    Date: date,
                                                    IDNhanVien: staffID
                                                }
                                            })
                                            if (timeKeeping && timeKeeping.Status == 'Sat') {
                                                await mtblChamCong(db).destroy({
                                                    where: {
                                                        ID: timeKeeping.ID
                                                    }
                                                })
                                                await writeDataFromTimekeeperToDatabase(db, arrayUserID[i], arrayData, month, year, j, staff.ID)
                                            }
                                        } else if (checkDuplicate(arrayHoliday, j)) {

                                            await mtblChamCong(db).destroy({
                                                where: {
                                                    Date: date,
                                                    IDNhanVien: staffID
                                                }
                                            })
                                            await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Holiday', 'Nghỉ lễ', false, 0)
                                        } else {
                                            // check xem có trong ngày nghỉ phép không ?
                                            if (checkDuplicate(arrayLeaveDay.array, j)) {
                                                for (let i = 0; i < arrayLeaveDay.arrayObj.length; i++) {
                                                    if (arrayLeaveDay.arrayObj[i].date == j) {
                                                        await mtblChamCong(db).destroy({
                                                            where: {
                                                                Date: date,
                                                                IDNhanVien: staffID
                                                            }
                                                        })
                                                        await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', false, 0)
                                                        await createAttendanceData(db, staffID, date, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', true, 0)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                await mtblDMNhanvien(db).findAll({ where: whereobj }).then(async staff => {
                    yearMonth = year + '-' + await convertNumber(month);
                    var stt = 1;
                    for (var i = 0; i < staff.length; i++) {
                        if (checkDuplicate(arrayStaff, staff[i].ID)) {
                            let objWhere = {};
                            let arraySearchAnd = [];
                            let arraySearchOr = [];
                            let arraySearchNot = [];
                            if (dateRes) {
                                arraySearchAnd.push({ IDNhanVien: staff[i].ID });
                                arraySearchAnd.push({
                                    Date: {
                                        [Op.substring]: '%' + yearMonth + '%'
                                    }
                                });
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
                                        if (timeKeepingM.Status == 'KL' && timeKeepingM.Reason == 'Nghỉ không phép') {
                                            if (checkDuplicate(arrayTakeLeave, j)) {
                                                if (checkFor == 0)
                                                    arrayDays.push(await convertNumber(j) + "/" + await convertNumber(month))
                                                let objDay = {};
                                                objDay['S'] = timeKeepingM ? timeKeepingM.Status ? timeKeepingM.Status : '' : ' ';
                                                objDay['idS'] = timeKeepingM ? timeKeepingM.ID : ' ';
                                                objDay['C'] = timeKeepingA ? timeKeepingA.Status : '';
                                                objDay['idC'] = timeKeepingA ? timeKeepingA.ID : ' ';
                                                objDay['status'] = 'H';
                                                obj[await convertNumber(j) + "/" + await convertNumber(month)] = objDay;
                                                freeBreak += 1;
                                            } else {
                                                if (checkFor == 0)
                                                    arrayDays.push(await convertNumber(j) + "/" + await convertNumber(month))
                                                let objDay = {};
                                                objDay['S'] = timeKeepingM ? timeKeepingM.Status ? timeKeepingM.Status : '' : ' ';
                                                objDay['idS'] = timeKeepingM ? timeKeepingM.ID : ' ';
                                                objDay['C'] = timeKeepingA ? timeKeepingA.Status : '';
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
                            obj['takeLeave'] = arrayTakeLeave ? arrayTakeLeave.length : 0;
                            // obj['holiday'] = arrayHoliday ? arrayHoliday.length : 0;
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
                            obj['stt'] = stt;
                            array.push(obj)
                            stt += 1;
                        }
                    }
                })
                result = {
                    array: array,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    arrayDays
                }
            } catch (error) {
                console.log(error);
                result = {}
            }
        } else {
            result = {}
        }
    })
    return result
}

async function getMinWageConfig(db, year, month) {
    let minimumWage = 0;
    let minimumWageDate = moment(year + '-' + await convertNumber(month + 1) + '-01').add(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS')
    await mtblMinWageConfig(db).findOne({
        order: [
            ['ID', 'DESC']
        ],
        where: {
            StartDate: {
                [Op.lte]: minimumWageDate
            }
        }
    }).then(data => {
        minimumWage = data.MinimumWage
    })
    return minimumWage
}
async function getMucDongBaoHiem(db, year, month) {
    let objInsurance = {};
    let minimumWageDate = moment(year + '-' + await convertNumber(month + 1) + '-01').add(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS')
    await mtblMucDongBaoHiem(db).findOne({
        order: [
            ['ID', 'DESC']
        ],
        ApplicableDate: {
            [Op.lte]: minimumWageDate
        }
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
    return objInsurance
}

async function getDetailPayrollForMonthYear(db, monthYear, departmentID) {
    try {
        var result = {}
        let stt = 1;
        let tblBangLuong = mtblBangLuong(db);
        var date = monthYear + '-01 07:00:00.000'
        var month = Number(monthYear.slice(5, 7)); // January
        var year = Number(monthYear.slice(0, 4));
        var dateFrom = year + '-' + await convertNumber(month)
        let tblDMNhanvien = mtblDMNhanvien(db);
        tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'department' })
        tblBangLuong.belongsTo(tblDMNhanvien, { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
        let whereArray = []
        if (!departmentID) {
            whereArray = [{
                Date: {
                    [Op.substring]: dateFrom
                },
                DateEnd: null,
            },
            {
                Date: {
                    [Op.lte]: date
                },
                DateEnd: null,
            },
            {
                Date: {
                    [Op.substring]: dateFrom
                },
                DateEnd: {
                    [Op.gte]: date
                },
            },
            {
                Date: {
                    [Op.lte]: date
                },
                DateEnd: {
                    [Op.gte]: date
                },
            },
            ]
        } else {
            let arrayStaff = []
            await mtblDMNhanvien(db).findAll({
                where: {
                    IDBoPhan: departmentID
                }
            }).then(data => {
                data.forEach(element => {
                    arrayStaff.push(element.ID)
                })
            })
            whereArray = [{
                Date: {
                    [Op.substring]: dateFrom
                },
                DateEnd: null,
                IDNhanVien: { [Op.in]: arrayStaff }
            },
            {
                Date: {
                    [Op.lte]: date
                },
                DateEnd: null,
                IDNhanVien: { [Op.in]: arrayStaff }

            },
            {
                Date: {
                    [Op.substring]: dateFrom
                },
                DateEnd: {
                    [Op.gte]: date
                },
                IDNhanVien: { [Op.in]: arrayStaff }

            },
            {
                Date: {
                    [Op.lte]: date
                },
                DateEnd: {
                    [Op.gte]: date
                },
                IDNhanVien: { [Op.in]: arrayStaff }

            },
            ]
        }
        let whereObj = {
            [Op.or]: whereArray
        }
        await tblBangLuong.findAll({
            include: [{
                model: tblDMNhanvien,
                required: false,
                as: 'nv',
                include: [{
                    model: mtblDMBoPhan(db),
                    required: false,
                    as: 'department'
                }]
            },],
            order: [
                ['ID', 'DESC']
            ],
            // offset: Number(body.itemPerPage) * (Number(body.page) - 1),
            // limit: Number(body.itemPerPage),
            where: whereObj,
        }).then(async data => {
            var array = [];
            var minimumWage = await getMinWageConfig(db, year, month);
            var objInsurance = {};
            await mtblMucDongBaoHiem(db).findOne({
                order: [
                    ['ID', 'DESC']
                ],
                where: {
                    ApplicableDate: { [Op.like]: '%' + monthYear + '%' }
                }
            }).then(async data => {
                if (data) {
                    objInsurance['staffBHXH'] = data.StaffBHXH ? data.StaffBHXH : 0
                    objInsurance['staffBHYT'] = data.StaffBHYT
                    objInsurance['staffBHTN'] = data.StaffBHTN
                    objInsurance['union'] = data.StaffUnion ? data.StaffUnion : 0;
                } else {
                    await mtblMucDongBaoHiem(db).findOne({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(data => {
                        if (data) {
                            objInsurance['staffBHXH'] = data.StaffBHXH ? data.StaffBHXH : 0
                            objInsurance['staffBHYT'] = data.StaffBHYT
                            objInsurance['staffBHTN'] = data.StaffBHTN
                            objInsurance['union'] = data.StaffUnion ? data.StaffUnion : 0;
                        }
                    })
                }
            })
            let totalRealField = 0;
            let totalBHXHSalary = 0;
            let totalProductivityWages = 0;
            let totalStaffBHXH = 0;
            let totalStaffBHYT = 0;
            let totalStaffBHTN = 0;
            let totalUnion = 0;
            let totalPersonalTax = 0;
            let totalPersonalTaxSalary = 0;
            let totalAllReduce = 0;
            let totelReduce = 0;
            for (var i = 0; i < data.length; i++) {
                var reduce = 0;
                await mtblDMGiaDinh(db).findAll({
                    where: { IDNhanVien: data[i].IDNhanVien }
                }).then(family => {
                    family.forEach(element => {
                        reduce += Number(element.Reduce);
                    });
                })
                let salariesDecidedIncrease = await getIncreaseSalaryOfStaff(db, data[i].IDNhanVien, dateFrom); // quyết định tawg lương năng suất
                let productivityWages = await realProductivityWageCalculation(db, data[i].IDNhanVien, date, data[i].nv ? (data[i].nv.ProductivityWages + Number(salariesDecidedIncrease)) : 0)
                productivityWages = productivityWages ? productivityWages : 0
                var coefficientsSalary = 0;
                coefficientsSalary = data[i].nv ? data[i].nv.CoefficientsSalary ? data[i].nv.CoefficientsSalary : 0 : 0
                let union = data[i].nv.Status == "Đóng bảo hiểm" ? 0 : (productivityWages * objInsurance['union'] / 100)
                let bhxhSalary = data[i].nv.Status == "Hưởng lương" ? 0 : (minimumWage * coefficientsSalary)
                let staffBHXH = data[i].nv.Status == "Hưởng lương" ? 0 : (minimumWage * coefficientsSalary * objInsurance['staffBHXH'] / 100)
                let staffBHYT = data[i].nv.Status == "Hưởng lương" ? 0 : (minimumWage * coefficientsSalary * objInsurance['staffBHYT'] / 100)
                let staffBHTN = data[i].nv.Status == "Hưởng lương" ? 0 : (minimumWage * coefficientsSalary * objInsurance['staffBHTN'] / 100)
                let totalReduceBHXH = staffBHYT + staffBHXH + union + staffBHTN
                let workingSalary = data[i].nv.Status == "Đóng bảo hiểm" ? 0 : (data[i].WorkingSalary ? data[i].WorkingSalary : 0)
                let personalTaxSalary = productivityWages - totalReduceBHXH - reduce - 11000000
                personalTaxSalary = personalTaxSalary > 0 ? personalTaxSalary : 0
                let personalTax = personalTaxSalary > 0 ? await checkTypeContract(db, data[i].IDNhanVien, Number(personalTaxSalary)) : 0;
                let totalReduce = totalReduceBHXH + personalTax
                totalReduce = totalReduce > 0 ? totalReduce : 0
                totalReduce = Math.round(totalReduce)
                let realField = productivityWages - totalReduce
                var obj = {
                    stt: stt,
                    id: Number(data[i].ID),
                    idStaff: data[i].IDNhanVien ? data[i].IDNhanVien : null,
                    staffName: data[i].IDNhanVien ? data[i].nv.StaffName : null,
                    staffCode: data[i].IDNhanVien ? data[i].nv.StaffCode : null,
                    departmentName: data[i].IDNhanVien ? data[i].nv.department ? data[i].nv.department.DepartmentName : '' : '',
                    workingSalary: workingSalary.toFixed(0),
                    bhxhSalary: bhxhSalary.toFixed(0),
                    staffBHXH: staffBHXH.toFixed(0),
                    staffBHYT: staffBHYT.toFixed(0),
                    staffBHTN: staffBHTN.toFixed(0),
                    union: union.toFixed(0),
                    personalTax: Math.round(personalTax),
                    personalTaxSalary: Math.round(personalTaxSalary),
                    reduce: reduce + 11000000,
                    totalReduce: totalReduce.toFixed(0),
                    realField: realField > 0 ? realField.toFixed(0) : 0,
                    productivityWages: productivityWages.toFixed(0),
                }
                realField = (realField > 0 ? realField.toFixed(0) : 0)
                if (data[i].nv.Status == 'Lương và bảo hiểm' || data[i].nv.Status == 'Hưởng lương') {
                    totalRealField += Number(realField);
                    totalBHXHSalary += bhxhSalary;
                    totalProductivityWages += productivityWages;
                    totalStaffBHXH += staffBHXH;
                    totalStaffBHYT += staffBHYT;
                    totalStaffBHTN += staffBHTN;
                    totalUnion += union;
                    totalPersonalTax += Math.round(personalTax);
                    totalPersonalTaxSalary += Math.round(personalTaxSalary);
                    totalAllReduce += totalReduce;
                    totelReduce += (reduce + 11000000)
                    array.push(obj);
                    stt += 1;
                }
            }
            var count = await mtblBangLuong(db).count({
                where: {
                    Date: {
                        [Op.substring]: monthYear
                    }
                },
            })
            result = {
                objInsurance: objInsurance,
                totalFooter: {
                    totalRealField: totalRealField.toFixed(0),
                    totalBHXHSalary: totalBHXHSalary.toFixed(0),
                    totalProductivityWages: totalProductivityWages.toFixed(0),
                    totalStaffBHXH: totalStaffBHXH.toFixed(0),
                    totalStaffBHYT: totalStaffBHYT.toFixed(0),
                    totalStaffBHTN: totalStaffBHTN.toFixed(0),
                    totalUnion: totalUnion.toFixed(0),
                    totalPersonalTax: totalPersonalTax.toFixed(0),
                    totalPersonalTaxSalary: totalPersonalTaxSalary.toFixed(0),
                    totalAllReduce: totalAllReduce.toFixed(0),
                    totelReduce: totelReduce.toFixed(0),
                },
                array: array,
                status: Constant.STATUS.SUCCESS,
                message: Constant.MESSAGE.ACTION_SUCCESS,
                all: count
            }
        })
        return result
    } catch (error) {
        console.log(error);
    }
}

async function getDetailTrackInsurancePremiums(db, monthYear, departmentID) {
    var result = {}
    let stt = 1;
    var date = monthYear + '-01 07:00:00.000'
    var month = Number(monthYear.slice(5, 7)); // January
    var year = Number(monthYear.slice(0, 4));
    var dateFrom = year + '-' + await convertNumber(month)
    let tblBangLuong = mtblBangLuong(db);
    let tblDMNhanvien = mtblDMNhanvien(db)
    try {
        tblBangLuong.belongsTo(tblDMNhanvien, { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
        tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bp' })
        let whereArray = []
        if (!departmentID) {
            whereArray = [{
                Date: {
                    [Op.substring]: dateFrom
                },
                DateEnd: null,
            },
            {
                Date: {
                    [Op.lte]: date
                },
                DateEnd: null,
            },
            {
                Date: {
                    [Op.substring]: dateFrom
                },
                DateEnd: {
                    [Op.gte]: date
                },
            },
            {
                Date: {
                    [Op.lte]: date
                },
                DateEnd: {
                    [Op.gte]: date
                },
            },
            ]
        } else {
            let arrayStaff = []
            await mtblDMNhanvien(db).findAll({
                where: {
                    IDBoPhan: departmentID
                }
            }).then(data => {
                data.forEach(element => {
                    arrayStaff.push(element.ID)
                })
            })
            whereArray = [{
                Date: {
                    [Op.substring]: dateFrom
                },
                DateEnd: null,
                IDNhanVien: { [Op.in]: arrayStaff }
            },
            {
                Date: {
                    [Op.lte]: date
                },
                DateEnd: null,
                IDNhanVien: { [Op.in]: arrayStaff }

            },
            {
                Date: {
                    [Op.substring]: dateFrom
                },
                DateEnd: {
                    [Op.gte]: date
                },
                IDNhanVien: { [Op.in]: arrayStaff }

            },
            {
                Date: {
                    [Op.lte]: date
                },
                DateEnd: {
                    [Op.gte]: date
                },
                IDNhanVien: { [Op.in]: arrayStaff }

            },
            ]
        }
        let whereObj = {
            [Op.or]: whereArray
        }
        await tblBangLuong.findAll({
            include: [{
                model: tblDMNhanvien,
                required: false,
                as: 'nv',
                include: [{
                    model: mtblDMBoPhan(db),
                    required: false,
                    as: 'bp'
                },],
            },],
            order: [
                ['ID', 'DESC']
            ],
            where: whereObj,
        }).then(async data => {
            var array = [];
            var objInsurance = await getMucDongBaoHiem(db, year, month);
            var minimumWage = await getMinWageConfig(db, year, month);

            let bhxhSalaryTotal = 0
            let bhxhCTTotal = 0
            let bhxhNVTotal = 0
            let bhytCTTotal = 0
            let bhytNVTotal = 0
            let bhtnCTTotal = 0
            let bhtnNVTotal = 0
            let bhtnldTotal = 0
            let tongTotal = 0
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
                let bhxhSalary = coefficientsSalary * minimumWage + ((insuranceSalaryIncrease ? insuranceSalaryIncrease.Increase : 0) * coefficientsSalary)
                bhxhSalaryTotal += bhxhSalary
                bhxhCTTotal += (bhxhSalary * objInsurance['companyBHXH'] / 100)
                bhxhNVTotal += (bhxhSalary * objInsurance['staffBHXH'] / 100)
                bhytCTTotal += (bhxhSalary * objInsurance['companyBHYT'] / 100)
                bhytNVTotal += (bhxhSalary * objInsurance['staffBHYT'] / 100)
                bhtnNVTotal += (bhxhSalary * objInsurance['staffBHTN'] / 100)
                bhtnCTTotal += (bhxhSalary * objInsurance['companyBHTN'] / 100)
                bhtnldTotal += (bhxhSalary * objInsurance['staffBHTNLD'] / 100)
                let total = bhxhSalary * (objInsurance['companyBHXH'] + objInsurance['staffBHXH'] + objInsurance['companyBHYT'] + objInsurance['staffBHYT'] + objInsurance['staffBHTN'] + objInsurance['companyBHTN'] + objInsurance['staffBHTNLD']) / 100
                // tongTotal += total
                var obj = {
                    stt: stt,
                    id: Number(data[i].ID),
                    idStaff: data[i].IDNhanVien ? data[i].IDNhanVien : null,
                    nameStaff: data[i].IDNhanVien ? data[i].nv.StaffName : null,
                    nameDepartment: data[i].IDNhanVien ? data[i].nv.bp ? data[i].nv.bp.DepartmentName : '' : '',
                    staffCode: data[i].IDNhanVien ? data[i].nv.StaffCode : null,
                    productivityWages: data[i].IDNhanVien ? data[i].nv.ProductivityWages : 0,
                    workingSalary: data[i].WorkingSalary ? data[i].WorkingSalary : 0,
                    bhxhSalary: bhxhSalary,
                    reduce: Number(reduce),
                    insuranceSalaryIncrease: insuranceSalaryIncrease ? insuranceSalaryIncrease.Increase : 0,
                    coefficientsSalary: coefficientsSalary
                }
                if (data[i].nv.Status == 'Lương và bảo hiểm' || data[i].nv.Status == 'Đóng bảo hiểm') {
                    tongTotal += total
                    array.push(obj);
                    stt += 1;
                }

            }
            var count = await mtblBangLuong(db).count({
                where: {
                    Date: {
                        [Op.substring]: monthYear
                    }
                },
            })
            result = {
                objInsurance: objInsurance,
                array: array,
                totalFooter: {
                    bhxhSalaryTotal: bhxhSalaryTotal,
                    bhxhCTTotal: bhxhCTTotal,
                    bhxhNVTotal: bhxhNVTotal,
                    bhytCTTotal: bhytCTTotal,
                    bhytNVTotal: bhytNVTotal,
                    bhtnCTTotal: bhtnCTTotal,
                    bhtnNVTotal: bhtnNVTotal,
                    bhtnldTotal: bhtnldTotal,
                    tongTotal: tongTotal,
                },
                status: Constant.STATUS.SUCCESS,
                message: Constant.MESSAGE.ACTION_SUCCESS,
                all: count
            }
        })
    } catch (error) {
        console.log(error);
    }

    return result
}
module.exports = {
    createTimeAttendanceSummaryFollowMonth,
    createTimeAttendanceSummary,
    deleteRelationshiptblBangLuong,
    // get_list_tbl_bangluong
    getListtblBangLuong: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var monthStart;
                    var yearStart;
                    var monthEnd;
                    var yearEnd;
                    if (body.dateStart) {
                        monthStart = Number(body.dateStart.slice(5, 7)); // January
                        yearStart = Number(body.dateStart.slice(0, 4));
                    }
                    if (body.dateEnd) {
                        monthEnd = Number(body.dateEnd.slice(5, 7));
                        yearEnd = Number(body.dateEnd.slice(0, 4));
                    }
                    let result = {}
                    if (body.dateEnd) {
                        if (yearEnd < yearStart) {
                            result = {
                                status: Constant.STATUS.FAIL,
                                message: 'Tháng bắt đầu lớn hơn tháng kết thúc. Vui lòng kiểm tra lại!'
                            }
                        } else if (yearEnd = yearStart) {
                            result = await getDetailPayrollForMonthYear(db, yearStart + '-' + await convertNumber(monthStart), body.departmentID)
                            let arrayStaff = []
                            for (let arr = 0; arr < result.array.length; arr++) {
                                arrayStaff.push(Number(result.array[arr].idStaff))
                            }
                            for (let m = monthStart + 1; m <= monthEnd; m++) {
                                let resultObj = await getDetailPayrollForMonthYear(db, yearStart + '-' + await convertNumber(m), body.departmentID)
                                result.totalFooter.totalRealField = Number(result.totalFooter.totalRealField) + Number(resultObj.totalFooter.totalRealField)
                                result.totalFooter.totalBHXHSalary = Number(result.totalFooter.totalBHXHSalary) + Number(resultObj.totalFooter.totalBHXHSalary)
                                result.totalFooter.totalProductivityWages = Number(result.totalFooter.totalProductivityWages) + Number(resultObj.totalFooter.totalProductivityWages)
                                result.totalFooter.totalStaffBHXH = Number(result.totalFooter.totalStaffBHXH) + Number(resultObj.totalFooter.totalStaffBHXH)
                                result.totalFooter.totalStaffBHYT = Number(result.totalFooter.totalStaffBHYT) + Number(resultObj.totalFooter.totalStaffBHYT)
                                result.totalFooter.totalStaffBHTN = Number(result.totalFooter.totalStaffBHTN) + Number(resultObj.totalFooter.totalStaffBHTN)
                                result.totalFooter.totalUnion = Number(result.totalFooter.totalUnion) + Number(resultObj.totalFooter.totalUnion)
                                result.totalFooter.totalPersonalTax = Number(result.totalFooter.totalPersonalTax) + Number(resultObj.totalFooter.totalPersonalTax)
                                result.totalFooter.totalPersonalTaxSalary = Number(result.totalFooter.totalPersonalTaxSalary) + Number(resultObj.totalFooter.totalPersonalTaxSalary)
                                result.totalFooter.totalAllReduce = Number(result.totalFooter.totalAllReduce) + Number(resultObj.totalFooter.totalAllReduce)
                                result.totalFooter.totelReduce = Number(result.totalFooter.totelReduce) + Number(resultObj.totalFooter.totelReduce)
                                for (let arrayM = 0; arrayM < resultObj.array.length; arrayM++) {
                                    if (checkDuplicate(arrayStaff, Number(resultObj.array[arrayM].idStaff)) == false) {
                                        arrayStaff.push(Number(resultObj.array[arrayM].idStaff))
                                        result.array.push(resultObj.array[arrayM])
                                    } else {
                                        for (let arrayR = 0; arrayR < result.array.length; arrayR++) {
                                            if (resultObj.array[arrayM].idStaff == result.array[arrayR].idStaff) {
                                                result.array[arrayR].workingSalary = Number(result.array[arrayR].workingSalary) + Number(resultObj.array[arrayM].workingSalary)
                                                result.array[arrayR].bhxhSalary = Number(result.array[arrayR].bhxhSalary) + Number(resultObj.array[arrayM].bhxhSalary)
                                                result.array[arrayR].staffBHXH = Number(result.array[arrayR].staffBHXH) + Number(resultObj.array[arrayM].staffBHXH)
                                                result.array[arrayR].staffBHYT = Number(result.array[arrayR].staffBHYT) + Number(resultObj.array[arrayM].staffBHYT)
                                                result.array[arrayR].staffBHTN = Number(result.array[arrayR].staffBHTN) + Number(resultObj.array[arrayM].staffBHTN)
                                                result.array[arrayR].union = Number(result.array[arrayR].union) + Number(resultObj.array[arrayM].union)
                                                result.array[arrayR].personalTax = Number(result.array[arrayR].personalTax) + Number(resultObj.array[arrayM].personalTax)
                                                result.array[arrayR].personalTaxSalary = Number(result.array[arrayR].personalTaxSalary) + Number(resultObj.array[arrayM].personalTaxSalary)
                                                result.array[arrayR].reduce = Number(result.array[arrayR].reduce) + Number(resultObj.array[arrayM].reduce)
                                                result.array[arrayR].totalReduce = Number(result.array[arrayR].totalReduce) + Number(resultObj.array[arrayM].totalReduce)
                                                result.array[arrayR].realField = Number(result.array[arrayR].realField) + Number(resultObj.array[arrayM].realField)
                                                result.array[arrayR].productivityWages = Number(result.array[arrayR].productivityWages) + Number(resultObj.array[arrayM].productivityWages)
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                    else {
                        result = await getDetailPayrollForMonthYear(db, yearStart + '-' + await convertNumber(monthStart), body.departmentID)
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
    // track_insurance_premiums
    trackInsurancePremiums: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var monthStart;
                    var yearStart;
                    var monthEnd;
                    var yearEnd;
                    if (body.dateStart) {
                        monthStart = Number(body.dateStart.slice(5, 7)); // January
                        yearStart = Number(body.dateStart.slice(0, 4));
                    }
                    if (body.dateEnd) {
                        monthEnd = Number(body.dateEnd.slice(5, 7));
                        yearEnd = Number(body.dateEnd.slice(0, 4));
                    }
                    let result = {}
                    if (body.dateEnd) {
                        if (yearEnd < yearStart) {
                            result = {
                                status: Constant.STATUS.FAIL,
                                message: 'Tháng bắt đầu lớn hơn tháng kết thúc. Vui lòng kiểm tra lại!'
                            }
                        } else if (yearEnd = yearStart) {
                            result = await getDetailTrackInsurancePremiums(db, yearStart + '-' + await convertNumber(monthStart), body.departmentID)
                            let arrayStaff = []
                            for (let arr = 0; arr < result.array.length; arr++) {
                                arrayStaff.push(Number(result.array[arr].idStaff))
                            }
                            for (let m = monthStart + 1; m <= monthEnd; m++) {
                                let resultObj = await getDetailTrackInsurancePremiums(db, yearStart + '-' + await convertNumber(m), body.departmentID)
                                result.totalFooter.bhxhSalaryTotal = Number(result.totalFooter.bhxhSalaryTotal) + Number(resultObj.totalFooter.bhxhSalaryTotal)
                                result.totalFooter.bhxhCTTotal = Number(result.totalFooter.bhxhCTTotal) + Number(resultObj.totalFooter.bhxhCTTotal)
                                result.totalFooter.bhxhNVTotal = Number(result.totalFooter.bhxhNVTotal) + Number(resultObj.totalFooter.bhxhNVTotal)
                                result.totalFooter.bhytCTTotal = Number(result.totalFooter.bhytCTTotal) + Number(resultObj.totalFooter.bhytCTTotal)
                                result.totalFooter.bhytNVTotal = Number(result.totalFooter.bhytNVTotal) + Number(resultObj.totalFooter.bhytNVTotal)
                                result.totalFooter.bhtnCTTotal = Number(result.totalFooter.bhtnCTTotal) + Number(resultObj.totalFooter.bhtnCTTotal)
                                result.totalFooter.bhtnNVTotal = Number(result.totalFooter.bhtnNVTotal) + Number(resultObj.totalFooter.bhtnNVTotal)
                                result.totalFooter.bhtnldTotal = Number(result.totalFooter.bhtnldTotal) + Number(resultObj.totalFooter.bhtnldTotal)
                                result.totalFooter.tongTotal = Number(result.totalFooter.tongTotal) + Number(resultObj.totalFooter.tongTotal)
                                for (let arrayM = 0; arrayM < resultObj.array.length; arrayM++) {
                                    if (checkDuplicate(arrayStaff, Number(resultObj.array[arrayM].idStaff)) == false) {
                                        arrayStaff.push(Number(resultObj.array[arrayM].idStaff))
                                        result.array.push(resultObj.array[arrayM])
                                    } else {
                                        for (let arrayR = 0; arrayR < result.array.length; arrayR++) {
                                            if (resultObj.array[arrayM].idStaff == result.array[arrayR].idStaff) {
                                                result.array[arrayR].workingSalary = Number(result.array[arrayR].workingSalary) + Number(resultObj.array[arrayM].workingSalary)
                                                result.array[arrayR].bhxhSalary = Number(result.array[arrayR].bhxhSalary) + Number(resultObj.array[arrayM].bhxhSalary)
                                                result.array[arrayR].reduce = Number(result.array[arrayR].reduce) + Number(resultObj.array[arrayM].reduce)
                                                result.array[arrayR].insuranceSalaryIncrease = Number(result.array[arrayR].insuranceSalaryIncrease) + Number(resultObj.array[arrayM].insuranceSalaryIncrease)
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    } else {
                        result = await getDetailTrackInsurancePremiums(db, yearStart + '-' + await convertNumber(monthStart), body.departmentID)
                        console.log(result);
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
    // data_timekeeping
    dataTimekeeping: async (req, res) => {
        let body = req.body;
        let result = await getDataTimeKeeping(body.date, body.departmentID)
        console.log(result);
        res.json(result);
    },
    // update_timekeeping
    updateTimekeeping: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    body.array = JSON.parse(body.array);
                    for (var i = 0; i < body.array.length; i++) {
                        if (body.array[i].id) {
                            let reason = ''
                            let obj = {}
                            if (body.array[i].status == 'plus')
                                obj = {
                                    Status: '+',
                                }
                            else
                                obj = {
                                    Status: body.array[i].status,
                                }
                            if (body.array[i].status != 1) {
                                obj['Reason'] = reason
                            }
                            let now = moment().add(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
                            obj['EditDate'] = now
                            await mtblChamCong(db).update(obj, {
                                where: {
                                    ID: body.array[i].id
                                }
                            })
                        }
                    }
                    let timeKeeping = await mtblChamCong(db).findOne({
                        where: {
                            ID: body.array[0].id
                        }
                    })
                    if (timeKeeping) {
                        var month = Number(timeKeeping.Date.slice(5, 7)); // January
                        var year = Number(timeKeeping.Date.slice(0, 4));
                        await createTimeAttendanceSummaryFollowMonth(month, year, timeKeeping.IDNhanVien)
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
                var obj = [];
                if (body.departmentID) {
                    obj.push({ IDBoPhan: body.departmentID })
                }
                let tblDMNhanvien = mtblDMNhanvien(db);
                tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'department' })
                await tblDMNhanvien.findAll({
                    where: obj,
                    include: [{
                        model: mtblDMBoPhan(db),
                        required: false,
                        as: 'department'
                    },],
                }).then(async staff => {
                    let stt = 1
                    for (var i = 0; i < staff.length; i++) {
                        var arrayHoliday = await getListleaveDate(db, month, year, staff[i].ID, dateFinal)
                        if (count > 0)
                            checkFor = 1;
                        var freeBreak = 0;
                        var workingDay = 0;
                        var arrayTakeLeave = await getDateTakeLeave(db, month, year, staff[i].ID)
                        var yearMonth = year + '-' + await convertNumber(month);
                        var timeKeeping = await mtblChamCong(db).findOne({
                            where: [
                                { IDNhanVien: staff[i].ID },
                                {
                                    Date: {
                                        [Op.substring]: '%' + yearMonth + '%'
                                    }
                                },
                            ]
                        })
                        let objMorning = {};
                        let objAfternoon = {};
                        objAfternoon['Số thứ tự'] = stt;
                        objAfternoon['Phòng ban'] = staff[i].department ? staff[i].department ? staff[i].department.DepartmentName : '' : '';
                        objAfternoon['Mã nhân viên'] = staff[i] ? staff[i].StaffCode : '';
                        objAfternoon['Tên nhân viên'] = staff[i] ? staff[i].StaffName : '';
                        objAfternoon['Buổi'] = 'Chiều';
                        objMorning['Số thứ tự'] = stt;
                        objMorning['Phòng ban'] = staff[i].department ? staff[i].department ? staff[i].department.DepartmentName : '' : '';
                        objMorning['Mã nhân viên'] = staff[i] ? staff[i].StaffCode : '';
                        objMorning['Tên nhân viên'] = staff[i] ? staff[i].StaffName : '';
                        objMorning['Buổi'] = 'Sáng';
                        if (timeKeeping) {
                            for (var j = 1; j <= dateFinal; j++) {
                                if (!checkDuplicate(arrayHoliday.array, j)) {
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
                                    } else {
                                        if (checkDuplicate(arrayTakeLeave, j)) {
                                            if (checkFor == 0)
                                                count += 1;

                                            objMorning[await convertNumber(j) + "/" + await convertNumber(month)] = 1;
                                            objAfternoon[await convertNumber(j) + "/" + await convertNumber(month)] = '';
                                            freeBreak += 1;
                                        } else {
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
                        stt += 1
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
        // await createTimeAttendanceSummary()
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let arrayStaff = []
                    let array = []
                    let where = []
                    if (body.departmentID) {
                        await mtblDMNhanvien(db).findAll({
                            where: { IDBoPhan: body.departmentID }
                        }).then(staff => {
                            staff.forEach(element => {
                                arrayStaff.push(element.ID)
                            })
                        })
                        where.push({
                            StaffID: {
                                [Op.in]: arrayStaff
                            }
                        })
                    }
                    where.push({
                        Month: {
                            [Op.like]: '%' + body.date + '%'
                        }
                    })
                    await mtblTimeAttendanceSummary(db).findAll({
                        where: where,
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(data => {
                        for (let i = 0; i < data.length; i++) {
                            array.push({
                                staffID: data[i].StaffID,
                                staffName: data[i].StaffName,
                                staffCode: data[i].StaffCode,
                                departmentName: data[i].DepartmentName,
                                overtime: data[i].Overtime,
                                numberHoliday: data[i].NumberHoliday,
                                freeBreak: data[i].FreeBreak,
                                lateDay: data[i].LateDay,
                                remaining: data[i].Remaining,
                                remainingPreviousYear: data[i].RemainingPreviousYear,
                                month: data[i].Month
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