const cryptoJS = require('crypto-js');
var moment = require('moment');
var fs = require('fs');
const JSZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const path = require('path');

var arrCallStatus = [
    { id: 1, name: 'Không trả lời' },
    { id: 2, name: 'Bận' },
    { id: 3, name: 'Nhầm số' },
    { id: 4, name: 'Tin nhắn' },
    { id: 5, name: 'Cúp máy' },
    { id: 6, name: 'Đã kết nối' },
]

var arrTastType = [
    { id: 1, name: 'Cuộc gọi' },
    { id: 2, name: 'Email' },
    { id: 3, name: 'Gặp mặt' }
]

var arrMailStatus = [
    { id: 1, name: 'Đã gửi' },
    { id: 2, name: 'Đã nhận' },
    { id: 3, name: 'Đã trả lời' },
    { id: 4, name: 'Nhầm email' }
]

function checkDuplicate(array, elm) {
    var check = false;
    array.forEach(item => {
        if (item === elm) check = true;
    })
    return check;
}
let ctlFileAttach = require('../controllers/ctl-tblFileAttach');
var mtblFileAttach = require('../tables/constants/tblFileAttach');

var dayInWeek = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
module.exports = {
    checkDuplicate,
    updateForFileAttach: async function (db, key, array, idFile) {
        let arrayFileAttach = []
        let obj = {}
        obj[key] = idFile
        let where = []
        where.push(obj)
        for (var i = 0; i < array.length; i++) {
            arrayFileAttach.push(array[i].id)
        }
        await mtblFileAttach(db).findAll({
            where: where
        }).then(async data => {
            for (let file = 0; file < data.length; file++) {
                console.log(array);
                console.log(data[file].ID);
                if (!checkDuplicate(arrayFileAttach, data[file].ID)) {
                    console.log(123);
                    await ctlFileAttach.deleteRelationshiptblFileAttach(db, data[file].ID)

                }
            }
        })
        for (var j = 0; j < array.length; j++)
            await mtblFileAttach(db).update(obj, {
                where: {
                    ID: array[j].id
                }
            })
    },
    automaticCode: async (database, fieldCode, codeBefore, type = '') => {
        let year = moment().format('YYYY');
        let month = moment().format('MM');
        let where = []
        if (type != '') {
            where.push({ Type: type })
        }
        var check = await database.findOne({
            order: [
                ['ID', 'DESC']
            ],
            where: where,
        })
        var automaticCode = codeBefore + '_1_' + month + year;
        if (!check) {
            codeNumber = codeBefore + '_1_' + month + year
        } else {
            let codeBetween = 1;
            if (Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 6)))
                codeBetween = Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 6)) + 1
            else if (Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 5)))
                codeBetween = Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 5)) + 1
            else if (Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 4)))
                codeBetween = Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 4)) + 1
            else if (Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 3)))
                codeBetween = Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 3)) + 1
            else if (Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 2)))
                codeBetween = Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 2)) + 1
            if (check[fieldCode]) {
                let checkMonth = Number(check[fieldCode].slice(Number(check[fieldCode].length - 6), Number(check[fieldCode].length - 4)))
                console.log(checkMonth);
                if (Number(check[fieldCode].slice(check[fieldCode].length - 4, check[fieldCode].length + 6)) == year) {
                    if (month != checkMonth)
                        automaticCode = codeBefore + '_' + 1 + '_' + month + year
                    else
                        automaticCode = codeBefore + '_' + codeBetween + '_' + month + year
                } else
                    automaticCode = codeBefore + '_' + 1 + '_' + month + year
            } else {
                automaticCode = codeBefore + '_' + 1 + '_' + month + year

            }
        }
        return automaticCode
    },
    toDatetimeHour: function (time) {
        if (time) {
            var hour = moment(time).hours();
            return hour + ":00, " + moment(time).format('DD/MM/YYYY');
        } else return null
    },

    toHour: function (time) {
        if (time) {
            return moment(time).hours() + ":00";
        } else return null
    },

    toDatetimeDay: function (time) {
        console.log(time);
        if (time) {
            var day = dayInWeek[moment(time).days()];
            return day + ", " + moment(time).format('DD/MM/YYYY');
        } else return null
    },

    toDay: function (time) {
        if (time) {
            return dayInWeek[moment(time).days()];
        } else return null
    },

    toDatetimeMonth: function (time) {
        if (time) {
            return "Tháng " + moment(time).format('MM/YYYY');
        } else return null
    },

    toMonth: function (time) {
        if (time) {
            return "T" + moment(time).format('MM/YYYY');
        } else return null
    },

    toDatetime: function (time) {
        if (time)
            return moment(time).format('DD/MM/YYYY HH:mm');
        else return null
    },

    callStatus: function (type) {
        var obj = arrCallStatus.find(item => {
            return item.id == type
        });
        if (obj) {
            return obj.name
        } else return ''
    },

    mailStatus: function (type) {
        var obj = arrMailStatus.find(item => {
            return item.id == type
        });
        if (obj) {
            return obj.name
        } else return ''
    },

    taskType: function (type) {
        var obj = arrTastType.find(item => {
            return item.id == type
        });
        if (obj) {
            return obj.name
        } else return ''
    },

    encryptKey(value) {

        var key = "CRM@NAP#JSC$123";
        key = cryptoJS.MD5(key).toString();
        var keyHex = cryptoJS.enc.Hex.parse(key);

        var options = {
            mode: cryptoJS.mode.ECB,
            padding: cryptoJS.pad.Pkcs7
        };

        var textWordArray = cryptoJS.enc.Utf8.parse(value);
        var encrypted = cryptoJS.TripleDES.encrypt(textWordArray, keyHex, options);
        var base64String = encrypted.toString();

        return base64String;
    },

    decryptKey(value) {

        var key = "CRM@NAP#JSC$123";
        key = cryptoJS.MD5(key).toString();
        var keyHex = cryptoJS.enc.Hex.parse(key);

        var options = {
            mode: cryptoJS.mode.ECB,
            padding: cryptoJS.pad.Pkcs7
        };

        var resultArray = cryptoJS.TripleDES.decrypt({
            ciphertext: cryptoJS.enc.Base64.parse(value)
        }, keyHex, options);

        return resultArray.toString(cryptoJS.enc.Utf8);
    },

    handleWhereClause: async function (listObj) {
        let obj = {};
        for (let field of listObj) {
            obj[field.key] = field.value
        }
        return obj
    },

    arrayToObj(array) {
        let obj = {};
        for (let field of array) {
            obj[field.key] = field.value
        }
        return obj;
    },
    convertDataAndRenderWordFile: async function (objKey, readName, writeName) {
        var pathTo = 'C:/images_services/ageless_sendmail/'
        try {
            console.log(pathTo + readName);
            fs.readFile(pathTo + readName, 'binary', function (err, data) {
                if (err) {
                    console.log(err, 1);
                    return false
                }
                var zip = new JSZip(data);
                var doc = new Docxtemplater().loadZip(zip)
                doc.setData(objKey);
                doc.render()
                var buf = doc.getZip().generate({ type: 'nodebuffer' });
                fs.writeFileSync(path.resolve(pathTo, writeName), buf);
                return 'C:/images_services/ageless_sendmail/' + writeName
            });
        } catch (error) {
            console.log(error);
            return ''
        }

    },
}