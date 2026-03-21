// Global error handler — must be registered last in app.js
const handleError = (err, req, res, next) => {
    let status = err.status || err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
        status = 401;
        message = "Invalid or expired token. Please log in again.";
    } else if (err.name === "CastError") {
        status = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    } else if (err.name === "ValidationError") {
        status = 400;
        message = Object.values(err.errors).map((e) => e.message).join(", ");
    } else if (err.code === 11000) {
        status = 409;
        const field = Object.keys(err.keyValue || {})[0] || "field";
        message = `${field} already exists.`;
    }

    const response = { success: false, message };
    if (process.env.NODE_ENV === "development") response.stack = err.stack;

    res.status(status).json(response);
};

export default handleError;
