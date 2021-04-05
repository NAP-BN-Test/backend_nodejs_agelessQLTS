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
let dataTemplate = [
    {

    }
]
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
            await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(async data => {
                if (data) {
                    if (data.data.status_code == 200) {
                        if (data) {
                            var array = data.data.data.list;
                            var stt = 1;
                            for (var i = 0; i < array.length; i++) {
                                array[i]['stt'] = stt;
                                var inv = await mtblInvoice(db).findOne({
                                    where: {
                                        IDSpecializedSoftware: array[i].id
                                    }
                                })
                                if (!inv) {
                                    await mtblInvoice(db).create({
                                        IDSpecializedSoftware: array[i].id ? array[i].id : null,
                                        Status: array[i].statusName,
                                    })
                                } else {
                                    array[i]['statusName'] = inv.Status;
                                }
                                stt += 1;
                            }
                            var count = await mtblInvoice(db).count()
                            var result = {
                                array: data.data.data.list,
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                                all: count
                            }
                            res.json(result);
                        }
                        else {
                            res.json(Result.SYS_ERROR_RESULT)
                        }
                    } else {
                        res.json(Result.SYS_ERROR_RESULT)
                    }
                }
                else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            })
        },
        )
    },
}