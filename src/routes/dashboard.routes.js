const express = require("express");

const { authenticateToken } = require("../middleware/auth.middleware");

const { authorizeRoles } = require("../middleware/role.middleware");

const { getDashboard } = require("../controllers/dashboard.controller");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  authorizeRoles("user", "admin"),
  getDashboard,
);

module.exports = router;
