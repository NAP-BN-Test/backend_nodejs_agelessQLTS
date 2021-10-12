const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDeNghiThanhToan = require('../tables/qlnb/tblDeNghiThanhToan')
var database = require('../database');
var mtblFileAttach = require('../tables/constants/tblFileAttach');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMUser = require('../tables/constants/tblDMUser');
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblDMChiNhanh = require('../tables/constants/tblDMChiNhanh')
var mtblYeuCauMuaSam = require('../tables/qlnb/tblYeuCauMuaSam')
var mtblYeuCauMuaSamDetail = require('../tables/qlnb/tblYeuCauMuaSamDetail')
var mtblDMHangHoa = require('../tables/qlnb/tblDMHangHoa');
var mtblDMLoaiTaiSan = require('../tables/qlnb/tblDMLoaiTaiSan');
var mtblVanPhongPham = require('../tables/qlnb/tblVanPhongPham')
var mModules = require('../constants/modules');
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')
var ctlReceiptsPayment = require('../controller_finance/ctl-tblReceiptsPayment')
var mtblDMNhaCungCap = require('../tables/qlnb/tblDMNhaCungCap');
var mtblVanPhongPham = require('../tables/qlnb/tblVanPhongPham')
var mtblThemVPP = require('../tables/qlnb/tblThemVPP')
var mThemVPPChiTiet = require('../tables/qlnb/ThemVPPChiTiet');
var mtblPaymentRCredit = require('../tables/financemanage/tblPaymentRCredit')

async function deleteRelationshiptblDeNghiThanhToan(db, listID) {
    let arrayReceiptsPayment = []

    await mtblFileAttach(db).destroy({
        where: {
            IDDeNghiThanhToan: {
                [Op.in]: listID
            }
        }
    })
    await mtblPaymentRCredit(db).destroy({
        where: {
            PaymentID: {
                [Op.in]: listID
            }
        }
    })
    await mtblDeNghiThanhToan(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
    await mtblDeNghiThanhToan(db).findAll({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    }).then(data => {
        data.forEach(item => {
            if (item.IDReceiptsPayment)
                arrayReceiptsPayment.push(item.IDReceiptsPayment)

        })
    })
    await ctlReceiptsPayment.deleteRelationshiptblReceiptsPayment(db, arrayReceiptsPayment)
}
async function getDetailYCMS(db, id) {
    var array = [];
    let stt = 1;
    let tblYeuCauMuaSam = mtblYeuCauMuaSam(db); // bắt buộc
    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet1', sourceKey: 'IDPheDuyet1', as: 'PheDuyet1' })
    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet2', sourceKey: 'IDPheDuyet2', as: 'PheDuyet2' })
    tblYeuCauMuaSam.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDPhongBan', sourceKey: 'IDPhongBan', as: 'phongban' })
    let tblYeuCauMuaSamDetail = mtblYeuCauMuaSamDetail(db);
    tblYeuCauMuaSam.hasMany(tblYeuCauMuaSamDetail, { foreignKey: 'IDYeuCauMuaSam', as: 'line' })
    await tblYeuCauMuaSam.findAll({
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
        // offset: Number(body.itemPerPage) * (Number(body.page) - 1),
        // limit: Number(body.itemPerPage),
        where: { IDPaymentOrder: id }
    }).then(async data => {
        for (var i = 0; i < data.length; i++) {
            var obj = {
                stt: stt,
                id: Number(data[i].ID),
                idNhanVien: data[i].IDNhanVien ? data[i].IDNhanVien : null,
                requestCode: data[i].RequestCode ? data[i].RequestCode : null,
                nameNhanVien: data[i].NhanVien ? data[i].NhanVien.StaffName : null,
                idPhongBan: data[i].IDPhongBan ? data[i].IDPhongBan : null,
                codePhongBan: data[i].phongban ? data[i].phongban.DepartmentCode : null,
                namePhongBan: data[i].phongban ? data[i].phongban.DepartmentName : null,
                requireDate: data[i].RequireDate ? moment(data[i].RequireDate).format('DD/MM/YYYY') : null,
                reason: data[i].Reason ? data[i].Reason : '',
                status: data[i].Status ? data[i].Status : '',
                idPheDuyet1: data[i].IDPheDuyet1 ? data[i].IDPheDuyet1 : null,
                namePheDuyet1: data[i].PheDuyet1 ? data[i].PheDuyet1.StaffName : null,
                idPheDuyet2: data[i].IDPheDuyet2 ? data[i].IDPheDuyet2 : null,
                namePheDuyet2: data[i].PheDuyet2 ? data[i].PheDuyet2.StaffName : null,
                type: data[i].Type ? data[i].Type : '',
                line: data[i].line
            }
            var arrayTaiSan = []
            var arrayVPP = []
            var arrayFile = []
            var total = 0;
            for (var j = 0; j < obj.line.length; j++) {
                if (data[i].Type == 'Tài sản') {
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
                                assetName: obj.line[j] ? obj.line[j].AssetName : '',
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
                                assetName: obj.line[j] ? obj.line[j].AssetName : '',
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
            obj['arrayFile'] = arrayFile;
            array.push(obj)
        }
    })
    return array


}
var mModules = require('../constants/modules');
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
module.exports = {
    deleteRelationshiptblDeNghiThanhToan,
    // add_tbl_denghi_thanhtoan
    addtblDeNghiThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let objCreate = {
                        PaymentOrderCode: await mModules.automaticCode(mtblDeNghiThanhToan(db), 'PaymentOrderCode', 'DNTT'),
                        IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                        Contents: body.contents ? body.contents : '',
                        Cost: body.cost ? body.cost : null,
                        CostText: body.costText ? body.costText : null,
                        IDNhanVienKTPD: body.idNhanVienKTPD ? body.idNhanVienKTPD : null,
                        TrangThaiPheDuyetKT: 'Chờ phê duyệt',
                        IDNhanVienLDPD: body.idNhanVienKTPD ? body.idNhanVienKTPD : null,
                        Description: body.description ? body.description : '',
                        TrangThaiPheDuyetLD: 'Chờ phê duyệt',
                        Link: body.linkPayroll ? body.linkPayroll : '',
                    }
                    body.object = JSON.parse(body.object)
                    if (body.object.type == 'customer')
                        objCreate['CustomerID'] = body.object.id
                    else
                        objCreate['IDSupplier'] = body.object.id

                    mtblDeNghiThanhToan(db).create(objCreate).then(async data => {
                        if (body.listCredit) {
                            var listCredit = JSON.parse(body.listCredit)
                            for (item of listCredit) {
                                await mtblPaymentRCredit(db).create({
                                    IDSpecializedSoftware: item,
                                    PaymentID: data.ID
                                })
                            }
                        }
                        body.fileAttach = JSON.parse(body.fileAttach)
                        if (body.fileAttach.length > 0)
                            for (var j = 0; j < body.fileAttach.length; j++)
                                await mtblFileAttach(db).update({
                                    IDDeNghiThanhToan: data.ID,
                                }, {
                                    where: {
                                        ID: body.fileAttach[j].id
                                    }
                                })
                        if (body.listID) {
                            body.listID = JSON.parse(body.listID)
                            if (body.listID.length > 0)
                                for (var i = 0; i < body.listID.length; i++)
                                    await mtblYeuCauMuaSam(db).update({
                                        Status: 'Đang thanh toán',
                                        IDPaymentOrder: data.ID,
                                        IDSupplier: body.idNhaCungCap,
                                    }, { where: { ID: body.listID[i] } })
                        }
                        if (body.idNhaCungCap) {
                            await mtblYeuCauMuaSam(db).update({
                                IDSupplier: body.idNhaCungCap,
                            }, {
                                where: {
                                    IDPaymentOrder: data.ID
                                }
                            })
                        }
                        var result = {
                            id: data.ID,
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
    // update_tbl_denghi_thanhtoan
    updatetblDeNghiThanhToan: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    body.fileAttach = JSON.parse(body.fileAttach)
                    await mModules.updateForFileAttach(db, 'IDDeNghiThanhToan', body.fileAttach, body.id)
                    let update = [];
                    if (body.listCredit) {
                        await mtblPaymentRCredit(db).destroy({ where: { PaymentID: body.id } })
                        var listCredit = JSON.parse(body.listCredit)
                        for (item of listCredit) {
                            await mtblPaymentRCredit(db).create({
                                IDSpecializedSoftware: item,
                                PaymentID: body.id
                            })
                        }
                    }
                    if (body.idNhanVien || body.idNhanVien === '') {
                        if (body.idNhanVien === '')
                            update.push({ key: 'IDNhanVien', value: null });
                        else
                            update.push({ key: 'IDNhanVien', value: body.idNhanVien });
                    }
                    if (body.object) {
                        body.object = JSON.parse(body.object)
                        if (body.object.type == 'customer') {
                            update.push({ key: 'CustomerID', value: body.object.id });
                            update.push({ key: 'IDSupplier', value: null });
                        }
                        else {
                            update.push({ key: 'CustomerID', value: null });
                            update.push({ key: 'IDSupplier', value: body.object.id });
                        }
                    }
                    if (body.contents || body.contents === '')
                        update.push({ key: 'Contents', value: body.contents });
                    if (body.description || body.description === '')
                        update.push({ key: 'Description', value: body.description });
                    if (body.costText || body.costText === '')
                        update.push({ key: 'CostText', value: body.costText });
                    if (body.cost || body.cost === '') {
                        if (body.cost === '')
                            update.push({ key: 'Cost', value: null });
                        else
                            update.push({ key: 'Cost', value: body.cost });
                    }
                    if (body.idNhanVienKTPD || body.idNhanVienKTPD === '') {
                        if (body.idNhanVienKTPD === '')
                            update.push({ key: 'IDNhanVienKTPD', value: null });
                        else
                            update.push({ key: 'IDNhanVienKTPD', value: body.idNhanVienKTPD });
                    }
                    if (body.TrangThaiPheDuyetKT || body.TrangThaiPheDuyetKT === '')
                        update.push({ key: 'TrangThaiPheDuyetKT', value: body.TrangThaiPheDuyetKT });
                    if (body.idNhanVienLDPD || body.idNhanVienLDPD === '') {
                        if (body.idNhanVienLDPD === '')
                            update.push({ key: 'IDNhanVienLDPD', value: null });
                        else
                            update.push({ key: 'IDNhanVienLDPD', value: body.idNhanVienLDPD });
                    }
                    if (body.trangThaiPheDuyetLD || body.trangThaiPheDuyetLD === '')
                        update.push({ key: 'TrangThaiPheDuyetLD', value: body.trangThaiPheDuyetLD });
                    database.updateTable(update, mtblDeNghiThanhToan(db), body.id).then(response => {
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
    // delete_tbl_denghi_thanhtoan
    deletetblDeNghiThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await mtblYeuCauMuaSam(db).update({
                        Status: 'Đã mua',
                        IDPaymentOrder: null
                    }, {
                        where: {
                            IDPaymentOrder: {
                                [Op.in]: listID
                            }
                        }
                    })
                    await deleteRelationshiptblDeNghiThanhToan(db, listID);
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
    // get_list_tbl_denghi_thanhtoan
    getListtblDeNghiThanhToan: (req, res) => {
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
                            var list = [];
                            await mtblDMNhanvien(db).findAll({
                                order: [
                                    ['ID', 'DESC']
                                ],
                                where: {
                                    [Op.or]: [{
                                        StaffCode: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    },
                                    {
                                        StaffName: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    }
                                    ]
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    list.push(item.ID);
                                })
                            })
                            where = {
                                [Op.or]: [{
                                    IDNhanVien: {
                                        [Op.in]: list
                                    }
                                },
                                {
                                    PaymentOrderCode: {
                                        [Op.like]: '%' + data.search + '%'
                                    }
                                }
                                ]
                            };
                        } else {
                            where = [{
                                Contents: {
                                    [Op.ne]: '%%'
                                }
                            },];
                        }
                        whereObj[Op.and] = where
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'NGƯỜI ĐỀ NGHỊ') {
                                    userFind['IDNhanVien'] = data.items[i]['searchFields']
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
                                if (data.items[i].fields['name'] === 'MÃ ĐNTT') {
                                    userFind['PaymentOrderCode'] = {
                                        [Op.eq]: data.items[i]['searchFields']
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
                        }
                        let userObj = [];
                        if (body.userID) {
                            let staff = await mtblDMUser(db).findOne({
                                where: { ID: body.userID }
                            })
                            if (staff && staff.Username.toUpperCase() != 'ADMIN') {
                                arraySearchOr.push({ IDNhanVien: staff.IDNhanvien })
                                arraySearchOr.push({ IDNhanVienKTPD: staff.IDNhanvien })
                                arraySearchOr.push({ IDNhanVienLDPD: staff.IDNhanvien })
                            }

                        }
                        if (userObj.length > 0)
                            arraySearchOr.push(userObj)
                        if (arraySearchOr.length > 0)
                            whereObj[Op.or] = arraySearchOr
                        if (arraySearchAnd.length > 0)
                            whereObj[Op.and] = arraySearchAnd
                        if (arraySearchNot.length > 0)
                            whereObj[Op.not] = arraySearchNot
                    }
                    let stt = 1;
                    let tblDeNghiThanhToan = mtblDeNghiThanhToan(db);
                    let tblDMNhanvien = mtblDMNhanvien(db);
                    tblDeNghiThanhToan.belongsTo(tblDMNhanvien, { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
                    tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bp' })
                    tblDeNghiThanhToan.belongsTo(tblDMNhanvien, { foreignKey: 'idNhanVienKTPD', sourceKey: 'idNhanVienKTPD', as: 'KTPD' })
                    tblDeNghiThanhToan.belongsTo(mtblDMNhaCungCap(db), { foreignKey: 'IDSupplier', sourceKey: 'IDSupplier', as: 'supplier' })
                    tblDeNghiThanhToan.belongsTo(tblDMNhanvien, { foreignKey: 'idNhanVienLDPD', sourceKey: 'idNhanVienLDPD', as: 'LDPD' })
                    tblDeNghiThanhToan.findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereObj,
                        include: [{
                            model: tblDMNhanvien,
                            required: false,
                            as: 'NhanVien',
                            include: [{
                                model: mtblDMBoPhan(db),
                                required: false,
                                as: 'bp'
                            },]
                        },
                        {
                            model: tblDMNhanvien,
                            required: false,
                            as: 'KTPD'
                        },
                        {
                            model: tblDMNhanvien,
                            required: false,
                            as: 'LDPD'
                        },
                        {
                            model: mtblDMNhaCungCap(db),
                            required: false,
                            as: 'supplier'
                        },
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            let statusKT;
                            if (element.TrangThaiPheDuyetKT === 'Đã phê duyệt')
                                statusKT = element.KTPD ? element.KTPD.StaffName : '';
                            else if (element.TrangThaiPheDuyetKT === 'Từ chối')
                                statusKT = element.ReasonRejectKTPD ? element.ReasonRejectKTPD : '';
                            else
                                statusKT = element.TrangThaiPheDuyetKT ? element.TrangThaiPheDuyetKT : '';
                            let statusLD;
                            if (element.TrangThaiPheDuyetLD === 'Đã phê duyệt')
                                statusLD = element.LDPD ? element.LDPD.StaffName : '';
                            else if (element.TrangThaiPheDuyetLD === 'Từ chối')
                                statusLD = element.ReasonRejectLDPD ? element.ReasonRejectLDPD : '';
                            else
                                statusLD = element.TrangThaiPheDuyetLD ? element.TrangThaiPheDuyetLD : '';
                            let checkPayment = false
                            if (element.IDReceiptsPayment)
                                checkPayment = true
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                idNhanVien: element.IDNhanVien ? element.IDNhanVien : null,
                                nameNhanVien: element.NhanVien ? element.NhanVien.StaffName : '',
                                costText: element.CostText ? element.CostText : '',
                                departmentName: element.NhanVien ? element.NhanVien.bp ? element.NhanVien.bp.DepartmentName : '' : '',
                                contents: element.Contents ? element.Contents : '',
                                cost: element.Cost ? element.Cost : null,
                                idNhanVienKTPD: element.IDNhanVienKTPD ? element.IDNhanVienKTPD : null,
                                nameNhanVienKTPD: element.KTPD ? element.KTPD.StaffName : '',
                                trangThaiPheDuyetKT: statusKT,
                                idNhanVienLDPD: element.IDNhanVienLDPD ? element.IDNhanVienLDPD : null,
                                nameNhanVienLDPD: element.LDPD ? element.LDPD.StaffName : '',
                                paymentOrderCode: element.PaymentOrderCode ? element.PaymentOrderCode : '',
                                trangThaiPheDuyetLD: statusLD,
                                isCreatePayment: element.IDReceiptsPayment ? true : false,
                                supplierName: element.supplier ? element.supplier.SupplierName : '',
                                idNhaCungCap: element.IDSupplier ? Number(element.IDSupplier) : null,
                                linkPayroll: element.Link ? element.Link : '',
                                isCheckPayment: checkPayment,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        for (var i = 0; i < array.length; i++) {
                            var arrayFile = []
                            await mtblFileAttach(db).findAll({ where: { IDDeNghiThanhToan: array[i].id } }).then(file => {
                                if (file.length > 0) {
                                    for (var e = 0; e < file.length; e++) {
                                        arrayFile.push({
                                            name: file[e].Name ? file[e].Name : '',
                                            link: file[e].Link ? file[e].Link : '',
                                        })
                                    }
                                }
                            })
                            array[i]['arrayFile'] = arrayFile;
                            await mtblYeuCauMuaSam(db).findOne({ where: { IDPaymentOrder: array[i].id } }).then(data => {
                                if (data)
                                    array[i]['check'] = true;
                                else
                                    array[i]['check'] = false;
                            })
                        }
                        var count = await mtblDeNghiThanhToan(db).count({ where: whereObj, })
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
    // detail_tbl_denghi_thanhtoan
    detailtblDeNghiThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    let tblDeNghiThanhToan = mtblDeNghiThanhToan(db);
                    let tblDMNhanvien = mtblDMNhanvien(db);
                    let tblDMBoPhan = mtblDMBoPhan(db);
                    tblDMNhanvien.belongsTo(tblDMBoPhan, { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bophan' })
                    tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh', as: 'chinhanh' })
                    tblDeNghiThanhToan.belongsTo(mtblDMNhaCungCap(db), { foreignKey: 'IDSupplier', sourceKey: 'IDSupplier', as: 'supplier' })
                    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
                    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'idNhanVienKTPD', sourceKey: 'idNhanVienKTPD', as: 'KTPD' })
                    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'idNhanVienLDPD', sourceKey: 'idNhanVienLDPD', as: 'LDPD' })
                    tblDeNghiThanhToan.findOne({
                        where: { ID: body.id },
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        include: [{
                            model: tblDMNhanvien,
                            required: false,
                            as: 'NhanVien',
                            include: [{
                                model: tblDMBoPhan,
                                required: false,
                                as: 'bophan',
                                include: [{
                                    model: mtblDMChiNhanh(db),
                                    required: false,
                                    as: 'chinhanh'
                                },],
                            },],
                        },
                        {
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'KTPD'
                        },
                        {
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'LDPD'
                        },
                        {
                            model: mtblDMNhaCungCap(db),
                            required: false,
                            as: 'supplier'
                        },
                        ],
                    }).then(async data => {
                        var obj = {
                            stt: stt,
                            id: Number(data.ID),
                            idNhanVien: data.IDNhanVien ? Number(data.IDNhanVien) : null,
                            nameNhanVien: data.NhanVien ? data.NhanVien.StaffName : '',
                            contents: data.Contents ? data.Contents : '',
                            cost: data.Cost ? data.Cost : '',
                            costText: data.CostText ? data.CostText : '',
                            idNhanVienKTPD: data.IDNhanVienKTPD ? Number(data.IDNhanVienKTPD) : null,
                            nameNhanVienKTPD: data.KTPD ? data.KTPD.StaffName : '',
                            trangThaiPheDuyetKT: data.trangThaiPheDuyetKT ? data.trangThaiPheDuyetKT : '',
                            idNhanVienLDPD: data.IDNhanVienLDPD ? Number(data.IDNhanVienLDPD) : null,
                            description: data.Description ? data.Description : '',
                            paymentOrderCode: data.PaymentOrderCode ? data.PaymentOrderCode : '',
                            nameNhanVienLDPD: data.LDPD ? data.LDPD.StaffName : '',
                            trangThaiPheDuyetLD: data.trangThaiPheDuyetLD ? data.trangThaiPheDuyetLD : '',
                            idPhongBan: {
                                id: data.NhanVien ? data.NhanVien.bophan ? Number(data.NhanVien.bophan.ID) : '' : '',
                                departmentName: data.NhanVien ? data.NhanVien.bophan ? data.NhanVien.bophan.DepartmentName : '' : '',
                                departmentCode: data.NhanVien ? data.NhanVien.bophan ? data.NhanVien.bophan.DepartmentCode : '' : '',
                            },
                            branchID: data.NhanVien ? data.NhanVien.bophan ? data.NhanVien.bophan.chinhanh ? Number(data.NhanVien.bophan.chinhanh.ID) : null : null : null,
                            branchName: data.NhanVien ? data.NhanVien.bophan ? data.NhanVien.bophan.chinhanh ? data.NhanVien.bophan.chinhanh.BranchName : '' : '' : '',
                            branchCode: data.NhanVien ? data.NhanVien.bophan ? data.NhanVien.bophan.chinhanh ? data.NhanVien.bophan.chinhanh.BranchCode : '' : '' : '',
                            supplierName: data.supplier ? data.supplier.SupplierName : '',
                            idNhaCungCap: data.IDSupplier ? Number(data.IDSupplier) : null,
                            linkPayroll: data.Link ? data.Link : '',
                        }
                        var objObject = {};
                        if (data.IDSupplier)
                            objObject = {
                                id: Number(data.supplier.ID),
                                name: data.supplier.SupplierName ? data.supplier.SupplierName : '',
                                code: data.supplier.SupplierCode ? data.supplier.SupplierCode : '',
                                displayName: '[' + data.supplier.SupplierCode + '] ' + data.supplier.SupplierName,
                                type: 'supplier',
                            }
                        else {
                            let objCustomer = await getDetailCustomer(data.CustomerID ? data.CustomerID : 1)
                            objObject = {
                                name: objCustomer.name,
                                address: objCustomer.address,
                                code: objCustomer.customerCode,
                                displayName: '[' + objCustomer.customerCode + '] ' + objCustomer.name,
                                id: objCustomer.id,
                                type: 'customer',
                            }
                        }
                        obj['object'] = objObject
                        let listCredit = []
                        await mtblPaymentRCredit(db).findAll({
                            where: {
                                PaymentID: data.ID
                            }
                        }).then(payment => {
                            for (item of payment) {
                                listCredit.push(Number(item.IDSpecializedSoftware))
                            }
                        })
                        obj['listCredit'] = listCredit
                        stt += 1;
                        var arrayFile = []
                        await mtblFileAttach(db).findAll({ where: { IDDeNghiThanhToan: obj.id } }).then(file => {
                            if (file.length > 0) {
                                for (var e = 0; e < file.length; e++) {
                                    arrayFile.push({
                                        name: file[e].Name ? file[e].Name : '',
                                        link: file[e].Link ? file[e].Link : '',
                                        id: file[e].ID,
                                    })
                                }
                            }
                        })
                        var arrayObj = await getDetailYCMS(db, data.ID)
                        obj['arrayFile'] = arrayFile;
                        var result = {
                            obj: obj,
                            arrayRequest: await getDetailYCMS(db, data.ID),
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
    // get_list_name_tbl_denghi_thanhtoan
    getListNametblDeNghiThanhToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDeNghiThanhToan(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                contents: element.Contents ? element.Contents : '',
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
    // approval_employee_accountant
    approvalNhanVienKTPD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblDeNghiThanhToan(db).update({
                        TrangThaiPheDuyetKT: 'Đã phê duyệt'
                    }, {
                        where: { ID: body.id }
                    })
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
    // approval_employee_leader
    approvalNhanVienLDPD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblDeNghiThanhToan(db).update({
                        TrangThaiPheDuyetLD: 'Đã phê duyệt'
                    }, {
                        where: { ID: body.id }
                    })
                    let ycmsSearch = await mtblYeuCauMuaSam(db).findOne({ where: { IDPaymentOrder: body.id } })
                    if (ycmsSearch) {
                        if (ycmsSearch.Type == 'Tài sản') {
                            await mtblYeuCauMuaSam(db).update({
                                Status: 'Đã thanh toán',
                            }, { where: { IDPaymentOrder: body.id } })
                        } else {
                            await mtblYeuCauMuaSam(db).update({
                                Status: 'Đã nhập văn phòng phẩm',
                            }, { where: { IDPaymentOrder: body.id } })
                            let now = moment().format('MM-DD-YYYY HH:mm:ss.SSS');
                            await mtblYeuCauMuaSam(db).findOne({ where: { ID: ycmsSearch.ID } }).then(async data => {
                                var addVPP = await mtblThemVPP(db).create({
                                    IDNhaCungCap: data.IDSupplier ? data.IDSupplier : null,
                                    Date: now,
                                })
                                await mtblFileAttach(db).findAll({
                                    where: {
                                        IDYeuCauMuaSam: ycmsSearch.ID
                                    }
                                }).then(async ycms => {
                                    for (let y = 0; y < ycms.length; y++) {
                                        await mtblFileAttach(db).create({
                                            Link: ycms[y].Link,
                                            Name: ycms[y].Name,
                                            IDVanPhongPham: addVPP.ID,
                                        })
                                    }
                                })
                                await mtblYeuCauMuaSamDetail(db).findAll({ where: { IDYeuCauMuaSam: data.ID } }).then(async detail => {
                                    for (var i = 0; i < detail.length; i++) {
                                        await mThemVPPChiTiet(db).create({
                                            IDVanPhongPham: detail[i].IDVanPhongPham,
                                            IDThemVPP: addVPP.ID,
                                            Amount: detail[i].Amount ? detail[i].Amount : 0,
                                            Describe: data.Reason ? data.Reason : '',
                                        })
                                        let vpp = await mtblVanPhongPham(db).findOne({ where: { ID: detail[i].IDVanPhongPham } })
                                        let amount = vpp ? vpp.RemainingAmount : 0;
                                        await mtblVanPhongPham(db).update({
                                            RemainingAmount: Number(detail[i].Amount) + Number(amount),
                                        }, { where: { ID: detail[i].IDVanPhongPham } })
                                    }
                                })
                            })
                        }
                    }
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
    //  refuse_employee_accountant
    refuseNhanVienKTPD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblDeNghiThanhToan(db).update({
                        TrangThaiPheDuyetKT: 'Từ chối',
                        ReasonRejectKTPD: body.reason ? body.reason : '',
                    }, {
                        where: { ID: body.id }
                    })
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
    //  refuse_employee_leader
    refuseNhanVienLDPD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblDeNghiThanhToan(db).update({
                        TrangThaiPheDuyetLD: 'Từ chối',
                        ReasonRejectLDPD: body.reason ? body.reason : '',
                    }, {
                        where: { ID: body.id }
                    })
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
    //  change_notification_status_payment
    changeNotificationStatusPayment: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblDeNghiThanhToan(db).update({
                        IsNotification: true,
                    }, {
                        where: { ID: body.id }
                    })
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
}