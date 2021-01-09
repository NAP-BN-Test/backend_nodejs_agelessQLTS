const { BOOLEAN } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblChamCong', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDNhanVien: Sequelize.BIGINT,
        Date: Sequelize.DATE,
        Time: Sequelize.FLOAT,
        Status: Sequelize.STRING,
        Reason: Sequelize.STRING,
        Type: BOOLEAN,
    });

    return table;
}