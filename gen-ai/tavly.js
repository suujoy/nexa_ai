import "dotenv/config";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export const searchWeb = async ({ query }) => {
    const response = await tvly.search(query, {
        search_depth: "basic",
    });


    const results = response.results
        .slice(0, 3)
        .map((r) => {
            return `Title: ${r.title}
Content: ${r.content}
Source: ${r.url}`;
        })
        .join("\n\n");

    return `Web search results:\n\n${results}`;
};


export const extractWebPage = async ({url})=>{
    const response = await tvly.extract(url)
    console.log(response)
    return response
}