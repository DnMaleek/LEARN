const getDashboard = (req, res) => {
    res.json({
        message: "Welcome to your dashboard"
    });
};

module.exports = {
    getDashboard
};