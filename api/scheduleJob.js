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
const axios = require('axios');

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
                            IDMayChamCong: arrayData[dataTimeKp]['User ID']
                        })
                        if (staff) {
                            let checkMonth = moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M').format('YYYY-MM');
                            let checkTimekeeping = await mtblChamCong(db).findOne({
                                where: {
                                    Time: { [Op.like]: checkMonth }
                                }
                            })
                            if (!checkTimekeeping) {
                                let date = moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M-D h:m:s').format('DD')
                                let month = moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M-D h:m:s').format('MM')
                                let year = moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M-D h:m:s').format('YYYY')
                                await writeDataFromTimekeeperToDatabase(db, arrayData[dataTimeKp]['User ID'], arrayData, month, year, date, staff.ID);
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
                            IDMayChamCong: arrayData[dataTimeKp]['User ID']
                        })
                        if (staff) {
                            let checkMonth = moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M').format('YYYY-MM');
                            let checkTimekeeping = await mtblChamCong(db).findOne({
                                where: {
                                    Time: { [Op.like]: checkMonth }
                                }
                            })
                            if (!checkTimekeeping) {
                                let date = moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M-D h:m:s').format('DD')
                                let month = moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M-D h:m:s').format('MM')
                                let year = moment(arrayData[dataTimeKp]['Verify Date'], 'YYYY-M-D h:m:s').format('YYYY')
                                await writeDataFromTimekeeperToDatabase(db, arrayData[dataTimeKp]['User ID'], arrayData, month, year, date, staff.ID);
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