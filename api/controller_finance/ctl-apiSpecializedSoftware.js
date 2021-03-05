const axios = require('axios');
const Result = require('../constants/result');
const Constant = require('../constants/constant');
module.exports = {
    // get_list_department
    getListDepartment: async (req, res) => {
        await axios.get(`http://ageless-ldms-api.vnsolution.tech/api/v1/department/share`).then(data => {
            if (data) {
                var result = {
                    array: data.data.data,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    all: data.data.data.length
                }
                res.json(result);
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
            // console.log(data.data);
        })
    },
    // get_list_partner
    getListPartner: async (req, res) => {
        await axios.get(`http://ageless-ldms-api.vnsolution.tech/api/v1/address_book/share`).then(data => {
            // console.log(data.data);
            if (data) {
                var result = {
                    array: data.data.data,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    all: data.data.data.length
                }
                res.json(result);
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
            // console.log(data.data);
        })
    },
    // get_list_customer
    getListCustomer: async (req, res) => {
        await axios.get(`http://ageless-ldms-api.vnsolution.tech/api/v1/address_book/partners_share`).then(data => {
            if (data) {
                var result = {
                    array: data.data.data,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    all: data.data.data.length
                }
                res.json(result);
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
            // console.log(data.data);
        })
    },
    // get_list_user
    getListUser: async (req, res) => {
        await axios.get(`http://ageless-ldms-api.vnsolution.tech/api/v1/user/share`).then(data => {
            if (data) {
                var result = {
                    array: data.data.data,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    all: data.data.data.length
                }
                res.json(result);
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
            // console.log(data.data);
        })
    },
    // get_list_invoice
    getListInvoice: async (req, res) => {
        var obj = {
            "paging":
            {
                "pageSize": 0,
                "currentPage": 0
            }
        }
        await axios.post(`http://ageless-ldms-api.vnsolution.tech/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                var result = {
                    array: data.data.data.list,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    all: data.data.data.pager.rowsCount
                }
                res.json(result);
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
            // console.log(data.data);
        })
    },
}