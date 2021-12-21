const Sequelize = require('sequelize');

module.exports = function(db) {
    var table = db.define('tblInvoice', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Status: Sequelize.STRING,
        IDSpecializedSoftware: Sequelize.INTEGER,
        Request: Sequelize.STRING,
        Payments: Sequelize.STRING,
        PayDate: Sequelize.DATE,
        InitialAmount: Sequelize.FLOAT,
        PaidAmount: Sequelize.FLOAT,
        UnpaidAmount: Sequelize.FLOAT,
        IsInvoice: Sequelize.BOOLEAN,
    });
    return table;
}