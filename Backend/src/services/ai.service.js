import {
    HumanMessage,
    AIMessage,
    SystemMessage,
} from "@langchain/core/messages";

import { ChatGroq } from "@langchain/groq";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import aiModel from "../models/aiModel.model.js";

/* -------------------- GET MODEL FROM DB -------------------- */
const getModelData = async (modelId) => {
    let modelData;

    if (modelId) {
        modelData = await aiModel.findById(modelId);
    }

    if (!modelData) {
        modelData = await aiModel.findOne({ isDefault: true });
    }

    if (!modelData || !modelData.isActive) {
        throw new Error("No active model available");
    }

    return modelData;
};

/* -------------------- CREATE LLM INSTANCE -------------------- */
const getLLM = (modelData) => {
    const { provider, model } = modelData;

    if (provider === "groq") {
        return new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model,
        });
    }

    if (provider === "mistral") {
        return new ChatMistralAI({
            apiKey: process.env.MISTRAL_API_KEY,
            model,
        });
    }

    if (provider === "google") {
        return new ChatGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY,
            model,
        });
    }

    throw new Error("Unsupported provider");
};

/* -------------------- GENERATE RESPONSE -------------------- */
export const generateResponse = async (messages, modelId) => {
    if (!messages || messages.length === 0) return "";

    const modelData = await getModelData(modelId);
    const llm = getLLM(modelData);

    const langchainMessages = messages
        .map((msg) => {
            if (msg.role === "user") return new HumanMessage(msg.content);
            if (msg.role === "ai") return new AIMessage(msg.content);
            if (msg.role === "system") return new SystemMessage(msg.content);
            return null;
        })
        .filter(Boolean);

    const response = await llm.invoke(langchainMessages);

    return response?.content || "";
};

/* -------------------- GENERATE CHAT TITLE -------------------- */
export const generateChatTitle = async (message) => {
    try {
        const modelData = await aiModel.findOne({ isDefault: true });

        if (!modelData) throw new Error("No default model found");

        const llm = getLLM(modelData);

        const response = await llm.invoke([
            new SystemMessage(
                "Generate a clear 2-4 word chat title. Return only title.",
            ),
            new HumanMessage(`First message: ${message}`),
        ]);

        return response.content.trim();
    } catch (error) {
        console.error("Title Error:", error.message);
        return "New Chat";
    }
};
