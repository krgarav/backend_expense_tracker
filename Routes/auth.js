const express = require("express");

const router = express.Router();

const authController = require("../Controllers/auth")

router.post("/signup", authController.authSignupPost);

router.post("/login", authController.authLoginPost);

router.post("/resetlink",authController.updatePassword);

module.exports = router;