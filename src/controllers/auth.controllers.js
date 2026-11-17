const register = (req, res) => {
    res.json({
        message: "Registration controller reached"
    });
};

const login = (req, res) => {
    res.json({
        message: "Login controller reached"
    });
};

module.exports = {
    register,
    login
};