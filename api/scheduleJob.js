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
                console.log(job);
            } catch (error) {
                console.log(error);
                res.json(Result.SYS_ERROR_RESULT)
            }
        })

    }
}