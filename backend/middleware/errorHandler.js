const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const status = res.statusCode ? res.statusCode : 500;
    res.status(status).json({
        message: err.message,
        isError: true
    });
};

module.exports = errorHandler;
