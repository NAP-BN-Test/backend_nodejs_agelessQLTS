const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('LaborSafetyRecord', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        ProfileName: Sequelize.STRING,
        Description: Sequelize.STRING,
        Code: Sequelize.STRING,
        NumberEmployees: Sequelize.INTEGER,
        IDProFManufacturing: Sequelize.BIGINT,
        NumberFullTimeStaff: Sequelize.INTEGER,
    });

    return table;
}