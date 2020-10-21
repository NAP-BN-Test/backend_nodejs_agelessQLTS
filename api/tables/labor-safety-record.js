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
    });

    return table;
}