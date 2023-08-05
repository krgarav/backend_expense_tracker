const express = require("express");

const router = express.Router();

const passwordController = require("../Controllers/password")

router.post("/forgotpassword", passwordController.sendMail);

router.get("/resetpassword/:userId",passwordController.resetMail);

module.exports = router;