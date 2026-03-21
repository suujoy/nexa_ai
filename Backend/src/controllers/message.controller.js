import messageModel from "../models/message.models.js";
import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.models.js";

/**
 * @route POST /api/message/:chatId
 * @access private
 */
export const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        const { chatId } = req.params;

        if (!message || !message.trim()) {
            return res
                .status(400)
                .json({ success: false, message: "Message is required" });
        }

        const chatData = await chatModel.findOne({
            _id: chatId,
            user: req.user.id,
        });
        if (!chatData)
            return res
                .status(404)
                .json({ success: false, message: "Chat not found" });

        // Auto-generate title on first message
        if (!chatData.title || chatData.title.trim() === "") {
            chatData.title = await generateChatTitle(message);
            await chatData.save();
        }

        await messageModel.create({
            chat: chatId,
            content: message,
            role: "user",
        });

        // Load full history for AI context
        const allMessages = await messageModel
            .find({ chat: chatId })
            .sort({ createdAt: 1 });

        const aiContent = await generateResponse(allMessages, chatData.model);

        const userMessage = allMessages[allMessages.length - 1];
        const aiMessage = await messageModel.create({
            chat: chatId,
            content: aiContent,
            role: "ai",
        });

        res.status(201).json({
            success: true,
            userMessage,
            aiMessage,
            chat: chatData,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @route GET /api/message/messages/:chatId
 * @access private
 */
export const getMessagesByChatId = async (req, res, next) => {
    try {
        const chat = await chatModel.findOne({
            _id: req.params.chatId,
            user: req.user.id,
        });
        if (!chat)
            return res
                .status(404)
                .json({ success: false, message: "Chat not found" });

        const messages = await messageModel
            .find({ chat: req.params.chatId })
            .sort({ createdAt: 1 });
        res.status(200).json({ success: true, messages });
    } catch (err) {
        next(err);
    }
};

/**
 * @route PATCH /api/message/messages/update/:messageId
 * @access private
 */
export const updateMessageWithAI = async (req, res, next) => {
    try {
        const { content } = req.body;
        if (!content || !content.trim())
            return res
                .status(400)
                .json({ success: false, message: "Content is required" });

        const userMessage = await messageModel.findById(req.params.messageId);
        if (!userMessage)
            return res
                .status(404)
                .json({ success: false, message: "Message not found" });
        if (userMessage.role !== "user")
            return res.status(400).json({
                success: false,
                message: "Only user messages can be updated",
            });

        const chat = await chatModel.findOne({
            _id: userMessage.chat,
            user: req.user.id,
        });
        if (!chat)
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized" });

        userMessage.content = content.trim();
        await userMessage.save();

        // Delete all messages after the edited one (now stale)
        await messageModel.deleteMany({
            chat: userMessage.chat,
            createdAt: { $gt: userMessage.createdAt },
        });

        const history = await messageModel
            .find({ chat: userMessage.chat })
            .sort({ createdAt: 1 });
        const aiContent = await generateResponse(history, chat.model);

        const aiMessage = await messageModel.create({
            chat: userMessage.chat,
            content: aiContent,
            role: "ai",
        });

        res.status(200).json({ success: true, userMessage, aiMessage });
    } catch (err) {
        next(err);
    }
};

/**
 * @route DELETE /api/message/messages/:messageId
 * @access private
 */
export const deleteMessageWithAI = async (req, res, next) => {
    try {
        const userMessage = await messageModel.findById(req.params.messageId);
        if (!userMessage)
            return res
                .status(404)
                .json({ success: false, message: "Message not found" });
        if (userMessage.role !== "user")
            return res.status(400).json({
                success: false,
                message: "Only user messages can be deleted",
            });

        const chat = await chatModel.findOne({
            _id: userMessage.chat,
            user: req.user.id,
        });
        if (!chat)
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized" });

        // Find paired AI message (next AI message after this user message)
        const aiMessage = await messageModel
            .findOne({
                chat: userMessage.chat,
                role: "ai",
                createdAt: { $gt: userMessage.createdAt },
            })
            .sort({ createdAt: 1 });

        await messageModel.findByIdAndDelete(req.params.messageId);
        if (aiMessage) await messageModel.findByIdAndDelete(aiMessage._id);

        res.status(200).json({
            success: true,
            message: "Deleted",
            deletedAiMessageId: aiMessage?._id || null,
        });
    } catch (err) {
        next(err);
    }
};
