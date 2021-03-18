const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblNghiPhep', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDLoaiChamCong: Sequelize.BIGINT,
        DateStart: Sequelize.NOW,
        DateEnd: Sequelize.NOW,
        IDNhanVien: Sequelize.BIGINT,
        NumberLeave: Sequelize.STRING,
        Type: Sequelize.STRING,
        Date: Sequelize.DATE,
        Remaining: Sequelize.FLOAT,
        IDHeadDepartment: Sequelize.BIGINT,
        IDAdministrationHR: Sequelize.BIGINT,
        IDHeads: Sequelize.BIGINT,
        Status: Sequelize.STRING,
        Reason: Sequelize.STRING,
    });

    return table;
}