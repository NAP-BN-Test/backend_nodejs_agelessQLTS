const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblCoQuanNhaNuoc', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDSpecializedSoftware: Sequelize.BIGINT,
        Status: Sequelize.STRING,
    });

    return table;
}