const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblVayTamUng', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        AdvanceCode: Sequelize.STRING,
        IDNhanVienCreate: Sequelize.BIGINT,
        IDBoPhanNVCreate: Sequelize.BIGINT,
        IDNhanVienAdvance: Sequelize.BIGINT,
        IDBoPhanNVAdvance: Sequelize.BIGINT,
        Date: Sequelize.DATE,
        Contents: Sequelize.STRING,
        Cost: Sequelize.FLOAT,
        IDTaiKhoanKeToanCost: Sequelize.BIGINT,
        IDNhanVienLD: Sequelize.BIGINT,
        TrangThaiPheDuyetLD: Sequelize.STRING,
        Reason: Sequelize.STRING,
        Refunds: Sequelize.BOOLEAN,
    });

    return table;
}