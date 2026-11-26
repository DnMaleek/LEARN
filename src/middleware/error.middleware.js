function errorHandler(err, req, res, next) {
    console.error(err);

        if (res.headersSent) {
        return next(err);
    }


    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        message: statusCode === 500
            ? "Internal server error"
            : err.message
    });
}

module.exports = {
    errorHandler
};