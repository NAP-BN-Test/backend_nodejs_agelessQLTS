const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblBangLuong', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Date: Sequelize.DATE,
        IDNhanVien: Sequelize.BIGINT,
        WorkingSalary: Sequelize.FLOAT,
        CurrentSalary: Sequelize.FLOAT,
        BHXHSalary: Sequelize.FLOAT,
        Workday: Sequelize.FLOAT,
        WorkVP: Sequelize.FLOAT,
        WorkBusiness: Sequelize.FLOAT,

    });

    return table;
}