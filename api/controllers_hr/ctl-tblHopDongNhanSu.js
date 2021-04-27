const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblHopDongNhanSu = require('../tables/hrmanage/tblHopDongNhanSu')
var database = require('../database');
var mtblLoaiHopDong = require('../tables/hrmanage/tblLoaiHopDong')
var mtblBangLuong = require('../tables/hrmanage/tblBangLuong')
var mtblQuyetDinhTangLuong = require('../tables/hrmanage/tblQuyetDinhTangLuong')
const Sequelize = require('sequelize');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mModules = require('../constants/modules');
var mtblFileAttach = require('../tables/constants/tblFileAttach');
var mtblDMChucVu = require('../tables/constants/tblDMChucVu');

async function deleteRelationshiptblHopDongNhanSu(db, listID) {
    await mtblFileAttach(db).destroy({
        where: {
            IDContract: { [Op.in]: listID }
        }
    })
    await mtblHopDongNhanSu(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
async function detailContract(db, id) {
    var obj = {}
    let tblHopDongNhanSu = mtblHopDongNhanSu(db);
    tblHopDongNhanSu.belongsTo(mtblLoaiHopDong(db), { foreignKey: 'IDLoaiHopDong', sourceKey: 'IDLoaiHopDong', as: 'lhd' })
    tblHopDongNhanSu.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
    await tblHopDongNhanSu.findOne({
        where: { ID: id },
        include: [
            {
                model: mtblLoaiHopDong(db),
                required: false,
                as: 'lhd'
            },
            {
                model: mtblDMNhanvien(db),
                required: false,
                as: 'nv'
            },
        ],
        order: [
            ['ID', 'DESC']
        ],
    }).then(async data => {
        if (data) {
            contactNumber = data.ContractCode
            obj = {
                'SỐ HỢP ĐỒNG': data.ContractCode ? data.ContractCode : '',
                'NGÀY KÍ': data.Date ? moment(data.Date).format('DD/MM/YYYY') : '',
                'NHÂN VIÊN': data.nv ? data.nv.StaffName ? data.nv.StaffName : '' : '',
                'NGÀY SINH': data.nv ? moment(data.nv.Birthday).format('DD/MM/YYYY') ? moment(data.nv.Birthday).format('DD/MM/YYYY') : '' : '',
                'TÊN THÀNH PHỐ': data.nv ? data.nv.Address ? data.nv.Address : '' : '',
                'ĐỊA CHỈ': data.nv ? data.nv.Address ? data.nv.Address : '' : '',
                'CMT': data.nv ? data.nv.CMNDNumber ? data.nv.CMNDNumber : '' : '',
                'NGÀY CẤP': data.nv ? data.nv.CMNDDate ? data.nv.CMNDDate : '' : '',
                'NƠI CẤP': data.nv ? data.nv.CMNDPlace ? data.nv.CMNDPlace : '' : '',
            }
        }
    })
    return obj
}

async function inWordContact(db, id) {
    let contactNumber = ''
    let obj = {
        'SỐ HỢP ĐỒNG': contactNumber,
        'NGÀY KÍ': '',
        'NHÂN VIÊN': '',
        'NGÀY SINH': '',
        'TÊN THÀNH PHỐ': '',
        'ĐỊA CHỈ': '',
        'CMT': '',
        'NGÀY CẤP': '',
        'NƠI CẤP': '',
    }
    let tblHopDongNhanSu = mtblHopDongNhanSu(db);
    tblHopDongNhanSu.belongsTo(mtblLoaiHopDong(db), { foreignKey: 'IDLoaiHopDong', sourceKey: 'IDLoaiHopDong', as: 'lhd' })
    tblHopDongNhanSu.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
    await tblHopDongNhanSu.findOne({
        where: { ID: id },
        include: [
            {
                model: mtblLoaiHopDong(db),
                required: false,
                as: 'lhd'
            },
            {
                model: mtblDMNhanvien(db),
                required: false,
                as: 'nv'
            },
        ],
        order: [
            ['ID', 'DESC']
        ],
    }).then(async data => {
        if (data) {
            contactNumber = data.ContractCode
            let tblDMNhanvien = mtblDMNhanvien(db);
            tblDMNhanvien.belongsTo(mtblDMChucVu(db), { foreignKey: 'IDChucVu', sourceKey: 'IDChucVu', as: 'position' })

            let staff = await tblDMNhanvien.findOne({
                where: { ID: data.IDNhanVien },
                include: [
                    {
                        model: mtblDMChucVu(db),
                        required: false,
                        as: 'position'
                    },
                ],
            })
            obj = {
                'SỐ HỢP ĐỒNG': data.ContractCode ? data.ContractCode : '',
                'NGÀY KÍ': data.Date ? moment(data.Date).format('DD/MM/YYYY') : '',
                'NHÂN VIÊN': data.nv ? data.nv.StaffName ? data.nv.StaffName : '' : '',
                'NGÀY SINH': data.nv ? moment(data.nv.Birthday).format('DD/MM/YYYY') ? moment(data.nv.Birthday).format('DD/MM/YYYY') : '' : '',
                'TÊN THÀNH PHỐ': data.nv ? data.nv.Address ? data.nv.Address : '' : '',
                'ĐỊA CHỈ': data.nv ? data.nv.Address ? data.nv.Address : '' : '',
                'CMT': data.nv ? data.nv.CMNDNumber ? data.nv.CMNDNumber : '' : '',
                'NGÀY CẤP': data.nv ? data.nv.CMNDDate ? data.nv.CMNDDate : '' : '',
                'NƠI CẤP': data.nv ? data.nv.CMNDPlace ? data.nv.CMNDPlace : '' : '',
                'LOẠI HỢP ĐỒNG': data.lhd ? data.lhd.TenLoaiHD ? data.lhd.TenLoaiHD : '' : '',
                'TỪ NGÀY': data.ContractDateStart ? moment(data.ContractDateStart).format('DD/MM/YYYY') : '',
                'ĐẾN NGÀY': data.ContractDateEnd ? moment(data.ContractDateEnd).format('DD/MM/YYYY') : '',
                'TRÌNH ĐỘ HỌC VẤN': staff.Degree ? staff.Degree : '',
                'CHỨC VỤ': staff.position ? staff.position.PositionName ? staff.position.PositionName : '' : '',
            }
        }
    })
    await mModules.convertDataAndRenderWordFile(obj, 'template_contract.docx', (contactNumber ? contactNumber : 'HD') + '-HĐLĐ-TX2021.docx')
    return (contactNumber ? contactNumber : 'HD') + '-HĐLĐ-TX2021.docx'
}
module.exports = {
    deleteRelationshiptblHopDongNhanSu,
    //  get_detail_tbl_hopdong_nhansu
    detailtblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblHopDongNhanSu(db).findOne({ where: { ID: body.id } }).then(async data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                contractCode: data.ContractCode ? data.ContractCode : '',
                                signDate: data.Date ? data.Date : null,
                                idLoaiHopDong: data.IDLoaiHopDong ? data.IDLoaiHopDong : '',
                                salaryNumber: data.SalaryNumber ? data.SalaryNumber : '',
                                salaryText: data.SalaryText ? data.SalaryText : '',
                                contractDateEnd: data.ContractDateEnd ? data.contractDateEnd : '',
                                contractDateStart: data.ContractDateStart ? data.ContractDateStart : null,
                                unitSalary: 'VND',
                                status: data.Status ? data.Status : '',
                            }
                            var arrayFile = []
                            await mtblFileAttach(db).findAll({ where: { IDContract: obj.id } }).then(file => {
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
                            obj['fileAttach'] = arrayFile;
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
    // add_tbl_hopdong_nhansu
    addtblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    if (body.idSalaryIncrease)
                        mtblQuyetDinhTangLuong(db).update({
                            Status: "Đã tạo hợp đồng"
                        }, { where: { ID: body.idSalaryIncrease } })
                    if (body.idNhanVien)
                        await mtblHopDongNhanSu(db).update({
                            Status: 'Hết hiệu lực'
                        }, {
                            where: { IDNhanVien: body.idNhanVien }
                        })
                    let noticeTime;
                    if (moment(body.contractDateEnd).add(7, 'hours').subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss.SSS') > moment().format('YYYY-MM-DD HH:mm:ss.SSS'))
                        noticeTime = moment(body.contractDateEnd).add(7, 'hours').subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss.SSS')
                    else
                        noticeTime = moment().add(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS')
                    mtblHopDongNhanSu(db).create({
                        IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                        ContractCode: body.contractCode ? body.contractCode : '',
                        Date: body.signDate ? body.signDate : null,
                        IDLoaiHopDong: body.idLoaiHopDong ? body.idLoaiHopDong : null,
                        SalaryNumber: body.salaryNumber ? body.salaryNumber : '',
                        SalaryText: body.salaryNumber ? body.salaryNumber : '',
                        ContractDateEnd: body.contractDateEnd ? body.contractDateEnd : null,
                        ContractDateStart: body.signDate ? body.signDate : null,
                        UnitSalary: 'VND',
                        WorkingPlace: '',
                        Status: body.status ? body.status : '',
                        CMNDNumber: body.cmndNumber ? body.cmndNumber : '',
                        CMNDate: body.cmndate ? body.cmndate : null,
                        CMNDPlace: body.cmndPlace ? body.cmndPlace : '',
                        Announced: false,
                        NoticeTime: noticeTime,
                    }).then(async data => {
                        let obj = {}
                        var contract = await detailContract(db, data.ID)
                        let tblDMNhanvien = mtblDMNhanvien(db);
                        tblDMNhanvien.belongsTo(mtblDMChucVu(db), { foreignKey: 'IDChucVu', sourceKey: 'IDChucVu', as: 'position' })

                        let staff = await tblDMNhanvien.findOne({
                            where: { ID: body.idNhanVien },
                            include: [
                                {
                                    model: mtblDMChucVu(db),
                                    required: false,
                                    as: 'position'
                                },
                            ],
                        })
                        obj = {
                            'SỐ HỢP ĐỒNG': data.ContractCode ? data.ContractCode : '',
                            'NGÀY KÍ': data.Date ? moment(data.Date).format('DD/MM/YYYY') : '',
                            'NHÂN VIÊN': contract.nv ? contract.nv.StaffName ? contract.nv.StaffName : '' : '',
                            'NGÀY SINH': contract.nv ? moment(contract.nv.Birthday).format('DD/MM/YYYY') ? moment(contract.nv.Birthday).format('DD/MM/YYYY') : '' : '',
                            'TÊN THÀNH PHỐ': contract.nv ? contract.nv.Address ? contract.nv.Address : '' : '',
                            'ĐỊA CHỈ': contract.nv ? contract.nv.Address ? contract.nv.Address : '' : '',
                            'CMT': contract.nv ? contract.nv.CMNDNumber ? contract.nv.CMNDNumber : '' : '',
                            'NGÀY CẤP': contract.nv ? contract.nv.CMNDDate ? contract.nv.CMNDDate : '' : '',
                            'NƠI CẤP': contract.nv ? contract.nv.CMNDPlace ? contract.nv.CMNDPlace : '' : '',
                            'LOẠI HỢP ĐỒNG': contract.lhd ? contract.lhd.TenLoaiHD ? contract.lhd.TenLoaiHD : '' : '',
                            'TỪ NGÀY': contract.ContractDateStart ? moment(contract.ContractDateStart).format('DD/MM/YYYY') : '',
                            'ĐẾN NGÀY': contract.ContractDateEnd ? moment(contract.ContractDateEnd).format('DD/MM/YYYY') : '',
                            'TRÌNH ĐỘ HỌC VẤN': staff.Degree ? staff.Degree : '',
                            'CHỨC VỤ': staff.position ? staff.position ? staff.position.PositionName : '' : '',
                        }
                        await mModules.convertDataAndRenderWordFile(obj, 'template_contract.docx', (body.contractCode ? body.contractCode : 'HD') + '-HĐLĐ-TX2021.docx')
                        await mtblFileAttach(db).create({
                            Link: 'http://103.154.100.26:1357/ageless_sendmail/' + (body.contractCode ? body.contractCode : 'HD') + '-HĐLĐ-TX2021.docx',
                            Name: body.contractCode ? body.contractCode : 'HD' + '-HĐLĐ-TX2021.docx',
                            IDContract: data.ID
                        })
                        // var qdtl = await mtblQuyetDinhTangLuong(db).findOne({
                        //     order: [
                        //         Sequelize.literal('max(DecisionDate) DESC'),
                        //     ],
                        //     group: ['Status', 'SalaryIncrease', 'IDNhanVien', 'StopReason', 'StopDate', 'IncreaseDate', 'DecisionCode', 'ID', 'DecisionDate'],
                        //     where: {
                        //         IDNhanVien: body.idNhanVien,
                        //     }
                        // })
                        // salary = qdtl ? qdtl.SalaryIncrease ? qdtl.SalaryIncrease : 0 : 0
                        let bl = await mtblBangLuong(db).findOne({ where: { IDNhanVien: body.idNhanVien } })
                        if (!bl)
                            await mtblBangLuong(db).create({
                                Date: body.signDate,
                                IDNhanVien: body.idNhanVien,
                                WorkingSalary: body.salaryNumber,
                                BHXHSalary: body.salaryNumber,
                                DateEnd: body.contractDateEnd,
                            })
                        else {
                            await mtblBangLuong(db).update({
                                Date: body.signDate,
                                WorkingSalary: body.salaryNumber,
                                BHXHSalary: body.salaryNumber,
                                DateEnd: body.contractDateEnd,
                            }, { where: { IDNhanVien: body.idNhanVien } })
                        }
                        var result = {
                            link: 'http://103.154.100.26:1357/ageless_sendmail/' + (body.contractCode ? body.contractCode : 'HD') + '-HĐLĐ-TX2021.docx',
                            contractID: data.ID,
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
    // update_tbl_hopdong_nhansu
    updatetblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.contractCode || body.contractCode === '')
                        update.push({ key: 'ContractCode', value: body.contractCode });
                    if (body.signDate || body.signDate === '') {
                        if (body.signDate === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.signDate });
                    }
                    if (body.idLoaiHopDong || body.idLoaiHopDong === '') {
                        if (body.idLoaiHopDong === '')
                            update.push({ key: 'IDLoaiHopDong', value: null });
                        else
                            update.push({ key: 'IDLoaiHopDong', value: body.idLoaiHopDong });
                    }
                    if (body.salaryNumber || body.salaryNumber === '') {
                        if (body.salaryNumber === '')
                            update.push({ key: 'SalaryNumber', value: null });
                        else
                            update.push({ key: 'SalaryNumber', value: body.salaryNumber });
                    }
                    if (body.contractDateEnd || body.contractDateEnd === '') {
                        if (moment(body.contractDateEnd).add(7, 'hours').subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss.SSS') > moment().format('YYYY-MM-DD HH:mm:ss.SSS'))
                            update.push({ key: 'NoticeTime', value: moment(body.contractDateEnd).add(7, 'hours').subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss.SSS') });
                        else
                            update.push({ key: 'NoticeTime', value: moment().add(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS') });

                        update.push({ key: 'ContractDateEnd', value: body.contractDateEnd });
                    }
                    if (body.contractDateStart || body.contractDateStart === '') {
                        update.push({ key: 'ContractDateStart', value: body.contractDateStart });
                    }
                    if (body.status || body.status === '')
                        update.push({ key: 'Status', value: body.status });
                    database.updateTable(update, mtblHopDongNhanSu(db), body.id).then(async response => {
                        if (response == 1) {
                            let link = await inWordContact(db, body.id)
                            Result.ACTION_SUCCESS['link'] = 'http://103.154.100.26:1357/ageless_sendmail/' + link
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
    // delete_tbl_hopdong_nhansu
    deletetblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblHopDongNhanSu(db, listID);
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
    // get_list_tbl_hopdong_nhansu
    getListtblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)
                        var list = [];
                        await mtblLoaiHopDong(db).findAll({
                            order: [
                                ['ID', 'DESC']
                            ],
                            where: {
                                [Op.or]: [
                                    { MaLoaiHD: { [Op.like]: '%' + data.search + '%' } },
                                    { TenLoaiHD: { [Op.like]: '%' + data.search + '%' } }
                                ]
                            }
                        }).then(data => {
                            data.forEach(item => {
                                list.push(item.ID);
                            })
                        })
                        if (data.search) {
                            where = [
                                { ContractCode: { [Op.like]: '%' + data.search + '%' } },
                                { Status: { [Op.like]: '%' + data.search + '%' } },
                                { IDLoaiHopDong: { [Op.in]: list } },
                            ];
                        } else {
                            where = [
                                { ContractCode: { [Op.ne]: '%%' } },
                            ];
                        }
                        whereOjb = {
                            [Op.and]: [{ [Op.or]: where }],
                            [Op.or]: [{ ID: { [Op.ne]: null } }],
                        };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'SỐ HỢP ĐỒNG') {
                                    userFind['ContractCode'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'TÌNH TRẠNG HỢP ĐỒNG') {
                                    userFind['Status'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'LOẠI HỢP ĐỒNG') {
                                    var list = [];
                                    await mtblLoaiHopDong(db).findAll({
                                        order: [
                                            ['ID', 'DESC']
                                        ],
                                        where: {
                                            [Op.or]: [
                                                { MaLoaiHD: { [Op.like]: '%' + data.items[i]['searchFields'] + '%' } },
                                                { TenLoaiHD: { [Op.like]: '%' + data.items[i]['searchFields'] + '%' } }
                                            ]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.ID);
                                        })
                                    })
                                    userFind['IDLoaiHopDong'] = { [Op.in]: list }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                            }
                        }
                    }
                    let stt = 1;
                    let tblHopDongNhanSu = mtblHopDongNhanSu(db);
                    tblHopDongNhanSu.belongsTo(mtblLoaiHopDong(db), { foreignKey: 'IDLoaiHopDong', sourceKey: 'IDLoaiHopDong', as: 'lhd' })
                    tblHopDongNhanSu.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
                    tblHopDongNhanSu.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [
                            {
                                model: mtblLoaiHopDong(db),
                                required: false,
                                as: 'lhd'
                            },
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'nv'
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                contractCode: data[i].ContractCode ? data[i].ContractCode : '',
                                signDate: data[i].Date ? moment(data[i].Date).format('DD/MM/YYYY') : null,
                                idLoaiHopDong: data[i].IDLoaiHopDong ? data[i].IDLoaiHopDong : '',
                                loaiHopDong: data[i].lhd ? data[i].lhd.TenLoaiHD : '',
                                salaryNumber: data[i].SalaryNumber ? data[i].SalaryNumber : '',
                                salaryText: data[i].SalaryText ? data[i].SalaryText : '',
                                contractDateEnd: data[i].ContractDateEnd ? moment(data[i].ContractDateEnd).format('DD/MM/YYYY') : '',
                                contractDateStart: data[i].ContractDateStart ? moment(data[i].ContractDateStart).format('DD/MM/YYYY') : null,
                                unitSalary: 'VND',
                                status: data[i].Status ? data[i].Status : '',
                                idNhanVien: data[i].IDNhanVien ? data[i].IDNhanVien : null,
                                staffName: data[i].nv ? data[i].nv.StaffName : '',
                            }
                            var arrayFile = []
                            await mtblFileAttach(db).findAll({ where: { IDContract: obj.id } }).then(file => {
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
                            obj['fileAttach'] = arrayFile;
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblHopDongNhanSu(db).count({ where: whereOjb, })
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
    // get_list_tbl_hopdong_nhansu_detail
    getListtblHopDongNhanSuDetail: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    if (body.dataSearch) {
                    }
                    let stt = 1;
                    let tblHopDongNhanSu = mtblHopDongNhanSu(db);
                    tblHopDongNhanSu.belongsTo(mtblLoaiHopDong(db), { foreignKey: 'IDLoaiHopDong', sourceKey: 'IDLoaiHopDong', as: 'lhd' })

                    tblHopDongNhanSu.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: { IDNhanVien: body.idNhanVien },
                        include: [
                            {
                                model: mtblLoaiHopDong(db),
                                required: false,
                                as: 'lhd'
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                contractCode: data[i].ContractCode ? data[i].ContractCode : '',
                                signDate: data[i].Date ? moment(data[i].Date).format('DD/MM/YYYY') : null,
                                idLoaiHopDong: data[i].IDLoaiHopDong ? data[i].IDLoaiHopDong : '',
                                loaiHopDong: data[i].lhd ? data[i].lhd.TenLoaiHD : '',
                                salaryNumber: data[i].SalaryNumber ? data[i].SalaryNumber : '',
                                salaryText: data[i].SalaryText ? data[i].SalaryText : '',
                                contractDateEnd: data[i].ContractDateEnd ? moment(data[i].ContractDateEnd).format('DD/MM/YYYY') : '',
                                contractDateStart: data[i].ContractDateStart ? moment(data[i].ContractDateStart).format('DD/MM/YYYY') : null,
                                unitSalary: 'VND',
                                status: data[i].Status ? data[i].Status : '',
                                idNhanVien: data[i].IDNhanVien ? data[i].IDNhanVien : null,
                                staffName: data[i].nv ? data[i].nv.StaffName : '',
                            }
                            var arrayFile = []
                            await mtblFileAttach(db).findAll({ where: { IDContract: obj.id } }).then(file => {
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
                            obj['fileAttach'] = arrayFile;
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblHopDongNhanSu(db).count({ where: { IDNhanVien: body.idNhanVien } })
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
    // get_list_name_tbl_hopdong_nhansu
    getListNametblHopDongNhanSu: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblHopDongNhanSu(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                name: element.Name ? element.Name : '',
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
    // in_word_contract
    inWordContract: (req, res) => {
        let body = req.body;
        // ngày 20 tháng 10 năm 2020
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let contactNumber = ''
                    let obj = {
                        'SỐ HỢP ĐỒNG': contactNumber,
                        'NGÀY KÍ': '',
                        'NHÂN VIÊN': '',
                        'NGÀY SINH': '',
                        'TÊN THÀNH PHỐ': '',
                        'ĐỊA CHỈ': '',
                        'CMT': '',
                        'NGÀY CẤP': '',
                        'NƠI CẤP': '',
                    }
                    let tblHopDongNhanSu = mtblHopDongNhanSu(db);
                    tblHopDongNhanSu.belongsTo(mtblLoaiHopDong(db), { foreignKey: 'IDLoaiHopDong', sourceKey: 'IDLoaiHopDong', as: 'lhd' })
                    tblHopDongNhanSu.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
                    await tblHopDongNhanSu.findOne({
                        where: { ID: body.id },
                        include: [
                            {
                                model: mtblLoaiHopDong(db),
                                required: false,
                                as: 'lhd'
                            },
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'nv'
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        if (data) {
                            contactNumber = data.ContractCode
                            obj = {
                                'SỐ HỢP ĐỒNG': data.ContractCode ? data.ContractCode : '',
                                'NGÀY KÍ': data.Date ? moment(data.Date).format('DD/MM/YYYY') : '',
                                'NHÂN VIÊN': data.nv ? data.nv.StaffName ? data.nv.StaffName : '' : '',
                                'NGÀY SINH': data.nv ? moment(data.nv.Birthday).format('DD/MM/YYYY') ? moment(data.nv.Birthday).format('DD/MM/YYYY') : '' : '',
                                'TÊN THÀNH PHỐ': data.nv ? data.nv.Address ? data.nv.Address : '' : '',
                                'ĐỊA CHỈ': data.nv ? data.nv.Address ? data.nv.Address : '' : '',
                                'CMT': data.nv ? data.nv.CMNDNumber ? data.nv.CMNDNumber : '' : '',
                                'NGÀY CẤP': data.nv ? data.nv.CMNDDate ? data.nv.CMNDDate : '' : '',
                                'NƠI CẤP': data.nv ? data.nv.CMNDPlace ? data.nv.CMNDPlace : '' : '',
                                'LOẠI HỢP ĐỒNG': data.lhd ? data.lhd.TenLoaiHD ? data.lhd.TenLoaiHD : '' : '',
                                'TỪ NGÀY': data.ContractDateStart ? moment(data.ContractDateStart).format('DD/MM/YYYY') : '',
                                'ĐẾN NGÀY': data.ContractDateEnd ? moment(data.ContractDateEnd).format('DD/MM/YYYY') : '',
                            }
                        }
                    })
                    await mModules.convertDataAndRenderWordFile(obj, 'template_contract.docx', (contactNumber ? contactNumber : 'HD') + '-HĐLĐ-TX2021.docx')
                    var result = {
                        link: 'http://103.154.100.26:1357/ageless_sendmail/' + (contactNumber ? contactNumber : 'HD') + '-HĐLĐ-TX2021.docx',
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
    // setup_time_repeat
    setupTimeRepeat: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblHopDongNhanSu(db).update({
                        NoticeTime: moment(body.time).format('YYYY-MM-DD'),
                        Time: moment(body.time).format('YYYY-MM-DD  HH:mm:ss.SSS'),
                    }, {
                        where: {
                            ID: body.id
                        }
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