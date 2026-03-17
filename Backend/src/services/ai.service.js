import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
});

// export const testAi = async () => {
//     model.invoke(" ").then((res) => {
//         console.log(res.content);
//     });
// };


export const testAi = async () => {
    try {
        const res = await model.invoke("Hello AI");
        console.log(res.content);
    } catch (err) {
        console.log("AI Error:", err.message);
    }
};