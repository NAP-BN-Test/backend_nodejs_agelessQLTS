const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mLaborManagementBook = require('../tables/labor-management-book');
var database = require('../database');

module.exports = {
    addLaborManagementBook: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(db => {
            if (db) {
                mLaborManagementBook(db).findOne().then(data => {
                    res.json(data)
                })
            } else {
                res.json('ID không tồn tại !')
            }
        })
    },
}