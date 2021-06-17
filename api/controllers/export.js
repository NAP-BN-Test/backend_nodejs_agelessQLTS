var docxConverter = require('docx-pdf');
const Constant = require('../constants/constant');
const Result = require('../constants/result');
var mtblYeuCauMuaSam = require('../tables/qlnb/tblYeuCauMuaSam')
var mtblYeuCauMuaSamDetail = require('../tables/qlnb/tblYeuCauMuaSamDetail')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMHangHoa = require('../tables/qlnb/tblDMHangHoa');
var mtblDMLoaiTaiSan = require('../tables/qlnb/tblDMLoaiTaiSan');
var mtblFileAttach = require('../tables/constants/tblFileAttach');
var mtblVanPhongPham = require('../tables/qlnb/tblVanPhongPham')

// Require library
var xl = require('excel4node');
var XlsxTemplate = require('xlsx-template');
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')

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
var moment = require('moment');

function transform(amount, decimalCount = 2, decimal = '.', thousands = ',') {
    if (amount >= 100) {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? '-' : '';

        let i = parseInt(
            (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
        ).toString();
        let j = i.length > 3 ? i.length % 3 : 0;

        return (
            negativeSign +
            (j ? i.substr(0, j) + thousands : '') +
            i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands)
        );
    } else {
        return amount.toString();
    }
}

async function getDetailYCMS(db, id) {
    let obj = {}
    let tblYeuCauMuaSam = mtblYeuCauMuaSam(db); // bắt buộc
    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet1', sourceKey: 'IDPheDuyet1', as: 'PheDuyet1' })
    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet2', sourceKey: 'IDPheDuyet2', as: 'PheDuyet2' })
    tblYeuCauMuaSam.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDPhongBan', sourceKey: 'IDPhongBan', as: 'phongban' })
    let tblYeuCauMuaSamDetail = mtblYeuCauMuaSamDetail(db);
    tblYeuCauMuaSam.hasMany(tblYeuCauMuaSamDetail, { foreignKey: 'IDYeuCauMuaSam', as: 'line' })
    await tblYeuCauMuaSam.findOne({
        order: [
            ['ID', 'DESC']
        ],
        include: [{
            model: mtblDMBoPhan(db),
            required: false,
            as: 'phongban'
        },
        {
            model: mtblDMNhanvien(db),
            required: false,
            as: 'NhanVien'
        },
        {
            model: mtblDMNhanvien(db),
            required: false,
            as: 'PheDuyet1',
        },
        {
            model: mtblDMNhanvien(db),
            required: false,
            as: 'PheDuyet2',
        },
        {
            model: tblYeuCauMuaSamDetail,
            required: false,
            as: 'line'
        },
        ],
        where: { ID: id }
    }).then(async data => {
        obj = {
            id: Number(data.ID),
            idNhanVien: data.IDNhanVien ? data.IDNhanVien : null,
            nameNhanVien: data.NhanVien ? data.NhanVien.StaffName : null,
            idPhongBan: data.IDPhongBan ? data.IDPhongBan : null,
            codePhongBan: data.phongban ? data.phongban.DepartmentCode : null,
            namePhongBan: data.phongban ? data.phongban.DepartmentName : null,
            requireDate: data.RequireDate ? moment(data.RequireDate).format('DD/MM/YYYY') : null,
            reason: data.Reason ? data.Reason : '',
            status: data.Status ? data.Status : '',
            idPheDuyet1: data.IDPheDuyet1 ? data.IDPheDuyet1 : null,
            namePheDuyet1: data.PheDuyet1 ? data.PheDuyet1.StaffName : null,
            idPheDuyet2: data.IDPheDuyet2 ? data.IDPheDuyet2 : null,
            namePheDuyet2: data.PheDuyet2 ? data.PheDuyet2.StaffName : null,
            type: data.Type ? data.Type : '',
            line: data.line
        }
        var arrayTaiSan = []
        var arrayVPP = []
        var arrayFile = []
        var total = 0;
        for (var j = 0; j < obj.line.length; j++) {
            if (data.Type == 'Tài sản') {
                var price = obj.line[j].Price ? obj.line[j].Price : 0
                var amount = obj.line[j].Amount ? obj.line[j].Amount : 0
                total += amount * price
                let tblDMHangHoa = mtblDMHangHoa(db);
                tblDMHangHoa.belongsTo(mtblDMLoaiTaiSan(db), { foreignKey: 'IDDMLoaiTaiSan', sourceKey: 'IDDMLoaiTaiSan', as: 'loaiTaiSan' })
                await tblDMHangHoa.findOne({
                    where: {
                        ID: obj.line[j].IDDMHangHoa,
                    },
                    include: [{
                        model: mtblDMLoaiTaiSan(db),
                        required: false,
                        as: 'loaiTaiSan'
                    },],
                }).then(data => {
                    if (data)
                        arrayTaiSan.push({
                            id: Number(data.ID),
                            name: data.Name,
                            code: data.Code,
                            amount: obj.line[j] ? obj.line[j].Amount : 0,
                            nameLoaiTaiSan: data.loaiTaiSan ? data.loaiTaiSan.Name : '',
                            idLine: obj.line[j].ID,
                            amount: amount,
                            unitPrice: price,
                            remainingAmount: 0,
                        })
                })
            } else {
                await mtblVanPhongPham(db).findOne({ where: { ID: obj.line[j].IDVanPhongPham } }).then(data => {
                    var price = obj.line[j].Price ? obj.line[j].Price : 0
                    var amount = obj.line[j].Amount ? obj.line[j].Amount : 0

                    if (data) {
                        total += amount * price
                        arrayVPP.push({
                            name: data.VPPName ? data.VPPName : '',
                            code: data.VPPCode ? data.VPPCode : '',
                            amount: amount,
                            unitPrice: price,
                            remainingAmount: data.RemainingAmount ? data.RemainingAmount : 0,
                            id: Number(obj.line[j].IDVanPhongPham),
                        })
                    }
                })
            }
        }
        obj['price'] = total;
        await mtblFileAttach(db).findAll({ where: { IDYeuCauMuaSam: obj.id } }).then(file => {
            if (file.length > 0) {
                for (var e = 0; e < file.length; e++) {
                    arrayFile.push({
                        name: file[e].Name ? file[e].Name : '',
                        link: file[e].Link ? file[e].Link : '',
                        id: file[e].ID
                    })
                }
            }
        })
        obj['arrayTaiSan'] = arrayTaiSan.length > 0 ? arrayTaiSan : arrayVPP;
        // obj['arrayVPP'] = arrayVPP;
        obj['arrayFile'] = arrayFile;
    })
    return obj
}
module.exports = {
    // convert_docx_to_pdf
    convertDocxToPDF: (req, res) => {
        let body = req.body;
        try {
            // var pathlink = 'C:/images_services/ageless_sendmail/002.docx'
            var pathlink = 'C:/images_services/ageless_sendmail/' + body.link.slice(47, 100);
            const extend = '.pdf'
            var pathEx = 'C:/images_services/ageless_sendmail/export_pdf_file.pdf'
            const file = fs.readFileSync(pathlink);
            // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
            libre.convert(file, extend, undefined, (err, done) => {
                if (err) {
                    console.log(`Error converting file: ${err}`);
                }
                // Here in done you have pdf file which you can save or transfer in another stream
                fs.writeFileSync(pathEx, done);
                var result = {
                    link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/export_pdf_file.pdf',
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
            //         'C:/images_services/ageless_sendmail/export-file-pdf.pdf',
            //         PDFNet.SDFDoc.SaveOptions.e_linearized,
            //     );
            // };
            // // add your own license key as the second parameter, e.g. PDFNet.runWithCleanup(main, 'YOUR_LICENSE_KEY')
            // // PDFNet.runWithCleanup(main).catch(function (error) {
            // //     console.log('Error: ' + JSON.stringify(error));
            // // }).then(function () { PDFNet.shutdown(); });
            // PDFNetEndpoint(main, 'C:/images_services/ageless_sendmail/export-file-pdf.pdf', res);

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
        var stylecellNumber = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'right',
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
            'Mã YCMS',
            'NHÂN VIÊN',
            'NGÀY ĐỀ XUẤT',
            'MÃ TS/TB/LK',
            'TÊN TS/TB/LK',
            'ĐƠN GIÁ',
            'SỐ LƯỢNG',
            'SỐ TỒN',
            'TỔNG TIỀN',
            'IMPORT BÁO GIÁ',
            'LÝ DO MUA',
            // 'TRẠNG THÁI'
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
                        console.log(data[i]);
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
                        } else {
                            checkMaxRow += data[i].arrayFileExport.length;
                            max = data[i].arrayFileExport.length;
                        }
                        if (data[i].arrayTaiSanExport.length > 0) {
                            for (var taisan = 0; taisan < data[i].arrayTaiSanExport.length; taisan++) {
                                ws.cell(taisan + row, 6).string(data[i].arrayTaiSanExport[taisan].code).style(stylecell)
                                ws.cell(taisan + row, 7).string(data[i].arrayTaiSanExport[taisan].name).style(stylecell)
                                ws.cell(taisan + row, 9).string(transform(data[i].arrayTaiSanExport[taisan].amount ? data[i].arrayTaiSanExport[taisan].amount : 0) + '').style(stylecellNumber)
                                ws.cell(taisan + row, 8).string(transform(data[i].arrayTaiSanExport[taisan].unitPrice ? data[i].arrayTaiSanExport[taisan].unitPrice : 0) + '').style(stylecellNumber)
                                ws.cell(taisan + row, 10).string(transform(data[i].arrayTaiSanExport[taisan].remainingAmount ? data[i].arrayTaiSanExport[taisan].remainingAmount : 0) + '').style(stylecellNumber)
                            }
                        }
                        if (data[i].arrayFileExport.length > 0) {
                            for (var file = 0; file < data[i].arrayFileExport.length; file++) {
                                ws.cell(file + row, 12).link(data[i].arrayFileExport[file].link, data[i].arrayFileExport[file].name).style(stylecell)
                            }
                        }
                        if (data[i].arrayFileExport.length > 0 && data[i].arrayTaiSanExport.length > 0) {
                            ws.cell(row, 1, row + max - 1, 1, true).number(data[i].stt).style(stylecell);
                            ws.cell(row, 2, row + max - 1, 2, true).string(data[i].type).style(stylecell);
                            ws.cell(row, 3, row + max - 1, 3, true).string(data[i].requestCode).style(stylecell);
                            ws.cell(row, 4, row + max - 1, 4, true).string(data[i].nameIDNhanVien).style(stylecell);
                            ws.cell(row, 5, row + max - 1, 5, true).string(data[i].requireDate).style(stylecell);
                            ws.cell(row, 11, row + max - 1, 11, true).string(transform(data[i].price ? data[i].price : 0) + '').style(stylecellNumber);
                            ws.cell(row, 13, row + max - 1, 13, true).string(data[i].reason).style(stylecell);
                            // ws.cell(row, 12, row + max - 1, 12, true).string(data[i].status).style(stylecell);
                        } else {
                            ws.cell(row, 1).number(data[i].stt).style(stylecell);
                            ws.cell(row, 2).string(data[i].type).style(stylecell);
                            ws.cell(row, 3).string(data[i].requestCode).style(stylecell);
                            ws.cell(row, 4).string(data[i].nameIDNhanVien).style(stylecell);
                            ws.cell(row, 5).string(data[i].requireDate).style(stylecell);
                            ws.cell(row, 11).string(transform(data[i].price ? data[i].price : 0) + '').style(stylecellNumber);
                            ws.cell(row, 13,).string(data[i].reason).style(stylecell);
                            // ws.cell(row, 12,).string(data[i].status).style(stylecell);
                        }
                    }
                    await wb.write('C:/images_services/ageless_sendmail/export_excel_request_shopping.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/export_excel_request_shopping.xlsx',
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
        var stylecellNumber = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'right',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        let body = req.body;
        let data = JSON.parse(body.data);
        let arrayHeader = [
            'STT',
            'MÃ DNTT',
            'BỘ PHẬN',
            'NGƯỜI ĐỀ NGHỊ',
            'NỘI DUNG THANH TOÁN',
            'SỐ TIỀN THANH TOÁN',
            'CHỨNG TỪ',
            // 'NGƯỜI PHÊ DUYỆT TRƯỚC',
            // 'NGƯỜI PHÊ DUYỆT SAU',
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
                        console.log(data[i].arrayFileExport);
                        if (data[i].arrayFileExport.length > 0) {
                            for (var file = 0; file < data[i].arrayFileExport.length; file++) {
                                ws.cell(file + row, 7).link(data[i].arrayFileExport[file].link, data[i].arrayFileExport[file].name).style(stylecell)
                            }
                        }
                        if (data[i].arrayFileExport.length > 0) {
                            ws.cell(row, 1, row + max - 1, 1, true).number(data[i].stt).style(stylecell);
                            ws.cell(row, 3, row + max - 1, 3, true).string(data[i].departmentName).style(stylecell);
                            ws.cell(row, 4, row + max - 1, 4, true).string(data[i].nameNhanVien).style(stylecell);
                            ws.cell(row, 5, row + max - 1, 5, true).string(data[i].contents).style(stylecell);
                            ws.cell(row, 2, row + max - 1, 2, true).string(transform(data[i].paymentOrderCode ? data[i].paymentOrderCode : 0)).style(stylecell);
                            ws.cell(row, 6, row + max - 1, 6, true).string(transform(data[i].cost ? data[i].cost : 0)).style(stylecellNumber);
                        } else {
                            ws.cell(row, 1).number(data[i].stt).style(stylecell)
                            ws.cell(row, 3).string(data[i].departmentName).style(stylecell)
                            ws.cell(row, 4).string(data[i].nameNhanVien).style(stylecell)
                            ws.cell(row, 5).string(data[i].contents).style(stylecell)
                            ws.cell(row, 2).string(data[i].paymentOrderCode).style(stylecell)
                            ws.cell(row, 6).string(transform(data[i].cost ? data[i].cost : 0)).style(stylecellNumber);
                        }
                    }
                    await wb.write('C:/images_services/ageless_sendmail/export_excel_payment_request.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/export_excel_payment_request.xlsx',
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
            // fill: {
            //     type: 'pattern', // the only one implemented so far.
            //     patternType: 'solid', // most common.
            //     // fgColor: '2172d7', // you can add two extra characters to serve as alpha, i.e. '2172d7aa'.
            //     // bgColor: 'ffffff' // bgColor only applies on patternTypes other than solid.
            // },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var styleHearderNumber = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 14,
                bold: true,
            },
            // fill: {
            //     type: 'pattern', // the only one implemented so far.
            //     patternType: 'solid', // most common.
            //     // fgColor: '2172d7', // you can add two extra characters to serve as alpha, i.e. '2172d7aa'.
            //     // bgColor: 'ffffff' // bgColor only applies on patternTypes other than solid.
            // },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'right',
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
        var stylecellNumber = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'right',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        let body = req.body;
        let data = JSON.parse(body.data);
        let objInsurance = JSON.parse(body.objInsurance);
        let totalFooter = JSON.parse(body.totalFooter)
        let arrayHeader = [
            'STT',
            'MÃ NHÂN VIÊN',
            'HỌ VÀ TÊN',
            'PHÒNG BAN',
            // 'TỔNG THU NHẬP',
            'LƯƠNG NĂNG SUẤT',
            'LƯƠNG BHXH',
            'GIẢM TRỪ BHXH',
            'GIẢM TRỪ BHYT',
            'GIẢM TRỪ BHTN',
            'GIẢM TRỪ CÔNG ĐOÀN',
            'GT GIA CẢNH',
            'LƯƠNG TÍNH THUẾ TNCN',
            'THUẾ TNCN',
            'TỔNG CÁC KHOẢN TRỪ',
            'THỰC LĨNH',
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
                    ws.cell(3, 7, 3, 10, true)
                        .string('CÁC KHOẢN GIẢM TRỪ')
                        .style(styleHearder);
                    ws.cell(1, 1, 1, 14, true)
                        .string('BẢNG TỔNG HỢP LƯƠNG THÁNG ' + month + ' NĂM ' + year)
                        .style(styleHearder);

                    // push vào các khoản trừ %
                    console.log(objInsurance);
                    var arrayReduct = []
                    arrayReduct.push(1)
                    arrayReduct.push(2)
                    arrayReduct.push(3)
                    arrayReduct.push(4)
                    arrayReduct.push(5)
                    arrayReduct.push(6)
                    arrayReduct.push(objInsurance.staffBHXH)
                    arrayReduct.push(objInsurance.staffBHYT)
                    arrayReduct.push(objInsurance.staffBHTN)
                    arrayReduct.push(objInsurance.union)
                    for (var i = 0; i < arrayHeader.length; i++) {
                        if (i <= 5) {
                            ws.cell(3, row, 4, row, true)
                                .string(arrayHeader[i])
                                .style(styleHearder);
                        } else if (i > 5 && i <= 10) {
                            if (i < 10)
                                ws.cell(4, row)
                                    .string(arrayHeader[i] + ' ' + arrayReduct[i] + '%')
                                    .style(styleHearder);
                            else if (i = 10) {
                                ws.cell(4, row)
                                    .string(arrayHeader[i])
                                    .style(styleHearder);
                            } else
                                ws.cell(4, row)
                                    .string(arrayHeader[i])
                                    .style(styleHearder);
                        } else {
                            ws.cell(3, row, 4, row, true)
                                .string(arrayHeader[i])
                                .style(styleHearder);
                        }
                        row += 1
                        ws.column(row).setWidth(20);
                    }
                    // console.log(data);
                    for (var i = 0; i < data.length; i++) {
                        ws.cell(5 + i, 1).number(data[i].stt).style(stylecell)
                        ws.cell(5 + i, 2).string(data[i].staffCode ? data[i].staffCode : '').style(stylecell)
                        ws.cell(5 + i, 3).string(data[i].staffName ? data[i].staffName : '').style(stylecell)
                        ws.cell(5 + i, 4).string(data[i].departmentName ? data[i].departmentName : '').style(stylecell)
                        // ws.cell(5 + i, 3).number(data[i].workingSalary ? data[i].workingSalary : 0).style(stylecellNumber)
                        ws.cell(5 + i, 5).number(data[i].productivityWages ? Number(data[i].productivityWages) : 0).style(stylecellNumber)
                        ws.cell(5 + i, 6).number(data[i].bhxhSalary ? Number(data[i].bhxhSalary) : 0).style(stylecellNumber)
                        ws.cell(5 + i, 7).number(Number(data[i].staffBHXH)).style(stylecellNumber)
                        ws.cell(5 + i, 8).number(Number(data[i].staffBHYT)).style(stylecellNumber)
                        ws.cell(5 + i, 9).number(Number(data[i].staffBHTN)).style(stylecellNumber)
                        ws.cell(5 + i, 10).number(Number(data[i].union)).style(stylecellNumber)
                        ws.cell(5 + i, 12).number(data[i].personalTaxSalary ? Number(data[i].personalTaxSalary) : 0).style(stylecellNumber)
                        ws.cell(5 + i, 13).number(data[i].personalTax ? Number(data[i].personalTax) : 0).style(stylecellNumber)
                        ws.cell(5 + i, 11).number(data[i].reduce ? Number(data[i].reduce) : 0).style(stylecellNumber)
                        ws.cell(5 + i, 14).number(data[i].totalReduce ? Number(data[i].totalReduce) : 0).style(stylecellNumber)
                        ws.cell(5 + i, 15).number(data[i].realField ? Number(data[i].realField) : 0).style(stylecellNumber)
                    }
                    // Tổng cộng
                    ws.cell(5 + data.length, 1, 5 + data.length, 4, true)
                        .string('TỔNG CỘNG')
                        .style(styleHearder);
                    ws.cell(5 + data.length, 5).number(Number(totalFooter.totalProductivityWages)).style(styleHearderNumber)
                    ws.cell(5 + data.length, 6).number(Number(totalFooter.totalBHXHSalary)).style(styleHearderNumber)
                    ws.cell(5 + data.length, 7).number(Number(totalFooter.totalStaffBHXH)).style(styleHearderNumber)
                    ws.cell(5 + data.length, 8).number(Number(totalFooter.totalStaffBHYT)).style(styleHearderNumber)
                    ws.cell(5 + data.length, 9).number(Number(totalFooter.totalStaffBHTN)).style(styleHearderNumber)
                    ws.cell(5 + data.length, 10).number(Number(totalFooter.totalUnion)).style(styleHearderNumber)
                    ws.cell(5 + data.length, 11).number(Number(totalFooter.totelReduce)).style(styleHearderNumber)
                    ws.cell(5 + data.length, 12).number(Number(totalFooter.totalPersonalTaxSalary)).style(styleHearderNumber)
                    ws.cell(5 + data.length, 13).number(Number(totalFooter.totalPersonalTax)).style(styleHearderNumber)
                    ws.cell(5 + data.length, 14).number(Number(totalFooter.totalAllReduce)).style(styleHearderNumber)
                    ws.cell(5 + data.length, 15).number(Number(totalFooter.totalRealField)).style(styleHearderNumber)

                    await wb.write('C:/images_services/ageless_sendmail/' + 'export_excel_payroll_t' + month + '.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + 'export_excel_payroll_t' + month + '.xlsx',
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
    // export_to_file_excel_payroll
    exportToFileExcelTimekeeping: (req, res) => { },
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
        var styleHearderNumber = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 14,
                bold: true,
            },
            // fill: {
            //     type: 'pattern', // the only one implemented so far.
            //     patternType: 'solid', // most common.
            //     // fgColor: '2172d7', // you can add two extra characters to serve as alpha, i.e. '2172d7aa'.
            //     // bgColor: 'ffffff' // bgColor only applies on patternTypes other than solid.
            // },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'right',
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
        var stylecellNumber = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'right',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        let body = req.body;
        let data = JSON.parse(body.data);
        let objInsurance = JSON.parse(body.objInsurance);
        let totalFooter = JSON.parse(body.totalFooter);
        let arrayHeader = [
            'STT',
            'MÃ NHÂN VIÊN',
            'HỌ VÀ TÊN',
            'PHÒNG BAN',
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
        var month = Number(body.date.slice(5, 7)); // January
        var year = Number(body.date.slice(0, 4));
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    var row = 1
                    ws.column(row).setWidth(5);
                    ws.cell(1, 1, 1, 14, true)
                        .string('THEO DÕI ĐÓNG BẢO HIỂM ' + month + '/' + year)
                        .style(styleHearder);
                    ws.cell(3, 7, 3, 8, true)
                        .string('BHXH')
                        .style(styleHearder);
                    ws.cell(3, 9, 3, 10, true)
                        .string('BHYT')
                        .style(styleHearder);
                    ws.cell(3, 11, 3, 12, true)
                        .string('BHTN')
                        .style(styleHearder);
                    // // push vào các khoản trừ %
                    var arrayReduct = []
                    arrayReduct.push(1)
                    arrayReduct.push(2)
                    arrayReduct.push(3)
                    arrayReduct.push(4)
                    arrayReduct.push(5)
                    arrayReduct.push(6)
                    arrayReduct.push(objInsurance.companyBHXH)
                    arrayReduct.push(objInsurance.staffBHXH)
                    arrayReduct.push(objInsurance.companyBHYT)
                    arrayReduct.push(objInsurance.staffBHYT)
                    arrayReduct.push(objInsurance.companyBHTN)
                    arrayReduct.push(objInsurance.staffBHTN)
                    arrayReduct.push(objInsurance.staffBHTNLD)
                    arrayReduct.push(objInsurance.staffBHXH + objInsurance.companyBHXH + objInsurance.staffBHYT + objInsurance.companyBHYT + objInsurance.staffBHTN + objInsurance.companyBHTN + objInsurance.staffBHTNLD)
                    for (var i = 0; i < arrayHeader.length; i++) {
                        if (i <= 5) {
                            ws.cell(3, row, 4, row, true)
                                .string(arrayHeader[i])
                                .style(styleHearder);
                        } else if (i > 5 && i < 12) {
                            ws.cell(4, row)
                                .string(arrayHeader[i] + ' ' + arrayReduct[i] + '%')
                                .style(styleHearder);
                        } else {
                            ws.cell(3, row, 4, row, true)
                                .string(arrayHeader[i] + ' ' + arrayReduct[i] + '%')
                                .style(styleHearder);
                        }
                        row += 1
                        ws.column(row).setWidth(20);
                    }
                    for (var i = 0; i < data.length; i++) {
                        let wages = data[i].bhxhSalary ? data[i].bhxhSalary : 0;
                        ws.cell(5 + i, 1).number(data[i].stt).style(stylecellNumber)
                        ws.cell(5 + i, 2).string(data[i].staffCode).style(stylecell)
                        ws.cell(5 + i, 3).string(data[i].nameStaff ? data[i].nameStaff : 0).style(stylecell)
                        ws.cell(5 + i, 4).string(data[i].nameDepartment ? data[i].nameDepartment : '').style(stylecell)
                        ws.cell(5 + i, 5).number(data[i].coefficientsSalary ? data[i].coefficientsSalary : 0).style(stylecellNumber)
                        ws.cell(5 + i, 6).number(wages).style(stylecellNumber)
                        ws.cell(5 + i, 7).number(wages * objInsurance.companyBHXH / 100).style(stylecellNumber)
                        ws.cell(5 + i, 8).number(wages * objInsurance.staffBHXH / 100).style(stylecellNumber)
                        ws.cell(5 + i, 9).number(wages * objInsurance.companyBHYT / 100).style(stylecellNumber)
                        ws.cell(5 + i, 10).number(wages * objInsurance.staffBHYT / 100).style(stylecellNumber)
                        ws.cell(5 + i, 11).number(wages * objInsurance.companyBHTN / 100).style(stylecellNumber)
                        ws.cell(5 + i, 12).number(wages * objInsurance.staffBHTN / 100).style(stylecellNumber)
                        ws.cell(5 + i, 13).number(wages * objInsurance.staffBHTNLD / 100).style(stylecellNumber)
                        ws.cell(5 + i, 14).number(wages * (objInsurance.staffBHXH + objInsurance.companyBHXH + objInsurance.staffBHYT + objInsurance.companyBHYT + objInsurance.staffBHTN + objInsurance.companyBHTN + objInsurance.staffBHTNLD) / 100).style(stylecellNumber)
                    }
                    // Tổng cộng
                    ws.cell(5 + data.length, 1, 5 + data.length, 4, true)
                        .string('TỔNG CỘNG')
                        .style(styleHearder);
                    ws.cell(5 + data.length, 6).number(totalFooter.bhxhSalaryTotal).style(styleHearderNumber)
                    ws.cell(5 + data.length, 7).number(totalFooter.bhxhCTTotal).style(styleHearderNumber)
                    ws.cell(5 + data.length, 8).number(totalFooter.bhxhNVTotal).style(styleHearderNumber)
                    ws.cell(5 + data.length, 9).number(totalFooter.bhytCTTotal).style(styleHearderNumber)
                    ws.cell(5 + data.length, 10).number(totalFooter.bhytNVTotal).style(styleHearderNumber)
                    ws.cell(5 + data.length, 11).number(totalFooter.bhtnCTTotal).style(styleHearderNumber)
                    ws.cell(5 + data.length, 12).number(totalFooter.bhtnNVTotal).style(styleHearderNumber)
                    ws.cell(5 + data.length, 13).number(totalFooter.bhtnldTotal).style(styleHearderNumber)
                    ws.cell(5 + data.length, 14).number(totalFooter.tongTotal).style(styleHearderNumber)
                    await wb.write('C:/images_services/ageless_sendmail/export_excel_insurance_premiums.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/export_excel_insurance_premiums.xlsx',
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
    // export_excel_Detail_YCMS
    exportExcelInDetailYCMS: (req, res) => {
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
        var stylecellNumber = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'right',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecellText = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'left',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        let body = req.body;
        let arrayHeader = [
            'Ngày đề xuất',
            'Bộ phận đề xuất',
            'Nhân viên',
            'Người duyệt trước',
            'Người duyệt sau',
            'Mã TS/TB/LK',
            'Tên TS/TB/LK',
            'Số lượng',
            'Đơn giá',
            'Số tồn',
            'Tổng tiền',
            'Lý do mua',
            'Chứng từ đính kèm',
        ]
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    var row = 1
                    ws.column(row).setWidth(5);

                    for (var i = 0; i < arrayHeader.length; i++) {
                        ws.cell(1, row)
                            .string(arrayHeader[i])
                            .style(styleHearder);
                        ws.column(row).setWidth(20);
                        row += 1
                    }
                    var obj = await getDetailYCMS(db, body.id)
                    ws.cell(2, 1, obj.arrayTaiSan.length + 1, 1, true)
                        .string(obj.requireDate)
                        .style(stylecell);
                    ws.cell(2, 2, obj.arrayTaiSan.length + 1, 2, true)
                        .string(obj.namePhongBan)
                        .style(stylecell);
                    ws.cell(2, 3, obj.arrayTaiSan.length + 1, 3, true)
                        .string(obj.nameNhanVien)
                        .style(stylecell);
                    ws.cell(2, 4, obj.arrayTaiSan.length + 1, 4, true)
                        .string(obj.namePheDuyet1)
                        .style(stylecell);
                    ws.cell(2, 5, obj.arrayTaiSan.length + 1, 5, true)
                        .string(obj.namePheDuyet2)
                        .style(stylecell);
                    for (var i = 0; i < obj.arrayTaiSan.length; i++) {
                        ws.cell(2 + i, 6)
                            .string(obj.arrayTaiSan[i].name)
                            .style(stylecellText);
                        ws.cell(2 + i, 7)
                            .string(obj.arrayTaiSan[i].code)
                            .style(stylecellText);
                        ws.cell(2 + i, 8)
                            .number(obj.arrayTaiSan[i].amount)
                            .style(stylecellNumber);
                        ws.cell(2 + i, 9)
                            .number(obj.arrayTaiSan[i].unitPrice)
                            .style(stylecellNumber);
                        ws.cell(2 + i, 10)
                            .number(obj.arrayTaiSan[i].remainingAmount)
                            .style(stylecellNumber);
                    }
                    ws.cell(2, 11, obj.arrayTaiSan.length + 1, 11, true)
                        .number(obj.price)
                        .style(stylecellNumber);
                    ws.cell(2, 12, obj.arrayTaiSan.length + 1, 12, true)
                        .string(obj.reason)
                        .style(stylecellText);
                    for (var i = 0; i < obj.arrayFile.length; i++) {
                        ws.cell(2 + i, 13)
                            .link(obj.arrayFile[i].link, obj.arrayFile[i].name)
                            .style(stylecell);
                    }
                    await wb.write('C:/images_services/ageless_sendmail/export_excel_ycms.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/export_excel_ycms.xlsx',
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
    converBase64ToImg: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                var base64Data = body.data.base64.replace('data:image/jpeg;base64,', "");
                base64Data = base64Data.replace(/ /g, '+');
                var buf = new Buffer.from(base64Data, "base64");
                var numberRandom = Math.floor(Math.random() * 1000000);
                nameMiddle = numberRandom.toString();
                var dir = 'photo-' + nameMiddle + '.jpg';
                require("fs").writeFile('C:/images_services/struck_web/' + dir, buf, function (err) {
                    if (err) console.log(err + '');
                });
                var result = {
                    link: 'http://dbdev.namanphu.vn:1357/struck_web/' + dir,
                    name: body.data.name,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                }
                res.json(result);
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    exportToFileExcelVPP: async (req, res) => {
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
        var stylecellNumber = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'right',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        let body = req.body;
        let data = JSON.parse(body.data)
        let arrayHeader = [
            'MÃ VPP',
            'TÊN VPP',
            'ĐƠN VỊ TÍNH',
            'SỐ LƯỢNG',
            'TRẠNG THÁI',
            'NGƯỜI SỞ HỮU',
            'NGÀY TIẾP NHẬN',
            // 'NGƯỜI PHÊ DUYỆT TRƯỚC',
            // 'NGƯỜI PHÊ DUYỆT SAU',
        ]
        // Add Worksheets to the workbook
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
            var max = 0;
            // Hàng lớn nhất của bản ghi trước
            if (i > 0)
                row = checkMaxRow + 1
            // bản ghi đầu tiên
            else
                row = i + 2
            if (data[i].line.length) {
                checkMaxRow += data[i].line.length;
                // max dùng để đánh dầu hàng tiếp theo
                max = data[i].line.length;
            } else {
                checkMaxRow += 1;
            }
            if (data[i].line.length > 0) {
                //  nơi những trường không cần merge
                for (var l = 0; l < data[i].line.length; l++) {
                    ws.cell(l + row, 1).string(data[i].line[l].vppCode).style(stylecell)
                    ws.cell(l + row, 2).string(data[i].line[l].vppName).style(stylecell)
                    ws.cell(l + row, 3).string(data[i].line[l].unit).style(stylecell)
                    ws.cell(l + row, 4).number(data[i].line[l].amount).style(stylecellNumber)
                }
            }
            //  nói những trường cần merger
            if (data[i].line.length > 0) {
                ws.cell(row, 5, row + max - 1, 5, true).string(data[i].status).style(stylecell);
                ws.cell(row, 6, row + max - 1, 6, true).string(data[i].nameNhanVienSoHuu).style(stylecell);
                ws.cell(row, 7, row + max - 1, 7, true).string(data[i].date).style(stylecell);
            }
        }
        await wb.write('C:/images_services/ageless_sendmail/export_excel_handing_over_vpp.xlsx');
        setTimeout(() => {
            var result = {
                link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/export_excel_handing_over_vpp.xlsx',
                status: Constant.STATUS.SUCCESS,
                message: Constant.MESSAGE.ACTION_SUCCESS,
            }
            res.json(result);
        }, 500);

    },
}