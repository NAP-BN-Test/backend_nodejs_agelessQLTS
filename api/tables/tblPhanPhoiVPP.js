const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblPhanPhoiVPP', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDVanPhongPham: Sequelize.BIGINT,
        IDNhanVien: Sequelize.BIGINT,
        IDBoPhan: Sequelize.BIGINT,
        Date: Sequelize.DATE,
        Amount: Sequelize.FLOAT,

    });

    return table;
}