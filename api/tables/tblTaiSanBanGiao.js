const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblTaiSanBanGiao', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDNhanVienBanGiao: Sequelize.BIGINT,
        IDNhanVienSoHuu: Sequelize.BIGINT,
        IDBoPhanSoHuu: Sequelize.BIGINT,
        Date: Sequelize.DATE,
    });

    return table;
}