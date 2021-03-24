const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblAccountingBooks', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        NumberReceipts: Sequelize.FLOAT,
        CreateDate: Sequelize.DATE,
        Submitter: Sequelize.STRING,
        Address: Sequelize.STRING,
        Reason: Sequelize.STRING,
        Amount: Sequelize.FLOAT

    });

    return table;
}