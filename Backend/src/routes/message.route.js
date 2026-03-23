import { Router } from "express";
import { identifyUser } from "../middlewares/auth.middleware.js";
import {
    deleteChatMessages,
    deleteMessage,
    getMessages,
    sendMessage,
    streamMessage,
    updateMessage,
} from "../controllers/message.controller.js";

const messageRouter = Router();

messageRouter.post("/send", identifyUser, sendMessage);
messageRouter.post("/send/:chatId", identifyUser, sendMessage);
messageRouter.get("/get/:chatId", identifyUser, getMessages);
messageRouter.patch("/update/:messageId", identifyUser, updateMessage);
messageRouter.delete("/:messageId", identifyUser, deleteMessage);
messageRouter.delete("/chat/:chatId", identifyUser, deleteChatMessages);
messageRouter.get("/stream/:chatId", identifyUser, streamMessage);

export default messageRouter;
