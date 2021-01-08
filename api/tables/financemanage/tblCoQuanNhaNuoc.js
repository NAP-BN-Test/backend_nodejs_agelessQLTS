const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblCoQuanNhaNuoc', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDSoTienDauKy: Sequelize.BIGINT,
        SoChungTu: Sequelize.STRING,
        NgayChungTu: Sequelize.DATE,
        Payment: Sequelize.FLOAT,
        PaymentType: Sequelize.BOOLEAN,
        CostBill: Sequelize.FLOAT,
        CostFunds: Sequelize.FLOAT,

    });

    return table;
}