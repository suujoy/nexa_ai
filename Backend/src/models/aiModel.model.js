import mongoose from "mongoose";

const aiModelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        provider: {
            type: String,
            required: true, // example: google, openai
        },

        model: {
            type: String,
            required: true, // example: gemini-1.5-flash
        },

        maxToken: {
            type: Number,
            default: 0,
        },

        costPerToken: {
            type: Number,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const aiModel = mongoose.model("AIModel", aiModelSchema);
export default aiModel;
