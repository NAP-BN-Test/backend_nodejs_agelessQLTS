const axios = require('axios');
const Result = require('../constants/result');
const Constant = require('../constants/constant');
data = [
    {
        createdDate: '01/05/2020',
        number: 'Công ty tnhh An Phú',
        numberInvoice: 'INV0001',
        numberInvoice: 'INV0001',
        total: '1000000',
        typeMoney: 'VND',
        statusNameName: 'Sửa',
    },
    {
        createdDate: '02/05/2020',
        number: 'Công ty tnhh An Phú',
        numberInvoice: 'INV0002',
        numberInvoice: 'INV0002',
        total: '1100000',
        typeMoney: 'VND',
        statusNameName: 'Xóa',
    },
    {
        createdDate: '03/05/2020',
        number: 'Công ty tnhh An Phú',
        numberInvoice: 'INV0003',
        numberInvoice: 'INV0003',
        total: '1200000',
        typeMoney: 'VND',
        statusNameName: 'Thanh toán',
    },
    {
        createdDate: '04/05/2020',
        number: 'Công ty tnhh An Phú',
        numberInvoice: 'INV0004',
        numberInvoice: 'INV0004',
        total: '1300000',
        typeMoney: 'VND',
        statusNameName: 'Sửa',
    },
    {
        createdDate: '05/05/2020',
        number: 'Công ty tnhh An Phú',
        numberInvoice: 'INV0005',
        numberInvoice: 'INV0005',
        total: '1400000',
        typeMoney: 'VND',
        statusNameName: 'Sửa',
    },
    {
        createdDate: '06/05/2020',
        number: 'Công ty tnhh An Phú',
        numberInvoice: 'INV0006',
        numberInvoice: 'INV0006',
        total: '1500000',
        typeMoney: 'VND',
        statusNameName: 'Thanh toán',
    },
    {
        createdDate: '07/05/2020',
        number: 'Công ty tnhh An Phú',
        numberInvoice: 'INV0007',
        numberInvoice: 'INV0007',
        total: '1600000',
        typeMoney: 'VND',
        statusNameName: 'Xóa',
    },
    {
        createdDate: '08/05/2020',
        number: 'Công ty tnhh An Phú',
        numberInvoice: 'INV0008',
        numberInvoice: 'INV0008',
        total: '1700000',
        typeMoney: 'VND',
        statusNameName: 'Chờ thanh toán',
    },
    {
        createdDate: '09/05/2020',
        number: 'Công ty tnhh An Phú',
        numberInvoice: 'INV0009',
        numberInvoice: 'INV0009',
        total: '1800000',
        typeMoney: 'VND',
        statusNameName: 'Chờ thanh toán',
    },
    {
        createdDate: '10/05/2020',
        number: 'Công ty tnhh An Phú',
        numberInvoice: 'INV0010',
        numberInvoice: 'INV0010',
        total: '1900000',
        typeMoney: 'VND',
        statusNameName: 'Sửa',
    },
];
module.exports = {
    // get_list_department
    getListDepartment: async (req, res) => {
        await axios.get(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/department/share`).then(data => {
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
        await axios.get(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/address_book/share`).then(data => {
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
        dataCustomer = [
            {
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
                "customerCode": "KH0010",
                "name": "Công ty tnhh Hòa Phát",
                "attributesChangeLog": "Công ty chuyên sản xuất tôn ngói ",
                "tax": "014775745",
                "countryName": "Việt Nam",
                "address": "Số 2 Phố Huế Hà Nội",
                "mobile": "045245401",
                "fax": "021455235",
                "email": "hoaphat0102@gmail.com",
            },
            {
                "customerCode": "KH0011",
                "name": "Công ty sx và dịch vụ Tiến Đạt",
                "attributesChangeLog": "Công ty chuyên cung cấp đồ gia dụng",
                "tax": "043245545",
                "countryName": "Việt Nam",
                "address": "Số 17 Khu công nghiệp Vsip Bắc Ninh",
                "mobile": "024545572",
                "fax": "0241336814",
                "email": "tiendatj0305@gmail.com",
            }
        ]
        // await axios.get(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/address_book/partners_share`).then(data => {
        if (dataCustomer) {
            var result = {
                // array: data.data.data,
                array: dataCustomer,
                status: Constant.STATUS.SUCCESS,
                message: Constant.MESSAGE.ACTION_SUCCESS,
                all: 10
                // all: data.data.data.length
            }
            res.json(result);
        }
        else {
            res.json(Result.SYS_ERROR_RESULT)
        }
        // console.log(data.data);
        // })
    },
    // get_list_user
    getListUser: async (req, res) => {
        await axios.get(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/user/share`).then(data => {
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

    // Invoice follow customer ------------------------------------------------------------------------------------------------------------------
    // get_list_invoice_from_customer
    getListInvoiceFromCustomer: async (req, res) => {
        var body = req.body
        var obj = {
            "paging":
            {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        // console.log(body);
        // await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
        if (data) {
            // if (data.data.status_code == 200) {
            totalMoney = [
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
            // } else {
            //     res.json(Result.SYS_ERROR_RESULT)
            // }
        }
        else {
            res.json(Result.SYS_ERROR_RESULT)
        }
        // })
    },
    // get_list_invoice_wait_for_pay_from_customer
    getListInvoiceWaitForPayFromCustomer: async (req, res) => {
        var body = req.body
        var obj = {
            "paging":
            {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        console.log(body);
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_invoice_paid_from_customer
    getListInvoicePaidFromCustomer: async (req, res) => {
        var body = req.body
        var obj = {
            "paging":
            {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        console.log(body);
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },

    // Credit follow customer ------------------------------------------------------------------------------------------------------------------
    // get_list_credit_from_customer
    getListCreditFromCustomer: async (req, res) => {
        var body = req.body
        console.log(body.id);
        var obj = {
            "paging":
            {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_credit_wait_for_pay_from_customer
    getListCreditWaitForPayFromCustomer: async (req, res) => {
        var body = req.body
        console.log(body.id);
        var obj = {
            "paging":
            {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_credit_paid_from_customer
    getListCreditPaidFromCustomer: async (req, res) => {
        var body = req.body
        console.log(body.id);
        var obj = {
            "paging":
            {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },


    // ------------------------------------------------------------------------------------------------------------------------------------------
    // get_list_invoice_from_partner
    getListInvoiceFromPartner: async (req, res) => {
        var body = req.body
        var obj = {
            "paging":
            {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // invoice-------------------------------------------------------------------------------------------------------------------------------------
    // get_list_invoice_wait_for_pay
    getListInvoiceWaitForPay: async (req, res) => {
        var body = req.body
        var obj = {
            "paging":
            {
                "pageSize": body.itemPerPage ? body.itemPerPage : 0,
                "currentPage": body.page ? body.page : 0
            },
            "type": body.type
        }
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_invoice_paid
    getListInvoicePaid: async (req, res) => {
        var body = req.body
        var obj = {
            "paging":
            {
                "pageSize": body.itemPerPage ? body.itemPerPage : 0,
                "currentPage": body.page ? body.page : 0
            },
            "type": body.type
        }
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_invoice_edit_request
    getListInvoiceEditRequest: async (req, res) => {
        var body = req.body
        var obj = {
            "paging":
            {
                "pageSize": body.itemPerPage ? body.itemPerPage : 0,
                "currentPage": body.page ? body.page : 0
            },
            "type": body.type
        }
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_invoice_delete_request
    getListInvoiceDeleteRequest: async (req, res) => {
        var body = req.body
        var obj = {
            "paging":
            {
                "pageSize": body.itemPerPage ? body.itemPerPage : 0,
                "currentPage": body.page ? body.page : 0
            },
            "type": body.type
        }
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },


    // credit-------------------------------------------------------------------------------------------------------------------------------------
    // get_list_credit
    getListCredit: async (req, res) => {
        var body = req.body
        var obj = {
            "paging":
            {
                "pageSize": body.itemPerPage ? body.itemPerPage : 0,
                "currentPage": body.page ? body.page : 0
            },
            "type": body.type
        }
        console.log(body);
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_Credit_wait_for_pay
    getListCreditWaitForPay: async (req, res) => {
        var body = req.body
        var obj = {
            "paging":
            {
                "pageSize": body.itemPerPage ? body.itemPerPage : 0,
                "currentPage": body.page ? body.page : 0
            },
            "type": body.type
        }
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_Credit_paid
    getListCreditPaid: async (req, res) => {
        var body = req.body
        var obj = {
            "paging":
            {
                "pageSize": body.itemPerPage ? body.itemPerPage : 0,
                "currentPage": body.page ? body.page : 0
            },
            "type": body.type
        }
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_Credit_edit_request
    getListCreditEditRequest: async (req, res) => {
        var body = req.body
        var obj = {
            "paging":
            {
                "pageSize": body.itemPerPage ? body.itemPerPage : 0,
                "currentPage": body.page ? body.page : 0
            },
            "type": body.type
        }
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_Credit_delete_request
    getListCreditDeleteRequest: async (req, res) => {
        var body = req.body
        var obj = {
            "paging":
            {
                "pageSize": body.itemPerPage ? body.itemPerPage : 0,
                "currentPage": body.page ? body.page : 0
            },
            "type": body.type
        }
        await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
            if (data) {
                if (data.data.status_code == 200) {
                    var result = {
                        array: data.data.data.list,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: data.data.data.pager.rowsCount
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
}