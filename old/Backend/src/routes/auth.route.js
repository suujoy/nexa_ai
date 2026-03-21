import { Router } from "express";
import {
    loginValidator,
    registerValidator,
} from "../validation/auth.validate.js";
import {
    getMeController,
    loginController,
    registerController,
    resendEmailController,
    verifyEmailController,
} from "../controllers/auth.controller.js";
import { identifyUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * @name registerController
 * @description register user
 * @route POST /api/auth/register
 * @access public
 */

authRouter.post("/register", registerValidator, registerController);

/**
 * @name loginController
 * @description login user
 * @route POST /api/auth/login
 * @access public
 */
authRouter.post("/login", loginValidator, loginController);

/**
 * @name identifyUser
 * @description identify user
 * @route GET /api/auth/get-me
 * @access private
 */

authRouter.get("/get-me", identifyUser, getMeController);

/**
 * @name verifyEmailController
 * @description verify user email
 * @route GET /api/auth/verify-email
 * @access public
 */

authRouter.get("/verify-email", verifyEmailController);

/**
 * @name resendEmailController
 * @description resend email verification link
 * @route POST /api/auth/resend-email
 * @access public
 */
authRouter.post("/resend-verify-email", resendEmailController);

export default authRouter;
