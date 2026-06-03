import fs from "fs/promises";
import path from "path";

import { LegalDocument } from "../types/legalDocument";

export async function saveDocuments(
  documents: LegalDocument[]
) {
  const outputDir = path.join(
    process.cwd(),
    "output"
  );

  await fs.mkdir(outputDir, {
    recursive: true,
  });

  const outputFile = path.join(
    outputDir,
    "documents.json"
  );

  await fs.writeFile(
    outputFile,
    JSON.stringify(documents, null, 2),
    "utf8"
  );

  console.log(
    `Saved ${documents.length} documents to ${outputFile}`
  );
}