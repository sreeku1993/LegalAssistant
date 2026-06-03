import fs from "fs/promises";
import path from "path";
import { LegalDocument } from "../../types/legalDocument";

const DATASET_DIR = path.join(
  process.cwd(),
  "legal-data",
  "datasets",
  "indian-law"
);

export async function ingestIndianLaw(): Promise<
  LegalDocument[]
> {
  const documents: LegalDocument[] = [];

  const files = await fs.readdir(DATASET_DIR);

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const filePath = path.join(
      DATASET_DIR,
      file
    );

    const raw = await fs.readFile(
      filePath,
      "utf-8"
    );

    const data = JSON.parse(raw);

    console.log(
      `${file}: ${data.length} sections`
    );

    for (const item of data) {
      documents.push({
  content: `Section ${item.Section}: ${item.section_title}\n\n${item.section_desc ?? ""}`,
  metadata: {
    source: "indian-law",
    act: file.replace(".json", ""),
    chapter: String(
      item.chapter ?? ""
    ),
    chapterTitle:
      item.chapter_title ?? "",
    section: String(
      item.Section ?? ""
    ),
    heading:
      item.section_title ?? ""
  }
});
    }
  }

  console.log(
    `Indian law documents: ${documents.length}`
  );

  return documents;
}