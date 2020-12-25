const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDaoTaoSau', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDNhanVien: Sequelize.BIGINT,
        DateStart: Sequelize.DATE,
        DateEnd: Sequelize.DATE,
        TrainningCourse: Sequelize.STRING,
        CompanyCost: Sequelize.FLOAT,
        Result: Sequelize.STRING,
        StaffCost: Sequelize.FLOAT,
        Majors: Sequelize.STRING,
    });

    return table;
}