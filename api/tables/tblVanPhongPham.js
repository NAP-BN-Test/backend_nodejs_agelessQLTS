const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblVanPhongPham', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        VPPCode: Sequelize.STRING,
        VPPName: Sequelize.STRING,
        Unit: Sequelize.FLOAT,
        Specifications: Sequelize.STRING,
        RemainingAmount: Sequelize.FLOAT,

    });

    return table;
}