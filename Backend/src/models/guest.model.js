import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
        },

        messageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },

        messageLimit: {
            type: Number,
            default: 10,
        },

        messageCount: {
            type: Number,
            default: 0,
        },

        modelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AIModel",
        },
    },
    { timestamps: true },
);

const guestModel = mongoose.model("Guest", guestSchema);

export default guestModel;
