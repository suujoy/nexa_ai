import mongoose from "mongoose";
import chatModel from "../models/chat.model.js";
import guestModel from "../models/guest.model.js";

const DEFAULT_MODEL_ID = process.env.DEFAULT_MODEL_ID;

export const createGuest = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "name is required",
            });
        }

        if (!DEFAULT_MODEL_ID) {
            return res.status(500).json({
                success: false,
                message: "DEFAULT_MODEL_ID is not set in env",
            });
        }

        const modelObjectId = new mongoose.Types.ObjectId(DEFAULT_MODEL_ID);

        // IMPORTANT: match your chat schema field name
        const chat = await chatModel.create({
            title: `${name}'s Chat`,
            model: modelObjectId, // or change to modelId if your schema uses that
        });

        const guest = await guestModel.create({
            name,
            chatId: chat._id,
            modelId: modelObjectId,
        });

        return res.status(201).json({
            success: true,
            guest,
            chatId: chat._id,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};