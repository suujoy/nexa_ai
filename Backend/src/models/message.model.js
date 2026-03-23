import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        role: {
            type: String,
            enum: ["user", "ai", "system"],
            required: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
        },

        model: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AiModel",
            required: true,
        },

        inputTokens: {
            type: Number,
            default: 0,
        },

        outputTokens: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["pending", "success", "error"],
            default: "pending",
        },

        parentMessageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    },
    { timestamps: true },
);

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;
