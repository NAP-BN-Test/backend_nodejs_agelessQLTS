const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblYeuCauMuaSam', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDNhanVien: Sequelize.BIGINT,
        IDPhongBan: Sequelize.BIGINT,
        RequireDate: Sequelize.DATE,
        IDDMHangHoa: Sequelize.STRING,
        Amount: Sequelize.FLOAT,
        Specifications: Sequelize.STRING,
        Reason: Sequelize.STRING,
        Status: Sequelize.STRING,
        IDPheDuyet1: Sequelize.BIGINT,
        IDPheDuyet2: Sequelize.BIGINT,
    });

    return table;
}