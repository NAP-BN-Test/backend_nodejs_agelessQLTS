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
        include: [
            {
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
                    include: [
                        {
                            model: mtblDMLoaiTaiSan(db),
                            required: false,
                            as: 'loaiTaiSan'
                        },
                    ],
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
            var pathlink = 'C:/images_services/ageless_sendmail/' + body.link.slice(44, 100);
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
                    link: 'http://103.154.100.26:1357/ageless_sendmail/export_pdf_file.pdf',
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
                                ws.cell(taisan + row, 8).string(transform(data[i].arrayTaiSanExport[taisan].amount ? data[i].arrayTaiSanExport[taisan].amount : 0) + '').style(stylecellNumber)
                                ws.cell(taisan + row, 7).string(transform(data[i].arrayTaiSanExport[taisan].unitPrice ? data[i].arrayTaiSanExport[taisan].unitPrice : 0) + '').style(stylecellNumber)
                            }
                        }
                        if (data[i].arrayFileExport.length > 0) {
                            for (var file = 0; file < data[i].arrayFileExport.length; file++) {
                                ws.cell(file + row, 10).link(data[i].arrayFileExport[file].link, data[i].arrayFileExport[file].name).style(stylecell)
                            }
                        }
                        if (data[i].arrayFileExport.length > 0 && data[i].arrayTaiSanExport.length > 0) {
                            ws.cell(row, 1, row + max - 1, 1, true).number(data[i].stt).style(stylecell);
                            ws.cell(row, 2, row + max - 1, 2, true).string(data[i].type).style(stylecell);
                            ws.cell(row, 3, row + max - 1, 3, true).string(data[i].nameIDNhanVien).style(stylecell);
                            ws.cell(row, 4, row + max - 1, 4, true).string(data[i].requireDate).style(stylecell);
                            ws.cell(row, 9, row + max - 1, 9, true).string(transform(data[i].price ? data[i].price : 0) + '').style(stylecellNumber);
                            ws.cell(row, 11, row + max - 1, 11, true).string(data[i].reason).style(stylecell);
                            ws.cell(row, 12, row + max - 1, 12, true).string(data[i].status).style(stylecell);
                        }
                        else {
                            ws.cell(row, 1).number(data[i].stt).style(stylecell);
                            ws.cell(row, 2).string(data[i].type).style(stylecell);
                            ws.cell(row, 3).string(data[i].nameIDNhanVien).style(stylecell);
                            ws.cell(row, 4).string(data[i].requireDate).style(stylecell);
                            ws.cell(row, 9).string(transform(data[i].price ? data[i].price : 0) + '').style(stylecellNumber);
                            ws.cell(row, 11,).string(data[i].reason).style(stylecell);
                            ws.cell(row, 12,).string(data[i].status).style(stylecell);
                        }
                    }
                    await wb.write('C:/images_services/ageless_sendmail/export_excel_request_shopping.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://103.154.100.26:1357/ageless_sendmail/export_excel_request_shopping.xlsx',
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
                                ws.cell(file + row, 2).link(data[i].arrayFileExport[file].link, data[i].arrayFileExport[file].name).style(stylecell)
                            }
                        }
                        if (data[i].arrayFileExport.length > 0) {
                            ws.cell(row, 1, row + max - 1, 1, true).number(data[i].stt).style(stylecell);
                            ws.cell(row, 3, row + max - 1, 3, true).string(data[i].departmentName).style(stylecell);
                            ws.cell(row, 4, row + max - 1, 4, true).string(data[i].nameNhanVien).style(stylecell);
                            ws.cell(row, 5, row + max - 1, 5, true).string(data[i].contents).style(stylecell);
                            ws.cell(row, 6, row + max - 1, 6, true).string(transform(data[i].cost ? data[i].cost : 0)).style(stylecellNumber);
                            ws.cell(row, 7, row + max - 1, 7, true).string(data[i].nameNhanVienKTPD).style(stylecell);
                            ws.cell(row, 8, row + max - 1, 8, true).string(data[i].trangThaiPheDuyetLD).style(stylecell);
                        }
                        else {
                            ws.cell(row, 1).number(data[i].stt).style(stylecell)
                            ws.cell(row, 3).string(data[i].departmentName).style(stylecell)
                            ws.cell(row, 4).string(data[i].nameNhanVien).style(stylecell)
                            ws.cell(row, 5).string(data[i].contents).style(stylecell)
                            ws.cell(row, 6).string(transform(data[i].cost ? data[i].cost : 0)).style(stylecellNumber)
                            ws.cell(row, 7).string(data[i].nameNhanVienKTPD).style(stylecell)
                            ws.cell(row, 8).string(data[i].trangThaiPheDuyetLD).style(stylecell)
                        }
                    }
                    await wb.write('C:/images_services/ageless_sendmail/export_excel_payment_request.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://103.154.100.26:1357/ageless_sendmail/export_excel_payment_request.xlsx',
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
                        ws.cell(5 + i, 1).string(data[i].stt).style(stylecell)
                        ws.cell(5 + i, 2).string(data[i].staffName ? data[i].staffName : 0).style(stylecell)
                        ws.cell(5 + i, 3).number(data[i].workingSalary ? data[i].workingSalary : 0).style(stylecell)
                        ws.cell(5 + i, 4).number(data[i].bhxhSalary ? data[i].bhxhSalary : 0).style(stylecell)
                        ws.cell(5 + i, 5).number(data[i].productivityWages ? data[i].productivityWages : 0).style(stylecell)
                        ws.cell(5 + i, 6).number(data[i].bhxhSalary).style(stylecell)
                        ws.cell(5 + i, 7).number(data[i].bhxhSalary).style(stylecell)
                        ws.cell(5 + i, 8).number(data[i].bhxhSalary).style(stylecell)
                        ws.cell(5 + i, 9).number(data[i].bhxhSalary).style(stylecell)
                        ws.cell(5 + i, 10).number(0).style(stylecell)
                        ws.cell(5 + i, 11).number(data[i].personalTax ? data[i].personalTax : 0).style(stylecell)
                        ws.cell(5 + i, 12).number(data[i].personalTaxSalary ? data[i].personalTaxSalary : 0).style(stylecell)
                        ws.cell(5 + i, 13).number(data[i].tongKhoanTru ? data[i].tongKhoanTru : 0).style(stylecell)
                        // ws.cell(5 + i, 14).number(data[i].tamUng ? data[i].tamUng : 0).style(stylecell)
                        ws.cell(5 + i, 15).number(data[i].realField ? data[i].realField : 0).style(stylecell)
                    }
                    await wb.write('C:/images_services/ageless_sendmail/export_excel_payroll.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://103.154.100.26:1357/ageless_sendmail/export_excel_payroll.xlsx',
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
                    arrayReduct.push(4)
                    arrayReduct.push(objInsurance.companyBHXH)
                    arrayReduct.push(objInsurance.staffBHXH)
                    arrayReduct.push(objInsurance.companyBHYT)
                    arrayReduct.push(objInsurance.staffBHYT)
                    arrayReduct.push(objInsurance.companyBHTN)
                    arrayReduct.push(objInsurance.staffBHTN)
                    arrayReduct.push(objInsurance.staffBHTNLD)
                    arrayReduct.push(objInsurance.staffBHXH + objInsurance.companyBHXH + objInsurance.staffBHYT + objInsurance.companyBHYT + objInsurance.staffBHTN + objInsurance.companyBHTN + objInsurance.staffBHTNLD)
                    for (var i = 0; i < arrayHeader.length; i++) {
                        if (i <= 3) {
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
                                .string(arrayHeader[i] + ' ' + arrayReduct[i] + '%')
                                .style(styleHearder);
                        }
                        row += 1
                        ws.column(row).setWidth(20);
                    }
                    for (var i = 0; i < data.length; i++) {
                        let wages = data[i].bhxhSalary ? data[i].bhxhSalary : 0;
                        ws.cell(5 + i, 1).number(data[i].stt).style(stylecell)
                        ws.cell(5 + i, 2).string(data[i].nameStaff ? data[i].nameStaff : 0).style(stylecell)
                        ws.cell(5 + i, 3).number(data[i].coefficientsSalary ? data[i].coefficientsSalary : 0).style(stylecell)
                        ws.cell(5 + i, 4).number(wages).style(stylecell)
                        ws.cell(5 + i, 5).number(wages * objInsurance.companyBHXH / 100).style(stylecell)
                        ws.cell(5 + i, 6).number(wages * objInsurance.staffBHXH / 100).style(stylecell)
                        ws.cell(5 + i, 7).number(wages * objInsurance.companyBHYT / 100).style(stylecell)
                        ws.cell(5 + i, 8).number(wages * objInsurance.staffBHYT / 100).style(stylecell)
                        ws.cell(5 + i, 9).number(wages * objInsurance.companyBHTN / 100).style(stylecell)
                        ws.cell(5 + i, 10).number(wages * objInsurance.staffBHTN / 100).style(stylecell)
                        ws.cell(5 + i, 11).number(wages * objInsurance.staffBHTNLD / 100).style(stylecell)
                        ws.cell(5 + i, 12).number(wages * (objInsurance.staffBHXH + objInsurance.companyBHXH + objInsurance.staffBHYT + objInsurance.companyBHYT + objInsurance.staffBHTN + objInsurance.companyBHTN + objInsurance.staffBHTNLD) / 100).style(stylecell)
                    }
                    await wb.write('C:/images_services/ageless_sendmail/export_excel_insurance_premiums.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://103.154.100.26:1357/ageless_sendmail/export_excel_insurance_premiums.xlsx',
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
    // let body = req.body
    //     // console.log(body);
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 fs.readFile(path.join('D:/images_services/ageless_sendmail/', 'template1.xlsx'), async function (err, data) {

    //                     // Create a template
    //                     var template = new XlsxTemplate(data);

    //                     // Replacements take place on first sheet
    //                     var sheetNumber = 1;

    //                     var obj = await getDetailYCMS(db, body.id)
    //                     // console.log(obj);
    //                     // Set up some placeholder values matching the placeholders in the template
    //                     var arrayTaiSan = obj.arrayTaiSan.concat(obj.arrayVPP)
    //                     var values = {
    //                         requireDate: obj.requireDate,
    //                         namePhongBan: obj.namePhongBan ? obj.namePhongBan : '',
    //                         nameNhanVien: obj.nameNhanVien ? obj.nameNhanVien : '',
    //                         namePheDuyet1: obj.namePheDuyet1 ? obj.namePheDuyet1 : '',
    //                         namePheDuyet2: obj.namePheDuyet2 ? obj.namePheDuyet2 : '',
    //                         arrayTaiSan: arrayTaiSan,
    //                         price: obj.price ? obj.price : 0,
    //                         reason: obj.reason ? obj.reason : '',
    //                         arrayFile: obj.arrayFile,
    //                     };
    //                     // Perform substitution
    //                     template.substitute(sheetNumber, values);

    //                     // Get binary data
    //                     var data = template.generate();
    //                     fs.writeFileSync('D:/images_services/ageless_sendmail/test.xlsx', data, 'binary');
    //                     res.json(Result.SYS_ERROR_RESULT)

    //                 });
    //             } catch (error) {
    //                 console.log(error);
    //                 res.json(Result.SYS_ERROR_RESULT)
    //             }
    //         } else {
    //             res.json(Constant.MESSAGE.USER_FAIL)
    //         }
    //     })
    // },
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
                            link: 'http://103.154.100.26:1357/ageless_sendmail/export_excel_ycms.xlsx',
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
    }
}