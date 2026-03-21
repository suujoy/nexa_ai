import chatModel from "../models/chat.models.js";
import messageModel from "../models/message.models.js";

/**
 * @name: Create Chat without title
 */
export const createChat = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }

        const chat = await chatModel.create({ user: user._id });

        res.status(201).json({
            message: "Chat Created Successfully",
            success: true,
            chat,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @name: Update chat title manually
 */
export const updateChatTitle = async (req, res, next) => {
    try {
        // get chatId and title
        const { chatId } = req.params;
        const { title } = req.body;

        // validate title
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        // find chat first
        const chat = await chatModel.findById(chatId);

        // check chat exists
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        // ownership check (important)
        if (chat.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // update title
        chat.title = title;
        await chat.save();

        // response
        res.status(200).json({
            success: true,
            message: "Title Updated",
            chat,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @name: Get all chats (for sidebar)
 */
export const getAllChats = async (req, res, next) => {
    try {
        // get user id from middleware
        const userId = req.user.id;

        // find chats of this user, latest first
        const chats = await chatModel
            .find({ user: userId })
            .select("title updatedAt")
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            chats,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @name: Delete chat
 */
export const deleteChat = async (req, res, next) => {
    try {
        const { chatId } = req.params;

        // find chat
        const chat = await chatModel.findById(chatId);

        // check chat exists
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        // ownership check (important)
        if (chat.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // delete all messages of this chat
        await messageModel.deleteMany({ chat: chatId });

        // delete chat
        await chatModel.findByIdAndDelete(chatId);

        res.status(200).json({
            success: true,
            message: "Chat deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @name: Get single chat with messages
 */
export const getSingleChat = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;

        // find chat
        const chat = await chatModel.findById(chatId);

        // check chat exists
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        // check ownership (important)
        if (chat.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // get all messages of this chat
        const messages = await messageModel
            .find({ chat: chatId })
            .select("content role createdAt")
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            chat,
            messages,
        });
    } catch (err) {
        next(err);
    }
};
