const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblInvoice = require('../tables/financemanage/tblInvoice')
var database = require('../database');
async function deleteRelationshiptblInvoice(db, listID) {
    await mtblInvoice(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblInvoice,
    //  get_detail_tbl_invoice
    detailtblInvoice: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblInvoice(db).findOne({ where: { ID: body.id } }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                invoiceCode: data.InvoiceCode ? data.InvoiceCode : '',
                                invoiceNumber: data.InvoiceNumber ? data.InvoiceNumber : '',
                                idKhachHang: data.IDKhachHang ? data.IDKhachHang : null,
                                idNhanVienCreate: data.IDNhanVienCreate ? data.IDNhanVienCreate : null,
                                invoiceDate: data.InvoiceDate ? data.InvoiceDate : null,
                                invoiceContent: data.InvoiceContent ? data.InvoiceContent : '',
                                invoiceCost: data.InvoiceCost ? data.InvoiceCost : null,
                                idTaiKhoanKeToanCost: data.IDTaiKhoanKeToanCost ? data.IDTaiKhoanKeToanCost : null,
                                idNhanVienAccounting: data.IDNhanVienAccounting ? data.IDNhanVienAccounting : null,
                                idBoPhan: data.IDBoPhan ? data.IDBoPhan : null,
                                idDieuKhoanThanhToan: data.IDDieuKhoanThanhToan ? data.IDDieuKhoanThanhToan : null,
                                ngayHachToan: data.NgayHachToan ? data.NgayHachToan : null,
                                ngayChungTu: data.NgayChungTu ? data.NgayChungTu : null,
                                idKhoanTienKhongXacDinh: data.IDKhoanTienKhongXacDinh ? data.IDKhoanTienKhongXacDinh : null,
                                typeCost: data.TypeCost ? data.TypeCost : null,
                                exchangeRate: data.ExchangeRate ? data.ExchangeRate : null,
                                soChungTu: data.SoChungTu ? data.SoChungTu : '',
                                payment: data.Payment ? data.Payment : null,
                                idTaiKhoanKeToanPayment: data.IDTaiKhoanKeToanPayment ? data.IDTaiKhoanKeToanPayment : null,
                                debt: data.Debt ? data.Debt : null,
                                status: data.Status ? data.Status : '',
                            }
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
    // add_tbl_invoice
    addtblInvoice: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblInvoice(db).create({
                        InvoiceCode: body.invoiceCode ? body.invoiceCode : '',
                        InvoiceNumber: body.invoiceNumber ? body.invoiceNumber : '',
                        IDKhachHang: body.idKhachHang ? body.idKhachHang : null,
                        IDNhanVienCreate: body.idNhanVienCreate ? body.idNhanVienCreate : null,
                        InvoiceDate: body.invoiceDate ? body.invoiceDate : null,
                        InvoiceContent: body.invoiceContent ? body.invoiceContent : '',
                        InvoiceCost: body.invoiceCost ? body.invoiceCost : null,
                        IDTaiKhoanKeToanCost: body.idTaiKhoanKeToanCost ? body.idTaiKhoanKeToanCost : null,
                        IDNhanVienAccounting: body.idNhanVienAccounting ? body.idNhanVienAccounting : null,
                        IDBoPhan: body.idBoPhan ? body.idBoPhan : null,
                        IDDieuKhoanThanhToan: body.idDieuKhoanThanhToan ? body.idDieuKhoanThanhToan : null,
                        NgayHachToan: body.ngayHachToan ? body.ngayHachToan : null,
                        NgayChungTu: body.ngayChungTu ? body.ngayChungTu : null,
                        IDKhoanTienKhongXacDinh: body.idKhoanTienKhongXacDinh ? body.idKhoanTienKhongXacDinh : null,
                        TypeCost: body.typeCost ? body.typeCost : null,
                        ExchangeRate: body.exchangeRate ? body.exchangeRate : null,
                        SoChungTu: body.soChungTu ? body.soChungTu : '',
                        Payment: body.payment ? body.payment : null,
                        IDTaiKhoanKeToanPayment: body.idTaiKhoanKeToanPayment ? body.idTaiKhoanKeToanPayment : null,
                        Debt: body.debt ? body.debt : null,
                        Status: body.status ? body.status : '',
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
    // // update_tbl_invoice
    // updatetblInvoice: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 let update = [];
    //                 if (body.code || body.code === '')
    //                     update.push({ key: 'Code', value: body.code });
    //                 if (body.name || body.name === '')
    //                     update.push({ key: 'Name', value: body.name });
    //                 if (body.name || body.name === '')
    //                     update.push({ key: 'Name', value: body.name });
    //                 if (body.name || body.name === '')
    //                     update.push({ key: 'Name', value: body.name });
    //                 if (body.name || body.name === '')
    //                     update.push({ key: 'Name', value: body.name });
    //                 if (body.name || body.name === '')
    //                     update.push({ key: 'Name', value: body.name });
    //                 if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
    //                     if (body.idLoaiTaiKhoanKeToan === '')
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
    //                     else
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
    //                 }
    //                 if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
    //                     if (body.idLoaiTaiKhoanKeToan === '')
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
    //                     else
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
    //                 }
    //                 if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
    //                     if (body.idLoaiTaiKhoanKeToan === '')
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
    //                     else
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
    //                 }
    //                 if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
    //                     if (body.idLoaiTaiKhoanKeToan === '')
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
    //                     else
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
    //                 }
    //                 if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
    //                     if (body.idLoaiTaiKhoanKeToan === '')
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
    //                     else
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
    //                 }
    //                 if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
    //                     if (body.idLoaiTaiKhoanKeToan === '')
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
    //                     else
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
    //                 }
    //                 if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
    //                     if (body.idLoaiTaiKhoanKeToan === '')
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
    //                     else
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
    //                 }
    //                 if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
    //                     if (body.idLoaiTaiKhoanKeToan === '')
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
    //                     else
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
    //                 }
    //                 if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
    //                     if (body.idLoaiTaiKhoanKeToan === '')
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
    //                     else
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
    //                 }
    //                 if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
    //                     if (body.idLoaiTaiKhoanKeToan === '')
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
    //                     else
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
    //                 }
    //                 if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
    //                     if (body.idLoaiTaiKhoanKeToan === '')
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
    //                     else
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
    //                 }
    //                 if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
    //                     if (body.idLoaiTaiKhoanKeToan === '')
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
    //                     else
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
    //                 }
    //                 if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
    //                     if (body.idLoaiTaiKhoanKeToan === '')
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
    //                     else
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
    //                 }
    //                 if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
    //                     if (body.idLoaiTaiKhoanKeToan === '')
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
    //                     else
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
    //                 }
    //                 if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
    //                     if (body.idLoaiTaiKhoanKeToan === '')
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
    //                     else
    //                         update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
    //                 }
    //                 database.updateTable(update, mtblInvoice(db), body.id).then(response => {
    //                     if (response == 1) {
    //                         res.json(Result.ACTION_SUCCESS);
    //                     } else {
    //                         res.json(Result.SYS_ERROR_RESULT);
    //                     }
    //                 })
    //             } catch (error) {
    //                 console.log(error);
    //                 res.json(Result.SYS_ERROR_RESULT)
    //             }
    //         } else {
    //             res.json(Constant.MESSAGE.USER_FAIL)
    //         }
    //     })
    // },
    // delete_tbl_invoice
    deletetblInvoice: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblInvoice(db, listID);
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
    // get_list_tbl_invoice
    getListtblInvoice: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    // if (body.dataSearch) {
                    //     var data = JSON.parse(body.dataSearch)

                    //     if (data.search) {
                    //         where = [
                    //             { FullName: { [Op.like]: '%' + data.search + '%' } },
                    //             { Address: { [Op.like]: '%' + data.search + '%' } },
                    //             { CMND: { [Op.like]: '%' + data.search + '%' } },
                    //             { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
                    //         ];
                    //     } else {
                    //         where = [
                    //             { FullName: { [Op.ne]: '%%' } },
                    //         ];
                    //     }
                    //     whereOjb = {
                    //         [Op.and]: [{ [Op.or]: where }],
                    //         [Op.or]: [{ ID: { [Op.ne]: null } }],
                    //     };
                    //     if (data.items) {
                    //         for (var i = 0; i < data.items.length; i++) {
                    //             let userFind = {};
                    //             if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                    //                 userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                    //                 if (data.items[i].conditionFields['name'] == 'And') {
                    //                     whereOjb[Op.and].push(userFind)
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Or') {
                    //                     whereOjb[Op.or].push(userFind)
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Not') {
                    //                     whereOjb[Op.not] = userFind
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                    let stt = 1;
                    mtblInvoice(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                invoiceCode: element.InvoiceCode ? element.InvoiceCode : '',
                                invoiceNumber: element.InvoiceNumber ? element.InvoiceNumber : '',
                                idKhachHang: element.IDKhachHang ? element.IDKhachHang : null,
                                idNhanVienCreate: element.IDNhanVienCreate ? element.IDNhanVienCreate : null,
                                invoiceDate: element.InvoiceDate ? element.InvoiceDate : null,
                                invoiceContent: element.InvoiceContent ? element.InvoiceContent : '',
                                invoiceCost: element.InvoiceCost ? element.InvoiceCost : null,
                                idTaiKhoanKeToanCost: element.IDTaiKhoanKeToanCost ? element.IDTaiKhoanKeToanCost : null,
                                idNhanVienAccounting: element.IDNhanVienAccounting ? element.IDNhanVienAccounting : null,
                                idBoPhan: element.IDBoPhan ? element.IDBoPhan : null,
                                idDieuKhoanThanhToan: element.IDDieuKhoanThanhToan ? element.IDDieuKhoanThanhToan : null,
                                ngayHachToan: element.NgayHachToan ? element.NgayHachToan : null,
                                ngayChungTu: element.NgayChungTu ? element.NgayChungTu : null,
                                idKhoanTienKhongXacDinh: element.IDKhoanTienKhongXacDinh ? element.IDKhoanTienKhongXacDinh : null,
                                typeCost: element.TypeCost ? element.TypeCost : null,
                                exchangeRate: element.ExchangeRate ? element.ExchangeRate : null,
                                soChungTu: element.SoChungTu ? element.SoChungTu : '',
                                payment: element.Payment ? element.Payment : null,
                                idTaiKhoanKeToanPayment: element.IDTaiKhoanKeToanPayment ? element.IDTaiKhoanKeToanPayment : null,
                                debt: element.Debt ? element.Debt : null,
                                status: element.Status ? element.Status : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblInvoice(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_invoice
    getListNametblInvoice: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblInvoice(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                invoiceNumber: element.InvoiceNumber ? element.InvoiceNumber : '',
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