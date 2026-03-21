import { Router } from "express";
import { loginValidator, registerValidator } from "../validation/auth.validate.js";
import {
    getMeController, loginController, registerController,
    resendEmailController, verifyEmailController,
} from "../controllers/auth.controller.js";
import { identifyUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

// POST /api/auth/register
authRouter.post("/register", registerValidator, registerController);

// POST /api/auth/login
authRouter.post("/login", loginValidator, loginController);

// GET /api/auth/get-me (private)
authRouter.get("/get-me", identifyUser, getMeController);

// GET /api/auth/verify-email?token=
authRouter.get("/verify-email", verifyEmailController);

// POST /api/auth/resend-verify-email
authRouter.post("/resend-verify-email", resendEmailController);

export default authRouter;
