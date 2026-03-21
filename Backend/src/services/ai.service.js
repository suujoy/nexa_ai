import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGroq } from "@langchain/groq";
// Fixed import: message classes live in @langchain/core, not "langchain"
import {
    HumanMessage,
    SystemMessage,
    AIMessage,
} from "@langchain/core/messages";

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY,
});

const groqModel = new ChatGroq({
    model: "llama-3.1-8b-instant",
    apiKey: process.env.GROQ_API_KEY,
});

// Accepts full message history array for conversation context
const models = {
    gemini: geminiModel,
    mistral: mistralModel,
    groq: groqModel,
};

export const generateResponse = async (messages, modelName = "groq") => {
    const selectedModel = models[modelName] || groqModel;

    const langchainMessages = messages
        .map((msg) => {
            if (msg.role === "user") return new HumanMessage(msg.content);
            if (msg.role === "ai") return new AIMessage(msg.content);
            return null;
        })
        .filter(Boolean);

    const response = await selectedModel.invoke(langchainMessages);
    return response.content;
};

// Generates a short 2-4 word title from the first message
export const generateChatTitle = async (message) => {
    const response = await mistralModel.invoke([
        new SystemMessage(
            `Generate a concise 2-4 word title for a chat based on the user's first message. Return only the title, no quotes.`,
        ),
        new HumanMessage(`First message: ${message}`),
    ]);
    return response.content.trim();
};
