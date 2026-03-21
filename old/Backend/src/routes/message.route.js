import { Router } from "express";
import {
    deleteMessageWithAI,
    getMessagesByChatId,
    sendMessage,
    updateMessageWithAI,
} from "../controllers/message.controller.js";
import { identifyUser } from "../middlewares/auth.middleware.js";

const messageRouter = Router();

messageRouter.post("/:chatId", identifyUser, sendMessage);

messageRouter.get("/messages/:chatId", getMessagesByChatId);

messageRouter.patch("/messages/update/:messageId", updateMessageWithAI);

messageRouter.delete("/messages/:messageId", deleteMessageWithAI);

export default messageRouter;
