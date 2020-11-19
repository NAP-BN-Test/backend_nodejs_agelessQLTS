const Sequelize = require('sequelize');
const { SELECT } = require('sequelize/types/lib/query-types');

module.exports = function (db) {
    var table = db.define('tblDMHangHoa', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Name: Sequelize.STRING,
        Code: Sequelize.STRING,
        IDDMLoaiTaiSan: Sequelize.BIGINT,
    });

    return table;
}