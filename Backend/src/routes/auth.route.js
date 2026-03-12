import { Router } from "express";
import { registerValidator } from "../validation/auth.validate.js";
import { registerController } from "../controllers/auth.controller.js";

const authRouter = Router();

/**
 * @name registerController
 * @description register user
 * @route POST /api/auth/register
 * @access public
 */

authRouter.post("/register", registerValidator, registerController);

export default authRouter;
