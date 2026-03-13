import "dotenv/config";
import readline from "readline/promises";
import { HumanMessage } from "langchain";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
    model: "mistral-small-latest",
});

const messages = [];

while (true) {
    const userInpute = await rl.question("You: ");

    messages.push(new HumanMessage(userInpute));

    const response = await model.invoke(messages);

    messages.push(response);

    console.log("Ai: " + response.text);
}

rl.close();
