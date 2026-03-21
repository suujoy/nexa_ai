import messageModel from "../models/message.models.js";
import { generateResponse } from "../services/ai.service.js";
import chatModel from "../models/chat.models.js";
import { generateChatTitle } from "../services/ai.service.js";

export const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        const chatId = req.params.chatId;

        const chatData = await chatModel.findById(chatId);

        if (!chatData) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        // only generate title if empty
        if (!chatData.title || chatData.title === "") {
            const title = await generateChatTitle(message);
            chatData.title = title;
            await chatData.save();
        }

        const aiContent = await generateResponse(message);

        const userMessage = await messageModel.create({
            chat: chatId,
            content: message,
            role: "user",
        });

        const aiMessage = await messageModel.create({
            chat: chatId,
            content: aiContent,
            role: "ai",
        });

        res.status(201).json({
            message: "Message Created Successfully",
            success: true,
            userMessage,
            aiMessage,
        });
    } catch (err) {
        next(err);
    }
};

export const getMessagesByChatId = async (req, res, next) => {
    try {
        const { chatId } = req.params;

        const messages = await messageModel
            .find({ chat: chatId })
            .sort({ createdAt: 1 }); // oldest to latest

        res.status(200).json({
            success: true,
            messages,
        });
    } catch (err) {
        next(err);
    }
};

export const updateMessageWithAI = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;

        // 1. find user message
        const userMessage = await messageModel.findById(messageId);

        if (!userMessage) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        if (userMessage.role !== "user") {
            return res.status(400).json({
                success: false,
                message: "Only user messages can be updated",
            });
        }

        // 2. update user message
        userMessage.content = content;
        await userMessage.save();

        // 3. generate new AI response
        const aiContent = await generateResponse(content);

        // 4. find next AI message
        const aiMessage = await messageModel
            .findOne({
                chat: userMessage.chat,
                role: "ai",
                createdAt: { $gt: userMessage.createdAt },
            })
            .sort({ createdAt: 1 });

        // 5. update AI message
        if (aiMessage) {
            aiMessage.content = aiContent;
            await aiMessage.save();
        }

        res.status(200).json({
            success: true,
            message: "Message and AI updated",
            userMessage,
            aiMessage,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteMessageWithAI = async (req, res, next) => {
    try {
        const { messageId } = req.params;

        // 1. find user message
        const userMessage = await messageModel.findById(messageId);

        if (!userMessage) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        if (userMessage.role !== "user") {
            return res.status(400).json({
                success: false,
                message: "Only user messages can be deleted",
            });
        }

        // 2. find related AI message (next message)
        const aiMessage = await messageModel
            .findOne({
                chat: userMessage.chat,
                role: "ai",
                createdAt: { $gt: userMessage.createdAt },
            })
            .sort({ createdAt: 1 });

        // 3. delete user message
        await messageModel.findByIdAndDelete(messageId);

        // 4. delete AI message if exists
        if (aiMessage) {
            await messageModel.findByIdAndDelete(aiMessage._id);
        }

        res.status(200).json({
            success: true,
            message: "Message and AI response deleted",
        });
    } catch (err) {
        next(err);
    }
};
