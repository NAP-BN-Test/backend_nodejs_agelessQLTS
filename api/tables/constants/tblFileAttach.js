const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblFileAttach', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Name: Sequelize.STRING,
        Link: Sequelize.STRING,
        IDTaiSanADD: Sequelize.BIGINT,
        IDYeuCauMuaSam: Sequelize.BIGINT,
        IDDeNghiThanhToan: Sequelize.BIGINT,
        IDVanPhongPham: Sequelize.BIGINT,
        IDCoQuanNhaNuoc: Sequelize.BIGINT,
        IDInvoice: Sequelize.BIGINT,
        IDCredit: Sequelize.BIGINT,
        IDTemplate: Sequelize.BIGINT,
    });

    return table;
}