const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblCustomer', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDSpecializedSoftware: Sequelize.BIGINT,
        AmountUnspecified: Sequelize.FLOAT,
        AmountSpent: Sequelize.FLOAT,
        AmountReceivable: Sequelize.FLOAT,

    });

    return table;
}