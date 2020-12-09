const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var Zalo = require('zalo-sdk');
var ZaloSocial = require('zalo-sdk').ZaloSocial;

var zsConfig = {
    appId: '2568387362160739467',
    redirectUri: 'http://localhost/login/zalo-callback',
    secretkey: 'BXRLx82AGrl2gBRoWDcN'
};

var ZSClient = new ZaloSocial(zsConfig);
module.exports = {
    zalo: (req, res) => {
        let body = req.body;
        try {
            ZSClient.api('me', 'GET', { fields: 'id, name, birthday, gender, picture' }, function (response) {
                console.log(response);
                res.json(response)

            });
        } catch (error) {
            console.log(error);
            res.json(Result.SYS_ERROR_RESULT)
        }
    },
}
