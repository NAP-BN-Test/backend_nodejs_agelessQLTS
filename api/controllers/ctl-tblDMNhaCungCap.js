const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMNhaCungCap = require('../tables/qlnb/tblDMNhaCungCap');
var mtblThemVPP = require('../tables/qlnb/tblThemVPP')
var mtblTaiSanADD = require('../tables/qlnb/tblTaiSanADD')

var database = require('../database');
async function deleteRelationshiptblDMNhaCungCap(db, listID) {
    await mtblThemVPP(db).update({
        IDNhaCungCap: null,
    }, { where: { IDNhaCungCap: { [Op.in]: listID } } })
    await mtblTaiSanADD(db).update({
        IDNhaCungCap: null,
    }, { where: { IDNhaCungCap: { [Op.in]: listID } } })
    await mtblDMNhaCungCap(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
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
module.exports = {
    deleteRelationshiptblDMNhaCungCap,
    // add_tbl_dmnhacungcap
    addtblDMNhaCungCap: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var check = await mtblDMNhaCungCap(db).findAll({ where: { SupplierCode: body.supplierCode } })
                    if (check.length > 0) {
                        var result = {
                            status: Constant.STATUS.SUCCESS,
                            message: 'Đã có mã này. Vui lòng kiểm tra lại !',
                        }
                        res.json(result);
                    }
                    else
                        mtblDMNhaCungCap(db).create({
                            SupplierCode: body.supplierCode ? body.supplierCode : '',
                            SupplierName: body.supplierName ? body.supplierName : '',
                            TaxNumber: body.taxNumber ? body.taxNumber : '',
                            BankNumber: body.bankNumber ? body.bankNumber : '',
                            BankName: body.bankName ? body.bankName : '',
                            Address: body.address ? body.address : '',
                            PhoneNumber: body.phoneNumber ? body.phoneNumber : '',
                            FaxNumber: body.faxNumber ? body.faxNumber : '',
                            Email: body.email ? body.email : '',
                            Describe: body.describe ? body.describe : '',
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
    // update_tbl_dmnhacungcap
    updatetblDMNhaCungCap: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.supplierCode || body.supplierCode === '')
                        update.push({ key: 'SupplierCode', value: body.supplierCode });
                    if (body.supplierName || body.supplierName === '')
                        update.push({ key: 'SupplierName', value: body.supplierName });
                    if (body.taxNumber || body.taxNumber === '')
                        update.push({ key: 'TaxNumber', value: body.taxNumber });
                    if (body.bankNumber || body.bankNumber === '')
                        update.push({ key: 'BankNumber', value: body.bankNumber });
                    if (body.bankName || body.bankName === '')
                        update.push({ key: 'BankName', value: body.bankName });
                    if (body.address || body.address === '')
                        update.push({ key: 'Address', value: body.address });
                    if (body.phoneNumber || body.phoneNumber === '')
                        update.push({ key: 'PhoneNumber', value: body.phoneNumber });
                    if (body.faxNumber || body.faxNumber === '')
                        update.push({ key: 'FaxNumber', value: body.faxNumber });
                    if (body.email || body.email === '')
                        update.push({ key: 'Email', value: body.email });
                    if (body.describe || body.describe === '')
                        update.push({ key: 'Describe', value: body.describe });
                    database.updateTable(update, mtblDMNhaCungCap(db), body.id).then(response => {
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
    // delete_tbl_dmnhacungcap
    deletetblDMNhaCungCap: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDMNhaCungCap(db, listID);
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
    // get_list_tbl_dmnhacungcap
    getListtblDMNhaCungCap: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var data = JSON.parse(body.dataSearch)
                    var whereOjb = []
                    if (body.dataSearch) {

                        if (data.search) {
                            where = [
                                { SupplierName: { [Op.like]: '%' + data.search + '%' } },
                                { SupplierCode: { [Op.like]: '%' + data.search + '%' } },
                                { Describe: { [Op.like]: '%' + data.search + '%' } },
                                { Email: { [Op.like]: '%' + data.search + '%' } },
                                { FaxNumber: { [Op.like]: '%' + data.search + '%' } },
                                { PhoneNumber: { [Op.like]: '%' + data.search + '%' } },
                                { Address: { [Op.like]: '%' + data.search + '%' } },
                                { BankName: { [Op.like]: '%' + data.search + '%' } },
                                { BankNumber: { [Op.like]: '%' + data.search + '%' } },
                                { TaxNumber: { [Op.like]: '%' + data.search + '%' } },
                            ];
                        } else {
                            where = [
                                { SupplierName: { [Op.ne]: '%%' } },
                            ];
                        }
                        whereOjb = { [Op.or]: where };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'TÊN NHÀ CUNG CẤP') {
                                    userFind['supplierName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'MÃ NHÀ CUNG CẤP') {
                                    userFind['supplierCode'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'MÔ TẢ') {
                                    userFind['Describe'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'MÃ SỐ THUẾ') {
                                    userFind['TaxNumber'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'SỐ TÀI KHOẢN') {
                                    userFind['BankNumber'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'TÊN NGÂN HÀNG') {
                                    userFind['BankName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'SỐ ĐIỆN THOẠI') {
                                    userFind['PhoneNumber'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'FAX') {
                                    userFind['FaxNumber'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'ĐỊA CHỈ') {
                                    userFind['Address'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'EMAIL') {
                                    userFind['Email'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                            }
                        }
                    }
                    let stt = 1;
                    mtblDMNhaCungCap(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                supplierCode: element.SupplierCode ? element.SupplierCode : '',
                                supplierName: element.SupplierName ? element.SupplierName : '',
                                taxNumber: element.TaxNumber ? element.TaxNumber : '',
                                bankNumber: element.BankNumber ? element.BankNumber : '',
                                bankName: element.BankName ? element.BankName : '',
                                address: element.Address ? element.Address : '',
                                phoneNumber: element.PhoneNumber ? element.PhoneNumber : '',
                                faxNumber: element.FaxNumber ? element.FaxNumber : '',
                                email: element.Email ? element.Email : '',
                                describe: element.Describe ? element.Describe : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblDMNhaCungCap(db).count({ where: whereOjb })
                        var result = {
                            all: count,
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
    // get_list_name_tbl_dmnhacungcap
    getListNametblDMNhaCungCap: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMNhaCungCap(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                supplierName: element.SupplierName ? element.SupplierName : '',
                                displayName: element.SupplierName ? element.SupplierName : '',
                                type: 'supplier',
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
    // get_list_obj_of_payment_order
    getListObjOfPayment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMNhaCungCap(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                name: element.SupplierName ? element.SupplierName : '',
                                code: element.SupplierCode ? element.SupplierCode : '',
                                displayName: '[' + element.SupplierCode + '] ' + element.SupplierName,
                                type: 'supplier',
                            }
                            array.push(obj);
                        });
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
}