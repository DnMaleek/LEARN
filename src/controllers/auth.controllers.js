const { registerUser } = require("../services/auth.service");
const { validationResult } = require("express-validator");

const register = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const result = await registerUser(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Internal server error",
    });
  }
};

const login = (req, res) => {
  res.json({
    message: "Login controller reached",
  });
};

module.exports = {
  register,
  login,
};
