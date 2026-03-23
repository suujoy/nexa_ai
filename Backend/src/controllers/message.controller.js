import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import aiModel from "../models/aiModel.model.js";
import { generateChatTitle, generateResponse } from "../services/ai.service.js";
import {
    emitNewMessage,
    emitChatTitleUpdate,
    emitAiThinking,
} from "../socket/socket.server.js";

export const sendMessage = async (req, res, next) => {
    try {
        let { chatId } = req.params;
        const { message } = req.body;
        const userId = req.user._id;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        let chat;
        let isNewChat = false;

        /* ----------- CREATE CHAT IF NOT EXISTS ----------- */
        if (!chatId) {
            const defaultModel = await aiModel.findOne({
                isDefault: true,
                isActive: true,
            });

            if (!defaultModel) {
                return res.status(500).json({
                    success: false,
                    message: "No active default model available",
                });
            }

            chat = await chatModel.create({
                userId,
                title: "New Chat",
                model: defaultModel._id,
            });

            chatId = chat._id;
            isNewChat = true;
        } else {
            chat = await chatModel.findById(chatId);
            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Chat not found",
                });
            }
        }

        const modelId = chat.model;

        /* ----------- SAVE USER MESSAGE ----------- */
        const userMessage = await messageModel.create({
            chatId,
            userId,
            role: "user",
            content: message,
            model: modelId,
            status: "success",
        });

        /* ----------- NOTIFY ROOM: USER MESSAGE ----------- */
        emitNewMessage(chatId, userMessage);

        /* ----------- NOTIFY ROOM: AI IS THINKING ----------- */
        emitAiThinking(chatId, true);

        /* ----------- GET ALL MESSAGES ----------- */
        const messages = await messageModel
            .find({ chatId })
            .sort({ createdAt: 1 });

        /* ----------- GENERATE AI RESPONSE + TITLE IN PARALLEL ----------- */
        let aiText;
        let title = chat.title;

        if (isNewChat) {
            const [aiResponse, generatedTitle] = await Promise.all([
                generateResponse(messages, modelId),
                generateChatTitle(message),
            ]);

            aiText = aiResponse;
            title = generatedTitle;

            await chatModel.findByIdAndUpdate(chatId, { title });

            /* ----------- NOTIFY ROOM: TITLE UPDATED ----------- */
            emitChatTitleUpdate(chatId, title);
        } else {
            aiText = await generateResponse(messages, modelId);
        }

        /* ----------- SAVE AI MESSAGE ----------- */
        const aiMessage = await messageModel.create({
            chatId,
            userId,
            role: "ai",
            content: aiText,
            model: modelId,
            status: "success",
        });

        /* ----------- NOTIFY ROOM: AI RESPONSE + STOP THINKING ----------- */
        emitAiThinking(chatId, false);
        emitNewMessage(chatId, aiMessage);

        /* ----------- HTTP RESPONSE ----------- */
        return res.status(200).json({
            success: true,
            chatId,
            title,
            message: aiText,
        });
    } catch (err) {
        next(err);
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        /* ----------- VERIFY CHAT EXISTS & BELONGS TO USER ----------- */
        const chat = await chatModel.findOne({ _id: chatId, userId });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        /* ----------- FETCH PAGINATED MESSAGES ----------- */
        const [messages, totalMessages] = await Promise.all([
            messageModel
                .find({ chatId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            messageModel.countDocuments({ chatId }),
        ]);

        const totalPages = Math.ceil(totalMessages / limit);

        /* ----------- RESPONSE ----------- */
        return res.status(200).json({
            success: true,
            chatId,
            pagination: {
                page,
                limit,
                totalMessages,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            messages: messages.reverse(),
        });
    } catch (err) {
        next(err);
    }
};

export const updateMessage = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required",
            });
        }

        /* ----------- FIND MESSAGE ----------- */
        const message = await messageModel.findOne({ _id: messageId, userId });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        if (message.role !== "user") {
            return res.status(403).json({
                success: false,
                message: "Only user messages can be edited",
            });
        }

        /* ----------- UPDATE USER MESSAGE ----------- */
        message.content = content;
        await message.save();

        const chatId = message.chatId;

        /* ----------- DELETE FUTURE MESSAGES ----------- */
        await messageModel.deleteMany({
            chatId,
            createdAt: { $gt: message.createdAt },
        });

        /* ----------- GET UPDATED CHAT HISTORY ----------- */
        const messages = await messageModel
            .find({ chatId })
            .sort({ createdAt: 1 });

        const formattedMessages = messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));

        /* ----------- GET CHAT MODEL ----------- */
        const chat = await chatModel.findById(chatId);
        const modelId = chat.model;

        /* ----------- NOTIFY ROOM: AI IS THINKING ----------- */
        emitAiThinking(chatId, true);

        /* ----------- GENERATE NEW AI RESPONSE ----------- */
        const aiText = await generateResponse(formattedMessages, modelId);

        /* ----------- SAVE NEW AI MESSAGE ----------- */
        const aiMessage = await messageModel.create({
            chatId,
            userId,
            role: "ai",
            content: aiText,
            model: modelId,
            status: "success",
            parentMessageId: message._id,
        });

        /* ----------- NOTIFY ROOM: AI RESPONSE + STOP THINKING ----------- */
        emitAiThinking(chatId, false);
        emitNewMessage(chatId, aiMessage);

        /* ----------- RESPONSE ----------- */
        return res.status(200).json({
            success: true,
            message: "Message updated and AI regenerated",
            data: {
                updatedMessage: message,
                aiMessage,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const deleteMessage = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        /* ----------- FIND MESSAGE ----------- */
        const message = await messageModel.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        /* ----------- VERIFY OWNERSHIP ----------- */
        if (message.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this message",
            });
        }

        await messageModel.findByIdAndDelete(messageId);

        return res.status(200).json({
            success: true,
            message: "Message deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};

export const deleteChatMessages = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        /* ----------- VERIFY CHAT OWNERSHIP ----------- */
        const chat = await chatModel.findOne({ _id: chatId, userId });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        /* ----------- DELETE ALL MESSAGES ----------- */
        const result = await messageModel.deleteMany({ chatId });

        return res.status(200).json({
            success: true,
            message: "All messages deleted successfully",
            deletedCount: result.deletedCount,
        });
    } catch (err) {
        next(err);
    }
};

export const streamMessage = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        /* ----------- VERIFY CHAT ----------- */
        const chat = await chatModel.findOne({ _id: chatId, userId });
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        /* ----------- SSE HEADERS ----------- */
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        /* ----------- GET MESSAGES ----------- */
        const messages = await messageModel
            .find({ chatId })
            .sort({ createdAt: 1 });

        const formattedMessages = messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));

        /* ----------- STREAM AI RESPONSE ----------- */
        const stream = await generateResponseStream(
            formattedMessages,
            chat.model,
        );

        let fullText = "";

        for await (const chunk of stream) {
            const token = chunk?.content || "";
            fullText += token;
            res.write(`data: ${JSON.stringify({ token })}\n\n`);
        }

        /* ----------- SAVE FINAL AI MESSAGE ----------- */
        const aiMessage = await messageModel.create({
            chatId,
            userId,
            role: "ai",
            content: fullText,
            model: chat.model,
            status: "success",
        });

        /* ----------- NOTIFY ROOM VIA SOCKET ----------- */
        emitNewMessage(chatId, aiMessage);

        /* ----------- END STREAM ----------- */
        res.write(`data: [DONE]\n\n`);
        res.end();
    } catch (err) {
        next(err);
    }
};
