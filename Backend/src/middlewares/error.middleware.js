const handleError = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    let response = {
        message: err.message,
    };

    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

export default handleError;
