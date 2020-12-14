const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblYeuCauMuaSamDetail', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDYeuCauMuaSam: Sequelize.BIGINT,
        IDDMHangHoa: Sequelize.BIGINT,
        Amount: Sequelize.FLOAT,
    });

    return table;
}