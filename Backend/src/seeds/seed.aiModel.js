import mongoose from "mongoose";
import dotenv from "dotenv";
import aiModel from "../models/aiModel.model.js";

dotenv.config();

const seedModel = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await aiModel.findOne({ isDefault: true });

    if (existing) {
        console.log("✅ Default model already exists:", existing.model);
        process.exit(0);
    }

    await aiModel.create({
        provider: "groq",
        model: "llama3-8b-8192",
        isDefault: true,
        isActive: true,
    });

    console.log("✅ Default model seeded successfully");
    process.exit(0);
};

seedModel().catch((err) => {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
});