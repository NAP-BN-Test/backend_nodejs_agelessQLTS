const axios = require('axios');
const Result = require('../constants/result');
const Constant = require('../constants/constant');
var mtblInvoice = require('../tables/financemanage/tblInvoice')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblCustomer = require('../tables/financemanage/tblCustomer');
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblCurrency = require('../tables/financemanage/tblCurrency')
var mtblRate = require('../tables/financemanage/tblRate')
var moment = require('moment');
var ctlInvoice = require('../controller_finance/ctl-tblInvoice')

const Op = require('sequelize').Op;
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')
var mtblPaymentRInvoice = require('../tables/financemanage/tblPaymentRInvoice')
var mtblInvoiceRCurrency = require('../tables/financemanage/tblInvoiceRCurrency')
var mtblDMTaiKhoanKeToan = require('../tables/financemanage/tblDMTaiKhoanKeToan')
// data model invoice của KH
let data = [];
totalMoney = [{
    total: 1000000000,
    type: 'VND',
},
{
    total: 1000,
    type: 'USD',
}
];
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

function checkDuplicate(array, elm) {
    var check = false;
    array.forEach(item => {
        if (item === elm) check = true;
    })
    return check;
}
var database = require('../database');
var mtblDMNhaCungCap = require('../tables/qlnb/tblDMNhaCungCap');
var mtblDMUser = require('../tables/constants/tblDMUser');

async function calculateTheTotalForCredit(array) {
    let arrayResult = []
    let total = 0
    for (let i = 0; i < array.length; i++) {
        total += Number(array[i].total)
    }
    arrayResult.push({
        type: 'VND',
        total: total
    })
    return arrayResult
}
async function calculateTheTotalAmountOfEachCurrency(array) {
    let arrayResult = []
    let arrayCheck = []
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].arrayMoney.length; j++) {
            if (!checkDuplicate(arrayCheck, array[i].arrayMoney[j].typeMoney)) {
                arrayCheck.push(array[i].arrayMoney[j].typeMoney)
                arrayResult.push({
                    total: Number(array[i].arrayMoney[j].total),
                    type: array[i].arrayMoney[j].typeMoney,
                    date: array[i].createdDate,
                })
            } else {
                arrayResult.forEach(element => {
                    if (element.type == array[i].arrayMoney[j].typeMoney) {
                        element.total += Number(array[i].arrayMoney[j].total)
                    }
                })
            }
        }
    }
    return arrayResult
}
let dataCustomer = [{
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
{
    "customerCode": "KH0011",
    "name": "Cơ quan nhà nước",
    "attributesChangeLog": "Cơ quan nhà nước",
    "tax": "014775745",
    "countryName": "Việt Nam",
    "address": "Số 2 Phố Huế Hà Nội",
    "mobile": "045245401",
    "fax": "021455235",
    "email": "cqnnvn@gmail.com",
    "id": 11,
},
]

async function getListCustomerOfPMCM(db, id = null) {
    let arrayResult = []
    let where = {}
    if (id)
        where = {
            ID: id
        }
    await mtblCustomer(db).findAll({
        where: where
    }).then(customer => {
        for (let cus of customer) {
            arrayResult.push({
                "customerCode": "",
                "name": cus.Name ? cus.Name : '',
                // "attributesChangeLog": "Công ty chuyên về lắp ráp linh kiện",
                "tax": cus.Tax ? cus.Tax : '',
                "countryName": cus.CountryName ? cus.CountryName : '',
                "address": cus.Address ? cus.Address : '',
                "mobile": cus.Mobile ? cus.Mobile : '',
                "fax": cus.Fax ? cus.Fax : '',
                "email": cus.email ? cus.email : '',
                "idPMCM": cus.IDSpecializedSoftware ? cus.IDSpecializedSoftware : null,
                "id": cus.ID ? cus.ID : null,
            })
        }
    })
    return arrayResult
}
async function getListInvoiceAndCreditOfPMCM(db) {
    let arrayResult = []
    let tblInvoice = mtblInvoice(db);
    let tblDMUser = mtblDMUser(db);
    let tblDMNhanvien = mtblDMNhanvien(db);
    tblInvoice.belongsTo(mtblCustomer(db), { foreignKey: 'IDCustomer', sourceKey: 'IDCustomer', as: 'cus' })
    tblDMUser.belongsTo(tblDMNhanvien, { foreignKey: 'IDNhanvien', sourceKey: 'IDNhanvien', as: 'staff' })
    tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'department' })
    tblInvoice.belongsTo(tblDMUser, { foreignKey: 'UserID', sourceKey: 'UserID', as: 'user' })
    await tblInvoice.findAll(
        {
            include: [
                {
                    model: mtblCustomer(db),
                    required: false,
                    as: 'cus'
                },
                {
                    model: tblDMUser,
                    required: false,
                    as: 'user',
                    include: [
                        {
                            model: tblDMNhanvien,
                            required: false,
                            as: 'staff',
                            include: [
                                {
                                    model: mtblDMBoPhan(db),
                                    required: false,
                                    as: 'department'
                                },
                            ],
                        },
                    ],
                },
            ],
        }
    ).then(async invoice => {
        for (let inv of invoice) {
            arrayResult.push({
                id: inv.IDSpecializedSoftware ? inv.IDSpecializedSoftware : null,
                createdDate: inv.CreatedDate,
                refNumber: inv.RefNumber ? JSON.parse(inv.RefNumber) : '',
                invoiceNumber: inv.InvoiceNumber,
                typeMoney: inv.TypeMoney,
                moneyTotal: inv.MoneyTotal,
                statusName: inv.Status,
                idCustomer: inv.IDCustomer,
                customerName: inv.IDCustomer ? inv.cus.Name : '',
                content: inv.Contents,
                request: inv.Request,
                userID: inv.UserID,
                userName: inv.UserID ? inv.user.Username : '',
                departmentName: inv.UserID ? (inv.user.staff ? (inv.user.staff.IDBoPhan ? inv.user.staff.IDBoPhan.DepartmentName : null) : null) : '',
                departmentID: inv.UserID ? (inv.user.staff ? inv.user.staff.IDBoPhan : null) : '',
                accounting: '131',
                nameAccounting: 'Phải thu khách hàng',
            })
        }
    })
    return arrayResult
}

// data
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
async function calculateMoneyFollowVND(db, typeMoney, total, date) {
    let exchangeRate = 1;
    let result = 0;
    let currency = await mtblCurrency(db).findOne({
        where: { ShortName: typeMoney }
    })
    if (currency)
        await mtblRate(db).findOne({
            where: {
                Date: {
                    [Op.substring]: date
                },
                IDCurrency: currency.ID
            },
            order: [
                ['ID', 'DESC']
            ],
        }).then(async Rate => {
            if (Rate)
                exchangeRate = Rate.ExchangeRate
            else {
                let searchNow = moment().format('YYYY-MM-DD');
                await mtblRate(db).findOne({
                    where: {
                        Date: {
                            [Op.substring]: searchNow
                        },
                        IDCurrency: currency.ID
                    },
                    order: [
                        ['ID', 'DESC']
                    ],
                }).then(Rate => {
                    if (Rate)
                        exchangeRate = Rate.ExchangeRate
                    else {

                    }
                })
            }
        })
    result = ((exchangeRate ? exchangeRate : 1) * total)
    return result
}
async function getExchangeRateFromDate(db, typeMoney, date) {
    let exchangeRate = 1;
    let result = {};
    let currency = await mtblCurrency(db).findOne({
        where: { ShortName: typeMoney }
    })
    if (currency)
        await mtblRate(db).findOne({
            where: {
                Date: {
                    [Op.substring]: date
                },
                IDCurrency: currency.ID
            },
            order: [
                ['ID', 'DESC']
            ],
        }).then(async Rate => {
            if (Rate)
                result = {
                    typeMoney: typeMoney,
                    exchangeRate: Rate.ExchangeRate,
                }
            else {
                let searchNow = moment().format('YYYY-MM-DD');
                await mtblRate(db).findOne({
                    where: {
                        Date: {
                            [Op.substring]: searchNow
                        },
                        IDCurrency: currency.ID
                    },
                    order: [
                        ['ID', 'DESC']
                    ],
                }).then(Rate => {
                    if (Rate)
                        result = {
                            typeMoney: typeMoney,
                            exchangeRate: Rate.ExchangeRate,
                        }
                })
            }
        })
    return result
}
module.exports = {
    getListCustomerOfPMCM,
    getListInvoiceAndCreditOfPMCM,
    // change_customer_data
    changeCustomerData: async (req, res) => {
        let body = req.body;
        try {
            console.log(12345, body);
            var result = {
                status: Constant.STATUS.SUCCESS,
            }
            res.json(result);
        } catch (error) {
            console.log(error);
        }
    },
    // change_invoice_or_credit_data
    changeInvoiceOrCreditData: async (req, res) => {
        let body = req.body;
        try {
            console.log(12345, body);
            var result = {
                status: Constant.STATUS.SUCCESS,
            }
            res.json(result);
        } catch (error) {
            console.log(error);
        }
    },
    // get_list_department
    getListDepartment: async (req, res) => {
        await axios.get(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/department/share`).then(data => {
            if (data) {
                var result = {
                    array: data.data.data,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    all: data.data.data.length
                }
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
            // console.log(data.data);
        })
    },
    // get_list_partner
    getListPartner: async (req, res) => {
        dataPartner = []
        // await axios.get(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/address_book/share`).then(data => {
        // console.log(data.data);
        if (dataPartner) {
            var result = {
                array: dataPartner,
                // array: data.data.data,
                status: Constant.STATUS.SUCCESS,
                message: Constant.MESSAGE.ACTION_SUCCESS,
                // all: data.data.data.length
                all: 10
            }
            res.json(result);
        } else {
            res.json(Result.SYS_ERROR_RESULT)
        }
        // console.log(data.data);
        // })
    },
    // get_list_customer
    getListCustomer: async (req, res) => {
        let obj = {
            "paging": {
                "pageSize": 0,
                "currentPage": 0,
                "rowsCount": 0
            }
        }
        try {
            database.connectDatabase().then(async db => {
                try {
                    if (db) {
                        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/address_book/list_pmtc`, obj).then(async data => {
                            console.log('------------------------------------------- Đã kết nối với PMCM -----------------------------------------');
                            for (let cus of data.data.data.list) {
                                let cucCheck = await mtblCustomer(db).findOne({
                                    where: {
                                        IDSpecializedSoftware: cus.id ? cus.id : null
                                    }
                                })
                                if (!cucCheck)
                                    await mtblCustomer(db).create({
                                        IDSpecializedSoftware: cus.id ? cus.id : null,
                                        Name: cus.name ? cus.name : '',
                                        Code: cus.code ? cus.code : '',
                                        Address: cus.address ? cus.address : '',
                                        Emails: cus.emails ? cus.emails : '',
                                        Email: cus.email ? cus.email : '',
                                        ContactPersonEmail: cus.contactPersonEmail ? cus.contactPersonEmail : '',
                                        Mobile: cus.mobile ? cus.mobile : '',
                                        Fax: cus.fax ? cus.fax : '',
                                        CountryName: cus.countryName ? cus.countryName : '',
                                        CreatedDate: cus.createdDate ? cus.createdDate : null,
                                        Tax: cus.tax ? cus.tax : '',
                                        OldID: cus.oldId ? cus.oldId : null,
                                        NewID: cus.newId ? cus.newId : null,
                                        Debt: cus.debt ? cus.debt : '',
                                        Note: cus.note ? cus.note : '',
                                        DebtDate: cus.debtDate ? cus.debtDate : null,
                                        DebtDescription: cus.debtDescription ? cus.debtDescription : '',
                                    })
                                else
                                    await mtblCustomer(db).update({
                                        Name: cus.name ? cus.name : '',
                                        Address: cus.address ? cus.address : '',
                                        Emails: cus.emails ? cus.emails : '',
                                        Email: cus.email ? cus.email : '',
                                        ContactPersonEmail: cus.contactPersonEmail ? cus.contactPersonEmail : '',
                                        Mobile: cus.mobile ? cus.mobile : '',
                                        Fax: cus.fax ? cus.fax : '',
                                        CountryName: cus.countryName ? cus.countryName : '',
                                        CreatedDate: cus.createdDate ? cus.createdDate : null,
                                        Tax: cus.tax ? cus.tax : '',
                                        OldID: cus.oldId ? cus.oldId : null,
                                        NewID: cus.newId ? cus.newId : null,
                                        Debt: cus.debt ? cus.debt : '',
                                        Note: cus.note ? cus.note : '',
                                        DebtDate: cus.debtDate ? cus.debtDate : null,
                                        DebtDescription: cus.debtDescription ? cus.debtDescription : '',
                                    }, {
                                        where: {
                                            IDSpecializedSoftware: cus.id ? cus.id : null,
                                        }
                                    })
                            }
                        })
                        res.json(1);
                    }
                } catch (error) {
                    console.log(error);
                }

            })

        } catch (error) {
            console.log(error + '');
        }
    },
    // insert_data_invoice_and_credit
    insertDataInvoiceAndCredit: async (req, res) => {
        let obj = {
            "paging": {
                "pageSize": 10000000,
                "currentPage": 1,
                "rowsCount": 0
            }
        }
        try {
            database.connectDatabase().then(async db => {
                try {
                    if (db) {
                        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/list_pmtc`, obj).then(async data => {
                            console.log('------------------------------------------------------Đã kết nối với PMCM-------------------------------------------------------------');
                            for (let inv of data.data.data.list) {
                                let invCheck = await mtblInvoice(db).findOne({
                                    where: {
                                        IDSpecializedSoftware: inv.id ? inv.id : null
                                    }
                                })
                                let status = inv.status == 2 ? 'Chờ thanh toán' : (inv.status == 3 ? 'Yêu cầu sửa' : (inv.status == 4 ? 'Yêu cầu xóa' : (inv.status == 5 ? 'Yêu cầu thanh toán' : 'Chờ thanh toán')))
                                let request = inv.status == 3 ? 'Yêu cầu sửa' : (inv.status == 4 ? 'Yêu cầu xóa' : (inv.status == 5 ? 'Yêu cầu thanh toán' : ''))
                                let customer = !inv.addressBookId ? null : await mtblCustomer(db).findOne({
                                    where: {
                                        IDSpecializedSoftware: inv.addressBookId
                                    }
                                })
                                let user = !inv.userName ? null : await mtblDMUser(db).findOne({
                                    where: {
                                        Username: inv.userName
                                    }
                                })
                                let account = !inv.recondingTxName ? null : await mtblDMTaiKhoanKeToan(db).findOne({
                                    where: {
                                        AccountingCode: inv.recondingTxName
                                    }
                                })
                                let typeMoney = inv.grandTotal.length >= 1 ? (inv.grandTotal[0].unit == 1 ? 'USD' : (inv.grandTotal[0].unit == 2 ? 'EURO' : (inv.grandTotal[0].unit == 3 ? 'FRANCE' : 'VND'))) : 'VND'
                                let currency = await mtblCurrency(db).findOne({
                                    where: {
                                        ShortName: typeMoney
                                    }
                                })
                                let moneyTotal = inv.grandTotal.length >= 1 ? inv.grandTotal[0].total : null
                                if (!invCheck)
                                    await mtblInvoice(db).create({
                                        IDSpecializedSoftware: inv.id ? inv.id : null,
                                        Status: status,
                                        VoucherNumber: null,// chưa thấy dùng đến
                                        Request: request,
                                        Payments: null, // chưa thấy dùng đến
                                        PayDate: null, // bên mình sẽ thanh toán mới tạo
                                        IsInvoice: inv.type == 1 ? true : false,
                                        RefNumber: inv.refDetailModels ? JSON.stringify(inv.refDetailModels) : '',
                                        CreatedDate: inv.createDate ? moment(inv.createDate).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS') : null,
                                        IDCustomer: customer ? customer.ID : null,
                                        InvoiceNumber: inv.no ? inv.no : '',
                                        CurrencyID: currency ? currency.ID : null,
                                        Contents: inv.note ? inv.note : '',
                                        UserID: user ? user.ID : null,
                                        AccountID: account ? account.ID : null,
                                        AccountName: inv.recondingTxName ? inv.recondingTxName : null,
                                        MoneyTotal: moneyTotal,
                                        TypeMoney: typeMoney,
                                        InitialAmount: moneyTotal,
                                        PaidAmount: 0,
                                        UnpaidAmount: moneyTotal,
                                    })
                                else
                                    await mtblInvoice(db).update({
                                        Status: status,
                                        VoucherNumber: null,// chưa thấy dùng đến
                                        Request: request,
                                        Payments: null, // chưa thấy dùng đến
                                        PayDate: null, // bên mình sẽ thanh toán mới tạo
                                        IsInvoice: inv.type == 1 ? true : false,
                                        RefNumber: inv.refDetailModels ? JSON.stringify(inv.refDetailModels) : '',
                                        CreatedDate: inv.createDate ? moment(inv.createDate).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS') : null,
                                        IDCustomer: customer ? customer.ID : null,
                                        InvoiceNumber: inv.no ? inv.no : '',
                                        CurrencyID: currency ? currency.ID : null,
                                        Contents: inv.note ? inv.note : '',
                                        UserID: user ? user.ID : null,
                                        AccountID: account ? account.ID : null,
                                        AccountName: inv.recondingTxName ? inv.recondingTxName : null,
                                        MoneyTotal: moneyTotal,
                                        TypeMoney: typeMoney,
                                        InitialAmount: moneyTotal,
                                        PaidAmount: 0,
                                        UnpaidAmount: moneyTotal,
                                    }, {
                                        where: {
                                            IDSpecializedSoftware: inv.id ? inv.id : null,
                                        }
                                    })
                            }
                        })
                        res.json(1);
                    }
                } catch (error) {
                    res.json(0);
                    console.log(error);
                }

            })

        } catch (error) {
            console.log(error + '');
        }
    },
    // get_list_user
    getListUser: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblDMNhanvien = mtblDMNhanvien(db);
                    tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bp' })

                    tblDMNhanvien.findAll({
                        include: [{
                            model: mtblDMBoPhan(db),
                            required: false,
                            as: 'bp'
                        },],
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                staffCode: element.StaffCode ? element.StaffCode : '',
                                fullName: element.StaffName ? element.StaffName : '',
                                departmentName: element.bp ? element.bp.DepartmentName : '',
                            }
                            array.push(obj);
                        });
                        var result = {
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
    // get_all_object
    getAllObject: async (req, res) => {
        database.connectDatabase().then(async db => {
            if (db) {
                let array = []
                let dataCustomer = await getListCustomerOfPMCM(db)
                for (c = 0; c < dataCustomer.length; c++) {
                    array.push({
                        name: dataCustomer[c].name,
                        address: dataCustomer[c].address,
                        code: dataCustomer[c].customerCode,
                        displayName: '[' + dataCustomer[c].customerCode + '] ' + dataCustomer[c].name,
                        id: dataCustomer[c].id,
                        type: 'customer',
                    })
                }
                await mtblDMNhanvien(db).findAll().then(data => {
                    data.forEach(element => {
                        array.push({
                            name: element.StaffName,
                            code: element.StaffCode,
                            displayName: '[' + element.StaffCode + '] ' + element.StaffName,
                            address: element.Address,
                            id: element.ID,
                            type: 'staff',
                        })
                    })
                })
                await mtblDMNhaCungCap(db).findAll().then(data => {
                    data.forEach(element => {
                        array.push({
                            name: element.SupplierName,
                            code: element.SupplierCode,
                            displayName: '[' + element.SupplierCode + '] ' + element.SupplierName,
                            address: element.Address,
                            id: element.ID,
                            type: 'supplier',
                        })
                    })
                })
                var result = {
                    array: array,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    all: 10
                }
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })

    },

    // Invoice follow customer ------------------------------------------------------------------------------------------------------------------
    // get_list_invoice_from_customer
    getListInvoiceFromCustomer: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                let objWhere = {
                    // Status: 'Chờ thanh toán',
                    IsInvoice: true,
                    IDCustomer: body.idCustomer
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_invoice_wait_for_pay_from_customer
    getListInvoiceWaitForPayFromCustomer: async (req, res) => {
        var body = req.body
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                let objWhere = {
                    Status: 'Chờ thanh toán',
                    IsInvoice: true,
                    IDCustomer: body.idCustomer
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere, body.receiptID ? body.receiptID : null)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_invoice_paid_from_customer
    getListInvoicePaidFromCustomer: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                let objWhere = {
                    Status: 'Đã thanh toán',
                    IsInvoice: true,
                    IDCustomer: body.idCustomer
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },

    // Credit follow customer ------------------------------------------------------------------------------------------------------------------
    // get_list_credit_from_customer
    getListCreditFromCustomer: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                let objWhere = {
                    // Status: 'Chờ thanh toán',
                    IsInvoice: false,
                    IDCustomer: body.idCustomer
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_credit_wait_for_pay_from_customer
    getListCreditWaitForPayFromCustomer: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                let objWhere = {
                    Status: 'Chờ thanh toán',
                    IsInvoice: false,
                    IDCustomer: body.idCustomer
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere, body.idReceiptPayment ? body.idReceiptPayment : null)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_credit_paid_from_customer
    getListCreditPaidFromCustomer: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                let objWhere = {
                    Status: 'Đã thanh toán',
                    IsInvoice: false,
                    IDCustomer: body.idCustomer
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },


    // ------------------------------------------------------------------------------------------------------------------------------------------
    // get_list_invoice_from_partner
    getListInvoiceFromPartner: async (req, res) => {
        var body = req.body
        var obj = {
            "paging": {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },




    // invoice-------------------------------------------------------------------------------------------------------------------------------------
    // get_list_invoice_wait_for_pay
    getListInvoiceWaitForPay: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                let objWhere = {
                    Status: 'Chờ thanh toán',
                    IsInvoice: true,
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)

            }
        })
    },
    // get_list_invoice_paid
    getListInvoicePaid: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                let objWhere = {
                    Status: 'Đã thanh toán',
                    IsInvoice: true,
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)

            }
        })
    },
    // get_list_invoice_edit_request
    getListInvoiceEditRequest: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                let objWhere = {
                    Status: 'Yêu cầu sửa',
                    IsInvoice: true,
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)

            }
        })
    },
    // get_list_invoice_delete_request
    getListInvoiceDeleteRequest: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                let objWhere = {
                    Status: 'Yêu cầu xóa',
                    IsInvoice: true,
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)

            }
        })
    },
    // get_list_invoice_payment_request
    getListInvoicePaymentRequest: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                let objWhere = {
                    Status: 'Yêu cầu thanh toán',
                    IsInvoice: true,
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)

            }
        })
    },

    // credit-------------------------------------------------------------------------------------------------------------------------------------
    // get_list_credit
    getListCredit: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                let objWhere = {
                    IsInvoice: false,
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_credit_wait_for_pay
    getListCreditWaitForPay: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                let objWhere = {
                    Status: 'Chờ thanh toán',
                    IsInvoice: false,
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_credit_paid
    getListCreditPaid: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                let objWhere = {
                    Status: 'Đã thanh toán',
                    IsInvoice: false,
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_credit_edit_request
    getListCreditEditRequest: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            let array = []
            if (db) {
                let objWhere = {
                    Status: 'Yêu cầu sửa',
                    IsInvoice: false,
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_credit_delete_request
    getListCreditDeleteRequest: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            let array = []
            if (db) {
                let objWhere = {
                    Status: 'Yêu cầu xóa',
                    IsInvoice: false,
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_credit_payment_request
    getListCreditPaymentRequest: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            let array = []
            if (db) {
                let objWhere = {
                    Status: 'Yêu cầu thanh toán',
                    IsInvoice: false,
                }
                let result = await ctlInvoice.getDataInvoiceByCondition(db, body.itemPerPage, body.page, objWhere)
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },


    //  api waiting SoftWare
    // -----------------------------------------------------------------------------------INVOICE-------------------------------------------------------------------------------
    // approval_invoice_and_credit
    approvalInvoiceAndCredit: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                await mtblInvoice(db).update({
                    Status: 'Chờ thanh toán',
                    Request: ''
                }, {
                    where: { IDSpecializedSoftware: body.id }
                })
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: 'Đã phê duyệt thành công',
                }
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // refuse_invoice_and_credit
    refuseInvoiceAndCredit: async (req, res) => {
        var body = req.body
        database.connectDatabase().then(async db => {
            if (db) {
                await mtblInvoice(db).update({
                    Status: 'Chờ thanh toán',
                    Request: ''
                }, {
                    where: { IDSpecializedSoftware: body.id }
                })
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: 'Đã phê duyệt thành công',
                }
                res.json(result);
            } else {
                res.json(Result.SYS_ERROR_RESULT)

            }
        })

    },
}