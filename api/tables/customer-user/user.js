const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('User', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Username: Sequelize.STRING,
        Password: Sequelize.STRING,
        IDCustomer: Sequelize.BIGINT,
        FullName: Sequelize.STRING,
    });

    return table;
}