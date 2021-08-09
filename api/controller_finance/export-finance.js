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
const JSZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const path = require('path');
const libre = require('libreoffice-convert-win');
var mModules = require('../constants/modules');
var mtblPaymentAccounting = require('../tables/financemanage/tblPaymentAccounting')
var mtblDMTaiKhoanKeToan = require('../tables/financemanage/tblDMTaiKhoanKeToan')

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
async function getDetailCustomer(id) {
    dataCustomer = [{
        "customerCode": "KH0001",
        "name": "Công ty tnhh An Phú",
        "attributesChangeLog": "Công ty chuyên về lắp ráp linh kiện",
        "tax": "123456789",
        "countryName": "Việt Nam",
        "address": "Số 2 Hoàng Mai Hà Nội",
        "mobile": "098705124",
        "fax": "01234567",
        "email": "anphu@gmail.com",
        "id": 1,
    },
    {
        "customerCode": "KH0002",
        "name": "Công ty tnhh Is Tech Vina",
        "attributesChangeLog": "Công ty chuyên sản xuất bánh kẹo ",
        "tax": "01245870",
        "countryName": "Việt Nam",
        "address": "Số 35 Bạch mai Cầu Giấy Hà Nội",
        "mobile": "082457145",
        "fax": "0241368451",
        "email": "istech@gmail.com",
        "id": 2,
    },
    {
        "customerCode": "KH0003",
        "name": "Công ty cổ phần Orion Việt Nam",
        "attributesChangeLog": "Công ty chuyên sản xuất bánh kẹo",
        "tax": "012341250",
        "countryName": "Việt nam",
        "address": "Số 12 Bạch Mai Hà Nội",
        "mobile": "0315456554",
        "fax": "132456545",
        "email": "orion13@gmail.com",
        "id": 3,
    },
    {
        "customerCode": "KH0004",
        "name": "Công ty TNHH Rồng Việt",
        "attributesChangeLog": "Công ty chuyên cung cấp thiết bị điện lạnh",
        "tax": "01323255",
        "countryName": "Việt Nam",
        "address": "Số 11 Vĩnh Tuy Hai Bà Trưng Hà Nội",
        "mobile": "0445445474",
        "fax": "1135635",
        "email": "rongviet@gmail.com",
        "id": 4,
    },
    {
        "customerCode": "KH0005",
        "name": "Công ty cổ phần và thương mại Đức Việt",
        "attributesChangeLog": "Công ty chuyên cung cấp thức ăn đông lạnh ",
        "tax": "017654124",
        "countryName": "Việt Nam",
        "address": "Số 389 Lĩnh Nam Hoàng mai Hà Nội",
        "mobile": "0444545401",
        "fax": "75241241241",
        "email": "ducviet0209@gmail.com",
        "id": 5,
    },
    {
        "customerCode": "KH0006",
        "name": "Công ty TNHH 1 thành viên Bảo Minh",
        "attributesChangeLog": "Công ty chuyên cung cấp cácclaoị thực phẩm khô",
        "tax": "154654565",
        "countryName": "Việt Nam",
        "address": "Số 25 Ba Đình Hà Nội",
        "mobile": "045102474",
        "fax": "02137244",
        "email": "baominh56@gmail.com",
        "id": 6,
    },
    {
        "customerCode": "KH0007",
        "name": "Công ty Sx và Tm Minh Hòa",
        "attributesChangeLog": "Công ty chuyên cung cấp lao động thời vụ",
        "tax": "04785635432",
        "countryName": "Việt Nam",
        "address": "Số 21 Hàng Mã Hà Nội",
        "mobile": "0045454510",
        "fax": "415265654",
        "email": "minhhoa1212@gmail.com",
        "id": 7,
    },
    {
        "customerCode": "KH0008",
        "name": "Công ty cổ phần EC",
        "attributesChangeLog": "Công ty chuyên cung cấp đồ gá khuôn jig",
        "tax": "45454545",
        "countryName": "Việt Nam",
        "address": "Số 13 đường 17 KCN Tiên Sơn Bắc Ninh",
        "mobile": "012345474",
        "fax": "012244635",
        "email": "ec1312@gmail.com",
        "id": 8,
    },
    {
        "customerCode": "KH0009",
        "name": "Công ty cổ phần Thu Hương",
        "attributesChangeLog": "Công ty chuyên cung cấp suất ăn công  nghiệp",
        "tax": "012546565",
        "countryName": "Việt Nam",
        "address": "Số 24 Bạch Mai Hà Nội",
        "mobile": "015245454",
        "fax": "45552478",
        "email": "thuhuong34@gmail.com",
        "id": 9,
    },
    {
        "customerCode": "KH0010",
        "name": "Công ty tnhh Hòa Phát",
        "attributesChangeLog": "Công ty chuyên sản xuất tôn ngói ",
        "tax": "014775745",
        "countryName": "Việt Nam",
        "address": "Số 2 Phố Huế Hà Nội",
        "mobile": "045245401",
        "fax": "021455235",
        "email": "hoaphat0102@gmail.com",
        "id": 10,
    },
    ]
    var obj = {}
    dataCustomer.forEach(item => {
        if (item.id == id) {
            obj = item
        }
    })
    return obj

}
async function getDetailStaff(id) {
    dataStaff = [

        {
            id: 1,
            staffCode: 'NV001',
            fullName: 'NGUYỄN THỊ THU',
            gender: 'Nữ',
            birthday: '20/03/1992',
            cmndNumber: '125457789',
            address: 'Số 13 Hoàng Mai Hà Nội',
            mobile: '065817845',
            email: 'thu123@gmail.com',
            departmentName: 'Ban MKT',
            branchName: 'Việt Nam',
        },
        {
            id: 2,
            staffCode: 'NV002',
            fullName: 'Nguyễn Anh Tuấn',
            gender: 'Nam',
            birthday: '15/04/1994',
            cmndNumber: '123789210',
            address: 'Số 21A Kim Ngưu Hoàng Mai Hai Bà Trưng Hà Nội',
            mobile: '067812345',
            email: 'tuanna@gmail.com',
            departmentName: 'Ban sáng chế',
            branchName: 'Việt Nam',
        },
        {
            id: 3,
            staffCode: 'NV003',
            fullName: 'LÊ THỊ THẢO',
            gender: 'Nữ',
            birthday: '25/10/1997',
            cmndNumber: '125654421',
            address: 'Số 203 Minh Khai Hà Nội',
            mobile: '0989705248',
            email: 'lethao.nap@gmail.com',
            departmentName: 'Ban kế toán',
            branchName: 'Việt Nam',
        },
        {
            id: 4,
            staffCode: 'NV004',
            fullName: 'Phạm Đức Anh',
            gender: 'Nam',
            birthday: '10/05/1985',
            cmndNumber: '121012351',
            address: 'Số 2 Đào Tấn Hà Nội',
            mobile: '0365412784',
            email: 'anhduc12@gmail.com',
            departmentName: 'Ban sáng chế',
            branchName: 'Việt Nam',
        },
        {
            id: 5,
            staffCode: 'NV005',
            fullName: 'Trần Quỳnh Trang',
            gender: 'Nữ',
            birthday: '18/03/1991',
            cmndNumber: '125317451',
            address: 'Số 23 Tam Trinh Hoàng Mai Hà Nội',
            mobile: '0368451274',
            email: 'trang123@gmail.com',
            departmentName: 'Ban NH1',
            branchName: 'Việt Nam',
        },
        {
            id: 6,
            staffCode: 'NV006',
            fullName: 'Nguyễn Thị Thu Trang',
            gender: 'Nữ',
            birthday: '20/09/1988',
            cmndNumber: '12612468',
            address: 'Số 1B Ngõ 286 Lĩnh Nam Hoàng Mai Hà Nội',
            mobile: '098714521',
            email: 'thutrang@gmail.com',
            departmentName: 'Ban Kế toán',
            branchName: 'Việt Nam',
        },
        {
            id: 7,
            staffCode: 'NV007',
            fullName: 'Vũ Văn Chiến',
            gender: 'Nam',
            birthday: '16/06/1990',
            cmndNumber: '125781423',
            address: 'Số 25 Ngọc Lâm Long Biên Hà Nội',
            mobile: '083654127',
            email: 'vvchien@gmail.com',
            departmentName: 'Ban Sáng chế',
            branchName: 'Việt Nam',
        },
        {
            id: 8,
            staffCode: 'NV008',
            fullName: 'lê Thị Ngọc Diệp',
            gender: 'Nữ',
            birthday: '25/10/1996',
            cmndNumber: '125021342',
            address: 'Số 3B Hàng Mã Hà Nội',
            mobile: '012784125',
            email: 'diephn@gmail.com',
            departmentName: 'Ban Sáng chế',
            branchName: 'Việt Nam',
        },
        {
            id: 9,
            staffCode: 'NV009',
            fullName: 'Vũ Quang Minh',
            gender: 'Nam',
            birthday: '06/06/1980',
            cmndNumber: '126120412',
            address: 'Số 86 Thái Hà Hà Nội',
            mobile: '086234517',
            email: 'vuminh@gmail.com',
            departmentName: 'Ban NH2',
            branchName: 'Việt Nam',
        },
        {
            id: 10,
            staffCode: 'NV010',
            fullName: 'Nguyễn Thị Thu Hà',
            gender: 'Nữ',
            birthday: '14/02/1985',
            cmndNumber: '121453245',
            address: 'Số 26 Hàng Chiếu Hà Nội',
            mobile: '089631242',
            email: 'thuha12@gmail.com',
            departmentName: 'Ban Kế toán',
            branchName: 'Việt Nam',
        },
    ]
    var obj = {}
    dataStaff.forEach(item => {
        if (item.id == id) {
            obj = item
        }
    })
    return obj

}
async function getDetailPartner(id) {
    dataPartner = [{
        id: "2",
        partnerCode: "LOCK LOCK",
        name: "Công ty TNHH Lock & Lock",
        tax: "01245782110",
        address: "Số 72A Nguyễn Trãi phường Thượng Đỉnh Thanh Xuân Hà Nội",
        mobile: "0823145678",
        fax: "045784124",
        email: "locklockvn@gmail",
    },
    {
        id: "3",
        partnerCode: "HOA PHAT",
        name: "Công ty TNHH Hòa Phát ",
        tax: "012345678",
        address: "Số 12 Bạch Mai Hà Nội",
        mobile: "089745120",
        fax: "023145216",
        email: "hoaphat123@gmail.com",
    },
    {
        id: "4",
        partnerCode: "MEDIA MART",
        name: "Siêu thị điện máy xanh media mart",
        tax: "012345801",
        address: "Số 1 Trương Định Hà Nội",
        mobile: "089724152",
        fax: "021465741",
        email: "mediamart4546@gmail.com",
    },
    {
        id: "5",
        partnerCode: "GLOMED",
        name: "Công ty dược phẩm Glomed  ",
        tax: "012465563",
        address: "Số 34 Huỳnh Thúc Kháng Hà Nội",
        mobile: "012568523",
        fax: "012457821",
        email: "glomeddp@gmail.com",
    },
    {
        id: "6",
        partnerCode: "THUONG ĐINH",
        name: "Công ty giầy Thượng Đỉnh",
        tax: "012489660",
        address: "Số 2 Kim Ngưu Hà Nội",
        mobile: "021565635",
        fax: "014653225",
        email: "thuongdinhgiay@gmail.com",
    },
    {
        id: "7",
        partnerCode: "GIAY THANG LONG",
        name: "Công ty TNHH giày Thăng Long",
        tax: "012457821",
        address: "Số 2A Phường Khương Trung Thanh Xuân Hà Nội",
        mobile: "012465623",
        fax: "01774125",
        email: "giaytot@gmail.com",
    },
    {
        id: "8",
        partnerCode: "VINH DOAN",
        name: "Công ty cổ phần Vĩnh Đoàn",
        tax: "012458990",
        address: "Số 60 Vĩnh Tuy Hai Bà Trưng Hà Nội",
        mobile: "021565650",
        fax: "0158555245",
        email: "vinhdoan123@gmail.com",
    },
    {
        id: "9",
        partnerCode: "SINO VANLOCK",
        name: "Công ty sản xuất thiết bị điện Sino vanlock",
        tax: "0124456685",
        address: "SỐ 10 nguyễn Văn Cừ Long Biên Hà Nội",
        mobile: "0154878741",
        fax: "0157878865",
        email: "sinovanlock@gmail.com",
    },
    {
        id: "10",
        partnerCode: "TRUNG NGUYEN",
        name: "Tập đoàn cà phê Trung Nguyên",
        tax: "0125748546",
        address: "Thị Cấm Phường Xuân Phương Nam Từ Liêm Hà Nội",
        mobile: "045654565",
        fax: "013245422",
        email: "trugnnguyen@gmail.com",
    },

    ]
    var obj = {}
    dataPartner.forEach(item => {
        if (item.id == id) {
            obj = item
        }
    })
    return obj

}
async function getDetailReceiptsPayment(db, idPayment) {
    let objResult = {}
    try {
        let tblReceiptsPayment = mtblReceiptsPayment(db);
        await tblReceiptsPayment.findOne({
            where: { ID: idPayment },
        }).then(async data => {
            if (data) {
                let obj = {
                    "NGÀY": data.Date ? data.Date : null,
                    "THÁNG": data.Date ? data.Date : null,
                    "NĂM": data.Date ? data.Date : null,
                    "SỐ PHIẾU": data.CodeNumber ? data.CodeNumber : '',
                    "ĐỊA CHỈ": data.Address ? data.Address : '',
                    "LÝ DO": data.Reason ? data.Reason : '',
                    "SỐ TIỀN": data.Amount ? data.Amount : null,
                    "SỐ TIỀN BẰNG CHỮ": data.AmountWords ? data.AmountWords : '',
                };
                let objName = ''
                if (data.IDStaff) {
                    let staff = await mtblDMNhanvien(db).findOne({
                        where: { ID: data.IDStaff }
                    })
                    objName = '[' + (staff ? staff.StaffCode : '') + '] ' + (staff ? staff.StaffName : '');
                } else if (data.IDPartner) {
                    let dataPartner = await getDetailPartner(data.IDPartner)
                    objName = '[' + (dataPartner ? dataPartner.partnerCode : '') + '] ' + (dataPartner ? dataPartner.name : '');
                } else {
                    let dataCus = await getDetailCustomer(data.IDCustomer)
                    objName = '[' + (dataCus ? dataCus.customerCode : '') + '] ' + (dataCus ? dataCus.name : '');
                }
                obj['ĐỐI TƯỢNG'] = objName
                let nameCredit = ''
                let namedebit = ''
                let tblPaymentAccounting = mtblPaymentAccounting(db);
                tblPaymentAccounting.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDAccounting', sourceKey: 'IDAccounting', as: 'acc' })
                await tblPaymentAccounting.findAll({
                    include: [{
                        model: mtblDMTaiKhoanKeToan(db),
                        required: false,
                        as: 'acc'
                    },],
                    where: {
                        IDReceiptsPayment: data.ID,
                        type: "CREDIT"
                    }
                }).then(data => {
                    for (let d = 0; d < data.length; d++) {
                        if (d < data.length.length - 1)
                            nameCredit += (data[d].acc ? data[d].acc.AccountingCode : '') + ', '
                        else
                            nameCredit += (data[d].acc ? data[d].acc.AccountingCode : '')
                    }
                })
                await tblPaymentAccounting.findAll({
                    include: [{
                        model: mtblDMTaiKhoanKeToan(db),
                        required: false,
                        as: 'acc'
                    },],
                    where: {
                        IDReceiptsPayment: data.ID,
                        type: "DEBIT"
                    }
                }).then(data => {
                    for (let d = 0; d < data.length; d++) {
                        if (d < data.length.length - 1)
                            namedebit += (data[d].acc ? data[d].acc.AccountingCode : '') + ', '
                        else
                            namedebit += (data[d].acc ? data[d].acc.AccountingCode : '')
                    }
                })
                obj['NỢ TK'] = namedebit
                obj['CÓ TK'] = nameCredit
                obj['type'] = data.Type
                objResult = obj
            }
        })
    } catch (error) {
        console.log(error);
    }
    return objResult
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
    // pour_data_into_work_file_and_convert_to_pdf
    pourDataIntoWorkFileAndConvertToPDF: async (req, res) => {
        let body = req.body;
        console.log(body);
        var objKey = {}
        await database.connectDatabase().then(async db => {
            if (db) {
                objKey = await getDetailReceiptsPayment(db, body.id)
            }
        })
        let type = '02-TT.docx'
        let nameFile = 'Phiếu chi.docx'
        let nameFilePDF = 'Phiếu chi pdf.pdf'
        if (objKey != {} && objKey.type == 'receipt') {
            type = '01-TT.docx'
            nameFile = 'Phiếu thu.docx'
            nameFilePDF = 'Phiếu thu pdf.pdf'
        }
        var pathTo = 'D:/images_services/ageless_sendmail/'
        fs.readFile(pathTo + type, 'binary', async function (err, data) {
            try {
                if (err) {
                    console.log(err);
                    var result = {
                        status: Constant.STATUS.FAIL,
                        message: 'File không tồn tại. Vui lòng cầu hình lại!',
                    }
                    res.json(result);
                } else {
                    var zip = new JSZip(data);
                    var doc = new Docxtemplater().loadZip(zip)
                    //set the templateVariables
                    doc.setData(objKey);
                    doc.render()
                    var buf = doc.getZip().generate({ type: 'nodebuffer' });
                    fs.writeFileSync(path.resolve(pathTo, nameFile), buf);
                    var pathlink = 'D:/images_services/ageless_sendmail/' + nameFile;
                    var pathEx = 'D:/images_services/ageless_sendmail/' + nameFilePDF;
                    await mModules.convertDocxToPDF(pathlink, pathEx)
                    var result = {
                        link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + nameFilePDF,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                }
            } catch (error) {
                console.log(error);
                res.json('Lỗi file export. Vui lòng cầu hình lại!')
            }
        });
    },
}