import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            default: "New Chat",
            trim: true,
        },

        model: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AIModel",
            required: true,
        },

        isPinned: {
            type: Boolean,
            default: false,
        },

        isArchived: {
            type: Boolean,
            default: false,
        },

        totalToken: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;
