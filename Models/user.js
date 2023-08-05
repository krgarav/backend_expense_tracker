const Sequelize = require("sequelize");
const sequelize = require("../Util/database");

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ispremiumuser: {
        type: Sequelize.BOOLEAN,
    },
    totalExpense: Sequelize.INTEGER,

});

module.exports = User;