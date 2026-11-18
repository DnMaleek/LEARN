const jwt = require ('jsonwebtoken')

function generateAcessToken(user) {
    return jwt.sign(
        {
            id:user.id,
            role:user.role
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn:'15m'
        }
    )
}

function generateRefreshToken(user) {
    return jwt.sign(
        {
            id:user.id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn:'7d'
        }
    )
}


function verifyAccessToken(token) {
    return jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
    )
}

function verifyRefreshToken(token) {
    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
    )
}

module.exports = {
    generateAcessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}