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

module.exports = {
    editStatus24HourEveryday: async (req, res) => {
        database.connectDatabase().then(async db => {
            try {
                let now = moment().add(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
                let nowLeave = moment().subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
                let leave = await mtblNghiPhep(db).findAll({
                    where: {
                        Type: 'SignUp'
                    }
                })
                for (let l = 0; l < leave.length; l++) {
                    let tblDateOfLeave = mtblDateOfLeave(db);
                    await tblDateOfLeave.findAll({
                        where: [
                            { LeaveID: leave[l].ID },
                            {
                                DateEnd: {
                                    [Op.lte]: nowLeave
                                },
                            }],
                    }).then(async date => {
                        if (date) {
                            await mtblNghiPhep(db).update({
                                Status: 'Từ chối',
                            }, { where: { ID: leave[l].ID } })
                        }
                    })
                }

                var job = schedule.scheduleJob({ hour: 23, minute: 59 }, async function () {
                    await ctlTimeAttendanceSummary.createTimeAttendanceSummary()

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
                                ExchangeRate: rate.ExchangeRate,
                                IDCurrency: data[i].ID,
                            })
                        }
                    })
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
                    await mtblCurrency(db).findAll().then(async data => {
                        for (let i = 0; i < data.length; i++) {
                            let rate = await mtblRate(db).findAll({
                                IDCurrency: data[i].ID,
                                order: [
                                    ['ID', 'DESC']
                                ],
                            })
                            await mtblRate(db).create({
                                Date: now,
                                ExchangeRate: rate.ExchangeRate,
                                IDCurrency: data[i].ID,
                            })
                        }
                    })
                });
                console.log(job);
            } catch (error) {
                console.log(error);
                res.json(Result.SYS_ERROR_RESULT)
            }
        })

    }
}