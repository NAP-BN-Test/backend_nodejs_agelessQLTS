const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblCustomer = require('../tables/financemanage/tblCustomer')
var database = require('../database');
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')

async function deleteRelationshiptblCustomer(db, listID) {
    await mtblCustomer(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
dataCredit = [
    {
        id: 1,
        createdDate: '01/05/2020',
        invoiceNumber: 'INV0001',
        total: '1000000',
        statusName: 'Chờ thanh toám',
        idCustomer: 1,
        creditNumber: 'CRE0001',
        typeMoney: 'VND',
        partnerName: 'Công ty tnhh An Phú',
        employeeName: 'Lê Thị Thảo',
        idEmployee: 1,
        content: 'test 01',
        request: 'Yêu cầu Xóa',
    },
    {
        id: 2,
        createdDate: '01/05/2020',
        invoiceNumber: 'INV0002',
        total: '1200000',
        statusName: 'Chờ thanh toán',
        idCustomer: 1,
        creditNumber: 'CRE0002',
        typeMoney: 'VND',
        partnerName: 'Công ty tnhh An Phú',
        employeeName: 'Lê Thị Thảo',
        idEmployee: 1,
        content: 'test 01',
        request: '',
    },
    {
        id: 3,
        createdDate: '03/05/2020',
        invoiceNumber: 'INV0003',
        total: '1300000',
        statusName: 'Đã thanh toán',
        idCustomer: 1,
        creditNumber: 'CRE0003',
        typeMoney: 'VND',
        partnerName: 'Công ty tnhh An Phú',
        employeeName: 'Lê Thị Thảo',
        idEmployee: 1,
        content: 'test 01',
        request: 'Yêu cầu xóa',
    },
    {
        id: 4,
        createdDate: '04/05/2020',
        invoiceNumber: 'INV0004',
        total: '1400000',
        statusName: 'Đã thanh toán',
        idCustomer: 1,
        creditNumber: 'CRE0004',
        typeMoney: 'VND',
        partnerName: 'Công ty tnhh An Phú',
        employeeName: 'Lê Thị Thảo',
        idEmployee: 1,
        content: 'test 01',
        request: 'Yêu cầu sửa',
    },
    {
        id: 5,
        createdDate: '05/05/2020',
        invoiceNumber: 'INV0005',
        total: '1500000',
        statusName: 'Chờ thanh toán',
        idCustomer: 1,
        creditNumber: 'CRE0005',
        typeMoney: 'VND',
        partnerName: 'Công ty tnhh An Phú',
        employeeName: 'Lê Thị Thảo',
        idEmployee: 1,
        content: 'test 01',
        request: '',
    },
    {
        id: 6,
        createdDate: '06/05/2020',
        invoiceNumber: 'INV0006',
        total: '1600000',
        statusName: 'Chờ thanh toán',
        idCustomer: 1,
        creditNumber: 'CRE0006',
        typeMoney: 'VND',
        partnerName: 'Công ty tnhh An Phú',
        employeeName: 'Lê Thị Thảo',
        idEmployee: 1,
        content: 'test 01',
        request: '',
    },
    {
        id: 7,
        createdDate: '07/05/2020',
        invoiceNumber: 'INV0007',
        total: '1700000',
        statusName: 'Đã thanh toán',
        idCustomer: 1,
        creditNumber: 'CRE0007',
        typeMoney: 'VND',
        partnerName: 'Công ty tnhh An Phú',
        employeeName: 'Lê Thị Thảo',
        idEmployee: 1,
        content: 'test 01',
        request: 'Yêu cầu xóa',
    },
    {
        id: 8,
        createdDate: '08/05/2020',
        invoiceNumber: 'INV0008',
        total: '1800000',
        statusName: 'Chờ thanh toán',
        idCustomer: 1,
        creditNumber: 'CRE0008',
        typeMoney: 'VND',
        partnerName: 'Công ty tnhh An Phú',
        employeeName: 'Lê Thị Thảo',
        idEmployee: 1,
        content: 'test 01',
        request: '',
    },
    {
        id: 9,
        createdDate: '10/05/2020',
        invoiceNumber: 'INV0009',
        total: '1900000',
        statusName: 'Chờ thanh toán',
        idCustomer: 1,
        creditNumber: 'CRE0009',
        typeMoney: 'VND',
        partnerName: 'Công ty tnhh An Phú',
        employeeName: 'Lê Thị Thảo',
        idEmployee: 1,
        content: 'test 01',
        request: '',
    },
    {
        id: 10,
        createdDate: '12/05/2020',
        invoiceNumber: 'INV0010',
        total: '12000000',
        statusName: 'Đã thanh toán',
        idCustomer: 1,
        creditNumber: 'CRE0010',
        typeMoney: 'VND',
        partnerName: 'Công ty tnhh An Phú',
        employeeName: 'Lê Thị Thảo',
        idEmployee: 1,
        content: 'test 01',
        request: 'Yêu cầu sửa',
    },
]
dataInv = [
    {
        id: 1,
        createdDate: '01/05/2020',
        refNumber: 'REF0001',
        invoiceNumber: 'INV0001',
        total: '1000000',
        typeMoney: 'VND',
        statusName: 'Đã thanh toán',
        idCustomer: 1,
        customerName: 'Công ty tnhh An Phú',
        content: 'Demo 1',
        request: '',
        departmentName: 'Hà Nội',
    },
    {
        id: 2,
        createdDate: '02/05/2020',
        refNumber: 'REF0002',
        invoiceNumber: 'INV0002',
        total: '1100000',
        typeMoney: 'VND',
        statusName: 'Đã thanh toán',
        idCustomer: 1,
        customerName: 'Công ty tnhh An Phú',
        content: 'Demo 2',
        request: 'Chờ thanh toám',
        departmentName: 'Hà Nội',
    },
    {
        id: 3,
        createdDate: '03/05/2020',
        refNumber: 'REF0003',
        invoiceNumber: 'INV0003',
        total: '1200000',
        typeMoney: 'VND',
        statusName: 'Đã thanh toán',
        idCustomer: 1,
        customerName: 'Công ty tnhh An Phú',
        content: 'Demo 3',
        request: 'Yêu cầu sửa',
        departmentName: 'Hà Nội',
    },
    {
        id: 4,
        createdDate: '04/05/2020',
        refNumber: 'REF0004',
        invoiceNumber: 'INV0004',
        total: '1300000',
        typeMoney: 'VND',
        statusName: 'Đã thanh toán',
        idCustomer: 1,
        customerName: 'Công ty tnhh An Phú',
        content: 'Demo 4',
        request: 'Yêu cầu sửa',
        departmentName: 'Hà Nội',
    },
    {
        id: 5,
        createdDate: '05/05/2020',
        refNumber: 'REF0005',
        invoiceNumber: 'INV0005',
        total: '1400000',
        typeMoney: 'VND',
        statusName: 'Đã thanh toán',
        idCustomer: 1,
        customerName: 'Công ty tnhh An Phú',
        content: 'Demo 5',
        request: '',
        departmentName: 'Hà Nội',
    },
    {
        id: 6,
        createdDate: '06/05/2020',
        refNumber: 'REF0006',
        invoiceNumber: 'INV0006',
        total: '1500000',
        typeMoney: 'VND',
        statusName: 'Đã thanh toán',
        idCustomer: 1,
        customerName: 'Công ty tnhh An Phú',
        content: 'Demo 6',
        request: 'Chờ thanh toám',
        departmentName: 'Hà Nội',
    },
    {
        id: 7,
        createdDate: '07/05/2020',
        refNumber: 'REF0007',
        invoiceNumber: 'INV0007',
        total: '1600000',
        typeMoney: 'VND',
        statusName: 'Chờ thanh toán',
        idCustomer: 1,
        customerName: 'Công ty tnhh An Phú',
        content: 'Demo 7',
        request: 'Chờ thanh toám',
        departmentName: 'Hà Nội',
    },
    {
        id: 8,
        createdDate: '08/05/2020',
        refNumber: 'REF0008',
        invoiceNumber: 'INV0008',
        total: '1700000',
        typeMoney: 'VND',
        statusName: 'Chờ thanh toán',
        idCustomer: 1,
        customerName: 'Công ty tnhh An Phú',
        content: 'Demo 8',
        request: 'Yêu cầu sửa',
        departmentName: 'Hà Nội',
    },
    {
        id: 9,
        createdDate: '09/05/2020',
        refNumber: 'REF0009',
        invoiceNumber: 'INV0009',
        total: '1800000',
        typeMoney: 'VND',
        statusName: 'Chờ thanh toán',
        idCustomer: 1,
        customerName: 'Công ty tnhh An Phú',
        content: 'Demo 9',
        request: 'Yêu cầu sửa',
        departmentName: 'Hà Nội',
    },
    {
        id: 10,
        createdDate: '10/05/2020',
        refNumber: 'REF0010',
        invoiceNumber: 'INV0010',
        total: '100000',
        typeMoney: 'VND',
        statusName: 'Chờ thanh toán',
        idCustomer: 1,
        customerName: 'Công ty tnhh An Phú',
        content: 'Demo 10',
        request: 'Yêu cầu sửa',
        departmentName: 'Hà Nội',
    },
];
const axios = require('axios');
module.exports = {
    deleteRelationshiptblCustomer,
    // add_tbl_customer
    addtblCustomer: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblCustomer(db).create({
                        IDSpecializedSoftware: body.idSpecializedSoftware ? body.idSpecializedSoftware : null,
                        AmountUnspecified: body.amountUnspecified ? body.amountUnspecified : null,
                        AmountSpent: body.amountSpent ? body.amountSpent : null,
                        AmountReceivable: body.amountReceivable ? body.amountReceivable : null,
                    }).then(data => {
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
    // update_tbl_customer
    updatetblCustomer: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.idSpecializedSoftware || body.idSpecializedSoftware === '') {
                        if (body.idSpecializedSoftware === '')
                            update.push({ key: 'IDSpecializedSoftware', value: null });
                        else
                            update.push({ key: 'IDSpecializedSoftware', value: body.idSpecializedSoftware });
                    }
                    if (body.amountUnspecified || body.amountUnspecified === '') {
                        if (body.amountUnspecified === '')
                            update.push({ key: 'AmountUnspecified', value: null });
                        else
                            update.push({ key: 'AmountUnspecified', value: body.amountUnspecified });
                    }
                    if (body.amountSpent || body.amountSpent === '') {
                        if (body.amountSpent === '')
                            update.push({ key: 'AmountSpent', value: null });
                        else
                            update.push({ key: 'AmountSpent', value: body.amountSpent });
                    }
                    if (body.amountReceivable || body.amountReceivable === '') {
                        if (body.amountReceivable === '')
                            update.push({ key: 'AmountReceivable', value: null });
                        else
                            update.push({ key: 'AmountReceivable', value: body.amountReceivable });
                    }
                    database.updateTable(update, mtblCustomer(db), body.id).then(response => {
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
    // delete_tbl_customer
    deletetblCustomer: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblCustomer(db, listID);
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
    // get_list_tbl_customer
    getListtblCustomer: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // await axios.get(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/address_book/partners_share`).then(async data => {
                    //     if (data) {
                    dataCustomer = [
                        {
                            "id": 1,
                            "customerCode": "KH0001",
                            "name": "Công ty tnhh An Phú",
                            "attributesChangeLog": "Công ty chuyên về lắp ráp linh kiện",
                            "tax": "123456789",
                            "countryName": "Việt Nam",
                            "address": "Số 2 Hoàng Mai Hà Nội",
                            "mobile": "098705124",
                            "fax": "01234567",
                            "email": "anphu@gmail.com",
                        },
                        {
                            "id": 2,
                            "customerCode": "KH0002",
                            "name": "Công ty tnhh Is Tech Vina",
                            "attributesChangeLog": "Công ty chuyên sản xuất bánh kẹo ",
                            "tax": "01245870",
                            "countryName": "Việt Nam",
                            "address": "Số 35 Bạch mai Cầu Giấy Hà Nội",
                            "mobile": "082457145",
                            "fax": "0241368451",
                            "email": "istech@gmail.com",
                        },
                        {
                            "id": 3,
                            "customerCode": "KH0003",
                            "name": "Công ty cổ phần Orion Việt Nam",
                            "attributesChangeLog": "Công ty chuyên sản xuất bánh kẹo",
                            "tax": "012341250",
                            "countryName": "Việt nam",
                            "address": "Số 12 Bạch Mai Hà Nội",
                            "mobile": "0315456554",
                            "fax": "132456545",
                            "email": "orion13@gmail.com",
                        },
                        {
                            "id": 4,
                            "customerCode": "KH0004",
                            "name": "Công ty TNHH Rồng Việt",
                            "attributesChangeLog": "Công ty chuyên cung cấp thiết bị điện lạnh",
                            "tax": "01323255",
                            "countryName": "Việt Nam",
                            "address": "Số 11 Vĩnh Tuy Hai Bà Trưng Hà Nội",
                            "mobile": "0445445474",
                            "fax": "1135635",
                            "email": "rongviet@gmail.com",

                        },
                        {
                            "id": 5,
                            "customerCode": "KH0005",
                            "name": "Công ty cổ phần và thương mại Đức Việt",
                            "attributesChangeLog": "Công ty chuyên cung cấp thức ăn đông lạnh ",
                            "tax": "017654124",
                            "countryName": "Việt Nam",
                            "address": "Số 389 Lĩnh Nam Hoàng mai Hà Nội",
                            "mobile": "0444545401",
                            "fax": "75241241241",
                            "email": "ducviet0209@gmail.com",
                        },
                        {
                            "id": 6,
                            "customerCode": "KH0006",
                            "name": "Công ty TNHH 1 thành viên Bảo Minh",
                            "attributesChangeLog": "Công ty chuyên cung cấp cácclaoị thực phẩm khô",
                            "tax": "154654565",
                            "countryName": "Việt Nam",
                            "address": "Số 25 Ba Đình Hà Nội",
                            "mobile": "045102474",
                            "fax": "02137244",
                            "email": "baominh56@gmail.com",

                        },
                        {
                            "id": 7,
                            "customerCode": "KH0007",
                            "name": "Công ty Sx và Tm Minh Hòa",
                            "attributesChangeLog": "Công ty chuyên cung cấp lao động thời vụ",
                            "tax": "04785635432",
                            "countryName": "Việt Nam",
                            "address": "Số 21 Hàng Mã Hà Nội",
                            "mobile": "0045454510",
                            "fax": "415265654",
                            "email": "minhhoa1212@gmail.com",
                        },
                        {
                            "id": 8,
                            "customerCode": "KH0008",
                            "name": "Công ty cổ phần EC",
                            "attributesChangeLog": "Công ty chuyên cung cấp đồ gá khuôn jig",
                            "tax": "45454545",
                            "countryName": "Việt Nam",
                            "address": "Số 13 đường 17 KCN Tiên Sơn Bắc Ninh",
                            "mobile": "012345474",
                            "fax": "012244635",
                            "email": "ec1312@gmail.com",
                        },
                        {
                            "id": 9,
                            "customerCode": "KH0009",
                            "name": "Công ty cổ phần Thu Hương",
                            "attributesChangeLog": "Công ty chuyên cung cấp suất ăn công  nghiệp",
                            "tax": "012546565",
                            "countryName": "Việt Nam",
                            "address": "Số 24 Bạch Mai Hà Nội",
                            "mobile": "015245454",
                            "fax": "45552478",
                            "email": "thuhuong34@gmail.com",
                        },
                        {
                            "id": 10,
                            "customerCode": "KH0010",
                            "name": "Công ty tnhh Hòa Phát",
                            "attributesChangeLog": "Công ty chuyên sản xuất tôn ngói ",
                            "tax": "014775745",
                            "countryName": "Việt Nam",
                            "address": "Số 2 Phố Huế Hà Nội",
                            "mobile": "045245401",
                            "fax": "021455235",
                            "email": "hoaphat0102@gmail.com",
                        }
                    ]
                    // var array = data.data.data;
                    var array = dataCustomer;
                    var arrayResult = [];
                    var stt = 1;
                    for (var i = 0; i < array.length; i++) {
                        var cus = await mtblCustomer(db).findOne({
                            where: {
                                IDSpecializedSoftware: array[i].id
                            }
                        })
                        if (!cus) {
                            await mtblCustomer(db).create({
                                IDSpecializedSoftware: array[i].id ? array[i].id : null,
                                AmountUnspecified: 0,
                                AmountSpent: 0,
                                AmountReceivable: 0,
                            })
                        }
                        let totalInv = 0;
                        let totalUndefind = 0;
                        let totalCredit = 0;
                        await mtblCustomer(db).findOne({
                            where: { IDSpecializedSoftware: array[i].id },
                        }).then(async data => {
                            for (var inv = 0; inv < dataInv.length; inv++) {
                                if (dataInv[inv].idCustomer == array[i].id) {
                                    totalInv += Number(dataInv[inv].total)
                                }
                            }
                            for (var cre = 0; cre < dataCredit.length; cre++) {
                                if (dataCredit[cre].idCustomer == array[i].id) {
                                    totalCredit += Number(dataCredit[cre].total)
                                }
                            }
                            await mtblReceiptsPayment(db).findAll({
                                where: { IDCustomer: array[i].id }
                            }).then(data => {
                                data.forEach(item => {
                                    totalUndefind += Number(item.Amount);
                                })
                            })
                            var obj = {
                                stt: stt,
                                id: Number(data.IDSpecializedSoftware),
                                name: array[i].name ? array[i].name : '',
                                code: array[i].customerCode ? array[i].customerCode : '',
                                address: array[i].address ? array[i].address : '',
                                idSpecializedSoftware: data.IDSpecializedSoftware ? data.IDSpecializedSoftware : 0,
                                amountUnspecified: [{ amount: totalUndefind, type: 'VND' }, { amount: 0, type: 'USD' }],
                                amountSpent: [{ amount: totalCredit, type: 'VND' }, { amount: 0, type: 'USD' }],
                                amountReceivable: [{ amount: totalInv, type: 'VND' }, { amount: 0, type: 'USD' }],
                            }
                            arrayResult.push(obj);
                            stt += 1;
                        })
                    }
                    var count = await mtblCustomer(db).count()
                    var result = {
                        array: arrayResult,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: count
                    }
                    res.json(result);
                    //     }
                    //     else {
                    //         res.json(Result.SYS_ERROR_RESULT)
                    //     }
                    //     // console.log(data.data);
                    // })
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // get_list_name_tbl_customer
    getListNametblCustomer: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblCustomer(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                idSpecializedSoftware: element.IDSpecializedSoftware ? element.IDSpecializedSoftware : '',
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
    }
}