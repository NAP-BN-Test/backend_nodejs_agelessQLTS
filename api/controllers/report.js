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

async function getDetailAsset(db, idGoods, goodsName, year) {
    let arrayResult = []
    let tblTaiSan = mtblTaiSan(db);
    tblTaiSan.belongsTo(mtblTaiSanADD(db), { foreignKey: 'IDTaiSanADD', sourceKey: 'IDTaiSanADD', as: 'asset' })
    await tblTaiSan.findAll({
        where: {
            IDDMHangHoa: idGoods,
            depreciationDate: { [Op.ne]: null }
        },
        include: [
            {
                model: mtblTaiSanADD(db),
                required: false,
                as: 'asset'
            },
        ],
    }).then(async asset => {
        let stt = 1;
        for (let s = 0; s < asset.length; s++) {
            let objGoods = {}
            let originalPrice = asset[s].DepreciationPrice ? asset[s].DepreciationPrice : 0
            let accumulatedDepreciation = 0
            let accumulatedDepreciationEndYear = 0
            let time = asset[s].GuaranteeMonth ? asset[s].GuaranteeMonth : 0
            let totalAnnualDepreciation = (time == 0 ? 0 : (originalPrice / time)) * 12
            totalAnnualDepreciation = Math.round(totalAnnualDepreciation)
            let valueDiscount = time == 0 ? 0 : (originalPrice / time)
            valueDiscount = Math.round(valueDiscount)
            let yearAsset = asset[s].DepreciationDate ? moment(asset[s].DepreciationDate).format('YYYY') : 0
            let yearEndResidualValue = 0
            if (yearAsset < year && yearAsset != 0) {
                for (let y = (Number(yearAsset)); y < year; y++) {
                    accumulatedDepreciationEndYear = accumulatedDepreciation + totalAnnualDepreciation
                    accumulatedDepreciation = accumulatedDepreciationEndYear
                    yearEndResidualValue = originalPrice - accumulatedDepreciationEndYear
                    if ((originalPrice - accumulatedDepreciationEndYear) <= 0) {
                        accumulatedDepreciation = 0
                        accumulatedDepreciationEndYear = 0
                        valueDiscount = 0
                        totalAnnualDepreciation = 0
                        yearEndResidualValue = 0
                        break
                    }
                }
            }
            accumulatedDepreciationEndYear = totalAnnualDepreciation + accumulatedDepreciation
            objGoods['stt'] = stt
            objGoods['assetName'] = goodsName
            objGoods['assetCode'] = asset[s].TSNBCode ? asset[s].TSNBCode : ''
            objGoods['date'] = asset[s].asset ? moment(asset[s].asset.Date).format('DD/MM/YYYY') : ''
            objGoods['originalPrice'] = originalPrice
            objGoods['time'] = time
            objGoods['accumulatedDepreciation'] = accumulatedDepreciation // lũy kế đầu năm,
            objGoods['residualValue'] = originalPrice - accumulatedDepreciation // giá trị còn lại đầu năm,
            objGoods['discountedValue1'] = valueDiscount
            objGoods['discountedValue2'] = valueDiscount
            objGoods['discountedValue3'] = valueDiscount
            objGoods['discountedValue4'] = valueDiscount
            objGoods['discountedValue5'] = valueDiscount
            objGoods['discountedValue6'] = valueDiscount
            objGoods['discountedValue7'] = valueDiscount
            objGoods['discountedValue8'] = valueDiscount
            objGoods['discountedValue9'] = valueDiscount
            objGoods['discountedValue10'] = valueDiscount
            objGoods['discountedValue11'] = valueDiscount
            objGoods['discountedValue12'] = valueDiscount
            objGoods['totalAnnualDepreciation'] = totalAnnualDepreciation
            objGoods['accumulatedDepreciationEndYear'] = accumulatedDepreciationEndYear
            objGoods['yearEndResidualValue'] = yearEndResidualValue
            objGoods['isTypeAsset'] = false
            arrayResult.push(objGoods)
            stt += 1
        }
    })
    return arrayResult
}

async function getInfoAssetFromIDTypeAsset(db, typeAssetID, year) {
    let arrayResult = []
    await mtblDMHangHoa(db).findAll({
        where: { IDDMLoaiTaiSan: typeAssetID }
    }).then(async goods => {
        for (var g = 0; g < goods.length; g++) {
            let arrayAsset = await getDetailAsset(db, goods[g].ID, goods[g].Name, year)
            Array.prototype.push.apply(arrayResult, arrayAsset);
        }

    })
    return arrayResult
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
    // depreciation_table
    depreciationTable: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblDMLoaiTaiSan(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async typeAsset => {
                        let array = [];
                        let objTotal = {}
                        let originalPriceTotal = 0
                        let accumulatedDepreciationTotal = 0
                        let timeTotal = 0
                        let residualValueTotal = 0
                        let discountedValue1Total = 0
                        let discountedValue2Total = 0
                        let discountedValue3Total = 0
                        let discountedValue4Total = 0
                        let discountedValue5Total = 0
                        let discountedValue6Total = 0
                        let discountedValue7Total = 0
                        let discountedValue8Total = 0
                        let discountedValue9Total = 0
                        let discountedValue10Total = 0
                        let discountedValue11Total = 0
                        let discountedValue12Total = 0
                        let totalAnnualDepreciationTotal = 0
                        let accumulatedDepreciationEndYearTotal = 0
                        let yearEndResidualValueTotal = 0
                        for (var detailAcsset = 0; detailAcsset < typeAsset.length; detailAcsset++) {
                            let arrayAsset = await getInfoAssetFromIDTypeAsset(db, typeAsset[detailAcsset].ID, body.year)
                            if (arrayAsset.length > 0) {
                                let obj = {}
                                let totalOriginalPrice = 0
                                let totalTime = 0
                                let totalAccumulatedDepreciation = 0
                                let totalResidualValue = 0
                                let totalDiscountedValue1 = 0
                                let totalDiscountedValue2 = 0
                                let totalDiscountedValue3 = 0
                                let totalDiscountedValue4 = 0
                                let totalDiscountedValue5 = 0
                                let totalDiscountedValue6 = 0
                                let totalDiscountedValue7 = 0
                                let totalDiscountedValue8 = 0
                                let totalDiscountedValue9 = 0
                                let totalDiscountedValue10 = 0
                                let totalDiscountedValue11 = 0
                                let totalDiscountedValue12 = 0
                                let totalAnnualDepreciation = 0
                                let totalAccumulatedDepreciationEndYear = 0
                                let totalyearEndResidualValue = 0

                                for (let asset = 0; asset < arrayAsset.length; asset++) {
                                    totalOriginalPrice += arrayAsset[asset].originalPrice
                                    totalTime += arrayAsset[asset].time
                                    totalAccumulatedDepreciation += arrayAsset[asset].accumulatedDepreciation
                                    totalResidualValue += arrayAsset[asset].residualValue
                                    totalDiscountedValue1 += arrayAsset[asset].discountedValue1
                                    totalDiscountedValue2 += arrayAsset[asset].discountedValue2
                                    totalDiscountedValue3 += arrayAsset[asset].discountedValue3
                                    totalDiscountedValue4 += arrayAsset[asset].discountedValue4
                                    totalDiscountedValue5 += arrayAsset[asset].discountedValue5
                                    totalDiscountedValue6 += arrayAsset[asset].discountedValue6
                                    totalDiscountedValue7 += arrayAsset[asset].discountedValue7
                                    totalDiscountedValue8 += arrayAsset[asset].discountedValue8
                                    totalDiscountedValue9 += arrayAsset[asset].discountedValue9
                                    totalDiscountedValue10 += arrayAsset[asset].discountedValue10
                                    totalDiscountedValue11 += arrayAsset[asset].discountedValue11
                                    totalDiscountedValue12 += arrayAsset[asset].discountedValue12
                                    totalAnnualDepreciation += arrayAsset[asset].totalAnnualDepreciation
                                    totalAccumulatedDepreciationEndYear += arrayAsset[asset].accumulatedDepreciationEndYear
                                    totalyearEndResidualValue += arrayAsset[asset].yearEndResidualValue
                                }
                                obj['assetName'] = typeAsset[detailAcsset].Name
                                obj['assetCode'] = typeAsset[detailAcsset].Code
                                obj['originalPrice'] = totalOriginalPrice
                                obj['time'] = totalTime
                                obj['accumulatedDepreciation'] = totalAccumulatedDepreciation
                                obj['residualValue'] = totalResidualValue
                                obj['discountedValue1'] = totalDiscountedValue1
                                obj['discountedValue2'] = totalDiscountedValue2
                                obj['discountedValue3'] = totalDiscountedValue3
                                obj['discountedValue4'] = totalDiscountedValue4
                                obj['discountedValue5'] = totalDiscountedValue5
                                obj['discountedValue6'] = totalDiscountedValue6
                                obj['discountedValue7'] = totalDiscountedValue7
                                obj['discountedValue8'] = totalDiscountedValue8
                                obj['discountedValue9'] = totalDiscountedValue9
                                obj['discountedValue10'] = totalDiscountedValue10
                                obj['discountedValue11'] = totalDiscountedValue11
                                obj['discountedValue12'] = totalDiscountedValue12
                                obj['totalAnnualDepreciation'] = totalAnnualDepreciation
                                obj['accumulatedDepreciationEndYear'] = totalAccumulatedDepreciationEndYear
                                obj['yearEndResidualValue'] = totalyearEndResidualValue
                                obj['isTypeAsset'] = true
                                arrayAsset.unshift(obj)

                                // Tình tổng cộng
                                originalPriceTotal += totalOriginalPrice
                                timeTotal += totalTime
                                residualValueTotal += totalResidualValue
                                accumulatedDepreciationTotal += totalAccumulatedDepreciation
                                discountedValue1Total += totalDiscountedValue1
                                discountedValue2Total += totalDiscountedValue2
                                discountedValue3Total += totalDiscountedValue3
                                discountedValue4Total += totalDiscountedValue4
                                discountedValue5Total += totalDiscountedValue5
                                discountedValue6Total += totalDiscountedValue6
                                discountedValue7Total += totalDiscountedValue7
                                discountedValue8Total += totalDiscountedValue8
                                discountedValue9Total += totalDiscountedValue9
                                discountedValue10Total += totalDiscountedValue10
                                discountedValue11Total += totalDiscountedValue11
                                discountedValue12Total += totalDiscountedValue12
                                totalAnnualDepreciationTotal += totalAnnualDepreciation
                                accumulatedDepreciationEndYearTotal += totalAccumulatedDepreciationEndYear
                                yearEndResidualValueTotal += totalyearEndResidualValue
                                Array.prototype.push.apply(array, arrayAsset);
                            }

                        }
                        console.log(accumulatedDepreciationTotal, originalPriceTotal);
                        objTotal['originalPriceTotal'] = originalPriceTotal
                        objTotal['timeTotal'] = timeTotal
                        objTotal['residualValueTotal'] = residualValueTotal
                        objTotal['accumulatedDepreciationTotal'] = accumulatedDepreciationTotal
                        objTotal['discountedValue1Total'] = discountedValue1Total
                        objTotal['discountedValue2Total'] = discountedValue2Total
                        objTotal['discountedValue3Total'] = discountedValue3Total
                        objTotal['discountedValue4Total'] = discountedValue4Total
                        objTotal['discountedValue5Total'] = discountedValue5Total
                        objTotal['discountedValue6Total'] = discountedValue6Total
                        objTotal['discountedValue7Total'] = discountedValue7Total
                        objTotal['discountedValue8Total'] = discountedValue8Total
                        objTotal['discountedValue9Total'] = discountedValue9Total
                        objTotal['discountedValue10Total'] = discountedValue10Total
                        objTotal['discountedValue11Total'] = discountedValue11Total
                        objTotal['discountedValue12Total'] = discountedValue12Total
                        objTotal['totalAnnualDepreciationTotal'] = totalAnnualDepreciationTotal
                        objTotal['accumulatedDepreciationEndYearTotal'] = accumulatedDepreciationEndYearTotal
                        objTotal['yearEndResidualValueTotal'] = yearEndResidualValueTotal
                        var result = {
                            total: objTotal,
                            array: array,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
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
}