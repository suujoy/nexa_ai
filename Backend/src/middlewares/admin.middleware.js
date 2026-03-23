export const isAdmin = (req, res, next) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only",
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};