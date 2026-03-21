import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // title starts empty, auto-generated on first message
        title: { type: String, default: "", trim: true },
        model: { type: String, default: "groq" },
    },
    { timestamps: true },
);

export default mongoose.model("Chat", chatSchema);
