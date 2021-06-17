const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDeNghiThanhToan', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDNhanVien: Sequelize.BIGINT,
        Contents: Sequelize.BIGINT,
        Cost: Sequelize.FLOAT,
        CostText: Sequelize.STRING,
        IDNhanVienKTPD: Sequelize.BIGINT,
        TrangThaiPheDuyetKT: Sequelize.BIGINT,
        IDNhanVienLDPD: Sequelize.BIGINT,
        TrangThaiPheDuyetLD: Sequelize.BIGINT,
        Description: Sequelize.STRING,
        ReasonRejectKTPD: Sequelize.STRING,
        ReasonRejectLDPD: Sequelize.STRING,
        PaymentOrderCode: Sequelize.STRING,
        IDReceiptsPayment: Sequelize.BIGINT,
        IDSupplier: Sequelize.BIGINT,
        Link: Sequelize.STRING,

    });

    return table;
}