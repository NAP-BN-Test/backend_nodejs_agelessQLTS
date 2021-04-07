const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblCustomer = require('../tables/financemanage/tblCustomer')
var database = require('../database');
async function deleteRelationshiptblCustomer(db, listID) {
    await mtblCustomer(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
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
                    await axios.get(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/address_book/partners_share`).then(async data => {
                        if (data) {
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
                                await mtblCustomer(db).findOne({
                                    where: { IDSpecializedSoftware: array[i].id },
                                }).then(async data => {
                                    var obj = {
                                        stt: stt,
                                        id: Number(data.IDSpecializedSoftware),
                                        name: array[i].name ? array[i].name : '',
                                        code: array[i].customerCode ? array[i].customerCode : '',
                                        address: array[i].address ? array[i].address : '',
                                        idSpecializedSoftware: data.IDSpecializedSoftware ? data.IDSpecializedSoftware : 0,
                                        amountUnspecified: data.AmountUnspecified ? data.AmountUnspecified : 0,
                                        amountSpent: data.AmountSpent ? data.AmountSpent : 0,
                                        amountReceivable: data.AmountReceivable ? data.AmountReceivable : 0,
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
                        }
                        else {
                            res.json(Result.SYS_ERROR_RESULT)
                        }
                        // console.log(data.data);
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