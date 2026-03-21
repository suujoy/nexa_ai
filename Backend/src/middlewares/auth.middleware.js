import jwt from "jsonwebtoken";

// Verifies JWT cookie and attaches decoded payload to req.user
export const identifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        next(err);
    }
};
