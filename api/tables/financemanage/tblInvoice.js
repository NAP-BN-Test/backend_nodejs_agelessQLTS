const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblInvoice', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Status: Sequelize.STRING,
        IDSpecializedSoftware: Sequelize.INTEGER,
    });

    return table;
}