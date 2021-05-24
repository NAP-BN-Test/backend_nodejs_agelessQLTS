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
            let seconrd = Number(array[i].slice(6, 8)) + Number(array[i].slice(3, 5)) * 60 + Number(array[i].slice(0, 2)) * 60 * 60
            if (seconrd >= maxTime) {
                maxTime = seconrd;
            }
        } else {
            let seconrd = Number(array[i].slice(5, 7)) + Number(array[i].slice(2, 4)) * 60 + Number(array[i].slice(0, 1)) * 60 * 60
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
            let seconrd = Number(array[i].slice(6, 8)) + Number(array[i].slice(3, 5)) * 60 + Number(array[i].slice(0, 2)) * 60 * 60;
            if (seconrd < minTime) {
                minTime = seconrd;
            }
        } else {
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
    await mtblNghiPhep(db).findAll({
        where: {
            IDNhanVien: staffID,
            Status: 'Hoàn thành',
        }
    }).then(leave => {
        leave.forEach(item => {
            listID.push(item.ID)
        })
    })
    for (let i = 0; i < listID.length; i++) {
        let query = `SELECT [ID], [LeaveID], [DateEnd], [DateStart] FROM [tblDateOfLeave] AS [tblDateOfLeave] 
        WHERE (DATEPART(yy, [tblDateOfLeave].[DateEnd]) = ` + year + ` AND DATEPART(mm, [tblDateOfLeave].[DateEnd]) = ` + month + `) AND ([tblDateOfLeave].[LeaveID] = N'` + listID[i] + `');`
        let date = await db.query(query)
        date = date[0]
        for (let i = 0; i < date.length; i++) {
            // kí hiệu
            let sign = '';
            let tblNghiPhep = mtblNghiPhep(db);
            tblNghiPhep.belongsTo(mtblLoaiChamCong(db), { foreignKey: 'IDLoaiChamCong', sourceKey: 'IDLoaiChamCong', as: 'type' })
            await tblNghiPhep.findOne({
                where: {
                    ID: date[i].LeaveID
                },
                include: [{
                    model: mtblLoaiChamCong(db),
                    required: false,
                    as: 'type'
                }, ],
            }).then(leave => {
                if (leave) {
                    sign = leave.type ? leave.type.Code : ''
                }
            })
            let dateStart = moment(date[i].DateStart).subtract(7, 'hours').date()
            let dateEnd = moment(date[i].DateEnd).subtract(7, 'hours').date()
            let dateEndMonth = moment(date[i].DateEnd).subtract(7, 'hours').month()
                // lấy tháng bị trừ 1
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
                    sign: sign,
                })
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
        }, ],
    })
    console.log(staffID);
    if (contract)
        result = await calculationPersonalUncomeTaxWay2(personalTax)
    return result
}

async function getIncreaseSalaryOfStaff(db, staffID) {
    let salariesDecidedIncrease = 0
    let tblIncreaseSalariesAndStaff = mtblIncreaseSalariesAndStaff(db);
    tblIncreaseSalariesAndStaff.belongsTo(mtblQuyetDinhTangLuong(db), { foreignKey: 'IncreaseSalariesID', sourceKey: 'IncreaseSalariesID', as: 'IncreaseSalaries' })

    await tblIncreaseSalariesAndStaff.findOne({
        where: { StaffID: staffID },
        include: [{
            model: mtblQuyetDinhTangLuong(db),
            required: false,
            as: 'IncreaseSalaries'
        }, ],
    }).then(Increase => {
        if (Increase)
            salariesDecidedIncrease = Increase.IncreaseSalaries ? Increase.IncreaseSalaries.Increase ? Increase.IncreaseSalaries.Increase : 0 : 0
    })
    return salariesDecidedIncrease
}

async function realProductivityWageCalculation(db, staffID, date, productivityWages) {
    console.log(staffID, date, 1234);
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
    await mtblChamCong(db).findAll({
        where: {
            IDNhanVien: staffID,
            Date: {
                [Op.substring]: year + '-' + month
            }
        }
    }).then(async leave => {
        for (let i = 0; i < leave.length; i++) {
            if (leave[i].Reason == 'Nghỉ không phép') {
                leaveFree += 1
            } else if (leave[i].Reason == 'Ngày nghỉ phép') {
                let tblNghiPhep = mtblNghiPhep(db);
                tblNghiPhep.belongsTo(mtblLoaiChamCong(db), { foreignKey: 'IDLoaiChamCong', sourceKey: 'IDLoaiChamCong', as: 'typeLeave' })
                await tblNghiPhep.findOne({
                    include: [{
                        model: mtblLoaiChamCong(db),
                        required: false,
                        as: 'typeLeave'
                    }, ],
                    where: {
                        IDNhanVien: staffID,
                        DateEnd: {
                            [Op.gte]: date
                        },
                        DateStart: {
                            [Op.lte]: date
                        },
                    }
                }).then(takeLeade => {
                    if (takeLeade && takeLeade.typeLeave) {
                        if (!takeLeade.typeLeave.SalaryIsAllowed) {
                            dayOff += 1
                        }
                    }
                })
            }
        }
    })
    let sunSta = 0
    for (let i = 0; i < dateFinal; i++) {
        var datetConvert = mModules.toDatetimeDay(moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(i)).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
        if (datetConvert.slice(0, 8) == 'Chủ nhật' || datetConvert.slice(0, 5) == 'Thứ 7') {
            sunSta += 1
        }
    }
    result = productivityWages / (dateFinal - sunSta) * ((dateFinal - sunSta) - (dayOff / 2 + leaveFree / 2))
    return result
}
async function getListHoliday(db, year, month, dateFinal) {
    let arrayResult = []
    await mtblNghiLe(db).findAll({
        where: {
            [Op.or]: {
                DateStartHoliday: {
                    [Op.substring]: year + '-' + month
                },
                DateEndHoliday: {
                    [Op.substring]: year + '-' + month
                },
            },
        }
    }).then(data => {
        data.forEach(element => {
            let dateStart = moment(element.DateStartHoliday).subtract(7, 'hours').date()
            let dateEnd = moment(element.DateEndHoliday).subtract(7, 'hours').date()
            let dateEndMonth = moment(element.DateEndHoliday).subtract(7, 'hours').month()
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
// Lấy danh sách thứ 7 đi làm
async function take7thDataToWork(db, year, month) {
    //  lấy danh sách thứ 7 đi làm ------------------------------------
    let array7thDB = []
    await mtblConfigWorkday(db).findAll({
        where: {
            Date: {
                [Op.substring]: year + '-' + await convertNumber(month)
            }
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
                statusAfternoon = ''
            }
            statusMorning = '0.5'
            summaryEndDateS = 0.5
        } else {
            // check sáng
            if (minTime >= eightH) {
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
            if (minTime >= eightH) {
                statusMorning = await converFromSecondsToHourLate(minTime - eightH)
                summaryEndDateS = await roundNumberMinutes(minTime - eightH)

            } else {
                if (twelveH >= maxTime) {
                    statusMorning = await converFromSecondsToHourLate(twelveH - maxTime)
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
                if (thirteenH <= minTime) {
                    statusAfternoon = await converFromSecondsToHourLate(minTime - thirteenH)
                    summaryEndDateC = await roundNumberMinutes(minTime - thirteenH)
                } else {
                    if (seventeenH >= maxTime) {
                        statusAfternoon = await converFromSecondsToHourAftersoon(seventeenH - maxTime)
                        summaryEndDateC = await roundNumberMinutes(seventeenH - maxTime)
                    } else {
                        statusAfternoon = ''
                    }
                }
            } else {
                // check sáng
                if (minTime >= eightH) {
                    statusMorning = await converFromSecondsToHourLate(minTime - eightH)
                    summaryEndDateS = await roundNumberMinutes(minTime - eightH)
                } else {
                    statusMorning = ''
                }
                // check chiều
                if (seventeenH >= maxTime) {
                    statusAfternoon = await converFromSecondsToHourAftersoon(seventeenH - maxTime)
                    summaryEndDateC = await roundNumberMinutes(seventeenH - maxTime)

                } else {
                    statusAfternoon = ''
                }
            }
        }
    }
    let datedb = moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(date)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS')
    let statusMorningDB = statusMorning ? statusMorning : null
    let statusAfternoonDB = statusAfternoon ? statusAfternoon : null
    console.log(statusMorningDB, statusAfternoonDB);
    if (arrayTimeOfDate.length >= 1) {
        await createAttendanceData(db, staffID, datedb, null, statusMorningDB, '+', true, summaryEndDateS)
        await createAttendanceData(db, staffID, datedb, null, statusAfternoonDB, '+', false, summaryEndDateC)
    } else {
        await createAttendanceData(db, staffID, datedb, null, '1', 'Nghỉ không phép', true, summaryEndDateS)
        await createAttendanceData(db, staffID, datedb, null, '1', 'Nghỉ không phép', false, summaryEndDateC)
    }
}

module.exports = {
    deleteRelationshiptblBangLuong,
    // get_list_tbl_bangluong
    getListtblBangLuong: (req, res) => {
        let body = req.body;
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
                        include: [{
                            model: tblDMNhanvien,
                            required: false,
                            as: 'nv',
                            include: [{
                                model: mtblDMBoPhan(db),
                                required: false,
                                as: 'department'
                            }]
                        }, ],
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: {
                            [Op.or]: [{
                                    Date: {
                                        [Op.lte]: date
                                    },
                                    DateEnd: {
                                        [Op.gte]: date
                                    },
                                },
                                {
                                    Date: {
                                        [Op.lte]: date
                                    },
                                    DateEnd: null,
                                }
                            ]
                        },
                    }).then(async data => {
                        var array = [];
                        var minimumWage = 0;
                        await mtblMinWageConfig(db).findOne({
                            order: [
                                ['ID', 'DESC']
                            ]
                        }).then(data => {
                            minimumWage = data.MinimumWage
                        })
                        var objInsurance = {};
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
                            let realProductivityWage = await realProductivityWageCalculation(db, data[i].IDNhanVien, date, data[i].nv ? data[i].nv.ProductivityWages : 0)
                            console.log(realProductivityWage, 1234);
                            let productivityWages = data[i].nv ? data[i].nv.ProductivityWages : 0;
                            productivityWages = realProductivityWage
                            let salariesDecidedIncrease = await getIncreaseSalaryOfStaff(db, data[i].IDNhanVien); // quyết định tawg lương năng suất
                            productivityWages += salariesDecidedIncrease
                            var coefficientsSalary = 0;
                            coefficientsSalary = data[i].nv ? data[i].nv.CoefficientsSalary ? data[i].nv.CoefficientsSalary : 0 : 0
                            let union = data[i].nv.Status == "Đóng bảo hiểm" ? 0 : ((data[i].nv.ProductivityWages ? data[i].nv.ProductivityWages : 0) * objInsurance['union'] / 100)
                            let bhxhSalary = data[i].nv.Status == "Hưởng lương" ? 0 : (minimumWage * coefficientsSalary)
                            let staffBHXH = data[i].nv.Status == "Hưởng lương" ? 0 : (minimumWage * coefficientsSalary * objInsurance['staffBHXH'] / 100)
                            let staffBHYT = data[i].nv.Status == "Hưởng lương" ? 0 : (minimumWage * coefficientsSalary * objInsurance['staffBHYT'] / 100)
                            let staffBHTN = data[i].nv.Status == "Hưởng lương" ? 0 : (minimumWage * coefficientsSalary * objInsurance['staffBHTN'] / 100)
                            let totalReduceBHXH = staffBHYT + staffBHXH + union + staffBHTN
                            let workingSalary = data[i].nv.Status == "Đóng bảo hiểm" ? 0 : (data[i].WorkingSalary ? data[i].WorkingSalary : 0)
                            let personalTaxSalary = (data[i].nv ? data[i].nv.ProductivityWages : 0) - totalReduceBHXH - reduce - 11000000
                            personalTaxSalary = personalTaxSalary > 0 ? personalTaxSalary : 0
                            let personalTax = personalTaxSalary > 0 ? await checkTypeContract(db, data[i].IDNhanVien, Number(personalTaxSalary)) : 0;
                            let totalReduce = totalReduceBHXH + personalTax
                            totalReduce = totalReduce > 0 ? totalReduce : 0
                            totalReduce = Math.round(totalReduce)
                            let realField = (data[i].nv.ProductivityWages ? data[i].nv.ProductivityWages : 0) - totalReduce
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                idStaff: data[i].IDNhanVien ? data[i].IDNhanVien : null,
                                staffName: data[i].IDNhanVien ? data[i].nv.StaffName : null,
                                staffCode: data[i].IDNhanVien ? data[i].nv.StaffCode : null,
                                departmentName: data[i].IDNhanVien ? data[i].nv.department ? data[i].nv.department.DepartmentName : '' : '',
                                workingSalary: workingSalary,
                                bhxhSalary: bhxhSalary,
                                staffBHXH: staffBHXH,
                                staffBHYT: staffBHYT,
                                staffBHTN: staffBHTN,
                                union: union,
                                personalTax: Math.round(personalTax),
                                personalTaxSalary: Math.round(personalTaxSalary),
                                reduce: reduce + 11000000,
                                totalReduce: totalReduce,
                                realField: realField,
                                productivityWages: data[i].nv ? data[i].nv.ProductivityWages ? data[i].nv.ProductivityWages : 0 : 0,
                            }
                            if (data[i].nv.Status == 'Lương và bảo hiểm' || data[i].nv.Status == 'Hưởng lương') {
                                totalRealField += realField;
                                totalBHXHSalary += bhxhSalary;
                                totalProductivityWages += (data[i].nv ? data[i].nv.ProductivityWages ? data[i].nv.ProductivityWages : 0 : 0);
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
                                    [Op.substring]: body.date
                                }
                            },
                        })
                        var result = {
                            objInsurance: objInsurance,
                            totalFooter: {
                                totalRealField: totalRealField,
                                totalBHXHSalary: totalBHXHSalary,
                                totalProductivityWages: totalProductivityWages,
                                totalStaffBHXH: totalStaffBHXH,
                                totalStaffBHYT: totalStaffBHYT,
                                totalStaffBHTN: totalStaffBHTN,
                                totalUnion: totalUnion,
                                totalPersonalTax: totalPersonalTax,
                                totalPersonalTaxSalary: totalPersonalTaxSalary,
                                totalAllReduce: totalAllReduce,
                                totelReduce: totelReduce,
                            },
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
                        include: [{
                            model: tblDMNhanvien,
                            required: false,
                            as: 'nv',
                            include: [{
                                model: mtblDMBoPhan(db),
                                required: false,
                                as: 'bp'
                            }, ],
                        }, ],
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: {
                            Date: {
                                [Op.substring]: body.date.slice(0, 4)
                            }
                        },
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
                            bhxhCTTotal += bhxhSalary * objInsurance['companyBHXH']
                            bhxhNVTotal += bhxhSalary * objInsurance['staffBHXH']
                            bhytCTTotal += bhxhSalary * objInsurance['companyBHYT']
                            bhytNVTotal += bhxhSalary * objInsurance['staffBHYT']
                            bhtnNVTotal += bhxhSalary * objInsurance['staffBHTN']
                            bhtnCTTotal += bhxhSalary * objInsurance['companyBHTN']
                            bhtnldTotal += bhxhSalary * objInsurance['staffBHTNLD']
                            let total = bhxhSalary * (objInsurance['companyBHXH'] + objInsurance['staffBHXH'] + objInsurance['companyBHYT'] + objInsurance['staffBHYT'] + objInsurance['staffBHTN'] + objInsurance['companyBHTN'] + objInsurance['staffBHTNLD'])
                            tongTotal += total
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
                                array.push(obj);
                                stt += 1;
                            }

                        }
                        var count = await mtblBangLuong(db).count({
                            where: {
                                Date: {
                                    [Op.substring]: body.date
                                }
                            },
                        })
                        var result = {
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
    dataTimekeeping: async(req, res) => {
        let body = req.body;
        let arrayData = [
            // 01 ----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-1 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-1 17:00:30",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-1 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-1 17:00:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -02 ----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-2 9:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-2 17:30:28",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-2 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-2 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -03----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-3 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-3 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-3 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-1-7 12:00:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -04----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-4 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-4 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-4 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-1-4 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -05----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-5 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-5 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-5 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-5 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -07----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-7 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-7 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-7 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-7 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -08----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-8 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-8 12:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-8 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-8 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -09----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-9 9:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-9 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-9 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-1-9 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -10----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-10 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-10 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-10 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-1-10 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -11----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-11 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-11 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-11 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-1-11 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -14----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-14 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-14 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-14 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-1-14 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -15----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-15 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-15 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-15 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-15 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -16----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-16 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-16 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-16 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-16 12:00:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -17----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-17 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-17 17:30:39",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-17 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-17 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -20----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-20 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-20 12:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-20 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-20 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -21----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-21 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-21 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-21 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-21 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -22----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-22 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-22 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-22 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-22 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },

            // -23----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-23 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-23 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-23 9:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-23 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -24----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-24 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-24 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-24 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-24 17:00:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -25----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-25 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-25 16:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-25 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-25 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -28----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-28 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-28 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-28 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-28 17:30:20",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            // -29----------------------------------------------------------------------------------------------------------------------------------
            {
                'User ID': 1,
                'Verify Date': "2021-4-29 8:00:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 1,
                'Verify Date': "2021-4-29 17:30:00",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            }, {
                'User ID': 2,
                'Verify Date': "2021-4-29 8:00:16",
                'Verify Type': 1,
                'Verify State': 1,
                'Work Code': 1
            },
            {
                'User ID': 2,
                'Verify Date': "2021-4-29 17:30:20",
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
                    var yearMonth = year + '-' + await convertNumber(month);
                    // lấy danh sách thứ 7 đi làm
                    var array7thDB = await take7thDataToWork(db, year, month);
                    var timeKeeping = await mtblChamCong(db).findOne({
                        where: [{
                            Date: {
                                [Op.substring]: '%' + yearMonth + '%'
                            }
                        }, ]
                    })
                    var arrayDays = [];
                    let checkFor = 0;
                    if (!timeKeeping) {
                        if (arrayUserID.length > 0) {
                            for (var i = 0; i < arrayUserID.length; i++) {
                                var arrayHoliday = await getListHoliday(db, month, year, dateFinal)
                                var staff = await mtblDMNhanvien(db).findOne({ where: { IDMayChamCong: arrayUserID[i] } })
                                if (staff) {
                                    var arrayLeaveDay = await getListleaveDate(db, month, year, staff.ID, dateFinal)
                                    var yearMonth = year + '-' + await convertNumber(month);
                                    for (var j = 1; j <= dateFinal; j++) {
                                        var datetConvert = mModules.toDatetimeDay(moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(j)).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
                                        let date = moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(j)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS')
                                        let staffID = staff ? staff.ID : null
                                        if (datetConvert.slice(0, 8) == 'Chủ nhật') {
                                            await createAttendanceData(db, staffID, date, null, 'Sunday', 'Nghỉ chủ nhật', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Sunday', 'Nghỉ chủ nhật', false, 0)
                                        } else if (datetConvert.slice(0, 5) == 'Thứ 7' && !checkDuplicate(array7thDB, j)) {
                                            await createAttendanceData(db, staffID, date, null, 'Saturday', 'Nghỉ thứ bảy', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Saturday', 'Nghỉ thứ bảy', false, 0)
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
                    } else {
                        if (arrayUserID.length > 0) {
                            for (var i = 0; i < arrayUserID.length; i++) {
                                var arrayHoliday = await getListHoliday(db, month, year, dateFinal)
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
                                            await createAttendanceData(db, staffID, date, null, 'Sunday', 'Nghỉ chủ nhật', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Sunday', 'Nghỉ chủ nhật', false, 0)
                                        } else if (datetConvert.slice(0, 5) == 'Thứ 7' && !checkDuplicate(array7thDB, j)) {
                                            await mtblChamCong(db).destroy({
                                                where: {
                                                    Date: date,
                                                    IDNhanVien: staffID
                                                }
                                            })
                                            await createAttendanceData(db, staffID, date, null, 'Saturday', 'Nghỉ thứ bảy', true, 0)
                                            await createAttendanceData(db, staffID, date, null, 'Saturday', 'Nghỉ thứ bảy', false, 0)
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
                    await mtblDMNhanvien(db).findAll({ where: whereobj }).then(async staff => {
                        yearMonth = year + '-' + await convertNumber(month);
                        var stt = 1;
                        for (var i = 0; i < staff.length; i++) {
                            let objWhere = {};
                            let arraySearchAnd = [];
                            let arraySearchOr = [];
                            let arraySearchNot = [];
                            if (body.date) {
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
                                            } else {
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
                    console.log(body.array);
                    for (var i = 0; i < body.array.length; i++) {
                        if (body.array[i].id) {
                            let reason = ''
                            let obj = {
                                Status: body.array[i].status,
                            }
                            if (body.array[i].status != 1) {
                                obj['Reason'] = reason
                            }
                            mtblChamCong(db).update(obj, {
                                where: {
                                    ID: body.array[i].id
                                }
                            })
                        }
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
                var arrayHoliday = await getListleaveDate(db, month, year, dateFinal)
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
                                {
                                    Date: {
                                        [Op.substring]: '%' + yearMonth + '%'
                                    }
                                },
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
    deleteAllTimekeeping: async(req, res) => {
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
    syntheticInformationMonthly: async(req, res) => {
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
                        include: [{
                            model: mtblDMBoPhan(db),
                            required: false,
                            as: 'department'
                        }, ],
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
                                        Status: 'Hoàn thành',
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
                                        Status: 'Hoàn thành',
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
                                        Status: 'Hoàn thành',
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