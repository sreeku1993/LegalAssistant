import fs from "fs/promises";

import { chat } from "../chat/chat";
import questions from "../../src/evaluation/questions.json";

async function main() {
  const results = [];

  for (const item of questions) {
    const response =
      await chat(item.question);

    results.push({
      question: item.question,
      answer: response.answer,

      contexts:
        response.sources.map(
          (s: any) => s.content
        ),

      ground_truth:
        item.ground_truth
    });
  }

  await fs.writeFile(
    "src/evaluation/results.json",
    JSON.stringify(
      results,
      null,
      2
    )
  );
}

main();