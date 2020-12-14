const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblNghiPhep', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDLoaiChamCong: Sequelize.BIGINT,
        DateStart: Sequelize.DATE,
        DateEnd: Sequelize.DATE,
        IDNhanVien: Sequelize.BIGINT,

    });

    return table;
}