// job chạy 12h hàng ngày
var mtblHopDongNhanSu = require('./tables/hrmanage/tblHopDongNhanSu')
const Op = require('sequelize').Op;
var schedule = require('node-schedule');
var moment = require('moment');
var database = require('./database');
var mtblQuyetDinhTangLuong = require('./tables/hrmanage/tblQuyetDinhTangLuong')

module.exports = {
    editStatus24HourEveryday: (req, res) => {
        var job = schedule.scheduleJob({ hour: 23, minute: 59 }, async function () {
            let now = moment().add(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
            database.connectDatabase().then(async db => {
                try {
                    await mtblHopDongNhanSu(db).update({
                        Status: 'Hết hiệu lực'
                    }, {
                        where: {
                            ContractDateEnd: { [Op.lt]: now }
                        }
                    })
                    await mtblQuyetDinhTangLuong(db).update({
                        StatusDecision: 'Hết hiệu lực'
                    }, {
                        where: {
                            StopDate: { [Op.lt]: now }
                        }
                    })
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            })
        });
        console.log(job);
    }
}