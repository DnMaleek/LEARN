const express = require("express");

const { register, login, refresh, logout } = require("../controllers/auth.controller");

const { registerValidator } = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
