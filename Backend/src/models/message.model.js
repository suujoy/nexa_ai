import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
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
    },

    model: {
      type: String,
      default: "gemini",
    },

    token: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["loading", "success", "error"],
      default: "success",
    },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;