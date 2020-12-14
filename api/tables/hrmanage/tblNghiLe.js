const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblNghiLe', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDLoaiChamCong: Sequelize.BIGINT,
        DateHoliday: Sequelize.DATE,
        NameHoliday: Sequelize.STRING,

    });

    return table;
}