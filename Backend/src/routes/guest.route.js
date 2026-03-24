import { Router } from "express";
import {
    clearGuestChat,
    createGuest,
    deleteGuestChat,
    getGuestChat,
    getGuestStatus,
    guestChat,
    incrementGuestMessageCount,
} from "../controllers/guest.controller.js";

const guestRouter = Router();

guestRouter.post("/create", createGuest);
guestRouter.post("/chat", guestChat);
guestRouter.get("/chat/:chatId", getGuestChat);
guestRouter.delete("/chat/:chatId", deleteGuestChat);
guestRouter.post("/chat/:chatId/delete", deleteGuestChat);
guestRouter.delete("/clear", clearGuestChat);
guestRouter.post("/clear", clearGuestChat);
guestRouter.post("/increment", incrementGuestMessageCount);
guestRouter.get("/status/:chatId", getGuestStatus);

export default guestRouter;
