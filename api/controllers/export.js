var docxConverter = require('docx-pdf');
const Constant = require('../constants/constant');
const Result = require('../constants/result');

// Require library
var xl = require('excel4node');

// Create a new instance of a Workbook class
var database = require('../database');
var fs = require('fs');
const PDFNetEndpoint = (main, pathname, res) => {
    PDFNet.runWithCleanup(main)
        .then(() => {
            PDFNet.shutdown();
            fs.readFile(pathname, (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.end(`Error getting the file: ${err}.`);
                } else {
                    fs.writeFileSync(pathname, data);
                }
            });
        })
        .catch((error) => {
            res.statusCode = 500;
            console.log(error);
        });
};
const { PDFNet } = require('@pdftron/pdfnet-node');
var fs = require("fs")
const path = require('path');
const unoconv = require('awesome-unoconv');
const libre = require('libreoffice-convert-win');
module.exports = {
    // convert_docx_to_pdf
    convertDocxToPDF: (req, res) => {
        let body = req.body;
        try {
            // var pathlink = 'D:/images_services/ageless_sendmail/002.docx'
            var pathlink = 'D:/images_services/ageless_sendmail/' + body.link.slice(44, 100);
            const extend = '.pdf'
            var pathEx = 'D:/images_services/ageless_sendmail/export_pdf_file.pdf'
            const file = fs.readFileSync(pathlink);
            // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
            libre.convert(file, extend, undefined, (err, done) => {
                if (err) {
                    console.log(`Error converting file: ${err}`);
                }
                // Here in done you have pdf file which you can save or transfer in another stream
                fs.writeFileSync(pathEx, done);
                var result = {
                    link: 'http://118.27.192.106:1357/ageless_sendmail/export_pdf_file.pdf',
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                }
                res.json(result);
            });
            // const main = async () => {
            //     const pdfdoc = await PDFNet.PDFDoc.create();
            //     await pdfdoc.initSecurityHandler();
            //     await PDFNet.Convert.toPdf(pdfdoc, path);
            //     // const page = await doc.pageCreate();
            //     // doc.pagePushBack(page);
            //     pdfdoc.save(
            //         'D:/images_services/ageless_sendmail/export-file-pdf.pdf',
            //         PDFNet.SDFDoc.SaveOptions.e_linearized,
            //     );
            // };
            // // add your own license key as the second parameter, e.g. PDFNet.runWithCleanup(main, 'YOUR_LICENSE_KEY')
            // // PDFNet.runWithCleanup(main).catch(function (error) {
            // //     console.log('Error: ' + JSON.stringify(error));
            // // }).then(function () { PDFNet.shutdown(); });
            // PDFNetEndpoint(main, 'D:/images_services/ageless_sendmail/export-file-pdf.pdf', res);

        } catch (error) {
            console.log(error);
            res.json(Result.SYS_ERROR_RESULT)
        }

    },
    // export_to_file_excel
    exportToFileExcel: (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        var styleHearder = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 14,
                bold: true,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecell = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        let body = req.body;
        let data = JSON.parse(body.data);
        let arrayHeader = [
            'STT',
            'LOẠI YÊU CẦU',
            'NHÂN VIÊN',
            'NGÀY ĐỀ XUẤT',
            'MÃ TS/TB/LK',
            'TÊN TS/TB/LK',
            'ĐƠN GIÁ',
            'SỐ LƯỢNG',
            'TỔNG TIỀN',
            'IMPORT BÁO GIÁ',
            'LÝ DO MUA',
            'TRẠNG THÁI'
        ]
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    var row = 1
                    ws.column(row).setWidth(5);
                    arrayHeader.forEach(element => {
                        ws.cell(1, row)
                            .string(element)
                            .style(styleHearder);
                        row += 1
                        ws.column(row).setWidth(20);
                    });
                    var row = 0;
                    var checkMaxRow = 1;
                    for (let i = 0; i < data.length; i++) {
                        data[i].arrayTaiSanExport = JSON.parse(data[i].arrayTaiSanExport)
                        data[i].arrayFileExport = JSON.parse(data[i].arrayFileExport)
                        var max = 0;
                        if (i > 0)
                            row = checkMaxRow + 1
                        else
                            row = i + 2
                        if (data[i].arrayTaiSanExport.length >= data[i].arrayFileExport.length) {
                            checkMaxRow += data[i].arrayTaiSanExport.length;
                            max = data[i].arrayTaiSanExport.length;
                        }
                        else {
                            checkMaxRow += data[i].arrayFileExport.length;
                            max = data[i].arrayFileExport.length;
                        }
                        if (data[i].arrayTaiSanExport.length > 0) {
                            for (var taisan = 0; taisan < data[i].arrayTaiSanExport.length; taisan++) {
                                ws.cell(taisan + row, 5).string(data[i].arrayTaiSanExport[taisan].code).style(stylecell)
                                ws.cell(taisan + row, 6).string(data[i].arrayTaiSanExport[taisan].name).style(stylecell)
                                ws.cell(taisan + row, 8).number(data[i].arrayTaiSanExport[taisan].amount ? data[i].arrayTaiSanExport[taisan].amount : 0).style(stylecell)
                                ws.cell(taisan + row, 7).number(data[i].arrayTaiSanExport[taisan].unitPrice ? data[i].arrayTaiSanExport[taisan].unitPrice : 0).style(stylecell)
                            }
                        }
                        if (data[i].arrayFileExport.length > 0) {
                            for (var file = 0; file < data[i].arrayFileExport.length; file++) {
                                ws.cell(file + row, 10).link(data[i].arrayFileExport[file].link).style(stylecell)
                            }
                        }
                        if (data[i].arrayFileExport.length > 0 && data[i].arrayTaiSanExport.length > 0) {
                            ws.cell(row, 1, row + max - 1, 1, true).number(data[i].stt).style(stylecell);
                            ws.cell(row, 2, row + max - 1, 2, true).string(data[i].type).style(stylecell);
                            ws.cell(row, 3, row + max - 1, 3, true).string(data[i].nameIDNhanVien).style(stylecell);
                            ws.cell(row, 4, row + max - 1, 4, true).string(data[i].requireDate).style(stylecell);
                            ws.cell(row, 9, row + max - 1, 9, true).number(data[i].price ? data[i].price : 0).style(stylecell);
                            ws.cell(row, 11, row + max - 1, 11, true).string(data[i].reason).style(stylecell);
                            ws.cell(row, 12, row + max - 1, 12, true).string(data[i].status).style(stylecell);
                        }
                        else {
                            ws.cell(row, 1).number(data[i].stt).style(stylecell);
                            ws.cell(row, 2).string(data[i].type).style(stylecell);
                            ws.cell(row, 3).string(data[i].nameIDNhanVien).style(stylecell);
                            ws.cell(row, 4).string(data[i].requireDate).style(stylecell);
                            ws.cell(row, 9).number(data[i].price ? data[i].price : 0).style(stylecell);
                            ws.cell(row, 11,).string(data[i].reason).style(stylecell);
                            ws.cell(row, 12,).string(data[i].status).style(stylecell);
                        }
                    }
                    wb.write('D:/images_services/ageless_sendmail/export_excel_request_shopping.xlsx');
                    var result = {
                        link: 'http://118.27.192.106:1357/ageless_sendmail/export_excel_request_shopping.xlsx',
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
    // export_to_file_excel_payment
    exportToFileExcelPayment: (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        var styleHearder = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 14,
                bold: true,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecell = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var options = {
            margins: {
                left: 1.5,
                right: 1.5,
            },
        };
        let body = req.body;
        let data = JSON.parse(body.data);
        let arrayHeader = [
            'STT',
            'CHỨNG TỪ',
            'BỘ PHẬN',
            'NGƯỜI ĐỀ NGHỊ',
            'NỘI DUNG THANH TOÁN',
            'SỐ TIỀN THANH TOÁN',
            'NGƯỜI PHÊ DUYỆT TRƯỚC',
            'NGƯỜI PHÊ DUYỆT SAU',
        ]
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    var row = 1
                    ws.column(row).setWidth(5);
                    arrayHeader.forEach(element => {
                        ws.cell(1, row)
                            .string(element)
                            .style(styleHearder);
                        row += 1
                        ws.column(row).setWidth(20);
                    });
                    var row = 0;
                    // dùng để check bản ghi chiếm nhiều nhất bao nhiêu dòng
                    var checkMaxRow = 1;
                    for (let i = 0; i < data.length; i++) {
                        data[i].arrayFileExport = JSON.parse(data[i].arrayFileExport)
                        var max = 0;
                        // Hàng lớn nhất của bản ghi trước
                        if (i > 0)
                            row = checkMaxRow + 1
                        // bản ghi đầu tiên
                        else
                            row = i + 2
                        if (data[i].arrayFileExport.length) {
                            checkMaxRow += data[i].arrayFileExport.length;
                            // max dùng để đánh dầu hàng tiếp theo
                            max = data[i].arrayFileExport.length;
                        } else {
                            checkMaxRow += 1;
                        }
                        if (data[i].arrayFileExport.length > 0) {
                            for (var file = 0; file < data[i].arrayFileExport.length; file++) {
                                ws.cell(file + row, 2).link(data[i].arrayFileExport[file].link).style(stylecell)
                            }
                        }
                        if (data[i].arrayFileExport.length > 0) {
                            ws.cell(row, 1, row + max - 1, 1, true).number(data[i].stt).style(stylecell);
                            ws.cell(row, 3, row + max - 1, 3, true).string(data[i].departmentName).style(stylecell);
                            ws.cell(row, 3, row + max - 1, 4, true).string(data[i].nameNhanVien).style(stylecell);
                            ws.cell(row, 4, row + max - 1, 5, true).string(data[i].contents).style(stylecell);
                            ws.cell(row, 5, row + max - 1, 6, true).number(data[i].cost ? data[i].cost : 0).style(stylecell);
                            ws.cell(row, 6, row + max - 1, 7, true).string(data[i].nameNhanVienKTPD).style(stylecell);
                            ws.cell(row, 7, row + max - 1, 8, true).string(data[i].trangThaiPheDuyetLD).style(stylecell);
                        }
                        else {
                            ws.cell(row, 1).number(data[i].stt).style(stylecell)
                            ws.cell(row, 3).string(data[i].departmentName).style(stylecell)
                            ws.cell(row, 4).string(data[i].nameNhanVien).style(stylecell)
                            ws.cell(row, 5).string(data[i].contents).style(stylecell)
                            ws.cell(row, 6).number(data[i].cost ? data[i].cost : 0).style(stylecell)
                            ws.cell(row, 7).string(data[i].nameNhanVienKTPD).style(stylecell)
                            ws.cell(row, 8).string(data[i].trangThaiPheDuyetLD).style(stylecell)
                        }
                    }
                    wb.write('D:/images_services/ageless_sendmail/export_excel_payment_request.xlsx');
                    var result = {
                        link: 'http://118.27.192.106:1357/ageless_sendmail/export_excel_payment_request.xlsx',
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
    // export_to_file_excel_payroll
    exportToFileExcelPayroll: (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        var styleHearder = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 14,
                bold: true,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecell = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        let body = req.body;
        let data = JSON.parse(body.data);
        let objInsurance = JSON.parse(body.objInsurance);
        let arrayHeader = [
            'STT',
            'HỌ VÀ TÊN',
            'TỔNG THU NHẬP',
            'LƯƠNG BHXH',
            'LƯƠNG NĂNG SUẤT',
            'GIẢM TRỪ BHXH',
            'GIẢM TRỪ BHYT',
            'GIẢM TRỪ BHTN',
            'GIẢM TRỪ CÔNG ĐOÀN',
            'GT GIA CẢNH',
            'LƯƠNG TÍNH THUẾ TNCN',
            'THUẾ TNCN',
            'TỔNG CÁC KHOẢN TRỪ',
            'TẠM ỨNG',
            'THỰC NHẬN',
        ]
        var month = Number(body.date.slice(5, 7)); // January
        var year = Number(body.date.slice(0, 4));
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    var row = 1
                    ws.column(row).setWidth(5);
                    ws.cell(3, 6, 3, 9, true)
                        .string('CÁC KHOẢN GIẢM TRỪ')
                        .style(styleHearder);
                    ws.cell(1, 1, 1, 14, true)
                        .string('BẢNG TỔNG HỢP LƯƠNG THÁNG ' + month + ' NĂM ' + year)
                        .style(styleHearder);

                    // push vào các khoản trừ %
                    var arrayReduct = []
                    arrayReduct.push(1)
                    arrayReduct.push(2)
                    arrayReduct.push(3)
                    arrayReduct.push(4)
                    arrayReduct.push(5)
                    arrayReduct.push(objInsurance.staffBHXH)
                    arrayReduct.push(objInsurance.staffBHYT)
                    arrayReduct.push(objInsurance.staffBHTN)
                    arrayReduct.push(objInsurance.union)
                    for (var i = 0; i < arrayHeader.length; i++) {
                        if (i < 5) {
                            ws.cell(3, row, 4, row, true)
                                .string(arrayHeader[i])
                                .style(styleHearder);
                        }
                        else if (i >= 5 && i <= 9) {
                            if (i < 9)
                                ws.cell(4, row)
                                    .string(arrayHeader[i] + ' ' + arrayReduct[i] + '%')
                                    .style(styleHearder);
                            else
                                ws.cell(4, row)
                                    .string(arrayHeader[i])
                                    .style(styleHearder);
                        }
                        else {
                            ws.cell(3, row, 4, row, true)
                                .string(arrayHeader[i])
                                .style(styleHearder);
                        }
                        row += 1
                        ws.column(row).setWidth(20);
                    }
                    for (var i = 0; i < data.length; i++) {
                        ws.cell(5 + i, 1).number(data[i].stt).style(stylecell)
                        ws.cell(5 + i, 2).string(data[i].nameStaff ? data[i].nameStaff : 0).style(stylecell)
                        ws.cell(5 + i, 3).number(data[i].workingSalary ? data[i].workingSalary : 0).style(stylecell)
                        ws.cell(5 + i, 4).number(data[i].bhxhSalary ? data[i].bhxhSalary : 0).style(stylecell)
                        ws.cell(5 + i, 5).number(data[i].productivityWages ? data[i].productivityWages : 0).style(stylecell)
                        ws.cell(5 + i, 6).number(objInsurance.staffBHXH * data[i].bhxhSalary / 100).style(stylecell)
                        ws.cell(5 + i, 7).number(objInsurance.staffBHYT * data[i].bhxhSalary / 100).style(stylecell)
                        ws.cell(5 + i, 8).number(objInsurance.staffBHTN * data[i].bhxhSalary / 100).style(stylecell)
                        ws.cell(5 + i, 9).number(objInsurance.union * data[i].bhxhSalary / 100).style(stylecell)
                        ws.cell(5 + i, 10).number(0).style(stylecell)
                        ws.cell(5 + i, 11).number(data[i].thueTNCN ? data[i].thueTNCN : 0).style(stylecell)
                        ws.cell(5 + i, 12).number(data[i].thueTNCN ? data[i].thueTNCN : 0).style(stylecell)
                        ws.cell(5 + i, 13).number(data[i].tongKhoanTru ? data[i].tongKhoanTru : 0).style(stylecell)
                        ws.cell(5 + i, 14).number(data[i].tamUng ? data[i].tamUng : 0).style(stylecell)
                        ws.cell(5 + i, 15).number(data[i].thucLinh ? data[i].thucLinh : 0).style(stylecell)
                    }
                    wb.write('D:/images_services/ageless_sendmail/export_excel_payroll.xlsx');
                    var result = {
                        link: 'http://118.27.192.106:1357/ageless_sendmail/export_excel_payroll.xlsx',
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
    // export_to_file_excel_payroll
    exportToFileExcelTimekeeping: (req, res) => {
    },
    // export_tofile_excel_insurance_premiums
    exportToFileExcelInsutancePremiums: (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        var styleHearder = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 14,
                bold: true,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecell = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        let body = req.body;
        console.log(body);
        let data = JSON.parse(body.data);
        let objInsurance = JSON.parse(body.objInsurance);
        let arrayHeader = [
            'STT',
            'HỌ VÀ TÊN',
            'HỆ SỐ LƯƠNG',
            'MỨC LƯƠNG',
            'CT',
            'NV',
            'CT',
            'NV',
            'CT',
            'NV',
            'BHTNLĐ',
            'TỔNG',
        ]
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    var row = 1
                    ws.column(row).setWidth(5);
                    ws.cell(1, 1, 1, 14, true)
                        .string('THEO DÕI ĐÓNG BẢO HIỂM')
                        .style(styleHearder);
                    ws.cell(3, 5, 3, 6, true)
                        .string('BHXH')
                        .style(styleHearder);
                    ws.cell(3, 7, 3, 8, true)
                        .string('BHYT')
                        .style(styleHearder);
                    ws.cell(3, 9, 3, 10, true)
                        .string('BHTN')
                        .style(styleHearder);
                    // // push vào các khoản trừ %
                    var arrayReduct = []
                    arrayReduct.push(1)
                    arrayReduct.push(2)
                    arrayReduct.push(3)
                    arrayReduct.push(objInsurance.staffBHXH)
                    arrayReduct.push(objInsurance.companyBHXH)
                    arrayReduct.push(objInsurance.staffBHYT)
                    arrayReduct.push(objInsurance.companyBHYT)
                    arrayReduct.push(objInsurance.staffBHTN)
                    arrayReduct.push(objInsurance.companyBHTN)
                    for (var i = 0; i < arrayHeader.length; i++) {
                        if (i < 4) {
                            ws.cell(3, row, 4, row, true)
                                .string(arrayHeader[i])
                                .style(styleHearder);
                        }
                        else if (i > 3 && i < 10) {
                            ws.cell(4, row)
                                .string(arrayHeader[i] + ' ' + arrayReduct[i] + '%')
                                .style(styleHearder);
                        }
                        else {
                            ws.cell(3, row, 4, row, true)
                                .string(arrayHeader[i])
                                .style(styleHearder);
                        }
                        row += 1
                        ws.column(row).setWidth(20);
                    }
                    for (var i = 0; i < data.length; i++) {
                        let wages = data[i].workingSalary ? data[i].workingSalary : 0;
                        ws.cell(5 + i, 1).number(data[i].stt).style(stylecell)
                        ws.cell(5 + i, 2).string(data[i].nameStaff ? data[i].nameStaff : 0).style(stylecell)
                        ws.cell(5 + i, 3).number(data[i].productivityWages ? data[i].productivityWages : 0).style(stylecell)
                        ws.cell(5 + i, 4).number(wages).style(stylecell)
                        ws.cell(5 + i, 5).number(wages * objInsurance.staffBHXH / 100).style(stylecell)
                        ws.cell(5 + i, 6).number(wages * objInsurance.companyBHXH / 100).style(stylecell)
                        ws.cell(5 + i, 7).number(wages * objInsurance.staffBHYT / 100).style(stylecell)
                        ws.cell(5 + i, 8).number(wages * objInsurance.companyBHYT / 100).style(stylecell)
                        ws.cell(5 + i, 9).number(wages * objInsurance.staffBHTN / 100).style(stylecell)
                        ws.cell(5 + i, 10).number(wages * objInsurance.companyBHTN / 100).style(stylecell)
                        ws.cell(5 + i, 11).number(wages * objInsurance.staffBHTNLD / 100).style(stylecell)
                        ws.cell(5 + i, 12).number(wages * (objInsurance.staffBHXH + objInsurance.companyBHXH + objInsurance.staffBHYT + objInsurance.companyBHYT + objInsurance.staffBHTN + objInsurance.companyBHTN + objInsurance.staffBHTNLD) / 100).style(stylecell)
                    }
                    wb.write('D:/images_services/ageless_sendmail/export_excel_insurance_premiums.xlsx');
                    var result = {
                        link: 'http://118.27.192.106:1357/ageless_sendmail/export_excel_insurance_premiums.xlsx',
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