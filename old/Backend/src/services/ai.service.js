import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "langchain";

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
    model: "magistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY,
});

export const generateResponse = async (messages) => {
    const response = await geminiModel.invoke(
        messages.map((msg) => {
            if (msg.role === "user") {
                return new HumanMessage(msg.content);
            } else if (msg.role === "ai") {
                return new AIMessage(msg.content);
            }
        }),
    );

    return response.text;
};

export const generateChatTitle = async (message) => {
    const response = await mistralModel.invoke([
        new SystemMessage(`You are a helpful AI assistant that generates concise and descriptive titles for chat conversations.

                            The user will provide the first message of a conversation. Create a clear and engaging 2-4 word title that captures the main topic and intent of the chat.`),
        new HumanMessage(
            `Genarate a title for a chat conversation based  on the following first message: ${message}`,
        ),
    ]);

    return response.text;
};
