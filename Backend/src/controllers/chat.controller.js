import chatModel from "../models/chat.models.js";
import messageModel from "../models/message.models.js";

/**
 * @route POST /api/chat/
 * @access private
 */
export const createChat = async (req, res, next) => {
    try {
        const { model } = req.body;
        if (!model)
            return res
                .status(400)
                .json({ success: false, message: "Model is required" });

        const chat = await chatModel.create({
            user: req.user.id,
            title: "",
            model: model || "groq",
        });

        res.status(201).json({ success: true, message: "Chat created", chat });
    } catch (err) {
        next(err);
    }
};

/**
 * @route GET /api/chat/
 * @access private
 */
export const getAllChats = async (req, res, next) => {
    try {
        const chats = await chatModel
            .find({ user: req.user.id })
            .select("title updatedAt")
            .sort({ updatedAt: -1 });
        res.status(200).json({ success: true, chats });
    } catch (err) {
        next(err);
    }
};

/**
 * @route GET /api/chat/:chatId
 * @access private
 */
export const getSingleChat = async (req, res, next) => {
    try {
        const chat = await chatModel.findById(req.params.chatId);
        if (!chat)
            return res
                .status(404)
                .json({ success: false, message: "Chat not found" });
        if (chat.user.toString() !== req.user.id)
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized" });

        const messages = await messageModel
            .find({ chat: req.params.chatId })
            .select("content role createdAt")
            .sort({ createdAt: 1 });

        res.status(200).json({ success: true, chat, messages });
    } catch (err) {
        next(err);
    }
};

/**
 * @route PUT /api/chat/:chatId/title
 * @access private
 */
export const updateChatTitle = async (req, res, next) => {
    try {
        const { title } = req.body;
        if (!title || !title.trim())
            return res
                .status(400)
                .json({ success: false, message: "Title is required" });

        const chat = await chatModel.findById(req.params.chatId);
        if (!chat)
            return res
                .status(404)
                .json({ success: false, message: "Chat not found" });
        if (chat.user.toString() !== req.user.id)
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized" });

        chat.title = title.trim();
        await chat.save();
        res.status(200).json({ success: true, message: "Title updated", chat });
    } catch (err) {
        next(err);
    }
};

/**
 * @route DELETE /api/chat/:chatId
 * @access private
 */
export const deleteChat = async (req, res, next) => {
    try {
        const chat = await chatModel.findById(req.params.chatId);
        if (!chat)
            return res
                .status(404)
                .json({ success: false, message: "Chat not found" });
        if (chat.user.toString() !== req.user.id)
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized" });

        await messageModel.deleteMany({ chat: req.params.chatId });
        await chatModel.findByIdAndDelete(req.params.chatId);
        res.status(200).json({ success: true, message: "Chat deleted" });
    } catch (err) {
        next(err);
    }
};
