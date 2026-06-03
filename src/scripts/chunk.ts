import fs from "fs/promises";
import path from "path";

import { chunkDocuments } from "../ingest/chunker";

async function main() {
  const documentsPath = path.join(
    process.cwd(),
    "output",
    "documents.json"
  );

  const raw = await fs.readFile(
    documentsPath,
    "utf8"
  );

  const documents = JSON.parse(raw);

  const chunks = chunkDocuments(
    documents
  );

  console.log(
    `Created ${chunks.length} chunks`
  );

  await fs.writeFile(
    path.join(
      process.cwd(),
      "output",
      "chunks.json"
    ),
    JSON.stringify(chunks, null, 2),
    "utf8"
  );

  console.log("Saved chunks.json");
}

main().catch(console.error);