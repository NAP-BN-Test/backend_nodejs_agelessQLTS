const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Customer', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        ExpirationDate: Sequelize.DATE,
        KeyLicense: Sequelize.STRING,
        ActiveStatus: Sequelize.BOOLEAN,
        DatabaseName: Sequelize.STRING,
        CreatedTime: Sequelize.DATE,
        UpdatedTime: Sequelize.DATE,
        NumberAllowedUser: Sequelize.INTEGER,
        UsernameDB: Sequelize.STRING,
        PassworDB: Sequelize.STRING,
        CustomerName: Sequelize.STRING,
        ServerIP: Sequelize.STRING,
    });

    return table;
}