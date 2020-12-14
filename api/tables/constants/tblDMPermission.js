const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDMPermission', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        PermissionName: Sequelize.STRING,

    });

    return table;
}