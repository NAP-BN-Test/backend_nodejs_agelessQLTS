const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('ManagementJobAndHR', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDAdminfuc: Sequelize.BIGINT,
        Curator: Sequelize.STRING,
        PlaceBuildingOutSide: Sequelize.STRING,
        IDFactoryManagement: Sequelize.BIGINT,
        IDLaborManagement: Sequelize.BIGINT,
    });

    return table;
}