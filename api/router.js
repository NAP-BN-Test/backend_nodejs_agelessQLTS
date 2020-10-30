module.exports = function (app) {
    var checkToken = require('./constants/token')
    // menu sổ quản lý lao động 
    var laborManagementBook = require('./controllers/labor-management-book')
    app.route('/lc/add_labor_management_book').post(checkToken.checkToken, laborManagementBook.addLaborManagementBook);
    app.route('/lc/update_labor_management_book').post(checkToken.checkToken, laborManagementBook.updateLaborManagementBook);
    app.route('/lc/delete_labor_management_book').post(checkToken.checkToken, laborManagementBook.deleteLaborManagementBook);
    app.route('/lc/get_list_labor_management_book').post(checkToken.checkToken, laborManagementBook.getListLaborManagementBook);

    // --------------------------------------------------------------------------------------------
    var login = require('./controllers/login');
    app.route('/lc/login').post(login.login);
    // -------------------------------------------------------------------------------------------
    // Quản lý công việc và nhân sự
    var managementJobHR = require('./controllers/management-job-hr');
    var factoryManagement = require('./controllers/factory-management');
    var addministrativeFunction = require('./controllers/administrative-function');

    app.route('/lc/add_management_job_hr').post(checkToken.checkToken, managementJobHR.addManagementJobHR);
    app.route('/lc/update_management_job_hr').post(checkToken.checkToken, managementJobHR.updateLaborManagementJobHR);
    app.route('/lc/delete_management_job_hr').post(checkToken.checkToken, managementJobHR.deleteLaborManagementJobHR);
    app.route('/lc/get_list_management_job_hr').post(managementJobHR.getListLaborManagementJobHR);
    app.route('/lc/get_list_name_factory_management').post(checkToken.checkToken, factoryManagement.getListNameFactoryManagement);
    app.route('/lc/get_list_name_addministrative_function').post(checkToken.checkToken, addministrativeFunction.getListNameAdministrativeFunction);

    // --------------------------------------------------------------------------------------------
    // Hồ sơ an toàn lao động
    var laborSafetyRecord = require('./controllers/labor-safety-record');

    app.route('/lc/add_labor_safety_record').post(checkToken.checkToken, laborSafetyRecord.addLaborSafetyRecord);
    app.route('/lc/update_labor_safety_record').post(checkToken.checkToken, laborSafetyRecord.updateLaborSafetyRecord);
    app.route('/lc/delete_labor_safety_record').post(checkToken.checkToken, laborSafetyRecord.deleteLaborSafetyRecord);
    app.route('/lc/get_list_labor_safety_record').post(checkToken.checkToken, laborSafetyRecord.getListLaborSafetyRecord);

    // --------------------------------------------------------------------------------------------
    // Hồ sơ an toàn lao động
    var businesInformation = require('./controllers/business-infomation');

    app.route('/lc/add_busines_information').post(checkToken.checkToken, businesInformation.addBusinessInformation);
    app.route('/lc/update_busines_information').post(checkToken.checkToken, businesInformation.updateBusinessInformation);
    app.route('/lc/delete_busines_information').post(checkToken.checkToken, businesInformation.deleteBusinessInformation);
    app.route('/lc/get_list_busines_information').post(businesInformation.getListBusinessInformation);

    var manufacturingIndustry = require('./controllers/manufacturing-industry');

    app.route('/lc/add_manufacturing_industry').post(checkToken.checkToken, manufacturingIndustry.addManufacuringIndustry);
    app.route('/lc/update_manufacturing_industry').post(checkToken.checkToken, manufacturingIndustry.updateManufacuringIndustry);
    app.route('/lc/delete_manufacturing_industry').post(checkToken.checkToken, manufacturingIndustry.deleteManufacuringIndustry);
    app.route('/lc/get_list_manufacturing_industry').post(manufacturingIndustry.getListManufacuringIndustry);

}