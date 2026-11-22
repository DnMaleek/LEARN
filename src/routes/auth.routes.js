const express = require("express");

const router = express.Router();

const {register, login} = require ('../controllers/auth.controllers')
const { registerValidator} = require ('../validators/auth.validator')

router.post("/register",registerValidator, register)

router.post("/login", login);

module.exports = router;