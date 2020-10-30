const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mBusinessInformation = require('../tables/business-information');
var mManufacturingIndustry = require('../tables/manufacturing-industry');
var database = require('../database');
async function deleteRelationshipBusinessInformation(db, listID) {
    await mBusinessInformation(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}

module.exports = {
    deleteRelationshipBusinessInformation,
    // add_busines_information
    addBusinessInformation: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(db => {
            if (db) {
                mBusinessInformation(db).create({
                    NameCompany: body.nameCompany ? body.nameCompany : '',
                    IDManufacturingIndustry: body.idManufacturingIndustry ? body.idManufacturingIndustry : '',
                    FoundedYear: body.foundedYear ? moment(body.foundedYear).format('YYYY-MM-DD') : null,
                    TotalEmployees: body.totalEmployees ? body.totalEmployees : null,
                    ManagingUnit: body.managingUnit ? body.managingUnit : '',
                    NumberDirectEmployees: body.numberDirectEmployees ? body.numberDirectEmployees : '',
                    Address: body.address ? body.address : '',
                    NumberFemaleEmployees: body.NumberFemaleEmployees ? body.NumberFemaleEmployees : null,
                    Provincial: body.provincial ? body.provincial : '',
                    District: body.district ? body.district : '',
                    President: body.president ? body.president : '',
                    Phone: body.phone ? body.phone : '',
                    Fax: body.fax ? body.fax : '',
                    Email: body.email ? body.email : '',
                    Website: body.website ? body.website : '',
                    VicePresident: body.vicePresident ? body.vicePresident : '',
                    PhoneOfCurator: body.phoneOfCurator ? body.phoneOfCurator : '',
                    DepartmentHead: body.departmentHead ? body.departmentHead : '',
                    ServiceAndProduct: body.serviceAndProduct ? body.serviceAndProduct : '',
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
    // update_busines_information
    updateBusinessInformation: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(db => {
            if (db) {
                try {
                    let update = [];
                    if (body.nameCompany || body.nameCompany === '')
                        update.push({ key: 'NameCompany', value: body.nameCompany });
                    if (body.managingUnit || body.managingUnit === '')
                        update.push({ key: 'ManagingUnit', value: body.managingUnit });
                    if (body.foundedYear || body.foundedYear === '') {
                        if (body.foundedYear === '')
                            update.push({ key: 'FoundedYear', value: null });
                        else
                            update.push({ key: 'FoundedYear', value: moment(body.foundedYear).format('YYYY-MM-DD') });
                    }
                    if (body.idManufacturingIndustry || body.idManufacturingIndustry === '') {
                        if (body.idManufacturingIndustry === '')
                            update.push({ key: 'IDManufacturingIndustry', value: null });
                        else
                            update.push({ key: 'IDManufacturingIndustry', value: body.idManufacturingIndustry });
                    }
                    if (body.totalEmployees || body.totalEmployees === '') {
                        if (body.totalEmployees === '')
                            update.push({ key: 'TotalEmployees', value: null });
                        else
                            update.push({ key: 'TotalEmployees', value: body.totalEmployees });
                    }
                    if (body.numberDirectEmployees || body.numberDirectEmployees === '') {
                        if (body.numberDirectEmployees === '')
                            update.push({ key: 'NumberDirectEmployees', value: null });
                        else
                            update.push({ key: 'NumberDirectEmployees', value: body.numberDirectEmployees });
                    }
                    if (body.numberFemaleEmployees || body.numberFemaleEmployees === '') {
                        if (body.numberFemaleEmployees === '')
                            update.push({ key: 'NumberFemaleEmployees', value: null });
                        else
                            update.push({ key: 'NumberFemaleEmployees', value: body.numberFemaleEmployees });
                    }
                    if (body.address || body.address === '')
                        update.push({ key: 'Address', value: body.address });
                    if (body.provincial || body.provincial === '')
                        update.push({ key: 'Provincial', value: body.provincial });
                    if (body.district || body.district === '')
                        update.push({ key: 'District', value: body.district });
                    if (body.president || body.president === '')
                        update.push({ key: 'President', value: body.president });
                    if (body.phone || body.phone === '')
                        update.push({ key: 'Phone', value: body.phone });
                    if (body.fax || body.fax === '')
                        update.push({ key: 'Fax', value: body.fax });
                    if (body.email || body.email === '')
                        update.push({ key: 'Email', value: body.email });
                    if (body.website || body.website === '')
                        update.push({ key: 'Website', value: body.website });
                    if (body.vicePresident || body.vicePresident === '')
                        update.push({ key: 'VicePresident', value: body.vicePresident });
                    if (body.phoneOfCurator || body.phoneOfCurator === '')
                        update.push({ key: 'PhoneOfCurator', value: body.phoneOfCurator });
                    if (body.departmentHead || body.departmentHead === '')
                        update.push({ key: 'DepartmentHead', value: body.departmentHead });
                    if (body.serviceAndProduct || body.serviceAndProduct === '')
                        update.push({ key: 'ServiceAndProduct', value: body.serviceAndProduct });
                    database.updateTable(update, mBusinessInformation(db), body.id).then(response => {
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
    // delete_busines_information
    deleteBusinessInformation: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            let body = req.body;
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshipBusinessInformation(db, listID);
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
    // get_list_busines_information
    getListBusinessInformation: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.userID).then(async db => {
            if (db) {
                try {
                    // Một nhiều
                    let businessInformation = mBusinessInformation(db); // bắt buộc
                    businessInformation.belongsTo(mManufacturingIndustry(db), { foreignKey: 'IDManufacturingIndustry', sourceKey: 'IDManufacturingIndustry' })
                    businessInformation.findAll({
                        include: [
                            {
                                model: mManufacturingIndustry(db),
                                required: false,
                            }
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                nameCompany: element.NameCompany ? element.NameCompany : '',
                                idManufacturingIndustry: element.ManufacturingIndustry ? element.ManufacturingIndustry.ID : '',
                                nameManufacturingIndustry: element.ManufacturingIndustry ? element.ManufacturingIndustry.Name : '',
                                foundedYear: element.FoundedYear ? moment(element.FoundedYear).format('YYYY-MM-DD') : null,
                                totalEmployees: element.TotalEmployees ? element.TotalEmployees : null,
                                managingUnit: element.ManagingUnit ? element.ManagingUnit : '',
                                numberDirectEmployees: element.NumberDirectEmployees ? element.NumberDirectEmployees : '',
                                address: element.Address ? element.Address : '',
                                numberFemaleEmployees: element.NumberFemaleEmployees ? element.NumberFemaleEmployees : null,
                                provincial: element.Provincial ? element.Provincial : '',
                                district: element.District ? element.District : '',
                                president: element.President ? element.President : '',
                                phone: element.Phone ? element.Phone : '',
                                fax: element.Fax ? element.Fax : '',
                                email: element.Email ? element.Email : '',
                                website: element.Website ? element.Website : '',
                                vicePresident: element.VicePresident ? element.VicePresident : '',
                                phoneOfCurator: element.PhoneOfCurator ? element.PhoneOfCurator : '',
                                departmentHead: element.DepartmentHead ? element.DepartmentHead : '',
                                serviceAndProduct: element.ServiceAndProduct ? element.ServiceAndProduct : '',
                            }
                            array.push(obj);
                        });
                        var result = {
                            array: array,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
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