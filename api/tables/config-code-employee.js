const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('ConfigCodeEmployee', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        PreviousCharacter: Sequelize.STRING,
        AfterCharacter: Sequelize.STRING,
        BetweenCharacter: Sequelize.STRING,
        AutoIncreasesCode: Sequelize.INTEGER,
    });

    return table;
}