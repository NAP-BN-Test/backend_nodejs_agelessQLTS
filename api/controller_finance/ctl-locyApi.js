const Sequelize = require('sequelize');
const Op = require('sequelize').Op;
async function connectDatabase() {
    const db = new Sequelize('LOCYF', 'locyf', '123456a$', {
        host: 'db.namanphu.vn',
        dialect: 'mssql',
        operatorsAliases: '0',
        // Bắt buộc phải có
        dialectOptions: {
            options: { encrypt: false }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: false,
            freezeTableName: true
        }
    });
    return db
}
module.exports = {
    apiGetTicketTypes: async(req, res) => {
        let body = req.body;
        let db = await connectDatabase()
        let query = `SELECT * FROM tblJOBPhieuThuChi`
        let locyData = await db.query(query)
        console.log(locyData[0][0]);
    }
}