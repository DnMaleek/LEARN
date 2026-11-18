require("dotenv").config();

const requiredVariables = [
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET"
];

for (const variable of requiredVariables) {
    if (!process.env[variable]) {
        throw new Error(
            `Missing environment variable: ${variable}`
        );
    }
}

module.exports = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development"
};