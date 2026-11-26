const {
    generateCsrfToken
} = require("../middleware/csrf.middleware");

function getCsrfToken(req, res) {
    const csrfToken = generateCsrfToken(req, res);

    return res.json({
        csrfToken
    });
}

module.exports = {
    getCsrfToken
};