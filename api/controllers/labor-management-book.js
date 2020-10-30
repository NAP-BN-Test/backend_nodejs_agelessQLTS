const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mLaborManagementBook = require('../tables/labor-management-book');
var mLaborManagementJobHR = require('../tables/labor-management-job-hr');
var database = require('../database');
async function deleteRelationshipLaborManagementBook(db, listID) {
    await mLaborManagementJobHR(db).destroy({
        where: {
            IDLaborBook: { [Op.in]: listID }
        }
    })
    await mLaborManagementBook(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}

module.exports = {
    deleteRelationshipLaborManagementBook,
    // add_labor_management_book
    addLaborManagementBook: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(db => {
            if (db) {
                mLaborManagementBook(db).create({
                    FullName: body.fullName ? body.fullName : '',
                    Sex: body.sex ? body.sex : '',
                    YearOfBirth: body.yearOfBirth ? moment(body.yearOfBirth).format('YYYY-MM-DD') : null,
                    Nationality: body.nationality ? body.nationality : '',
                    Address: body.address ? body.address : '',
                    CMND: body.cmnd ? body.cmnd : '',
                    EmployeeCode: body.employeeCode ? body.employeeCode : '',
                    Qualification: body.qualification ? body.qualification : '',
                    SpecializedTraining: body.specializedTraining ? body.specializedTraining : '',
                    Position: body.position ? body.position : '',
                    OtherCertificate: body.otherCertificate ? body.otherCertificate : '',
                    Phone: body.phone ? body.phone : '',
                }).then(data => {
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                })
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // update_labor_management_book
    updateLaborManagementBook: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(db => {
            if (db) {
                try {
                    let update = [];
                    if (body.fullName || body.fullName === '')
                        update.push({ key: 'FullName', value: body.fullName });
                    if (body.sex || body.sex === '')
                        update.push({ key: 'Sex', value: body.sex });
                    if (body.yearOfBirth || body.yearOfBirth === '')
                        update.push({ key: 'YearOfBirth', value: body.yearOfBirth });
                    if (body.nationality || body.nationality === '')
                        update.push({ key: 'Nationality', value: body.nationality });
                    if (body.address || body.address === '')
                        update.push({ key: 'Address', value: body.address });
                    if (body.cmnd || body.cmnd === '')
                        update.push({ key: 'CMND', value: body.cmnd });
                    if (body.employeeCode || body.employeeCode === '')
                        update.push({ key: 'EmployeeCode', value: body.employeeCode });
                    if (body.qualification || body.qualification === '')
                        update.push({ key: 'Qualification', value: body.qualification });
                    if (body.specializedTraining || body.specializedTraining === '')
                        update.push({ key: 'SpecializedTraining', value: body.specializedTraining });
                    if (body.position || body.position === '')
                        update.push({ key: 'Position', value: body.position });
                    if (body.otherCertificate || body.otherCertificate === '')
                        update.push({ key: 'OtherCertificate', value: body.otherCertificate });
                    if (body.phone || body.phone === '')
                        update.push({ key: 'Phone', value: body.phone });
                    database.updateTable(update, mLaborManagementBook(db), body.id).then(response => {
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
    // delete_labor_management_book
    deleteLaborManagementBook: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            let body = req.body;
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshipLaborManagementBook(db, listID);
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
    // get_list_labor_management_book
    getListLaborManagementBook: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    var data = JSON.parse(body.dataSearch)

                    if (data.search) {
                        where = [
                            { FullName: { [Op.like]: '%' + data.search + '%' } },
                            { Address: { [Op.like]: '%' + data.search + '%' } },
                            { CMND: { [Op.like]: '%' + data.search + '%' } },
                            { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
                        ];
                    } else {
                        where = [
                            { FullName: { [Op.ne]: '%%' } },
                        ];
                    }
                    let whereOjb = { [Op.or]: where };
                    if (data.items) {
                        for (var i = 0; i < data.items.length; i++) {
                            let userFind = {};
                            if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                                userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                if (data.items[i].conditionFields['name'] == 'And') {
                                    whereOjb[Op.and] = userFind
                                }
                                if (data.items[i].conditionFields['name'] == 'Or') {
                                    whereOjb[Op.or] = userFind
                                }
                                if (data.items[i].conditionFields['name'] == 'Not') {
                                    whereOjb[Op.not] = userFind
                                }
                            }
                            if (data.items[i].fields['name'] === 'ĐỊA CHỈ') {
                                userFind['Address'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                if (data.items[i].conditionFields['name'] == 'And') {
                                    whereOjb[Op.and] = userFind
                                }
                                if (data.items[i].conditionFields['name'] == 'Or') {
                                    whereOjb[Op.or] = userFind
                                }
                                if (data.items[i].conditionFields['name'] == 'Not') {
                                    whereOjb[Op.not] = userFind
                                }
                            }
                            if (data.items[i].fields['name'] === 'CMND(HỘ CHIẾU)') {
                                userFind['CMND'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                if (data.items[i].conditionFields['name'] == 'And') {
                                    whereOjb[Op.and] = userFind
                                }
                                if (data.items[i].conditionFields['name'] == 'Or') {
                                    whereOjb[Op.or] = userFind
                                }
                                if (data.items[i].conditionFields['name'] == 'Not') {
                                    whereOjb[Op.not] = userFind
                                }
                            }
                            if (data.items[i].fields['name'] === 'MÃ NHÂN VIÊN') {
                                userFind['EmployeeCode'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                if (data.items[i].conditionFields['name'] == 'And') {
                                    whereOjb[Op.and] = userFind
                                }
                                if (data.items[i].conditionFields['name'] == 'Or') {
                                    whereOjb[Op.or] = userFind
                                }
                                if (data.items[i].conditionFields['name'] == 'Not') {
                                    whereOjb[Op.not] = userFind
                                }
                            }
                            if (data.items[i].fields['name'] === 'CHỨC VỤ') {
                                userFind['Position'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                if (data.items[i].conditionFields['name'] == 'And') {
                                    whereOjb[Op.and] = userFind
                                }
                                if (data.items[i].conditionFields['name'] == 'Or') {
                                    whereOjb[Op.or] = userFind
                                }
                                if (data.items[i].conditionFields['name'] == 'Not') {
                                    whereOjb[Op.not] = userFind
                                }
                            }
                        }
                    }
                    var count = await mLaborManagementBook(db).count({ where: whereOjb })
                    mLaborManagementBook(db).findAll({
                        where: whereOjb,
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                    }).then(data => {
                        var array = [];
                        var stt = 1;
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                fullName: element.FullName ? element.FullName : '',
                                sex: element.Sex ? element.Sex : '',
                                yearOfBirth: element.YearOfBirth ? element.YearOfBirth : null,
                                nationality: element.Nationality ? element.Nationality : '',
                                address: element.Address ? element.Address : '',
                                cmnd: element.CMND ? element.CMND : '',
                                employeeCode: element.EmployeeCode ? element.EmployeeCode : '',
                                qualification: element.Qualification ? element.Qualification : '',
                                specializedTraining: element.SpecializedTraining ? element.SpecializedTraining : '',
                                position: element.Position ? element.Position : '',
                                otherCertificate: element.OtherCertificate ? element.OtherCertificate : '',
                                phone: element.Phone ? element.Phone : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var result = {
                            array: array,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                            count: count
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
    }
}