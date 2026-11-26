const { verifyAccessToken } = require("../utils/jwt");

function authenticateToken(req, res, next) {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    try {
        const decoded = verifyAccessToken(token);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token"
        });
    }
}

module.exports = { authenticateToken };