const Constant = require('../constants/constant');
const Result = require('../constants/result');
var database = require('../database');

module.exports = {
    // import_decided_increase_salary
    importDecidedIncreaseSalary: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
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