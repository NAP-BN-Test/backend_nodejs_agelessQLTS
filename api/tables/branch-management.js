const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('BranchManagement', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Brand: Sequelize.STRING,
        ProductionLine: Sequelize.STRING,
        Teams: Sequelize.STRING,
    });

    return table;
}