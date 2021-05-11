const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblVanPhongPham = require('../tables/qlnb/tblVanPhongPham')
var mThemVPPChiTiet = require('../tables/qlnb/ThemVPPChiTiet');
var mtblPhanPhoiVPP = require('../tables/qlnb/tblPhanPhoiVPP')
var mtblThemVPP = require('../tables/qlnb/tblThemVPP')
var mtblPhanPhoiVPPChiTiet = require('../tables/qlnb/tblPhanPhoiVPPChiTiet')
var mtblTaiSan = require('../tables/qlnb/tblTaiSan')
var mtblTaiSanADD = require('../tables/qlnb/tblTaiSanADD')
var mtblDMHangHoa = require('../tables/qlnb/tblDMHangHoa');
var mtblDMLoaiTaiSan = require('../tables/qlnb/tblDMLoaiTaiSan');
var database = require('../database');

async function getOpeningBalance(db, idVPP, dateFrom) {
    var result = 0;
    var array = [];
    await mtblThemVPP(db).findAll({
        where: { Date: { [Op.lte]: dateFrom } }
    }).then(data => {
        data.forEach(element => {
            array.push(element.ID);
        });
    })
    await mThemVPPChiTiet(db).findAll({
        where: {
            [Op.and]: [
                { IDVanPhongPham: idVPP },
                { IDThemVPP: { [Op.in]: array } }
            ]
        }
    }).then(detail => {
        detail.forEach(item => {
            result += item.Amount ? item.Amount : 0;
        })
    })
    await mtblPhanPhoiVPP(db).findAll({
        where: { Date: { [Op.lte]: dateFrom } }
    }).then(data => {
        data.forEach(element => {
            array.push(element.ID);
        });
    })
    await mtblPhanPhoiVPPChiTiet(db).findAll({
        where: {
            [Op.and]: [
                { IDVanPhongPham: idVPP },
                { IDPhanPhoiVPP: { [Op.in]: array } }
            ]
        }
    }).then(detail => {
        detail.forEach(item => {
            result -= item.Amount ? item.Amount : 0;
        })
    })
    return result;
}

async function getDuringBalance(db, idVPP, dateFrom, dateTo) {
    // dateFrom = moment(dateFrom).add(31, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
    dateTo = moment(dateTo).add(31, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
    console.log(28913471289423789892347892347891234789);
    console.log(dateFrom, dateTo);
    var result = 0;
    var array = [];
    await mtblThemVPP(db).findAll({
        where: { Date: { [Op.between]: [dateFrom, dateTo] } }
    }).then(data => {
        data.forEach(element => {
            array.push(element.ID);
        });
    })
    await mThemVPPChiTiet(db).findAll({
        where: {
            [Op.and]: [
                { IDVanPhongPham: idVPP },
                { IDThemVPP: { [Op.in]: array } }
            ]
        }
    }).then(detail => {
        detail.forEach(item => {
            result += item.Amount ? item.Amount : 0;
        })
    })
    return result;
}
async function getOutputPeriod(db, idVPP, dateFrom, dateTo) {
    // dateFrom = moment(dateFrom).add(31, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
    dateTo = moment(dateTo).add(31, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
    var result = 0;
    var array = [];
    await mtblPhanPhoiVPP(db).findAll({
        where: { Date: { [Op.between]: [dateFrom, dateTo] } }
    }).then(data => {
        data.forEach(element => {
            array.push(element.ID);
        });
    })
    await mtblPhanPhoiVPPChiTiet(db).findAll({
        where: {
            [Op.and]: [
                { IDVanPhongPham: idVPP },
                { IDPhanPhoiVPP: { [Op.in]: array } }
            ]
        }
    }).then(detail => {
        detail.forEach(item => {
            result += item.Amount ? item.Amount : 0;
        })
    })
    return result;
}

async function getInfoAssetFromIDTypeAsset(db, typeAssetID) {
    let arrayResult = []
    await mtblDMHangHoa(db).findAll({
        where: { IDDMLoaiTaiSan: typeAssetID }
    }).then(async goods => {
        let stt = 1;
        for (var g = 0; g < goods.length; g++) {
            let tblTaiSan = mtblTaiSan(db);
            tblTaiSan.belongsTo(mtblTaiSanADD(db), { foreignKey: 'IDTaiSanADD', sourceKey: 'IDTaiSanADD', as: 'asset' })
            await tblTaiSan.findAll({
                where: { IDDMHangHoa: goods[g].ID },
                include: [
                    {
                        model: mtblTaiSanADD(db),
                        required: false,
                        as: 'asset'
                    },
                ],
            }).then(async asset => {
                let objGoods = {}
                for (let s = 0; s < asset.length; s++) {
                    objGoods['stt'] = stt
                    objGoods['assetName'] = goods[g].Name ? goods[g].Name : ''
                    objGoods['assetCode'] = asset[s].TSNBCode ? asset[s].TSNBCode : ''
                    objGoods['date'] = asset[s].asset ? moment(asset[s].asset.Date).format('DD/MM/YYYY') : ''
                }
            })

            arrayResult.push(objGoods)
            stt += 1
        }
    })
}

module.exports = {
    // report
    report: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    mtblVanPhongPham(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            var openingBalance = 0;
                            var closingBalance = 0;
                            var duringBalance = 0;
                            var outputPeriod = 0;
                            if (body.dateFrom && body.dateTo) {
                                openingBalance = await getOpeningBalance(db, data[i].ID, body.dateFrom);
                                duringBalance = await getDuringBalance(db, data[i].ID, body.dateFrom, body.dateTo);
                                outputPeriod = await getOutputPeriod(db, data[i].ID, body.dateFrom, body.dateTo);
                                closingBalance = Number(openingBalance) + Number(duringBalance) - Number(outputPeriod);
                            }
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                vppCode: data[i].VPPCode ? data[i].VPPCode : '',
                                vppName: data[i].VPPName ? data[i].VPPName : '',
                                unit: data[i].Unit ? data[i].Unit : null,
                                openingBalance: openingBalance,
                                closingBalance: closingBalance,
                                duringBalance: duringBalance,
                                outputPeriod: outputPeriod,
                            }
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblVanPhongPham(db).count()
                        var result = {
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
    // depreciation table
    depreciationTable: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let array = [];
                    await mtblDMLoaiTaiSan(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async typeAsset => {
                        let stt = 1;
                        for (var detailAcsset = 0; detailAcsset < typeAsset.length; detailAcsset++) {
                            let obj = {}
                            obj['stt'] = stt
                            stt += 1
                        }
                    })
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
}