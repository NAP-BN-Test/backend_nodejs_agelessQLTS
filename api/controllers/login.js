const Result = require('../constants/result');
const Sequelize = require('sequelize');
const mCustomer = require('../tables/customer-user/customer');
const mUser = require('../tables/customer-user/user');
const Constant = require('../constants/constant');
const database = require('../database');
let jwt = require('jsonwebtoken');

module.exports = {
    login: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            try {
                var data = await mUser(db).findOne({
                    where: { Username: body.userName, Password: body.password },
                })
                if (data) {
                    var obj = {
                        id: data.ID,
                        username: data.Username,
                        password: data.Password,
                        name: data.FullName,
                    }
                    payload = {
                        "Username": req.body.userName,
                        // standard fields
                        // - Xác thực người tạo
                        "iss": "Tungnn",
                    }
                    let token = jwt.sign(payload,
                        'abcdxys',
                        {
                            algorithm: "HS256",
                            expiresIn: '24h' // expires in 24 hours
                        }
                    );
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: '',
                        obj: obj,
                        token: token,
                    }
                    res.json(result);
                } else {
                    res.json(Result.LOGIN_FAIL)

                }
            } catch (error) {
                console.log(error);
                res.json(Result.SYS_ERROR_RESULT)
            }
        }, error => {
            res.json(error)
        })
    },
}