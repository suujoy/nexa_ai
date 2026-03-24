import mongoose from "mongoose";
import aiModel from "../models/aiModel.model.js";
import chatModel from "../models/chat.model.js";
import guestModel from "../models/guest.model.js";
import messageModel from "../models/message.model.js";
import { generateChatTitle, generateResponse } from "../services/ai.service.js";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const buildGuestStatus = (guest) => {
    const remainingMessages = Math.max(
        guest.messageLimit - guest.messageCount,
        0,
    );

    return {
        messageCount: guest.messageCount,
        messageLimit: guest.messageLimit,
        remainingMessages,
    };
};

const getActiveDefaultModel = async () => {
    const model = await aiModel.findOne({
        isDefault: true,
        isActive: true,
    });

    if (!model) {
        throw new Error("No active default model found");
    }

    return model;
};

const getGuestByChatId = async (chatId) => guestModel.findOne({ chatId });

export const createGuest = async (req, res, next) => {
    try {
        const rawName = req.body?.name?.trim();
        const name = rawName || "Guest";
        const defaultModel = await getActiveDefaultModel();

        const chat = await chatModel.create({
            userId: new mongoose.Types.ObjectId(),
            title: `${name}'s Chat`,
            model: defaultModel._id,
        });

        const guest = await guestModel.create({
            name,
            chatId: chat._id,
            modelId: defaultModel._id,
        });

        return res.status(201).json({
            success: true,
            message: "Guest created successfully",
            guest,
            chatId: chat._id,
            ...buildGuestStatus(guest),
        });
    } catch (error) {
        next(error);
    }
};

export const guestChat = async (req, res, next) => {
    try {
        const { chatId, message } = req.body;

        if (!chatId || !message?.trim()) {
            return res.status(400).json({
                success: false,
                message: "chatId and message are required",
            });
        }

        if (!isValidObjectId(chatId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid chatId",
            });
        }

        const guest = await getGuestByChatId(chatId);

        if (!guest) {
            return res.status(404).json({
                success: false,
                message: "Guest chat not found",
            });
        }

        if (guest.messageCount >= guest.messageLimit) {
            return res.status(403).json({
                success: false,
                message: "Guest message limit reached",
                ...buildGuestStatus(guest),
            });
        }

        const chat = await chatModel.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        const modelId = guest.modelId || chat.model;
        const trimmedMessage = message.trim();
        const existingMessageCount = await messageModel.countDocuments({
            chatId,
        });

        await messageModel.create({
            chatId,
            role: "user",
            content: trimmedMessage,
            model: modelId,
            status: "success",
        });

        const messages = await messageModel
            .find({ chatId })
            .sort({ createdAt: 1 });

        let aiText = "";
        let title = chat.title;

        if (existingMessageCount === 0) {
            const [response, generatedTitle] = await Promise.all([
                generateResponse(messages, modelId),
                generateChatTitle(trimmedMessage),
            ]);

            aiText = response;
            title = generatedTitle || chat.title;

            if (title !== chat.title) {
                await chatModel.findByIdAndUpdate(chatId, { title });
            }
        } else {
            aiText = await generateResponse(messages, modelId);
        }

        const aiMessage = await messageModel.create({
            chatId,
            role: "ai",
            content: aiText,
            model: modelId,
            status: "success",
        });

        guest.messageCount += 1;
        await guest.save();

        return res.status(200).json({
            success: true,
            message: "Guest chat response generated successfully",
            chatId,
            title,
            aiMessage,
            response: aiText,
            status: buildGuestStatus(guest),
        });
    } catch (error) {
        next(error);
    }
};

export const getGuestChat = async (req, res, next) => {
    try {
        const { chatId } = req.params;

        if (!isValidObjectId(chatId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid chatId",
            });
        }

        const [guest, chat, messages] = await Promise.all([
            getGuestByChatId(chatId),
            chatModel.findById(chatId).populate("model"),
            messageModel.find({ chatId }).sort({ createdAt: 1 }),
        ]);

        if (!guest) {
            return res.status(404).json({
                success: false,
                message: "Guest chat not found",
            });
        }

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        return res.status(200).json({
            success: true,
            guest,
            chat,
            messages,
            status: buildGuestStatus(guest),
        });
    } catch (error) {
        next(error);
    }
};

export const deleteGuestChat = async (req, res, next) => {
    try {
        const chatId = req.params?.chatId || req.body?.chatId;

        if (!isValidObjectId(chatId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid chatId",
            });
        }

        const guest = await getGuestByChatId(chatId);

        if (!guest) {
            return res.status(404).json({
                success: false,
                message: "Guest chat not found",
            });
        }

        const [deletedMessages, deletedChat] = await Promise.all([
            messageModel.deleteMany({ chatId }),
            chatModel.findByIdAndDelete(chatId),
        ]);

        await guestModel.findByIdAndDelete(guest._id);

        return res.status(200).json({
            success: true,
            message: "Guest chat deleted successfully",
            deletedMessages: deletedMessages.deletedCount,
            deletedChat: Boolean(deletedChat),
        });
    } catch (error) {
        next(error);
    }
};

export const clearGuestChat = async (req, res, next) => {
    try {
        const chatId = req.body?.chatId || req.query?.chatId;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "chatId is required",
            });
        }

        if (!isValidObjectId(chatId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid chatId",
            });
        }

        const guest = await getGuestByChatId(chatId);

        if (!guest) {
            return res.status(404).json({
                success: false,
                message: "Guest chat not found",
            });
        }

        const deletedMessages = await messageModel.deleteMany({ chatId });

        guest.messageCount = 0;
        guest.messageId = undefined;
        await guest.save();

        const chat = await chatModel.findById(chatId);

        if (chat) {
            chat.title = `${guest.name}'s Chat`;
            await chat.save();
        }

        return res.status(200).json({
            success: true,
            message: "Guest chat cleared successfully",
            deletedMessages: deletedMessages.deletedCount,
            status: buildGuestStatus(guest),
        });
    } catch (error) {
        next(error);
    }
};

export const incrementGuestMessageCount = async (req, res, next) => {
    try {
        const { chatId } = req.body;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "chatId is required",
            });
        }

        if (!isValidObjectId(chatId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid chatId",
            });
        }

        const guest = await getGuestByChatId(chatId);

        if (!guest) {
            return res.status(404).json({
                success: false,
                message: "Guest chat not found",
            });
        }

        if (guest.messageCount >= guest.messageLimit) {
            return res.status(403).json({
                success: false,
                message: "Guest message limit reached",
                ...buildGuestStatus(guest),
            });
        }

        guest.messageCount += 1;
        await guest.save();

        return res.status(200).json({
            success: true,
            message: "Guest message count incremented successfully",
            ...buildGuestStatus(guest),
        });
    } catch (error) {
        next(error);
    }
};

export const getGuestStatus = async (req, res, next) => {
    try {
        const { chatId } = req.params;

        if (!isValidObjectId(chatId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid chatId",
            });
        }

        const guest = await getGuestByChatId(chatId);

        if (!guest) {
            return res.status(404).json({
                success: false,
                message: "Guest chat not found",
            });
        }

        return res.status(200).json({
            success: true,
            chatId,
            ...buildGuestStatus(guest),
        });
    } catch (error) {
        next(error);
    }
};
