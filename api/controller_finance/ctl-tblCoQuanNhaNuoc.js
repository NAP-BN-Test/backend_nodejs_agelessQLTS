const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblCoQuanNhaNuoc = require('../tables/financemanage/tblCoQuanNhaNuoc')
var database = require('../database');
const axios = require('axios');
async function deleteRelationshiptblCoQuanNhaNuoc(db, listID) {
    await mtblCoQuanNhaNuoc(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
dataCQNN = [
    {
        id: 1,
        invoiceNumber: 'INV0001',
        paymentSACode: 'TTCCNN0001',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '2020/02/01',
        content: 'Thanh toán cho TTCCNN0001',
        total: '1000000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
    },
    {
        id: 2,
        invoiceNumber: 'INV0002',
        paymentSACode: 'TTCCNN0002',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '2020/02/02',
        content: 'Thanh toán cho TTCCNN0002',
        total: '1200000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
    },
    {
        id: 3,
        invoiceNumber: 'INV0003',
        paymentSACode: 'TTCCNN0003',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '2020/02/03',
        content: 'Thanh toán cho TTCCNN0003',
        total: '1300000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
    },
    {
        id: 4,
        invoiceNumber: 'INV0004',
        paymentSACode: 'TTCCNN0004',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '2020/02/04',
        content: 'Thanh toán cho TTCCNN0004',
        total: '4000000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
    },
    {
        id: 5,
        invoiceNumber: 'INV0005',
        paymentSACode: 'TTCCNN0005',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '2020/02/05',
        content: 'Thanh toán cho TTCCNN0005',
        total: '1500000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
    },
    {
        id: 6,
        invoiceNumber: 'INV0006',
        paymentSACode: 'TTCCNN0006',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '2020/02/06',
        content: 'Thanh toán cho TTCCNN0006',
        total: '1600000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
    },
    {
        id: 7,
        invoiceNumber: 'INV0007',
        paymentSACode: 'TTCCNN0007',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '2020/02/07',
        content: 'Thanh toán cho TTCCNN0007',
        total: '1700000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
    },
    {
        id: 8,
        invoiceNumber: 'INV0008',
        paymentSACode: 'TTCCNN0008',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '2020/02/08',
        content: 'Thanh toán cho TTCCNN0008',
        total: '1800000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
    },
    {
        id: 9,
        invoiceNumber: 'INV0009',
        paymentSACode: 'TTCCNN0009',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '2020/02/09',
        content: 'Thanh toán cho TTCCNN0009',
        total: '1900000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
    },
    {
        id: 10,
        invoiceNumber: 'INV0010',
        paymentSACode: 'TTCCNN0010',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '2020/02/10',
        content: 'Thanh toán cho TTCCNN0010',
        total: '1200000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
    },
]
dataFLCQNN = [
    {
        id: 1,
        createdDate: '2020/02/01',
        code: 'BL0001',
        idCQNC: 1,
        amountReceipts: 1000000,
        invoiceNumber: 'INV0001',
    },
    {
        id: 2,
        createdDate: '2020/02/02',
        code: 'BL0002',
        idCQNC: 2,
        amountReceipts: 1200000,
        invoiceNumber: 'INV0002',

    },
    {
        id: 3,
        createdDate: '2020/02/03',
        code: 'BL0003',
        idCQNC: 3,
        amountReceipts: 1300000,
        invoiceNumber: 'INV0003',

    },
    {
        id: 4,
        createdDate: '2020/02/04',
        code: 'BL0004',
        idCQNC: 4,
        amountReceipts: 1400000,
        invoiceNumber: 'INV0004',

    },
    {
        id: 5,
        createdDate: '2020/02/05',
        code: 'BL0005',
        idCQNC: 5,
        amountReceipts: 1500000,
        invoiceNumber: 'INV0005',

    },
    {
        id: 6,
        createdDate: '2020/02/06',
        code: 'BL0006',
        idCQNC: 6,
        amountReceipts: 1600000,
        invoiceNumber: 'INV0006',

    },
    {
        id: 7,
        createdDate: '2020/02/08',
        code: 'BL0008',
        idCQNC: 8,
        amountReceipts: 1800000,
        invoiceNumber: 'INV0007',

    },
    {
        id: 8,
        createdDate: '2020/02/08',
        code: 'BL0008',
        idCQNC: 8,
        amountReceipts: 1800000,
        invoiceNumber: 'INV0008',

    },
    {
        id: 9,
        createdDate: '2020/02/09',
        code: 'BL0009',
        idCQNC: 9,
        amountReceipts: 1900000,
        invoiceNumber: 'INV0009',

    },
    {
        id: 10,
        createdDate: '2020/02/10',
        code: 'BL0010',
        idCQNC: 10,
        amountReceipts: 1110000,
        invoiceNumber: 'INV00010',

    },
]
module.exports = {
    deleteRelationshiptblCoQuanNhaNuoc,
    //  get_detail_tbl_state_agencies
    // detailtblCoQuanNhaNuoc: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 mtblCoQuanNhaNuoc(db).findOne({ where: { ID: body.id } }).then(data => {
    //                     if (data) {
    //                         var obj = {
    //                             id: data.ID,
    //                             name: data.Name,
    //                             code: data.Code,
    //                         }
    //                         var result = {
    //                             obj: obj,
    //                             status: Constant.STATUS.SUCCESS,
    //                             message: Constant.MESSAGE.ACTION_SUCCESS,
    //                         }
    //                         res.json(result);
    //                     } else {
    //                         res.json(Result.NO_DATA_RESULT)

    //                     }

    //                 })
    //             } catch (error) {
    //                 res.json(Result.SYS_ERROR_RESULT)
    //             }
    //         } else {
    //             res.json(Constant.MESSAGE.USER_FAIL)
    //         }
    //     })
    // },
    // add_tbl_state_agencies
    addtblCoQuanNhaNuoc: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblCoQuanNhaNuoc(db).create({
                        IDSpecializedSoftware: body.idSpecializedSoftware ? body.idSpecializedSoftware : null,
                        Status: 'Mới',
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
    // update_tbl_state_agencies
    updatetblCoQuanNhaNuoc: (req, res) => {
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
                    database.updateTable(update, mtblCoQuanNhaNuoc(db), body.id).then(response => {
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
    // delete_tbl_state_agencies
    deletetblCoQuanNhaNuoc: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblCoQuanNhaNuoc(db, listID);
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
    // get_list_tbl_state_agencies
    getListtblCoQuanNhaNuoc: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            var obj = {
                "paging":
                {
                    "pageSize": body.itemPerPage ? body.itemPerPage : 0,
                    "currentPage": body.page ? body.page : 0
                },
                "type": body.type
            }
            // await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(async data => {
            //     if (data) {
            //         if (data.data.status_code == 200) {
            if (dataCQNN) {
                // var array = data.data.data.list;
                var array = dataCQNN;
                // var stt = 1;
                // for (var i = 0; i < array.length; i++) {
                //     array[i]['stt'] = stt;
                //     var inv = await mtblCoQuanNhaNuoc(db).findOne({
                //         where: {
                //             IDSpecializedSoftware: array[i].id
                //         }
                //     })
                //     if (!inv) {
                //         await mtblCoQuanNhaNuoc(db).create({
                //             IDSpecializedSoftware: array[i].id ? array[i].id : null,
                //             Status: array[i].statusName,
                //         })
                //         console.log(123);

                //     } else {
                //         array[i]['statusName'] = inv.Status;
                //     }
                //     stt += 1;
                // }
                // var count = await mtblCoQuanNhaNuoc(db).count()
                var result = {
                    array: dataCQNN,
                    // array: data.data.data.list,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    all: 10
                    // all: count
                }
                res.json(result);
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
            //         } else {
            //             res.json(Result.SYS_ERROR_RESULT)
            //         }
            //     }
            //     else {
            //         res.json(Result.SYS_ERROR_RESULT)
            //     }
            // })
        })
    },
    // get_list_name_tbl_state_agencies
    getListNametblCoQuanNhaNuoc: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblCoQuanNhaNuoc(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                soChungTu: element.SoChungTu ? element.SoChungTu : '',
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
    // track_receipts
    trackReceipts: (req, res) => {
        let body = req.body;
        console.log(body);
        let array = [];
        let obj = {};
        database.connectDatabase().then(async db => {
            obj = {
                sdktcs: 2000000,
                kq: 2000000,
                sdq: 2000000,
                totalmoneyNC: 60000000,
                totalckNC: 20000000,
                totalsttbl: 15600000,
            }
            for (var i = 0; i < dataFLCQNN.length; i++) {
                array.push({
                    id: dataFLCQNN[i].idCQNC,
                    soCT: dataFLCQNN[i].code,
                    ngayCT: dataFLCQNN[i].createdDate,
                    moneyNC: 6000000,
                    invoiceNumber: dataFLCQNN[i].invoiceNumber,
                    ckNC: 2000000,
                    sttbl: dataFLCQNN[i].amountReceipts,
                    rq: 0,
                    sdck: 0,
                })
            }
            obj['lines'] = array;
            var result = {
                obj: obj,
                status: Constant.STATUS.SUCCESS,
                message: Constant.MESSAGE.ACTION_SUCCESS,
            }
            res.json(result);
        })
    },
}