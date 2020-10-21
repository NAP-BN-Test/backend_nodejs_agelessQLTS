const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('BusinessInformation', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        NameCompany: Sequelize.STRING,
        IDManufacturingIndustry: Sequelize.BIGINT,
        FoundedYear: Sequelize.DATE,
        TotalEmployees: Sequelize.INTEGER,
        ManagingUnit: Sequelize.INTEGER,
        NumberDirectEmployees: Sequelize.INTEGER,
        Address: Sequelize.STRING,
        NumberFemaleEmployees: Sequelize.INTEGER,
        Provincial: Sequelize.STRING,
        District: Sequelize.STRING,
        President: Sequelize.STRING,
        Phone: Sequelize.STRING,
        Fax: Sequelize.STRING,
        Email: Sequelize.STRING,
        Website: Sequelize.STRING,
        VicePresident: Sequelize.STRING,
        PhoneOfCurator: Sequelize.STRING,
        DepartmentHead: Sequelize.STRING,
        ServiceAndProduct: Sequelize.STRING,
    });

    return table;
}