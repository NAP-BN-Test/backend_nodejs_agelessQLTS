const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDMUser', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Username: Sequelize.STRING,
        Password: Sequelize.STRING,
        IDNhanvien: Sequelize.BIGINT,
        Active: Sequelize.BOOLEAN,
        IDPermission: Sequelize.BIGINT,

    });

    return table;
}