const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Country', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Code: Sequelize.BIGINT,
        Name: Sequelize.STRING,
    });

    return table;
}