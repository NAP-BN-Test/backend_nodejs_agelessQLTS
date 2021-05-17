const Sequelize = require('sequelize');
const Op = require('sequelize').Op;
const Constant = require('../constants/constant');

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

        if (body.type == 'receipts') {
            query = 'SELECT * FROM tblJOBPhieuThuChi WHERE EnumLoaiPhieu = 0'
        } else if (body.type == 'payment') {
            query = 'SELECT * FROM tblJOBPhieuThuChi WHERE EnumLoaiPhieu = 1'
        } else if (body.type == 'loan') {
            query = 'SELECT * FROM tblJOBPhieuThuChi WHERE enumLoaiPhieuTamUng = 2'
        } else {
            query = 'SELECT * FROM tblJOBPhieuThuChi WHERE enumLoaiPhieuTamUng = 2'

        }
        let locyData = await db.query(query)
            // console.log(locyData[0][0]);
        var result = {
            array: locyData[0],
            status: Constant.STATUS.SUCCESS,
            message: Constant.MESSAGE.ACTION_SUCCESS,
        }
        res.json(result);
    }
}