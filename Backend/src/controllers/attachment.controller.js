import attachmentModel from "../models/attachment.model.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { uploadFile } from "../services/imagekit.service.js";

export const uploadAttachment = async (req, res) => {
    try {
        const { chatId, messageId } = req.body;
        const file = req.file;

        if (!file || !chatId) {
            return res.status(400).json({
                success: false,
                message: "File and chatId are required",
            });
        }

        const chat = await chatModel.findOne({
            _id: chatId,
            userId: req.user._id,
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        if (messageId) {
            const message = await messageModel.findOne({
                _id: messageId,
                chatId,
                userId: req.user._id,
            });

            if (!message) {
                return res.status(404).json({
                    success: false,
                    message: "Message not found",
                });
            }
        }

        const uploadedData = await uploadFile(file);

        const attachment = await attachmentModel.create({
            userId: req.user._id,
            chatId,
            messageId,
            fileUrl: uploadedData.fileUrl,
            fileType: uploadedData.fileType,
            mimeType: uploadedData.mimeType,
            size: uploadedData.size,
            role: "user",
        });

        return res.status(201).json({
            success: true,
            attachment,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAttachmentsByMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        if (!messageId) {
            return res.status(400).json({
                success: false,
                message: "messageId is required",
            });
        }

        const message = await messageModel.findOne({
            _id: messageId,
            userId: req.user._id,
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        const attachments = await attachmentModel
            .find({ messageId, userId: req.user._id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            attachments,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAttachmentsByChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { role } = req.query;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "chatId is required",
            });
        }

        const chat = await chatModel.findOne({
            _id: chatId,
            userId: req.user._id,
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        const filter = { chatId, userId: req.user._id };
        if (role) filter.role = role;

        const attachments = await attachmentModel
            .find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            attachments,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteAttachment = async (req, res) => {
    try {
        const { attachmentId } = req.params;

        if (!attachmentId) {
            return res.status(400).json({
                success: false,
                message: "attachmentId is required",
            });
        }

        const attachment = await attachmentModel.findOne({
            _id: attachmentId,
            userId: req.user._id,
        });

        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: "Attachment not found",
            });
        }
        await attachmentModel.findByIdAndDelete(attachmentId);

        return res.status(200).json({
            success: true,
            message: "Attachment deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteAttachmentsByChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "chatId is required",
            });
        }

        const chat = await chatModel.findOne({
            _id: chatId,
            userId: req.user._id,
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        const attachments = await attachmentModel.find({
            chatId,
            userId: req.user._id,
        });

        if (!attachments.length) {
            return res.status(200).json({
                success: true,
                message: "No attachments found",
            });
        }

        const result = await attachmentModel.deleteMany({
            chatId,
            userId: req.user._id,
        });

        return res.status(200).json({
            success: true,
            message: "All attachments deleted",
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const downloadAttachment = async (req, res) => {
    try {
        const { attachmentId } = req.params;

        if (!attachmentId) {
            return res.status(400).json({
                success: false,
                message: "attachmentId is required",
            });
        }

        const attachment = await attachmentModel.findOne({
            _id: attachmentId,
            userId: req.user._id,
        });

        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: "Attachment not found",
            });
        }

        return res.redirect(attachment.fileUrl);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
