const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblReceiptsPayment', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Type: Sequelize.STRING,
        CodeNumber: Sequelize.STRING,
        IDCurrency: Sequelize.BIGINT,
        Date: Sequelize.DATE,
        IDCustomer: Sequelize.INTEGER,
        Address: Sequelize.STRING,
        Amount: Sequelize.FLOAT,
        AmountWords: Sequelize.STRING,
        Reson: Sequelize.STRING,
        IDManager: Sequelize.INTEGER,
        IDAccountant: Sequelize.INTEGER,
        IDTreasurer: Sequelize.INTEGER,
        IDEstablishment: Sequelize.INTEGER,
        IDSubmitter: Sequelize.INTEGER,
        VoucherNumber: Sequelize.STRING,
        VoucherDate: Sequelize.DATE,
    });

    return table;
}