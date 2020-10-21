const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('FactoryManagement', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Building: Sequelize.STRING,
        OutdoorArea: Sequelize.STRING,
    });

    return table;
}