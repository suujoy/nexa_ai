import {Router} from "express";
import { createGuest } from "../controllers/guest.controller.js";

const guestRouter = Router();

guestRouter.post("/create", createGuest);



export default guestRouter;