import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },

        messageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },

        fileUrl: {
            type: String,
            required: true,
        },

        fileType: {
            type: String, // image, pdf, audio, etc.
            required: true,
        },

        mimeType: {
            type: String, // image/png, application/pdf
        },

        size: {
            type: Number, // in bytes
        },

        role: {
            type: String,
            enum: ["user", "ai"],
            default: "user",
        },
    },
    { timestamps: true },
);

const attachmentModel = mongoose.model("Attachment", attachmentSchema);

export default attachmentModel;
