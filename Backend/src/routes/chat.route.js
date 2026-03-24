import { Router } from "express";
import { identifyUser } from "../middlewares/auth.middleware.js";
import {
    changeAiModel,
    createChat,
    deleteChat,
    getArchivedChat,
    getChatDetail,
    getChats,
    getPinnedChat,
    updateArchived,
    updatePin,
    updateTitle,
} from "../controllers/chat.controller.js";

const chatRouter = Router();
/**
 * Create Chat
 */
chatRouter.post("/create", identifyUser, createChat);

/**
 * Get all Chats
 */
chatRouter.get("/get", identifyUser, getChats);

/**
 * Get Chat Detail
 */
chatRouter.get("/detail/:chatId", identifyUser, getChatDetail);

/**
 * Update Chat Title
 */
chatRouter.patch("/title/:chatId", identifyUser, updateTitle);

/**
 * Update Chat Pin
 */
chatRouter.patch("/pin/:chatId", identifyUser, updatePin);

/**
 * Update Chat Archive
 */
chatRouter.patch("/archive/:chatId", identifyUser, updateArchived);

/**
 * get all pinned chats
 */
chatRouter.get("/pinned", identifyUser, getPinnedChat);

/**
 * get all archived chats
 */
chatRouter.get("/archived", identifyUser, getArchivedChat);

chatRouter.patch("/model/:chatId", identifyUser, changeAiModel);
chatRouter.delete("/delete/:chatId", identifyUser, deleteChat);


export default chatRouter;
