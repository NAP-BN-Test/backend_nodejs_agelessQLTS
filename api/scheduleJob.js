// job chạy 12h hàng ngày
var mtblHopDongNhanSu = require('./tables/hrmanage/tblHopDongNhanSu')
const Op = require('sequelize').Op;
var schedule = require('node-schedule');
var moment = require('moment');
var database = require('./database');
var mtblQuyetDinhTangLuong = require('./tables/hrmanage/tblQuyetDinhTangLuong')
let ctlTimeAttendanceSummary = require('./controllers_hr/ctl-tblBangLuong')
var mtblCurrency = require('./tables/financemanage/tblCurrency')
var mtblRate = require('./tables/financemanage/tblRate')
var mtblNghiPhep = require('./tables/hrmanage/tblNghiPhep')
var mtblDateOfLeave = require('./tables/hrmanage/tblDateOfLeave')
var mtblChamCong = require('./tables/hrmanage/tblChamCong')

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
async function convertNumber(number) {
    if (number < 10) {
        return '0' + number
    } else
        return number
}
var mtblNghiLe = require('./tables/hrmanage/tblNghiLe')
var mtblConfigWorkday = require('./tables/hrmanage/tblConfigWorkday')
var mtblLoaiChamCong = require('./tables/hrmanage/tblLoaiChamCong')

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
const axios = require('axios');
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
async function getListleaveDate(db, month, year, staffID, dateFinal) {
    let objResult = {}
    var array = [];
    var arrayObj = [];
    let listID = []
    let arrayRegimeLeave = [];
    let arrayO = [];
    let arrayKL = [];
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
                if (signObj && signObj.Code == 'O' || signObj.Code == 'CT' || signObj.Code == 'TS' || signObj.Code == 'CÐ') {
                    arrayRegimeLeave.push(signObj.Code)
                }
                if (signObj && signObj.Code == 'O') {
                    arrayO.push(signObj.Code)
                }
                if (signObj && signObj.Code == 'KL') {
                    arrayKL.push(signObj.Code)
                }
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
        arrayRegimeLeave: arrayRegimeLeave,
        arrayKL: arrayKL,
        arrayO: arrayO,
    }
    return objResult
}
function checkDuplicate(array, elm) {
    var check = false;
    array.forEach(item => {
        if (item === elm) check = true;
    })
    return check;
}
async function createDataTimeKeeping(db, year, month, date, staffID, IDMayChamCong, arrayData) {
    var dateFi = new Date(year, month, 0);
    var dateFinal = Number(dateFi.toISOString().slice(8, 10))
    dateFinal += 1
    var arrayHoliday = await getListHoliday(db, year, month, dateFinal)
    var array7thDB = await take7thDataToWork(db, year, month);
    var datetConvert = mModules.toDatetimeDay(moment(year + '-' + await convertNumber(month) + '-' + await convertNumber(date)).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS'))
    let dateMonth = moment(year + '/' + await convertNumber(month) + ' / ' + await convertNumber(date)).add(7, 'hours').format('YYYY/MM/DD HH:MM:SS')
    if (datetConvert.slice(0, 8) == 'Chủ nhật') {
        await createAttendanceData(db, staffID, dateMonth, null, 'Sun', 'Nghỉ chủ nhật', true, 0)
        await createAttendanceData(db, staffID, dateMonth, null, 'Sun', 'Nghỉ chủ nhật', false, 0)
    } else if (datetConvert.slice(0, 5) == 'Thứ 7' && !checkDuplicate(array7thDB, date)) {
        await createAttendanceData(db, staffID, dateMonth, null, 'Sat', 'Nghỉ thứ bảy', true, 0)
        await createAttendanceData(db, staffID, dateMonth, null, 'Sat', 'Nghỉ thứ bảy', false, 0)
    } else if (checkDuplicate(arrayHoliday, date)) {
        await createAttendanceData(db, staffID, dateMonth, null, 'Holiday', 'Nghỉ lễ', true, 0)
        await createAttendanceData(db, staffID, dateMonth, null, 'Holiday', 'Nghỉ lễ', false, 0)
    } else {
        var arrayLeaveDay = await getListleaveDate(db, month, year, staffID, dateFinal)
        // check xem có trong ngày nghỉ phép không ?
        if (checkDuplicate(arrayLeaveDay.array, date)) {
            for (let i = 0; i < arrayLeaveDay.arrayObj.length; i++) {
                if (arrayLeaveDay.arrayObj[i].date == date) {
                    await createAttendanceData(db, staffID, dateMonth, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', false, 0)
                    await createAttendanceData(db, staffID, dateMonth, null, arrayLeaveDay.arrayObj[i].sign, 'Nghỉ phép', true, 0)
                }
            }
        } else {
            await writeDataFromTimekeeperToDatabase(db, IDMayChamCong, arrayData, month, year, date, staffID)
        }
    }
}
module.exports = {
    editStatus24HourEveryday: async (req, res) => {
        database.connectDatabase().then(async db => {
            try {
                let now = moment().add(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
                let nowLeave = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                let leave = await mtblNghiPhep(db).findAll({
                    where: {
                        Type: 'SignUp',
                        Status: { [Op.ne]: 'Hoàn thành' },
                    }
                })
                for (let l = 0; l < leave.length; l++) {
                    let tblDateOfLeave = mtblDateOfLeave(db);
                    await tblDateOfLeave.findAll({
                        where: [
                            { LeaveID: leave[l].ID },
                        ],
                    }).then(async date => {
                        let check = false;
                        for (let d = 0; d < date.length; d++) {
                            if (moment(date[d].DateEnd).add(17, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS') <= nowLeave)
                                check = true
                        }
                        if (check) {
                            await mtblNghiPhep(db).update({
                                Status: 'Từ chối',
                            }, { where: { ID: leave[l].ID } })
                        }
                    })
                }

                var job = schedule.scheduleJob({ hour: 23, minute: 59 }, async function () {
                    let arrayData = [];
                    await axios.get(`http://192.168.23.16:1333/dulieuchamcong/index`).then(data => {
                        if (data.length > 0)
                            arrayData = JSON.parse(data)
                    })
                    for (let dataTimeKp = 0; dataTimeKp < arrayData.length; dataTimeKp++) {
                        let staff = await mtblDMNhanvien(db).findOne({
                            where: { IDMayChamCong: arrayData[dataTimeKp]['User ID'] }
                        })
                        if (staff) {
                            let checkMonth = await moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M-D').format('YYYY-MM-DD');
                            let checkTimekeeping = await mtblChamCong(db).findOne({
                                where: {
                                    Date: {
                                        [Op.substring]: checkMonth
                                    },
                                    IDNhanVien: staff.ID,
                                }
                            })
                            if (!checkTimekeeping) {
                                let date = moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M-D h:m:s').format('DD')
                                let month = moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M-D h:m:s').format('MM')
                                let year = moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M-D h:m:s').format('YYYY')
                                await createDataTimeKeeping(db, year, month, date, staff.ID, arrayData[dataTimeKp]['User ID'], arrayData);
                            }
                        }
                    }
                    await ctlTimeAttendanceSummary.createTimeAttendanceSummary()
                    await mtblHopDongNhanSu(db).update({
                        Status: 'Hết hiệu lực'
                    }, {
                        where: {
                            ContractDateEnd: {
                                [Op.lt]: now
                            }
                        }
                    })
                    await mtblQuyetDinhTangLuong(db).update({
                        StatusDecision: 'Hết hiệu lực'
                    }, {
                        where: {
                            StopDate: {
                                [Op.lt]: now
                            }
                        }
                    })
                    now = moment().add(21, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
                    await mtblCurrency(db).findAll().then(async data => {
                        for (let i = 0; i < data.length; i++) {
                            let rate = await mtblRate(db).findOne({
                                where: {
                                    IDCurrency: data[i].ID,
                                },
                                order: [
                                    ['ID', 'DESC']
                                ],
                            })
                            await mtblRate(db).create({
                                Date: now,
                                ExchangeRate: rate ? (rate.ExchangeRate ? rate.ExchangeRate : 1) : 1,
                                IDCurrency: data[i].ID,
                            })
                        }
                    })
                });
                schedule.scheduleJob({ hour: 11, minute: 59 }, async function () {
                    let arrayData = [];
                    await axios.get(`http://192.168.23.16:1333/dulieuchamcong/index`).then(data => {
                        if (data.length > 0)
                            arrayData = JSON.parse(data)
                    })
                    for (let dataTimeKp = 0; dataTimeKp < arrayData.length; dataTimeKp++) {
                        let staff = await mtblDMNhanvien(db).findOne({
                            where: { IDMayChamCong: arrayData[dataTimeKp]['User ID'] }
                        })
                        if (staff) {
                            let checkMonth = await moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M-D').format('YYYY-MM-DD');
                            let checkTimekeeping = await mtblChamCong(db).findOne({
                                where: {
                                    Date: {
                                        [Op.substring]: checkMonth
                                    },
                                    IDNhanVien: staff.ID,
                                }
                            })
                            if (!checkTimekeeping) {
                                let date = moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M-D h:m:s').format('DD')
                                let month = moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M-D h:m:s').format('MM')
                                let year = moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M-D h:m:s').format('YYYY')
                                await createDataTimeKeeping(db, year, month, date, staff.ID, arrayData[dataTimeKp]['User ID'], arrayData);
                            }
                        }
                    }
                })
                console.log(job);
            } catch (error) {
                console.log(error);
                res.json(Result.SYS_ERROR_RESULT)
            }
        })

    }
}