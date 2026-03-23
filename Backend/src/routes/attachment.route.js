import { Router } from "express";
import { identifyUser } from "../middlewares/auth.middleware.js";
import {
    deleteAttachment,
    deleteAttachmentsByChat,
    downloadAttachment,
    getAttachmentsByChat,
    getAttachmentsByMessage,
    uploadAttachment,
} from "../controllers/attachment.controller.js";
import upload from "../middlewares/upload.middleware.js";

const attachmentRouter = Router();

attachmentRouter.post(
    "/upload",
    identifyUser,
    upload.single("file"),
    uploadAttachment,
);

attachmentRouter.get(
    "/message/:messageId",
    identifyUser,
    getAttachmentsByMessage,
);

attachmentRouter.get("/chat/:chatId", identifyUser, getAttachmentsByChat);

attachmentRouter.delete(
    "/delete/:attachmentId",
    identifyUser,
    deleteAttachment,
);

attachmentRouter.delete(
    "/chat/delete/:chatId",
    identifyUser,
    deleteAttachmentsByChat,
);

attachmentRouter.get(
    "/download/:attachmentId",
    identifyUser,
    downloadAttachment,
);

export default attachmentRouter;
