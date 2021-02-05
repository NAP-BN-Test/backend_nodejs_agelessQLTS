var docxConverter = require('docx-pdf');
const Constant = require('../constants/constant');
const Result = require('../constants/result');

// Require library
var xl = require('excel4node');

// Create a new instance of a Workbook class
var wb = new xl.Workbook();
var database = require('../database');
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
module.exports = {
    // convert_docx_to_pdf
    convertDocxToPDF: (req, res) => {
        let body = req.body;
        try {
            // var path = 'D:/images_services/ageless_sendmail/' + body.link.slice(44, 100);
            var path = 'D:/images_services/ageless_sendmail/002.docx'
            const main = async () => {
                const pdfdoc = await PDFNet.PDFDoc.create();
                await pdfdoc.initSecurityHandler();
                await PDFNet.Convert.toPdf(pdfdoc, path);
                pdfdoc.save(
                    'D:/images_services/ageless_sendmail/export-file-pdf.pdf',
                    PDFNet.SDFDoc.SaveOptions.e_linearized,
                );
            };

            PDFNetEndpoint(main, 'D:/images_services/ageless_sendmail/export-file-pdf.pdf', res);

        } catch (error) {
            console.log(error);
            res.json(Result.SYS_ERROR_RESULT)
        }

    },
    // export_to_file_excel
    exportToFileExcel: (req, res) => {
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
                    wb.write('D:/images_services/ageless_sendmail/export_excel.xlsx');
                    var result = {
                        link: 'http://118.27.192.106:1357/ageless_sendmail/export_excel.xlsx',
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
        let body = req.body;
        let data = JSON.parse(body.data);
        let arrayHeader = [
            'STT',
            'CHỨNG TỪ',
            'NGƯỜI ĐỀ NGHỊ',
            'NỘI DUNG THANH TOÁN',
            'SỐ TIỀN THANH TOÁN',
            'NGƯỜI PHÊ DUYỆT TRƯỚC',
            'NGƯỜI PHÊ DUYỆT SAU'
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
                            ws.cell(row, 3, row + max - 1, 3, true).string(data[i].nameNhanVien).style(stylecell);
                            ws.cell(row, 4, row + max - 1, 4, true).string(data[i].contents).style(stylecell);
                            ws.cell(row, 5, row + max - 1, 5, true).number(data[i].cost ? data[i].cost : 0).style(stylecell);
                            ws.cell(row, 6, row + max - 1, 6, true).string(data[i].nameNhanVienKTPD).style(stylecell);
                            ws.cell(row, 7, row + max - 1, 7, true).string(data[i].trangThaiPheDuyetLD).style(stylecell);
                        }
                        else {
                            ws.cell(row, 1).number(data[i].stt).style(stylecell)
                            ws.cell(row, 3).string(data[i].nameNhanVien).style(stylecell)
                            ws.cell(row, 4).string(data[i].contents).style(stylecell)
                            ws.cell(row, 5).number(data[i].cost ? data[i].cost : 0).style(stylecell)
                            ws.cell(row, 6).string(data[i].nameNhanVienKTPD).style(stylecell)
                            ws.cell(row, 7).string(data[i].trangThaiPheDuyetLD).style(stylecell)
                        }
                    }
                    wb.write('D:/images_services/ageless_sendmail/export_excel_payment.xlsx');
                    var result = {
                        link: 'http://118.27.192.106:1357/ageless_sendmail/export_excel_payment.xlsx',
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
        let body = req.body;
        let data = JSON.parse(body.data);
        let arrayHeader = [
            'STT',
            'CHỨNG TỪ',
            'NGƯỜI ĐỀ NGHỊ',
            'NỘI DUNG THANH TOÁN',
            'SỐ TIỀN THANH TOÁN',
            'NGƯỜI PHÊ DUYỆT TRƯỚC',
            'NGƯỜI PHÊ DUYỆT SAU'
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
                            ws.cell(row, 3, row + max - 1, 3, true).string(data[i].nameNhanVien).style(stylecell);
                            ws.cell(row, 4, row + max - 1, 4, true).string(data[i].contents).style(stylecell);
                            ws.cell(row, 5, row + max - 1, 5, true).number(data[i].cost ? data[i].cost : 0).style(stylecell);
                            ws.cell(row, 6, row + max - 1, 6, true).string(data[i].nameNhanVienKTPD).style(stylecell);
                            ws.cell(row, 7, row + max - 1, 7, true).string(data[i].trangThaiPheDuyetLD).style(stylecell);
                        }
                        else {
                            ws.cell(row, 1).number(data[i].stt).style(stylecell)
                            ws.cell(row, 3).string(data[i].nameNhanVien).style(stylecell)
                            ws.cell(row, 4).string(data[i].contents).style(stylecell)
                            ws.cell(row, 5).number(data[i].cost ? data[i].cost : 0).style(stylecell)
                            ws.cell(row, 6).string(data[i].nameNhanVienKTPD).style(stylecell)
                            ws.cell(row, 7).string(data[i].trangThaiPheDuyetLD).style(stylecell)
                        }
                    }
                    wb.write('D:/images_services/ageless_sendmail/export_excel_payment.xlsx');
                    var result = {
                        link: 'http://118.27.192.106:1357/ageless_sendmail/export_excel_payment.xlsx',
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