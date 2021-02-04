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
        NumberLeave: Sequelize.STRING,
        Type: Sequelize.STRING,
        Date: Sequelize.DATE,
        Remaining: Sequelize.INTEGER,
        IDHeadDepartment: Sequelize.BIGINT,
        IDAdministrationHR: Sequelize.BIGINT,
        IDHeads: Sequelize.BIGINT,
        Status: Sequelize.STRING,
    });

    return table;
}