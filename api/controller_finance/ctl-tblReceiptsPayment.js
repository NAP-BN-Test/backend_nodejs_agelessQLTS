const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Sequelize = require('sequelize');

const Result = require('../constants/result');
var moment = require('moment');
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')
var mtblPaymentAccounting = require('../tables/financemanage/tblPaymentAccounting')
var database = require('../database');
var mtblDMTaiKhoanKeToan = require('../tables/financemanage/tblDMTaiKhoanKeToan')
var mtblInvoice = require('../tables/financemanage/tblInvoice')
var mtblPaymentRPayment = require('../tables/financemanage/tblPaymentRPayment')
var mtblPaymentRInvoice = require('../tables/financemanage/tblPaymentRInvoice')
var mtblRate = require('../tables/financemanage/tblRate')
var mtblCurrency = require('../tables/financemanage/tblCurrency')
var mtblVayTamUng = require('../tables/financemanage/tblVayTamUng')
var mtblAccountingBooks = require('../tables/financemanage/tblAccountingBooks')
var mtblTaiSan = require('../tables/qlnb/tblTaiSan')
var mtblDeNghiThanhToan = require('../tables/qlnb/tblDeNghiThanhToan')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');

async function deleteRelationshiptblReceiptsPayment(db, listID) {
    // Trả lại tiền
    var payment = await mtblPaymentRPayment(db).findAll({
        where: {
            IDPayment: {
                [Op.in]: listID
            }
        }
    })
    if (payment) {
        for (var i = 0; i < payment.length; i++) {
            let paymentUpdate = await mtblReceiptsPayment(db).findOne({
                where: { ID: payment[i].IDPaymentR }
            })

            await mtblReceiptsPayment(db).update({
                UnpaidAmount: paymentUpdate.UnpaidAmount + (payment[i].Amount ? payment[i].Amount : 0),
                PaidAmount: paymentUpdate.PaidAmount - (payment[i].Amount ? payment[i].Amount : 0),
                Unknown: true,
            }, {
                where: {
                    ID: payment[i].IDPaymentR
                }
            })
        }
    }
    await mtblPaymentRPayment(db).destroy({
        where: {
            IDPayment: {
                [Op.in]: listID
            }
        }
    })
    await mtblPaymentRPayment(db).destroy({
        where: {
            IDPaymentR: {
                [Op.in]: listID
            }
        }
    })
    await mtblTaiSan(db).update({
        IDReceiptsPayment: null
    }, {
        where: {
            IDReceiptsPayment: {
                [Op.in]: listID
            }
        }
    })
    await mtblAccountingBooks(db).destroy({
        where: {
            IDPayment: {
                [Op.in]: listID
            }
        }
    })
    await mtblReceiptsPayment(db).findAll({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    }).then(async data => {
        for (var i = 0; i < data.length; i++) {
            if (data[i].Type == 'payment')
                await mtblVayTamUng(db).update({
                    IDReceiptsPayment: null,
                    Status: 'Tạo phiếu chi'
                }, {
                    where: {
                        IDReceiptsPayment: data[i].ID
                    }
                })
            else
                await mtblVayTamUng(db).update({
                    IDReceiptsPayment: null,
                    Status: 'Chờ hoàn ứng'
                }, {
                    where: {
                        IDReceiptsPayment: data[i].ID
                    }
                })
        }
    })
    await mtblPaymentRInvoice(db).findAll({
        where: {
            IDPayment: {
                [Op.in]: listID
            }
        }
    }).then(async data => {
        for (let d = 0; d < data.length; d++) {
            if (data[d].IDSpecializedSoftware)
                await mtblInvoice(db).update({
                    Status: 'Chờ thanh toán'
                }, {
                    where: {
                        IDSpecializedSoftware: data[d].IDSpecializedSoftware
                    }
                })
        }
    })
    await mtblPaymentRInvoice(db).destroy({
        where: {
            IDPayment: {
                [Op.in]: listID
            }
        }
    })
    await mtblPaymentRPayment(db).destroy({
        where: {
            IDPayment: {
                [Op.in]: listID
            }
        }
    })
    await mtblPaymentAccounting(db).destroy({
        where: {
            IDReceiptsPayment: {
                [Op.in]: listID
            }
        }
    })

    await mtblReceiptsPayment(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
async function handleCodeNumber(str) {
    var endCode = '';
    if (!str)
        str = 'PT0000'
    var behind = Number(str.slice(2, 10)) + 1
    if (behind < 10)
        endCode = '000' + behind
    if (behind >= 10 && behind < 100)
        endCode = '00' + behind
    if (behind >= 100 && behind < 1000)
        endCode = '0' + behind
    if (behind >= 1000)
        endCode = behind

    return str.slice(0, 2) + endCode
}
async function createRate(db, exchangeRate, idCurrency) {
    let check;
    let searchNow = moment().format('YYYY-MM-DD');
    if (idCurrency)
        check = await mtblRate(db).findOne({
            where: {
                Date: {
                    [Op.substring]: searchNow
                },
                IDCurrency: idCurrency,
            }
        })
    if (check)
        mtblRate(db).update({
            ExchangeRate: exchangeRate ? exchangeRate : null,
        }, { where: { ID: check.ID } })
    else
        mtblRate(db).create({
            IDCurrency: idCurrency ? idCurrency : null,
            Date: searchNow,
            ExchangeRate: exchangeRate ? exchangeRate : null,
        })
}
async function deleteAndCreateAllPayment(db, id, listUndefinedID, withdrawalMoney) {
    // Xóa bản ghi cũ, công lại tiền cho bản ghi cũ
    var payment = await mtblPaymentRPayment(db).findAll({
        where: {
            IDPayment: id
        }
    })
    if (payment) {
        for (var i = 0; i < payment.length; i++) {
            let paymentUpdate = await mtblReceiptsPayment(db).findOne({
                where: { ID: payment[i].IDPaymentR }
            })
            await mtblReceiptsPayment(db).update({
                UnpaidAmount: paymentUpdate.UnpaidAmount + (payment[i].Amount ? payment[i].Amount : 0),
                PaidAmount: paymentUpdate.PaidAmount - (payment[i].Amount ? payment[i].Amount : 0),
            }, {
                where: {
                    ID: payment[i].IDPaymentR
                }
            })
        }
    }
    await mtblPaymentRPayment(db).destroy({
        where: {
            IDPayment: id
        }
    })

    for (var i = 0; i < listUndefinedID.length; i++) {
        if (withdrawalMoney > 0) {
            await mtblReceiptsPayment(db).findOne({
                where: {
                    ID: listUndefinedID[i]
                }
            }).then(async data => {
                if (withdrawalMoney >= data.UnpaidAmount) {
                    withdrawalMoney = withdrawalMoney - data.UnpaidAmount
                    await mtblPaymentRPayment(db).create({
                        IDPayment: id,
                        IDPaymentR: listUndefinedID[i],
                        Amount: data.UnpaidAmount,
                    })
                    await mtblReceiptsPayment(db).update({
                        UnpaidAmount: 0,
                        PaidAmount: data.UnpaidAmount + data.PaidAmount,
                    }, {
                        where: {
                            ID: listUndefinedID[i]
                        }
                    })
                } else {
                    await mtblPaymentRPayment(db).create({
                        IDPayment: id,
                        IDPaymentR: listUndefinedID[i],
                        Amount: withdrawalMoney,
                    })
                    await mtblReceiptsPayment(db).update({
                        UnpaidAmount: data.UnpaidAmount - withdrawalMoney,
                        PaidAmount: withdrawalMoney,
                        Unknown: false,
                    }, {
                        where: {
                            ID: listUndefinedID[i]

                        }
                    })
                    withdrawalMoney = 0
                }
            })
        }
    }
}
async function deleteAndCreateAllInvoice(db, id, listInvoiceID) {
    // Xóa dữ liệu cũ sau đó thêm mới
    await mtblPaymentRInvoice(db).destroy({
        where: {
            IDPayment: id
        }
    })
    // await mtblInvoice(db).update({ Status: 'notpaid' }, { where: { IDSpecializedSoftware: { [Op.in]: listInvoiceID } } })

    // Thêm mới
    for (var i = 0; i < listInvoiceID.length; i++) {
        await mtblPaymentRInvoice(db).create({
            IDPayment: id,
            IDSpecializedSoftware: listInvoiceID[i]
        })
        await mtblInvoice(db).update({
            Status: 'Đã thanh toán'
        }, { where: { IDSpecializedSoftware: listInvoiceID[i] } })
    }

    // Cập nhật mới
    // for (var i = 0; i < listInvoiceID.length; i++) {
    //     await mtblInvoice(db).update(
    //         {
    //             Status: 'paid'
    //         },
    //         { where: { IDSpecializedSoftware: listInvoiceID[i] } }
    //     )
    // }
}
async function checkUpdateError(db, listUndefinedID, withdrawalMoney) {
    let check = 0;
    for (var i = 0; i < listUndefinedID.length; i++) {
        await mtblReceiptsPayment(db).findOne({
            where: {
                ID: listUndefinedID[i]
            }
        }).then(async data => {
            check += data.UnpaidAmount
        })
    }
    if (check < withdrawalMoney)
        return false
    else
        return true
}

async function createLoanAdvances(db, IDpayment, loanAdvanceIDs, type) {
    if (loanAdvanceIDs.length > 0 && type == 'payment') {
        for (var i = 0; i < loanAdvanceIDs.length; i++) {
            await mtblVayTamUng(db).update({
                Status: 'Chờ hoàn ứng',
                IDReceiptsPayment: IDpayment,
            }, {
                where: { ID: loanAdvanceIDs[i] }
            })
        }
    } else if (loanAdvanceIDs.length > 0 && type == 'receipt') {
        for (var i = 0; i < loanAdvanceIDs.length; i++) {
            await mtblVayTamUng(db).update({
                Status: 'Đã hoàn ứng',
                IDReceiptsPayment: IDpayment,
            }, {
                where: { ID: loanAdvanceIDs[i] }
            })
        }
    }
}
async function updateLoanAdvances(db, IDpayment, loanAdvanceIDs) {
    let payment = await mtblReceiptsPayment(db).findOne({ where: { ID: IDpayment } })
    await mtblVayTamUng(db).update({
        Status: 'Tạo phiếu chi',
        IDReceiptsPayment: null,
    }, {
        where: { IDReceiptsPayment: IDpayment }
    })
    if (loanAdvanceIDs.length > 0 && payment.Type == 'payment') {
        for (var i = 0; i < loanAdvanceIDs.length; i++) {
            await mtblVayTamUng(db).update({
                Status: 'Chờ hoàn ứng',
                IDReceiptsPayment: IDpayment,
            }, {
                where: { ID: loanAdvanceIDs[i] }
            })
        }
    } else if (loanAdvanceIDs.length > 0 && payment.Type == 'receipt') {
        for (var i = 0; i < loanAdvanceIDs.length; i++) {
            await mtblVayTamUng(db).update({
                Status: 'Đã hoàn ứng',
                IDReceiptsPayment: IDpayment,
            }, {
                where: { ID: loanAdvanceIDs[i] }
            })
        }
    }
}
async function createAccountingBooks(db, listCredit, listDebit, idPayment, reason, number) {
    if (!number) {
        await mtblReceiptsPayment(db).findOne({ where: { ID: idPayment } }).then(data => {
            number = data ? data.CodeNumber : ''
        })
    }
    let now = moment().format('YYYY-MM-DD');
    for (var i = 0; i < listDebit.length; i++) {
        await mtblAccountingBooks(db).create({
            CreateDate: now,
            EntryDate: now,
            IDAccounting: listDebit[i].debtAccount.id,
            DebtIncurred: listDebit[i].amountOfMoney,
            CreditIncurred: 0,
            IDPayment: idPayment,
            Reason: reason,
            Number: number,
        })
    }
    for (var j = 0; j < listCredit.length; j++) {
        await mtblAccountingBooks(db).create({
            CreateDate: now,
            EntryDate: now,
            IDAccounting: listCredit[j].hasAccount.id,
            CreditIncurred: listCredit[j].amountOfMoney,
            DebtIncurred: 0,
            IDPayment: idPayment,
            Reason: reason,
            Number: number,
        })
    }
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
module.exports = {
    deleteRelationshiptblReceiptsPayment,
    //  get_detail_tbl_receipts_payment
    detailtblReceiptsPayment: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblReceiptsPayment = mtblReceiptsPayment(db);
                    tblReceiptsPayment.findOne({
                        where: { ID: body.id },
                    }).then(async data => {
                        if (data) {
                            var listInvoiceID = []
                            var listUndefinedID = []
                            await mtblPaymentRInvoice(db).findAll({ where: { IDPayment: data.ID } }).then(data => {
                                data.forEach(item => {
                                    listInvoiceID.push(Number(item.IDSpecializedSoftware))
                                })
                            })
                            await mtblPaymentRPayment(db).findAll({ where: { IDPayment: data.ID } }).then(data => {
                                data.forEach(item => {
                                    listUndefinedID.push(Number(item.IDPaymentR))
                                })
                            })
                            var currency = await mtblRate(db).findOne({
                                where: { IDCurrency: data.IDCurrency },
                                order: [
                                    ['ID', 'DESC']
                                ]
                            })
                            var currencyName = await mtblCurrency(db).findOne({
                                where: { ID: data.IDCurrency },
                                order: [
                                    ['ID', 'DESC']
                                ]
                            })
                            var obj = {
                                id: data.ID,
                                type: data.Type ? data.Type : '',
                                rpType: data.RPType ? data.RPType : '',
                                applicantReceiverName: data.ApplicantReceiverName ? data.ApplicantReceiverName : '',
                                voucherNumber: data.VoucherNumber ? data.VoucherNumber : null,
                                voucherDate: data.VoucherDate ? data.VoucherDate : null,
                                codeNumber: data.CodeNumber ? data.CodeNumber : '',
                                idCurrency: data.IDCurrency ? data.IDCurrency : null,
                                currencyName: currencyName ? currencyName.ShortName : '',
                                exchangeRate: currency ? currency.ExchangeRate : 0,
                                date: data.Date ? data.Date : null,
                                idCustomer: data.IDCustomer ? data.IDCustomer : null,
                                address: data.Address ? data.Address : '',
                                amount: data.Amount ? data.Amount : null,
                                amountWords: data.AmountWords ? data.AmountWords : '',
                                reason: data.Reason ? data.Reason : '',
                                idManager: data.IDManager ? data.IDManager : null,
                                idAccountant: data.IDAccountant ? data.IDAccountant : null,
                                idTreasurer: data.IDTreasurer ? data.IDTreasurer : null,
                                treasurerName: 'Nguyễn Thị Thu Trang',
                                idEstablishment: data.IDEstablishment ? data.IDEstablishment : null,
                                idSubmitter: data.IDSubmitter ? data.IDSubmitter : null,
                                licenseNumber: data.LicenseNumber ? data.LicenseNumber : '',
                                licenseDate: data.LicenseDate ? data.LicenseDate : null,
                                unpaidAmount: data.UnpaidAmount ? data.UnpaidAmount : null,
                                paidAmount: data.PaidAmount ? data.PaidAmount : null,
                                initialAmount: data.InitialAmount ? data.InitialAmount : null,
                                withdrawal: data.Withdrawal ? data.Withdrawal : null,
                                exchangeRate: data.ExchangeRate ? data.ExchangeRate : 1,
                                isUndefined: data.Unknown,
                                staffID: data.IDStaff ? data.IDStaff : null,
                                staffName: 'Chưa có dữ liệu' ? 'Chưa có dữ liệu' : null,
                            }
                            if (data.IDStaff) {
                                let staff = await mtblDMNhanvien(db).findOne({
                                    where: { ID: data.IDStaff }
                                })
                                obj['object'] = {
                                    name: staff ? staff.StaffName : '',
                                    code: staff ? staff.StaffCode : '',
                                    address: staff ? staff.Address : '',
                                    id: data.IDStaff,
                                    displayName: '[' + (staff ? staff.StaffCode : '') + '] ' + (staff ? staff.StaffName : ''),
                                    type: 'staff',
                                }
                            } else if (data.IDPartner) {
                                let dataPartner = await getDetailPartner(data.IDPartner)
                                obj['object'] = {
                                    name: dataPartner ? dataPartner.name : '',
                                    code: dataPartner ? dataPartner.partnerCode : '',
                                    address: dataPartner ? dataPartner.address : '',
                                    displayName: '[' + (dataPartner ? dataPartner.partnerCode : '') + '] ' + (dataPartner ? dataPartner.name : ''),
                                    id: data.IDPartner,
                                    type: 'partner',
                                }
                            } else {
                                let dataCus = await getDetailCustomer(data.IDCustomer)
                                obj['object'] = {
                                    name: dataCus ? dataCus.name : '',
                                    code: dataCus ? dataCus.customerCode : '',
                                    displayName: '[' + (dataCus ? dataCus.customerCode : '') + '] ' + (dataCus ? dataCus.name : ''),
                                    address: dataCus ? dataCus.address : '',
                                    id: data.IDCustomer,
                                    type: 'customer',
                                }
                            }
                            let arrayCredit = []
                            let arraydebit = []
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
                                data.forEach(item => {
                                    arrayCredit.push({
                                        hasAccount: {
                                            id: item.acc ? item.acc.ID : '',
                                            accountingName: item.acc ? item.acc.AccountingName : '',
                                            accountingCode: item.acc ? item.acc.AccountingCode : '',
                                        },
                                        amountOfMoney: item.Amount,
                                    })
                                })
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
                                data.forEach(item => {
                                    arraydebit.push({
                                        debtAccount: {
                                            id: item.acc ? item.acc.ID : '',
                                            accountingName: item.acc ? item.acc.AccountingName : '',
                                            accountingCode: item.acc ? item.acc.AccountingCode : '',
                                        },
                                        amountOfMoney: item.Amount,
                                    })
                                })
                            })
                            obj['arrayCredit'] = arrayCredit
                            obj['arrayDebit'] = arraydebit
                            obj['listInvoiceID'] = listInvoiceID
                            obj['listUndefinedID'] = listUndefinedID
                            let loanAdvanceIDs = []
                            await mtblVayTamUng(db).findAll({ where: { IDReceiptsPayment: body.id } }).then(data => {
                                data.forEach(item => {
                                    loanAdvanceIDs.push(Number(item.ID))
                                })
                            })
                            obj['loanAdvanceIDs'] = loanAdvanceIDs;
                            var result = {
                                obj: obj,
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                            }
                            res.json(result);
                        } else {
                            res.json(Result.NO_DATA_RESULT)

                        }

                    })
                } catch (error) {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // add_tbl_receipts_payment
    addtblReceiptsPayment: async (req, res) => {
        let body = req.body;
        var listUndefinedID = []
        var listInvoiceID = []
        if (body.listUndefinedID)
            listUndefinedID = JSON.parse(body.listUndefinedID)
        if (body.listInvoiceID)
            listInvoiceID = JSON.parse(body.listInvoiceID)
        var listCredit = JSON.parse(body.listCredit)
        var listDebit = JSON.parse(body.listDebit)
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await createRate(db, body.exchangeRate, body.idCurrency)
                    if (body.voucherNumber)
                        var check = await mtblReceiptsPayment(db).findOne({
                            where: { VoucherNumber: body.voucherNumber }
                        })
                    if (check) {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: "Số chứng từ đã tồn tại",
                        }
                        res.json(result);
                        return
                    }
                    var check = await mtblReceiptsPayment(db).findOne({
                        order: [
                            ['CodeNumber', 'DESC']
                        ],
                        where: {
                            Type: body.type,
                        }
                    })
                    var automaticCode = 'PT0001';
                    if (!check && body.type == 'receipt') {
                        codeNumber = 'PT0001'
                    } else if (!check && body.type == 'payment') {
                        automaticCode = 'PC0001'
                        codeNumber = 'PC0001'
                    } else {
                        automaticCode = await handleCodeNumber(check ? check.CodeNumber : null)
                    }
                    let unpaidAmount = body.amount ? (Number(body.amountInvCre ? body.amountInvCre : 0) - Number(body.amount)) : 0;
                    let objCreate = {
                        Type: body.type ? body.type : '',
                        RPType: body.rpType ? body.rpType : '',
                        ApplicantReceiverName: body.applicantReceiverName ? body.applicantReceiverName : '',
                        CodeNumber: automaticCode,
                        IDCurrency: body.idCurrency ? body.idCurrency : null,
                        Date: body.date ? body.date : null,
                        Address: body.address ? body.address : '',
                        Amount: body.amount ? body.amount : null,
                        AmountWords: body.amountWords ? body.amountWords : '',
                        Reason: body.reason ? body.reason : '',
                        IDManager: body.idManager ? body.idManager : null,
                        IDAccountant: body.idAccountant ? body.idAccountant : null,
                        IDTreasurer: body.idTreasurer ? body.idTreasurer : null,
                        IDEstablishment: body.idEstablishment ? body.idEstablishment : null,
                        IDSubmitter: body.idSubmitter ? body.idSubmitter : null,
                        VoucherNumber: body.voucherNumber ? body.voucherNumber : null,
                        VoucherDate: body.voucherDate ? body.voucherDate : null,
                        // Số tiền ban đầu
                        InitialAmount: body.amount ? body.amount : null,
                        // số tiền đã dùng
                        PaidAmount: body.amountInvCre ? body.amountInvCre : 0,
                        //  số tiền chưa dùng
                        UnpaidAmount: unpaidAmount,
                        Withdrawal: body.withdrawal ? body.withdrawal : null,
                        Unknown: body.isUndefined ? body.isUndefined : null,
                        ExchangeRate: body.exchangeRate ? body.exchangeRate : 0,
                    }
                    body.object = JSON.parse(body.object)
                    if (body.object.type == 'staff')
                        objCreate['IDStaff'] = body.object.id
                    else if (body.object.type == 'partner')
                        objCreate['IDPartner'] = body.object.id
                    else
                        objCreate['IDCustomer'] = body.object.id
                    if (unpaidAmount == 0) {
                        objCreate['Undefined'] = false;
                    } else {
                        objCreate['Undefined'] = true;
                    }
                    mtblReceiptsPayment(db).create(objCreate).then(async data => {
                        if (body.assetLiquidationIDs) {
                            body.assetLiquidationIDs = JSON.parse(body.assetLiquidationIDs)
                            for (var i = 0; i < body.assetLiquidationIDs.length; i++) {
                                await mtblTaiSan(db).update({
                                    IDReceiptsPayment: data.ID
                                }, {
                                    where: { ID: body.assetLiquidationIDs[i] }
                                })

                            }
                        }
                        if (body.paymentOrderID) {
                            await mtblDeNghiThanhToan(db).update({
                                IDReceiptsPayment: data.ID
                            }, {
                                where: { ID: body.paymentOrderID }
                            })

                        }
                        await createAccountingBooks(db, listCredit, listDebit, data.ID, body.reason ? body.reason : '', automaticCode)
                        if (body.loanAdvanceIDs) {
                            body.loanAdvanceIDs = JSON.parse(body.loanAdvanceIDs)
                            await createLoanAdvances(db, data.ID, body.loanAdvanceIDs, body.type)
                        }
                        if (body.loanAdvanceID) {
                            await mtblVayTamUng(db).update({
                                Status: 'Chờ hoàn ứng',
                                IDReceiptsPayment: data.ID,
                            }, {
                                where: { ID: body.loanAdvanceID }
                            })
                        }
                        // Thêm mới nhiều nhiều-----------------------------------------------------------------------------------------------------------
                        for (var i = 0; i < listInvoiceID.length; i++) {
                            await mtblPaymentRInvoice(db).create({
                                IDPayment: data.ID,
                                IDSpecializedSoftware: listInvoiceID[i]
                            })
                            await mtblInvoice(db).update({
                                Status: 'Đã thanh toán'
                            }, { where: { IDSpecializedSoftware: listInvoiceID[i] } })
                        }
                        var withdrawalMoney = Number(body.withdrawal);
                        for (var i = 0; i < listUndefinedID.length; i++) {
                            if (withdrawalMoney > 0) {
                                await mtblReceiptsPayment(db).findOne({
                                    where: {
                                        ID: listUndefinedID[i]
                                    }
                                }).then(async paymentR => {
                                    // Trường hợp nếu tiền rút lớn hơn hoặc bằng số tiền chưa thanh toán
                                    if (withdrawalMoney > paymentR.UnpaidAmount) {
                                        withdrawalMoney = withdrawalMoney - paymentR.UnpaidAmount
                                        // Tạo trước khi update
                                        await mtblPaymentRPayment(db).create({
                                            IDPayment: data.ID,
                                            IDPaymentR: paymentR.ID,
                                            Amount: paymentR.UnpaidAmount,
                                        })
                                        // Cập nhật số tiền thanh toán và không thanh toán của phiếu
                                        await mtblReceiptsPayment(db).update({
                                            UnpaidAmount: 0,
                                            PaidAmount: paymentR.InitialAmount,
                                        }, {
                                            where: {
                                                ID: paymentR.ID

                                            }
                                        })
                                    }
                                    // Trường hợp nếu tiền rút nhỏ hơn số tiền chưa thanh toán
                                    else {
                                        await mtblPaymentRPayment(db).create({
                                            IDPayment: data.ID,
                                            IDPaymentR: paymentR.ID,
                                            Amount: withdrawalMoney,
                                        })
                                        await mtblReceiptsPayment(db).update({
                                            Unknown: false,
                                            UnpaidAmount: paymentR.UnpaidAmount - withdrawalMoney,
                                            PaidAmount: paymentR.PaidAmount + withdrawalMoney,
                                        }, {
                                            where: {
                                                ID: paymentR.ID

                                            }
                                        })
                                        withdrawalMoney = 0
                                    }
                                })
                            }
                        }
                        // -------------------------------------------------------------------------------------------------------------------------------

                        for (var i = 0; i < listCredit.length; i++) {
                            await mtblPaymentAccounting(db).create({
                                IDReceiptsPayment: data.ID,
                                IDAccounting: listCredit[i].hasAccount.id,
                                Type: "CREDIT",
                                Amount: listCredit[i].amountOfMoney ? listCredit[i].amountOfMoney : 0,
                            })
                        }
                        for (var j = 0; j < listDebit.length; j++) {
                            await mtblPaymentAccounting(db).create({
                                IDReceiptsPayment: data.ID,
                                IDAccounting: listDebit[j].debtAccount.id,
                                Type: "DEBIT",
                                Amount: listDebit[j].amountOfMoney ? listDebit[j].amountOfMoney : 0,
                            })
                        }
                        var result = {
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
    // update_tbl_receipts_payment
    updatetblReceiptsPayment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    var listUndefinedID = JSON.parse(body.listUndefinedID)
                    var listInvoiceID = JSON.parse(body.listInvoiceID)
                    var listCredit = JSON.parse(body.listCredit)
                    var listDebit = JSON.parse(body.listDebit)
                    var withdrawalMoney = Number(body.withdrawal);
                    var check = await checkUpdateError(db, listUndefinedID, withdrawalMoney)
                    if (!check) {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: "Số tiền chọn lớn hơn số tiền rút quỹ. Vui lòng kiểm tra lại!",
                        }
                        res.json(result);
                    }
                    // return
                    await deleteAndCreateAllPayment(db, body.id, listUndefinedID, withdrawalMoney)
                    await deleteAndCreateAllInvoice(db, body.id, listInvoiceID)
                    await createRate(db, body.exchangeRate, body.idCurrency)
                    await mtblAccountingBooks(db).destroy({ where: { IDPayment: body.id } })
                    if (listCredit.length > 0 && listDebit.length > 0) {
                        await mtblPaymentAccounting(db).destroy({ where: { IDReceiptsPayment: body.id } })
                        for (var i = 0; i < listCredit.length; i++) {

                            await mtblPaymentAccounting(db).create({
                                IDReceiptsPayment: body.id,
                                IDAccounting: listCredit[i].hasAccount.id,
                                Type: "CREDIT",
                                Amount: listCredit[i].amountOfMoney ? listCredit[i].amountOfMoney : 0,
                            })
                        }
                        for (var j = 0; j < listDebit.length; j++) {
                            await mtblPaymentAccounting(db).create({
                                IDReceiptsPayment: body.id,
                                IDAccounting: listDebit[j].debtAccount.id,
                                Type: "DEBIT",
                                Amount: listDebit[j].amountOfMoney ? listDebit[j].amountOfMoney : 0,
                            })
                        }
                    }
                    if (body.loanAdvanceIDs) {
                        body.loanAdvanceIDs = JSON.parse(body.loanAdvanceIDs)
                        await updateLoanAdvances(db, body.id, body.loanAdvanceIDs)
                    }
                    await createAccountingBooks(db, listCredit, listDebit, body.id, body.reason ? body.reason : '', null)
                    if (body.type || body.type === '')
                        update.push({ key: 'Type', value: body.type });
                    if (body.applicantReceiverName || body.applicantReceiverName === '')
                        update.push({ key: 'ApplicantReceiverName', value: body.applicantReceiverName });
                    update.push({ key: 'Unknown', value: body.isUndefined });
                    if (body.withdrawal || body.withdrawal === '')
                        update.push({ key: 'Withdrawal', value: body.withdrawal });
                    if (body.voucherNumber || body.voucherNumber === '')
                        update.push({ key: 'VoucherNumber', value: body.voucherNumber });
                    if (body.address || body.address === '')
                        update.push({ key: 'Address', value: body.address });
                    if (body.amountWords || body.amountWords === '')
                        update.push({ key: 'AmountWords', value: body.amountWords });
                    if (body.reason || body.reason === '')
                        update.push({ key: 'Reason', value: body.reason });
                    if (body.idCurrency || body.idCurrency === '') {
                        if (body.idCurrency === '')
                            update.push({ key: 'IDCurrency', value: null });
                        else
                            update.push({ key: 'IDCurrency', value: body.idCurrency });
                    }
                    if (body.exchangeRate || body.exchangeRate === '') {
                        if (body.exchangeRate === '')
                            update.push({ key: 'ExchangeRate', value: null });
                        else
                            update.push({ key: 'ExchangeRate', value: body.exchangeRate });
                    }
                    if (body.voucherDate || body.voucherDate === '') {
                        if (body.voucherDate === '')
                            update.push({ key: 'VoucherDate', value: null });
                        else
                            update.push({ key: 'VoucherDate', value: body.voucherDate });
                    }
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    if (body.idCustomer || body.idCustomer === '') {
                        if (body.idCustomer === '')
                            update.push({ key: 'IDCustomer', value: null });
                        else
                            update.push({ key: 'IDCustomer', value: body.idCustomer });
                    }
                    if (body.amount || body.amount === '') {
                        if (body.amount === '') {
                            update.push({ key: 'Amount', value: null });
                            update.push({ key: 'InitialAmount', value: null });
                        } else {
                            update.push({ key: 'Amount', value: body.amount });
                            update.push({ key: 'InitialAmount', value: body.amount });
                        }
                    }
                    if (body.idManager || body.idManager === '') {
                        if (body.idManager === '')
                            update.push({ key: 'IDManager', value: null });
                        else
                            update.push({ key: 'IDManager', value: body.idManager });
                    }
                    if (body.idAccountant || body.idAccountant === '') {
                        if (body.idAccountant === '')
                            update.push({ key: 'IDAccountant', value: null });
                        else
                            update.push({ key: 'IDAccountant', value: body.idAccountant });
                    }
                    if (body.idTreasurer || body.idTreasurer === '') {
                        if (body.idTreasurer === '')
                            update.push({ key: 'IDTreasurer', value: null });
                        else
                            update.push({ key: 'IDTreasurer', value: body.idTreasurer });
                    }
                    if (body.idEstablishment || body.idEstablishment === '') {
                        if (body.idEstablishment === '')
                            update.push({ key: 'IDEstablishment', value: null });
                        else
                            update.push({ key: 'IDEstablishment', value: body.idEstablishment });
                    }
                    if (body.idSubmitter || body.idSubmitter === '') {
                        if (body.idSubmitter === '')
                            update.push({ key: 'IDSubmitter', value: null });
                        else
                            update.push({ key: 'IDSubmitter', value: body.idSubmitter });
                    }
                    body.object = JSON.parse(body.object)
                    if (body.object.type == 'staff')
                        update.push({ key: 'IDStaff', value: body.object.id });
                    else if (body.object.type == 'partner')
                        update.push({ key: 'IDPartner', value: body.object.id });
                    else
                        update.push({ key: 'IDCustomer', value: body.object.id });
                    database.updateTable(update, mtblReceiptsPayment(db), body.id).then(response => {
                        if (response == 1) {
                            res.json(Result.ACTION_SUCCESS);
                        } else {
                            res.json(Result.SYS_ERROR_RESULT);
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
    // delete_tbl_receipts_payment
    deletetblReceiptsPayment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    // for (var i = 0; i < listID.length; i++) {
                    //     var payment = await mtblPaymentRPayment(db).findAll({
                    //         where: {
                    //             IDPayment: listID[i]
                    //         }
                    //     })
                    //     if (payment) {
                    //         for (var i = 0; i < payment.length; i++) {
                    //             let paymentUpdate = await mtblReceiptsPayment(db).findOne({
                    //                 where: { ID: payment[i].IDPaymentR }
                    //             })
                    //             await mtblReceiptsPayment(db).update({
                    //                 UnpaidAmount: paymentUpdate.UnpaidAmount + payment[i].Amount,
                    //                 PaidAmount: paymentUpdate.PaidAmount - payment[i].Amount,
                    //             }, {
                    //                 where: {
                    //                     ID: payment[i].IDPaymentR
                    //                 }
                    //             })
                    //         }
                    //     }
                    // }
                    await deleteRelationshiptblReceiptsPayment(db, listID);
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
    // get_list_tbl_receipts_payment
    getListtblReceiptsPayment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereObj = {};
                    let arraySearchAnd = [];
                    let arraySearchOr = [];
                    let arraySearchNot = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)
                        if (data.search) {
                            where = [
                                { Type: body.type },
                                {
                                    CodeNumber: {
                                        [Op.like]: '%' + data.search + '%'
                                    }
                                },
                            ]
                            whereObj[Op.and] = where
                        } else {
                            where = {
                                Type: body.type
                            };
                            whereObj[Op.and] = where
                        }
                        if (data.items.length >= 1) {
                            arraySearchAnd.push({ Type: body.type })
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'SỐ PHIẾU') {
                                    userFind['CodeNumber'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'NGÀY TẠO ĐƠN') {
                                    let date = moment(data.items[i]['searchFields']).add(7, 'hours').format('YYYY-MM-DD')
                                    userFind['Date'] = {
                                        [Op.substring]: date
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                            }
                            if (arraySearchOr.length > 0)
                                whereObj[Op.or] = arraySearchOr
                            if (arraySearchAnd.length > 0)
                                whereObj[Op.and] = arraySearchAnd
                            if (arraySearchNot.length > 0)
                                whereObj[Op.not] = arraySearchNot
                        }
                    }
                    let stt = 1;
                    mtblReceiptsPayment(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereObj,
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            let dataCus = await getDetailCustomer(data[i].IDCustomer)
                            let dataStaff = await getDetailStaff(data[i].IDStaff)
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                type: data[i].Type ? data[i].Type : '',
                                rpType: data[i].RPType ? data[i].RPType : '',
                                applicantReceiverName: data[i].ApplicantReceiverName ? data[i].ApplicantReceiverName : '',
                                codeNumber: data[i].CodeNumber ? data[i].CodeNumber : '',
                                voucherNumber: data[i].VoucherNumber ? data[i].VoucherNumber : '',
                                voucherDate: data[i].VoucherDate ? data[i].VoucherDate : null,
                                idCurrency: data[i].IDCurrency ? data[i].IDCurrency : null,
                                date: data[i].Date ? moment(data[i].Date).format('DD/MM/YYYY') : null,
                                idCustomer: data[i].IDCustomer ? data[i].IDCustomer : null,
                                customerName: dataCus.name ? dataCus.name : dataStaff.fullName,
                                staffName: dataStaff.fullName,
                                address: data[i].Address ? data[i].Address : '',
                                amount: data[i].Amount ? data[i].Amount : null,
                                amountWords: data[i].AmountWords ? data[i].AmountWords : '',
                                reason: data[i].Reason ? data[i].Reason : '',
                                idManager: data[i].IDManager ? data[i].IDManager : null,
                                idManager: '',
                                idAccountant: data[i].IDAccountant ? data[i].IDAccountant : null,
                                nameAccountant: '',
                                idTreasurer: data[i].IDTreasurer ? data[i].IDTreasurer : null,
                                nameTreasurer: '',
                                idEstablishment: data[i].IDEstablishment ? data[i].IDEstablishment : null,
                                nameEstablishment: '',
                                idSubmitter: data[i].IDSubmitter ? data[i].IDSubmitter : null,
                                nameSubmitter: '',
                            }
                            if (data[i].IDStaff) {
                                let staff = await mtblDMNhanvien(db).findOne({
                                    where: { ID: data[i].IDStaff }
                                })
                                obj['object'] = {
                                    name: staff ? staff.StaffName : '',
                                    code: staff ? staff.StaffCode : '',
                                    address: staff ? staff.Address : '',
                                    id: data[i].IDStaff,
                                    displayName: '[' + (staff ? staff.StaffCode : '') + '] ' + (staff ? staff.StaffName : ''),
                                    type: 'staff',
                                }
                            } else if (data[i].IDPartner) {
                                let dataPartner = await getDetailPartner(data[i].IDPartner)
                                obj['object'] = {
                                    name: dataPartner ? dataPartner.name : '',
                                    code: dataPartner ? dataPartner.partnerCode : '',
                                    address: dataPartner ? dataPartner.address : '',
                                    displayName: '[' + (dataPartner ? dataPartner.partnerCode : '') + '] ' + (dataPartner ? dataPartner.name : ''),
                                    id: data[i].IDPartner,
                                    type: 'partner',
                                }
                            } else
                                obj['object'] = {
                                    name: dataCus ? dataCus.name : '',
                                    code: dataCus ? dataCus.customerCode : '',
                                    displayName: dataCus ? dataCus.name : '',
                                    address: dataCus ? dataCus.address : '',
                                    id: data[i].IDCustomer,
                                    type: 'customer',
                                }
                            obj['objectName'] = obj['object'].displayName
                            let arrayCredit = []
                            let arraydebit = []
                            let tblPaymentAccounting = mtblPaymentAccounting(db);
                            tblPaymentAccounting.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDAccounting', sourceKey: 'IDAccounting', as: 'acc' })
                            await tblPaymentAccounting.findAll({
                                include: [{
                                    model: mtblDMTaiKhoanKeToan(db),
                                    required: false,
                                    as: 'acc'
                                },],
                                where: {
                                    IDReceiptsPayment: data[i].ID,
                                    type: "CREDIT"
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    arrayCredit.push({
                                        nameAccount: item.acc ? item.acc.AccountingCode : '',
                                        nameAccount: item.acc ? item.acc.AccountingCode : '',
                                        amountOfMoney: item.Amount,
                                    })
                                })
                            })
                            await tblPaymentAccounting.findAll({
                                include: [{
                                    model: mtblDMTaiKhoanKeToan(db),
                                    required: false,
                                    as: 'acc'
                                },],
                                where: {
                                    IDReceiptsPayment: data[i].ID,
                                    type: "DEBIT"
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    arraydebit.push({
                                        nameAccount: item.acc ? item.acc.AccountingCode : '',
                                        amountOfMoney: item.Amount,
                                    })
                                })
                            })
                            obj['arrayCredit'] = arrayCredit
                            obj['arrayDebit'] = arraydebit
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblReceiptsPayment(db).count({ where: whereObj })
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
    // get_list_name_tbl_receipts_payment
    getListNametblReceiptsPayment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblReceiptsPayment(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                Reason: element.Reason ? element.Reason : '',
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
    // get_list_receipts_payment_unknown
    getListReceiptsPaymentUnknown: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    let listUndefinedID = [];
                    if (body.receiptID)
                        await mtblPaymentRPayment(db).findAll({ where: { IDPayment: body.receiptID } }).then(data => {
                            data.forEach(item => {
                                listUndefinedID.push(Number(item.IDPaymentR))
                            })
                        })
                    let tblReceiptsPayment = mtblReceiptsPayment(db);
                    tblReceiptsPayment.belongsTo(mtblCurrency(db), { foreignKey: 'IDCurrency', sourceKey: 'IDCurrency', as: 'currency' })
                    tblReceiptsPayment.findAll({
                        where: {
                            [Op.or]: [{
                                [Op.and]: {
                                    IDCustomer: body.idCustomer,
                                    Unknown: true,
                                }
                            }, {
                                ID: {
                                    [Op.in]: listUndefinedID
                                }
                            }
                            ],
                            ID: { [Op.ne]: (body.idReceiptsPayment ? body.idReceiptsPayment : null) }
                        },
                        order: [
                            ['ID', 'DESC']
                        ],
                        include: [{
                            model: mtblCurrency(db),
                            required: false,
                            as: 'currency'
                        },],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                codeNumber: data[i].CodeNumber ? data[i].CodeNumber : '',
                                unpaidAmount: data[i].UnpaidAmount ? data[i].UnpaidAmount : 0,
                                paidAmount: data[i].PaidAmount ? data[i].PaidAmount : 0,
                                initialAmount: data[i].InitialAmount ? data[i].InitialAmount : 0,
                                amount: data[i].Amount ? data[i].Amount : 0,
                                reason: data[i].Reason ? data[i].Reason : '',
                                date: data[i].Date ? moment(data[i].Date).format('DD/MM/YYYY') : 0,
                                idCurrency: data[i].IDCurrency ? data[i].IDCurrency : 0,
                                shortNameCurrency: data[i].currency ? data[i].currency.ShortName : 0,
                                fullNameCurrency: data[i].currency ? data[i].currency.FullName : 0,
                                type: "Phiếu thu",
                            }
                            array.push(obj);
                            stt += 1;
                        }
                        let arrayAmountMoney = []
                        await mtblCurrency(db).findAll().then(async data => {
                            for (var i = 0; i < data.length; i++) {
                                await mtblReceiptsPayment(db).findAll({
                                    attributes: [
                                        [Sequelize.fn('SUM', Sequelize.col('Amount')), 'total_amount'],
                                    ],
                                    // group: ['ID', 'Unknown', 'Withdrawal', 'InitialAmount', 'PaidAmount', 'UnpaidAmount', 'VoucherDate', 'VoucherNumber', 'IDManager', 'Reason', 'AmountWords', 'Amount', 'Address', 'IDCustomer', 'Date', 'IDCurrency', 'CodeNumber', 'Type'],
                                    where: {
                                        IDCurrency: data[i].ID,
                                        Unknown: true,
                                        IDCustomer: body.idCustomer,
                                    }
                                }).then(payment => {
                                    var obj = {
                                        type: data[i].ShortName ? data[i].ShortName : '',
                                        total: payment[0].dataValues.total_amount ? payment[0].dataValues.total_amount : 0
                                    }
                                    if (obj.total != 0)
                                        arrayAmountMoney.push(obj)
                                })
                            }
                        })
                        var count = await tblReceiptsPayment.count({
                            where: {
                                IDCustomer: body.idCustomer,
                                Unknown: true,
                            },
                        })
                        var result = {
                            array: array,
                            totalMoney: 0,
                            all: count,
                            totalMoney: arrayAmountMoney,
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
    // get_list_receipts_payment_unknown_from_customer
    getListReceiptsPaymentUnknownFromCustomer: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    let tblReceiptsPayment = mtblReceiptsPayment(db);
                    tblReceiptsPayment.belongsTo(mtblCurrency(db), { foreignKey: 'IDCurrency', sourceKey: 'IDCurrency', as: 'currency' })
                    tblReceiptsPayment.findAll({
                        where: {
                            IDCustomer: body.idCustomer,
                            Unknown: true,
                        },
                        order: [
                            ['ID', 'DESC']
                        ],
                        include: [{
                            model: mtblCurrency(db),
                            required: false,
                            as: 'currency'
                        },],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                codeNumber: data[i].CodeNumber ? data[i].CodeNumber : '',
                                unpaidAmount: data[i].UnpaidAmount ? data[i].UnpaidAmount : 0,
                                paidAmount: data[i].PaidAmount ? data[i].PaidAmount : 0,
                                initialAmount: data[i].InitialAmount ? data[i].InitialAmount : 0,
                                amount: data[i].Amount ? data[i].Amount : 0,
                                reason: data[i].Reason ? data[i].Reason : '',
                                date: data[i].Date ? moment(data[i].Date).format('DD/MM/YYYY') : null,
                                idCurrency: data[i].IDCurrency ? data[i].IDCurrency : 0,
                                shortNameCurrency: data[i].currency ? data[i].currency.ShortName : 0,
                                fullNameCurrency: data[i].currency ? data[i].currency.FullName : 0,
                                type: "Phiếu thu",
                            }
                            array.push(obj);
                            stt += 1;
                        }
                        let arrayAmountMoney = []
                        await mtblCurrency(db).findAll().then(async data => {
                            for (var i = 0; i < data.length; i++) {
                                await mtblReceiptsPayment(db).findAll({
                                    attributes: [
                                        [Sequelize.fn('SUM', Sequelize.col('Amount')), 'total_amount'],
                                    ],
                                    // group: ['ID', 'Unknown', 'Withdrawal', 'InitialAmount', 'PaidAmount', 'UnpaidAmount', 'VoucherDate', 'VoucherNumber', 'IDManager', 'Reason', 'AmountWords', 'Amount', 'Address', 'IDCustomer', 'Date', 'IDCurrency', 'CodeNumber', 'Type'],
                                    where: {
                                        IDCurrency: data[i].ID,
                                        Unknown: true,
                                        IDCustomer: body.idCustomer,
                                    }
                                }).then(payment => {
                                    var obj = {
                                        type: data[i].ShortName ? data[i].ShortName : '',
                                        total: payment[0].dataValues.total_amount ? payment[0].dataValues.total_amount : 0
                                    }
                                    if (obj.total != 0)
                                        arrayAmountMoney.push(obj)
                                })
                            }
                        })
                        var count = await tblReceiptsPayment.count({
                            where: {
                                IDCustomer: body.idCustomer,
                                Unknown: true,
                            },
                        })
                        var result = {
                            array: array,
                            totalMoney: 0,
                            all: count,
                            totalMoney: arrayAmountMoney,
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