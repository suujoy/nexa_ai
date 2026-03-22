import jwt from "jsonwebtoken";
import redis from '../configs/cache.js'

export const identifyUser = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Authentication token not found",
        });
    }

    const isTokenBlacklisted = await redis.get(token);

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Session expired. Please login again",
        });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or Unauthorize token",
        });
    }
};
