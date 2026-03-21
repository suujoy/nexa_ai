import { Router } from "express";
import { identifyUser } from "../middlewares/auth.middleware.js";
import {
    createChat,
    deleteChat,
    getAllChats,
    getSingleChat,
    updateChatTitle,
} from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.post("/", identifyUser, createChat);

chatRouter.put("/:chatId/title", identifyUser, updateChatTitle);

chatRouter.get("/", identifyUser, getAllChats);

chatRouter.delete("/:chatId", identifyUser, deleteChat);

chatRouter.get("/:chatId", identifyUser, getSingleChat);

export default chatRouter;
