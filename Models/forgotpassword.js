const Sequelize = require("sequelize");
const sequelize = require("../Util/database");
const { v4: uuidv4 } = require('uuid');


const Forgotpassword = sequelize.define('forgotpasswordrequests', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: uuidv4,
    },

    userId: Sequelize.INTEGER,
    isActive: Sequelize.BOOLEAN
});

module.exports = Forgotpassword;