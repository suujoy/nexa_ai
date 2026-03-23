import chatModel from "../models/chat.model.js";

export const createChat = async (req, res, next) => {
    try {
        const { title, modelId } = req.body;
        const userId = req.user._id;

        let selectedModel;

        if (modelId) {
            selectedModel = await aiModel.findById(modelId);

            if (!selectedModel || !selectedModel.isActive) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid or inactive model",
                });
            }
        } else {
            selectedModel = await aiModel.findOne({ isDefault: true });

            if (!selectedModel) {
                return res.status(400).json({
                    success: false,
                    message: "No default model found",
                });
            }
        }

        const chat = await chatModel.create({
            userId,
            title: title || "New Chat",
            model: selectedModel._id,
        });

        res.status(201).json({
            success: true,
            message: "Chat created successfully",
            chat,
        });
    } catch (error) {
        next(error);
    }
};

export const getChats = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const chats = await chatModel.find({ userId }).populate("model");

        if (chats.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Chats not found",
                error: "Chats not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Chats fetched successfully",
            chats,
        });
    } catch (error) {
        next(error);
    }
};

export const getChatDetail = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const chat = await chatModel.findById(chatId).populate("model");
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
                error: "Chat not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Chat fetched successfully",
            chat,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTitle = async (req, res, next) => {
    try {
        const { title } = req.body;

        const { chatId } = req.params;

        if (!chatId || !title) {
            return res.status(400).json({
                success: false,
                message: "All fields required",
            });
        }

        const chat = await chatModel.findOneAndUpdate(
            { _id: chatId, userId: req.user._id },
            { title },
            { new: true },
        );

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
                error: "Chat not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Chat updated successfully",
            chat,
        });
    } catch (error) {
        next(error);
    }
};

export const updatePin = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const { isPinned } = req.body;

        if (!chatId || isPinned === undefined) {
            return res.status(400).json({
                success: false,
                message: "All fields required",
                error: "All fields required",
            });
        }

        const chat = await chatModel.findOneAndUpdate(
            { _id: chatId, userId: req.user._id },
            { isPinned },
            { new: true },
        );

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
                error: "Chat not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Chat updated successfully",
            chat,
        });
    } catch (err) {
        next(err);
    }
};

export const updateArchived = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const { isArchived } = req.body;

        if (!chatId || isArchived === undefined) {
            return res.status(400).json({
                success: false,
                message: "All fields required",
                error: "All fields required",
            });
        }

        const chat = await chatModel.findOneAndUpdate(
            { _id: chatId, userId: req.user._id },
            { isArchived },
            { new: true },
        );

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
                error: "Chat not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Chat updated successfully",
            chat,
        });
    } catch (err) {
        next(err);
    }
};

export const getPinnedChat = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const chats = await chatModel.find({ userId, isPinned: true });

        if (chats.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pinned chats found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Chat fetched successfully",
            chats,
        });
    } catch (err) {
        next(err);
    }
};

export const getArchivedChat = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const chats = await chatModel.find({ userId, isArchived: true });

        if (chats.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No archived chats found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Chat fetched successfully",
            chats,
        });
    } catch (err) {
        next(err);
    }
};

export const changeAiModel = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const { modelId } = req.body;

        if (!chatId || !modelId) {
            return res.status(400).json({
                success: false,
                message: "All fields required",
            });
        }

        // check model
        const selectedModel = await aiModel.findById(modelId);

        if (!selectedModel || !selectedModel.isActive) {
            return res.status(400).json({
                success: false,
                message: "Invalid or inactive model",
            });
        }

        // update chat
        const chat = await chatModel
            .findOneAndUpdate(
                { _id: chatId, userId: req.user._id },
                { model: modelId },
                { new: true },
            )
            .populate("model");

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "AI model changed successfully",
            chat,
        });
    } catch (error) {
        next(error);
    }
};
