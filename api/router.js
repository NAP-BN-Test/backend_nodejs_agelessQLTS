module.exports = function (app) {
    var checkToken = require('./constants/token');
    var tblDMUser = require('./controllers/ctl-tblDMUser');

    //---------------------------------------------------------------- Menu Quản lý danh mục--------------------------------------------------------------------------------------
    // Quản lý account
    app.route('/qlnb/add_tbl_dmuser').post(tblDMUser.addtblDMUser);
    app.route('/qlnb/update_tbl_dmuser').post(tblDMUser.updatetblDMUser);
    app.route('/qlnb/delete_tbl_dmuser').post(tblDMUser.deletetblDMUser);
    app.route('/qlnb/get_list_tbl_dmuser').post(tblDMUser.getListtblDMUser);
    app.route('/qlnb/get_list_name_tbl_dmuser').post(tblDMUser.getListNametblDMUser);
}