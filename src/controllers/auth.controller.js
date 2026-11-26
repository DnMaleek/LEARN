const {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser
} = require("../services/auth.service");
const { validationResult } = require("express-validator");
const { setAuthCookies } = require("../utils/cookies");

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

const login = async (req, res) => {
  try {
    const user = await loginUser(req.body);

    setAuthCookies(res, user.accessToken, user.refreshToken);

    res.json({
      message: "User found successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Internal server error",
    });
  }
};

async function refresh(req, res) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    const tokens = await refreshUserSession(refreshToken);

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return res.json({
      message: "Session refreshed successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Internal server error",
    });
  }
}

async function logout(req, res) {
    try {
        const refreshToken = req.cookies?.refreshToken;

        await logoutUser(refreshToken);

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/api/auth"
        });

        return res.json({
            message: "Logout successful"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
  register,
  login,
  refresh,
  logout
};
