const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('LaborManagementJobHR', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDJobAndHR: Sequelize.BIGINT,
        IDLaborBook: Sequelize.BIGINT,
    });

    return table;
}