
const Users = require("../Models/user");
const jwt = require("jsonwebtoken");
const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorisation");
        const userId = jwt.verify(token, "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
        const user = await Users.findByPk(userId.userid);
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
    }


}

module.exports = authenticate;