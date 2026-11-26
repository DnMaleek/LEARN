const express = require("express");

const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/auth.controller");

const { registerValidator , loginValidator} = require("../validators/auth.validator");
const { authLimiter } = require("../middleware/rate-limit.middleware");
const { getCsrfToken } = require("../controllers/csrf.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { doubleCsrfProtection } = require("../middleware/csrf.middleware");

const router = express.Router();

router.post("/register", authLimiter, doubleCsrfProtection,registerValidator, register);
router.post("/login",loginValidator, authLimiter, doubleCsrfProtection, login);
router.post(
    "/refresh",
    doubleCsrfProtection,
    refresh
);router.post("/logout", authenticateToken, doubleCsrfProtection, logout);
router.get("/csrf-token", getCsrfToken);

module.exports = router;
