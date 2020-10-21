module.exports = function (app) {
    var checkToken = require('./constants/token')
    var laborManagementBook = require('./controllers/labor-management-book')
    app.route('/lc/add_labor_management_book').post(laborManagementBook.addLaborManagementBook);

    // --------------------------------------------------------------------------------------------
    var login = require('./controllers/login');
    app.route('/lc/login').post(login.login);

}