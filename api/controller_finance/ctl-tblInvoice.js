const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblInvoice = require('../tables/financemanage/tblInvoice')
var database = require('../database');
const axios = require('axios');

async function deleteRelationshiptblInvoice(db, listID) {
    await mtblInvoice(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
data = [
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
        request: 'Yêu cầu xóa',
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
        request: 'Yêu cầu xóa',
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
        request: 'Yêu cầu xóa',
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
module.exports = {
    deleteRelationshiptblInvoice,
    // get_list_tbl_invoice
    getListtblInvoice: async (req, res) => {
        var body = req.body
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
            if (data) {
                // var array = data.data.data.list;
                var array = data;
                var stt = 1;
                // for (var i = 0; i < array.length; i++) {
                //     array[i]['stt'] = stt;
                //     var inv = await mtblInvoice(db).findOne({
                //         where: {
                //             IDSpecializedSoftware: array[i].id
                //         }
                //     })
                //     if (!inv) {
                //         await mtblInvoice(db).create({
                //             IDSpecializedSoftware: array[i].id ? array[i].id : null,
                //             Status: array[i].statusName,
                //         })
                //     } else {
                //         array[i]['statusName'] = inv.Status;
                //     }
                //     stt += 1;
                // }
                var count = await mtblInvoice(db).count()
                let totalMoney = [
                    {
                        total: 1000000000,
                        type: 'VND',
                    },
                    {
                        total: 1000,
                        type: 'USD',
                    }
                ];
                var result = {
                    array: data,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    all: 10,
                    totalMoney: totalMoney,
                    // all: data.data.data.pager.rowsCount
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
        },
        )
    },
}