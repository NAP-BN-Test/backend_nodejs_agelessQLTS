const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDMTaiKhoanKeToan', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        AccountingCode: Sequelize.STRING,
        AccountingName: Sequelize.STRING,
        IDLoaiTaiKhoanKeToan: Sequelize.BIGINT,
        Levels: Sequelize.INTEGER,
        IDLevelAbove: Sequelize.BIGINT,

    });

    return table;
}