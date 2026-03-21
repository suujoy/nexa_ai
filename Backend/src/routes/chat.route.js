import { Router } from "express";
import { identifyUser } from "../middlewares/auth.middleware.js";
import { createChat, deleteChat, getAllChats, getSingleChat, updateChatTitle } from "../controllers/chat.controller.js";

const chatRouter = Router();

// POST   /api/chat/
chatRouter.post("/", identifyUser, createChat);

// GET    /api/chat/
chatRouter.get("/", identifyUser, getAllChats);

// GET    /api/chat/:chatId
chatRouter.get("/:chatId", identifyUser, getSingleChat);

// PUT    /api/chat/:chatId/title
chatRouter.put("/:chatId/title", identifyUser, updateChatTitle);

// DELETE /api/chat/:chatId
chatRouter.delete("/:chatId", identifyUser, deleteChat);

export default chatRouter;
