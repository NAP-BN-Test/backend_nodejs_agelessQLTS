const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('LaborManagementBook', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        FullName: Sequelize.STRING,
        Sex: Sequelize.STRING,
        YearOfBirth: Sequelize.DATE,
        IDNationality: Sequelize.BIGINT,
        Address: Sequelize.STRING,
        CMND: Sequelize.STRING,
        EmployeeCode: Sequelize.STRING,
        Qualification: Sequelize.STRING,
        SpecializedTraining: Sequelize.STRING,
        Position: Sequelize.STRING,
        OtherCertificate: Sequelize.STRING,
        Phone: Sequelize.STRING,
    });

    return table;
}