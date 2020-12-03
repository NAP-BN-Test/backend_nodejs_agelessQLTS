const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblTaiSanADD', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDNhaCungCap: Sequelize.BIGINT,
        Date: Sequelize.DATE,

    });

    return table;
}