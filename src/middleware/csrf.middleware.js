const { doubleCsrf } = require("csrf-csrf");

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,

  cookieName: "csrfToken",

  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },

  size: 64,

  getCsrfTokenFromRequest: (req) => {
    return req.headers["x-csrf-token"];
  },

  getSessionIdentifier: (req) => req.ip,
});

module.exports = {
  generateCsrfToken,
  doubleCsrfProtection,
};
