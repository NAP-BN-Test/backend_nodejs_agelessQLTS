const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblInvoice', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        InvoiceCode: Sequelize.STRING,
        InvoiceNumber: Sequelize.STRING,
        IDKhachHang: Sequelize.BIGINT,
        IDNhanVienCreate: Sequelize.BIGINT,
        InvoiceDate: Sequelize.DATE,
        InvoiceContent: Sequelize.STRING,
        InvoiceCost: Sequelize.FLOAT,
        IDTaiKhoanKeToanCost: Sequelize.BIGINT,
        IDNhanVienAccounting: Sequelize.BIGINT,
        IDBoPhan: Sequelize.BIGINT,
        IDDieuKhoanThanhToan: Sequelize.BIGINT,
        NgayHachToan: Sequelize.DATE,
        NgayChungTu: Sequelize.DATE,
        IDKhoanTienKhongXacDinh: Sequelize.BIGINT,
        TypeCost: Sequelize.STRING,
        ExchangeRate: Sequelize.DATE,
        SoChungTu: Sequelize.STRING,
        Payment: Sequelize.FLOAT,
        IDTaiKhoanKeToanPayment: Sequelize.BIGINT,
        Debt: Sequelize.FLOAT,
        Status: Sequelize.STRING,

    });

    return table;
}