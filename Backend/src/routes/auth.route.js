import { Router } from "express";
import {
    forgotPassword,
    getMe,
    login,
    logout,
    register,
    resetPassword,
    verifyEmail,
} from "../controllers/auth.controllers.js";
import { identifyUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * Register
 */
authRouter.post("/register", register);

/**
 * Verify email
 */
authRouter.get("/verify-email", verifyEmail);

/**
 * Login
 */
authRouter.post("/login", login);

/**
 * Get me
 */
authRouter.get("/get-me", identifyUser, getMe);

/**
 * Logout
 */
authRouter.post("/logout", identifyUser, logout);

/**
 * Forgot password
 */
authRouter.post("/forgot-password", forgotPassword);

/**
 * Reset password
 */
authRouter.post("/reset-password", resetPassword);

export default authRouter;
