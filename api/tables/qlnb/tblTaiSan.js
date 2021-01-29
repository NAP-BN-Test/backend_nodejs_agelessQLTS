const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblTaiSan', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDDMHangHoa: Sequelize.BIGINT,
        Unit: Sequelize.STRING,
        IDTaiSanADD: Sequelize.BIGINT,
        TSNBCode: Sequelize.BIGINT,
        OriginalPrice: Sequelize.FLOAT,
        DepreciationPrice: Sequelize.FLOAT,
        DepreciationDate: Sequelize.DATE,
        Condition: Sequelize.STRING,
        GuaranteeMonth: Sequelize.FLOAT,
        IDTaiSanDiKem: Sequelize.BIGINT,
        NoMonthUse: Sequelize.FLOAT,
        SerialNumber: Sequelize.STRING,
        Describe: Sequelize.STRING,
        DateDiKem: Sequelize.DATE,
        Status: Sequelize.STRING,
        TSNBNumber: Sequelize.INTEGER,
        StatusUsed: Sequelize.STRING,
    });

    return table;
}