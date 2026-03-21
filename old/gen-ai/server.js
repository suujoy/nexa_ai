import "dotenv/config";
import readline from "readline/promises";
import { HumanMessage, tool, createAgent, SystemMessage } from "langchain";
import { sendEmail } from "./mail.service.js";
import * as z from "zod";
import { ChatMistralAI } from "@langchain/mistralai";
import { extractWebPage, searchWeb } from "./tavly.js";

const emailTool = tool(sendEmail, {
    name: "emailTool",
    description: "Use this tool to sent an Email",
    schema: z.object({
        to: z.string().describe("The recippient email address"),
        html: z.string().describe("The email body"),
        subject: z.string().describe("The email subject"),
    }),
});

const searchTool = tool(searchWeb, {
    name: "searchTool",
    description:
        "Search the internet for real time information such as news, elections, political leaders, or events after 2023. Always use this tool before answering those questions.",
    schema: z.object({
        query: z.string().describe("The search query"),
    }),
});

const siteExtractTool = tool(extractWebPage, {
    name: "siteExtractTool",
    description: "Extract data from a website",
    schema: z.object({
        url: z.string().describe("The url of the website"),
    }),
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const model = new ChatMistralAI({
    model: "mistral-small-latest",
});

const agent = createAgent({
    tools: [emailTool, searchTool,siteExtractTool],
    model,
});

const messages = [
    new SystemMessage(
        "You are an AI assistant with internet access using searchTool. For any question about politics, current leaders, elections, or events after 2023 you MUST call searchTool before answering. Never rely on your internal knowledge for these topics.",
    ),
];

while (true) {
    const userInpute = await rl.question("You: ");

    messages.push(new HumanMessage(userInpute));

    const response = await agent.invoke({ messages });

    const lastMessage = response.messages[response.messages.length - 1];

    messages.push(lastMessage);

    if (lastMessage.content) {
        console.log(lastMessage.content);
    }
}

rl.close();
