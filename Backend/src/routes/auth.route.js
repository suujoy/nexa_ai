import { Router } from "express";
import {
    getMe,
    login,
    logout,
    register,
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

export default authRouter;
