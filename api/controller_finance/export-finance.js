const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Sequelize = require('sequelize');

const Result = require('../constants/result');
var moment = require('moment');
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var fs = require('fs');
var xl = require('excel4node');
var database = require('../database');

async function getAverageVotesFromDepartment(departmentID) {
    let result = 0;
    let arrayStaffID = []
    await mtblDMNhanvien(db).findAll({
        where: {
            IDBoPhan: departmentID
        }
    }).then(data => {
        data.forEach(element => {
            arrayStaffID.push(element.ID)
        });
    })
    await mtblReceiptsPayment(db).findAll({
        where: {

        }
    })

}
let styleHearderTitle = {
    font: {
        // color: '#FF0800',
        size: 12,
        bold: true,
        name: 'Times New Roman',
    },
    alignment: {
        wrapText: true,
        // ngang
        horizontal: 'center',
    },
    border: {
        left: {
            style: 'thin',
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
    },
    // numberFormat: '$#,##0.00; ($#,##0.00); -',
}
let styleHearderText = {
    font: {
        // color: '#FF0800',
        size: 10,
        bold: true,
        name: 'Times New Roman',
    },
    alignment: {
        wrapText: true,
        horizontal: 'center',
    },
    border: {
        left: {
            style: 'thin',
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
    },
    // numberFormat: '$#,##0.00; ($#,##0.00); -',
}
let styleHearderNumber = {
    font: {
        // color: '#FF0800',
        size: 12,
        bold: true,
        name: 'Times New Roman',
    },
    numberFormat: '#,##0; (#,##0); 0',
    alignment: {
        wrapText: true,
        horizontal: 'right',
        vertical: 'center',
    },
    border: {
        left: {
            style: 'thin',
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
    },
}
let styleCellText = {
    font: {
        size: 8,
        bold: true,
        name: 'Times New Roman',
    },
    alignment: {
        wrapText: true,
        // ngang
        horizontal: 'center',
    },
    border: {
        left: {
            style: 'thin',
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
    },
}
let stylecellNumber = {
    font: {
        // color: '#FF0800',
        size: 12,
        bold: false,
        name: 'Times New Roman',
    },
    numberFormat: '#,##0; (#,##0); 0',
    alignment: {
        wrapText: true,
        // ngang
        horizontal: 'right',
        // Dọc
        vertical: 'center',
    },
    border: {
        left: {
            style: 'thin',
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
    },
}
let stylecellNumberSpecial = {
    font: {
        // color: '#FF0800',
        size: 12,
        bold: false,
        name: 'Times New Roman',
    },
    numberFormat: '#,##0.00; (#,##0.00); -',
    alignment: {
        wrapText: true,
        // ngang
        horizontal: 'right',
        // Dọc
        vertical: 'center',
    },
    border: {
        left: {
            style: 'thin',
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
    },
}
let stylePublic = {
    border: {
        left: {
            style: 'thin',
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
    },
}
module.exports = {
    // report_average_votes
    reportAverageVotes: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMBoPhan(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async department => {
                        for (let d = 0; d < department.length; d++) {
                            let receipt = await mtblReceiptsPayment(db).findAll({})
                        }
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
    // TỔNG HỢP DOANH THU SHTT
    // export_excel_report_aggregate_revenue
    exportExcelReportAggregateRevenue: (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        styleHearderText['fill'] = {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#CCFFFF',
            fgColor: '#CCFFFF',
        }
        var styleHearderT = wb.createStyle(styleHearderText);
        var styleHearderN = wb.createStyle(styleHearderNumber);
        var stylecellT = wb.createStyle(styleCellText);
        var stylecellN = wb.createStyle(stylecellNumber);
        let body = req.body;
        // let data = JSON.parse(body.data);
        // let objInsurance = JSON.parse(body.objInsurance);
        // let totalFooter = JSON.parse(body.totalFooter)
        let arrayHeader = [
            'STT',
            'NỘI DUNG',
            'THÁNG 01/2020',
            'THÁNG 02/2020',
            'THÁNG 03/2020',
            'THÁNG 04/2020',
            'THÁNG 05/2020',
            'THÁNG 06/2020',
        ]
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    ws.column(1).setWidth(5);
                    ws.row(1).setHeight(25);
                    ws.row(2).setHeight(25);
                    ws.row(3).setHeight(25);
                    ws.row(4).setHeight(25);
                    ws.cell(1, 1, 1, 6, true)
                        .string('TỔNG HỢP DOANH THU SHTT NĂM 2020')
                        .style(styleHearderTitle);
                    stylePublic['font'] = {
                        size: 11,
                        bold: true,
                        underline: true,
                        name: 'Times New Roman',
                    }
                    stylePublic['alignment'] = {
                        wrapText: true,
                        // ngang
                        // horizontal: 'center',
                        // Dọc
                        // vertical: 'center',
                    }
                    ws.cell(2, 1, 2, 6, true)
                        .string('DOANH THU TRÊN DEBINOTE')
                        .style(stylePublic);
                    var row = 1
                    for (let width = 2; width < 1000; width++) {
                        ws.column(width).setWidth(20);
                        // ws.row(width).setWidth(20);
                    }
                    for (let hd = 0; hd < arrayHeader.length; hd++) {
                        if (hd < 2) {
                            ws.cell(3, row)
                                .string(arrayHeader[hd])
                                .style(styleHearderT);
                            styleCellText['fill'] = {
                                type: 'pattern',
                                patternType: 'solid',
                                bgColor: '#FFFF99',
                                fgColor: '#FFFF99',
                            }
                            let style = wb.createStyle(styleCellText)
                            ws.cell(4, row)
                                .number(hd + 1)
                                .style(style);
                            row += 1
                        } else {
                            ws.cell(3, row, 3, row + 3, true)
                                .string(arrayHeader[hd])
                                .style(styleHearderT);
                            styleCellText['fill'] = {
                                type: 'pattern',
                                patternType: 'solid',
                                bgColor: '#FFC000',
                                fgColor: '#FFC000',
                            }
                            let style1 = wb.createStyle(styleCellText)
                            ws.cell(4, row)
                                .string(arrayHeader[hd])
                                .style(style1);
                            styleCellText['fill'] = {
                                type: 'pattern',
                                patternType: 'solid',
                                bgColor: '#92D050',
                                fgColor: '#92D050',
                            }
                            let style2 = wb.createStyle(styleCellText)
                            ws.cell(4, row + 1)
                                .string(arrayHeader[hd])
                                .style(style2);
                            styleCellText['fill'] = {
                                type: 'pattern',
                                patternType: 'solid',
                                bgColor: '#FFFF99',
                                fgColor: '#FFFF99',
                            }
                            let style3 = wb.createStyle(styleCellText)
                            ws.cell(4, row + 2)
                                .string('CHÊNH LỆCH')
                                .style(style3);
                            ws.cell(4, row + 3)
                                .string('TỈ LỆ (%)')
                                .style(style3);
                            row += 4
                        }
                    }
                    ws.column(2).setWidth(30);
                    await wb.write('D:/images_services/ageless_sendmail/' + 'test.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + 'test.xlsx',
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        res.json(result);
                    }, 500);

                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // DOANH THU TRÊN TIỀN VỀ
    // export_excel_report_money_revenue
    exportExcelReportMoneyRevenue: (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        styleHearderText['alignment'] = {
            wrapText: true,
            horizontal: 'center',
            // Dọc
            vertical: 'center',
        }
        var styleHearderT = wb.createStyle(styleHearderText);
        var styleHearderN = wb.createStyle(styleHearderNumber);
        var stylecellT = wb.createStyle(styleCellText);
        var stylecellN = wb.createStyle(stylecellNumber);
        let body = req.body;
        // let data = JSON.parse(body.data);
        // let objInsurance = JSON.parse(body.objInsurance);
        // let totalFooter = JSON.parse(body.totalFooter)
        let arrayHeader = [
            'STT',
            'NỘI DUNG',
            'THÁNG 01/2020',
            'THÁNG 02/2020',
            'THÁNG 03/2020',
            'THÁNG 04/2020',
            'THÁNG 05/2020',
            'THÁNG 06/2020',
        ]
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    ws.column(1).setWidth(5);
                    ws.row(1).setHeight(25);
                    ws.row(2).setHeight(25);
                    ws.row(3).setHeight(25);
                    ws.row(4).setHeight(25);
                    ws.cell(1, 1, 1, 6, true)
                        .string('DOANH THU TRÊN TIỀN VỀ')
                        .style(styleHearderTitle);
                    var row = 1
                    for (let width = 2; width < 1000; width++) {
                        ws.column(width).setWidth(20);
                    }
                    for (let hd = 0; hd < arrayHeader.length; hd++) {
                        if (hd < 2) {
                            ws.cell(3, row, 4, row, true)
                                .string(arrayHeader[hd])
                                .style(styleHearderT);
                            row += 1
                        } else {
                            if (hd % 2 == 0) {
                                styleHearderText['fill'] = {
                                    type: 'pattern',
                                    patternType: 'solid',
                                    bgColor: '#FFC000',
                                    fgColor: '#FFC000',
                                }
                                styleHearderT = wb.createStyle(styleHearderText);
                                styleCellText['fill'] = {
                                    type: 'pattern',
                                    patternType: 'solid',
                                    bgColor: '#FFC000',
                                    fgColor: '#FFC000',
                                }
                                ws.cell(3, row, 3, row + 1, true)
                                    .string(arrayHeader[hd])
                                    .style(styleHearderT);
                                let style = wb.createStyle(styleCellText)
                                ws.cell(4, row)
                                    .string('USD')
                                    .style(style);
                                ws.cell(4, row + 1)
                                    .string('VND')
                                    .style(style);
                            } else {
                                styleHearderText['fill'] = {
                                    type: 'pattern',
                                    patternType: 'solid',
                                    bgColor: '#92D050',
                                    fgColor: '#92D050',
                                }
                                styleCellText['fill'] = {
                                    type: 'pattern',
                                    patternType: 'solid',
                                    bgColor: '#92D050',
                                    fgColor: '#92D050',
                                }
                                styleHearderT = wb.createStyle(styleHearderText);
                                ws.cell(3, row, 3, row + 1, true)
                                    .string(arrayHeader[hd])
                                    .style(styleHearderT);
                                let style = wb.createStyle(styleCellText)
                                ws.cell(4, row)
                                    .string('USD')
                                    .style(style);
                                ws.cell(4, row + 1)
                                    .string('VND')
                                    .style(style);
                            }
                            row += 2
                        }
                    }
                    ws.column(2).setWidth(30);
                    await wb.write('D:/images_services/ageless_sendmail/' + 'Doanh thu tiền về.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + 'Doanh thu tiền về.xlsx',
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        res.json(result);
                    }, 500);

                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // DOANH THU BÌNH QUÂN THÁNG CỦA CÁC BAN HOẶC CẢ CÔNG TY THEO NĂM
    // export_excel_report_average_monthly_revenue_by_year
    exportExcelReportAverageMonthlyRevenueByYear: (req, res) => {

        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var XlsxTemplate = require('xlsx-template');

                    // Load an XLSX file into memory
                    fs.readFile(('D:/images_services/ageless_sendmail/template-average-monthly-revenue-by-year.xlsx'), function (err, data) {

                        // Create a template
                        var template = new XlsxTemplate(data);

                        // Replacements take place on first sheet
                        var sheetNumber = 1;

                        // Set up some placeholder values matching the placeholders in the template
                        var values = {
                            extractDate: new Date(),
                            dates: [new Date("2013-06-01"), new Date("2013-06-02"), new Date("2013-06-03")],
                            people: [
                                { name: "John Smith", age: 20 },
                                { name: "Bob Johnson", age: 22 }
                            ]
                        };

                        // Perform substitution
                        template.substitute(sheetNumber, values);

                        // Get binary data
                        var data = template.generate();
                        fs.writeFileSync('D:/images_services/ageless_sendmail/Doanh thu bình quân tháng của các ban theo năm.xlsx', data, 'binary')
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