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
        Cost: Sequelize.BIGINT,
        IDNhanVienKTPD: Sequelize.BIGINT,
        TrangThaiPheDuyetKT: Sequelize.BIGINT,
        IDNhanVienLDPD: Sequelize.BIGINT,
        TrangThaiPheDuyetLD: Sequelize.BIGINT,

    });

    return table;
}