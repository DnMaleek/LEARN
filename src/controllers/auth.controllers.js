const { registerUser, loginUser } = require("../services/auth.service");
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

const login =async (req, res) => {
  try {
        const user = await loginUser(req.body);

        res.json({
            message: "User found successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.statusCode
                ? error.message
                : "Internal server error"
        });
    }
};

module.exports = {
  register,
  login,
};
