import { Router } from "express";
import {
    deleteMessageWithAI, getMessagesByChatId, sendMessage, updateMessageWithAI,
} from "../controllers/message.controller.js";
import { identifyUser } from "../middlewares/auth.middleware.js";

const messageRouter = Router();

// POST   /api/message/:chatId
messageRouter.post("/:chatId", identifyUser, sendMessage);

// PATCH  /api/message/messages/update/:messageId  (must be before /:chatId pattern)
messageRouter.patch("/messages/update/:messageId", identifyUser, updateMessageWithAI);

// GET    /api/message/messages/:chatId
messageRouter.get("/messages/:chatId", identifyUser, getMessagesByChatId);

// DELETE /api/message/messages/:messageId
messageRouter.delete("/messages/:messageId", identifyUser, deleteMessageWithAI);

export default messageRouter;
