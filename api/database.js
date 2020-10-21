const Result = require('./constants/result');
const Sequelize = require('sequelize');
const mCustomer = require('./tables/customer-user/customer');
const mUser = require('./tables/customer-user/user');
const Constant = require('./constants/constant');

async function connectDatabase(dbName, user, pass, ip) {
    const db = new Sequelize(dbName, user, pass, {
        host: ip,
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

    db.authenticate()
        .then(() => console.log('Ket noi thanh cong'))
        .catch(err => console.log(err.message));
    return db;
}

module.exports = {
    config: {
        user: 'sa',
        password: '1234',
        server: 'localhost',
        database: 'LABOR_CONTRACT',
        options: {
            encrypt: false,
        },
    },
    configDBCustomer: {
        user: 'sa',
        password: '1234',
        server: 'localhost',
        database: 'CustomerUser',
        options: {
            encrypt: false,
        },
    },
    connectDatabase: async function () {
        const db = new Sequelize('CustomerUser', 'sa', '1234', {
            host: 'localhost',
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

        db.authenticate()
            .then(() => console.log('Ket noi thanh cong'))
            .catch(err => console.log(err.message));
        return db;
    },
    // -----------------------------------------------------------------------------------------------------------------------------------------------------------

    checkServerInvalid: async function (userID) {
        let customer;
        try {
            await connectDatabase('CustomerUser', 'sa', '1234', 'localhost').then(async dbCustomer => {
                let user = await mUser(dbCustomer).findOne({
                    where: {
                        ID: userID
                    }
                })
                customer = await mCustomer(dbCustomer).findOne({
                    where: {
                        ID: user.IDCustomer
                    }
                })
                await dbCustomer.close()
            })
            if (customer) {
                let db = await connectDatabase(customer.DatabaseName, customer.UsernameDB, customer.PassworDB, customer.ServerIP);
                return db;
            }
            else return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------

    updateTable: async function (listObj, table, id) {
        let updateObj = {};
        for (let field of listObj) {
            updateObj[field.key] = field.value
        }
        try {
            await table.update(updateObj, { where: { ID: id } });
            return Promise.resolve(1);
        } catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }

}