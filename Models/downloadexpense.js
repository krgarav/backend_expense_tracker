const Sequelize = require("sequelize");
const sequelize = require("../Util/database");

const Expensedownload = sequelize.define('expensesdownload', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }

});

module.exports = Expensedownload;