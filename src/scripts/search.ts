import "dotenv/config";
import { chat } from "../chat/chat";

async function main() {
  const result =
    await chat(
      "What is Article 14?"
    );

  console.log(result.answer);
}

main().catch(console.error);