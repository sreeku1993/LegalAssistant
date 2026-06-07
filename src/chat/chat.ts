import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { traceable } from "langsmith/traceable";
import { hybridSearch } from "../retrieval/hybridSearch";
import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

function buildContext(results: any[]) {
  return results
    .map(
      (result, index) => `
[Source ${index + 1}]

${result.content}
`
    )
    .join("\n");
}

export const chat = traceable(
async function chat(
  question: string
) {
  const results =
    await hybridSearch(question, 5);

  const context =
    buildContext(results);

  const response =
    await model.invoke([
      {
        role: "system",
        content:
          "You are an Indian Legal Assistant. Use only the provided context.",
      },
      {
        role: "user",
        content: `
Legal Context:

${context}

Question:

${question}
`,
      },
    ]);

    return {
    answer: response.content,
    sources: results,
  };
},
{
  name: "legal-chat"
}
);