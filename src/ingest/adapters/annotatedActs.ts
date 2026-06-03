import fs from "fs/promises";
import path from "path";

import { LegalDocument } from "../../types/legalDocument";

function extractText(node: any): string {
  if (!node) return "";

  if (typeof node === "string") {
    return node.trim();
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("\n");
  }

  if (typeof node === "object") {
    const parts: string[] = [];

    if (typeof node.text === "string") {
      parts.push(node.text.trim());
    }

    if (node.contains) {
      for (const value of Object.values(node.contains)) {
        const extracted = extractText(value);

        if (extracted) {
          parts.push(extracted);
        }
      }
    }

    return parts.join("\n");
  }

  return "";
}

async function parseAnnotatedActsFile(
  filePath: string
): Promise<LegalDocument[]> {
  const raw = await fs.readFile(filePath, "utf8");

const data = JSON.parse(raw);



  const documents: LegalDocument[] = [];

  const actTitle =
    data["Act Title"] ?? path.basename(filePath);

 if (data.Parts) {
  for (const part of Object.values<any>(data.Parts)) {
    const partName = part?.Name ?? "";
    const sections = part?.Sections ?? {};

    for (const [sectionKey, section] of Object.entries<any>(
      sections
    )) {
      const paragraphs = section?.paragraphs ?? {};

      const content = Object.values(paragraphs)
        .map(extractText)
        .filter(Boolean)
        .join("\n\n");

      if (!content.trim()) continue;

      const normalizedSection = sectionKey
        .replace(/^Section\s*/i, "")
        .replace(/\.$/, "")
        .trim();

      documents.push({
  content: `${normalizedSection}: ${
    section?.heading ?? ""
  }\n\n${content}`,
  metadata: {
    source: "annotated-acts",
    act: actTitle,
    part: partName, // remove this line in Sections branch
    section: normalizedSection,
    heading:
      section?.heading ?? "",
  },
});
    }
  }
}

else if (data.Sections) {
  for (const [sectionKey, section] of Object.entries<any>(
    data.Sections
  )) {
    const paragraphs = section?.paragraphs ?? {};

    const content = Object.values(paragraphs)
      .map(extractText)
      .filter(Boolean)
      .join("\n\n");

    if (!content.trim()) continue;

    const normalizedSection = sectionKey
      .replace(/^Section\s*/i, "")
      .replace(/\.$/, "")
      .trim();

    documents.push({
  content: `${normalizedSection}: ${
    section?.heading ?? ""
  }\n\n${content}`,
  metadata: {
    source: "annotated-acts",
    act: actTitle,
    section: normalizedSection,
    heading:
      section?.heading ?? "",
  },
});
  }
}
else if (data.Chapters) {
  for (const chapter of Object.values<any>(
    data.Chapters
  )) {
    const chapterName =
      chapter?.Name ?? "";

    const sections =
      chapter?.Sections ?? {};

    for (const [sectionKey, section] of Object.entries<any>(
      sections
    )) {
      const paragraphs =
        section?.paragraphs ?? {};

      const content = Object.values(
        paragraphs
      )
        .map(extractText)
        .filter(Boolean)
        .join("\n\n");

      if (!content.trim()) continue;

      const normalizedSection =
        sectionKey
          .replace(/^Section\s*/i, "")
          .replace(/\.$/, "")
          .trim();

      documents.push({
  content: `${normalizedSection}: ${section?.heading ?? ""}\n\n${content}`,
  metadata: {
    source: "annotated-acts",
    act: actTitle,
    chapter: chapterName,
    section: normalizedSection,
    heading:
      section?.heading ?? "",
  },
});
    }
  }
}
  return documents;
}

export async function ingestAnnotatedActs(): Promise<
  LegalDocument[]
> {
  const datasetDir = path.join(
    process.cwd(),
    "legal-data",
    "datasets",
    "annotated-acts"
  );

  const files = (await fs.readdir(datasetDir)).filter(
    (file) => file.endsWith(".json")
  );

  const allDocuments: LegalDocument[] = [];

  console.log(
    `Found ${files.length} annotated acts`
  );
let zeroSectionFiles = 0;
  for (const file of files) {
    const filePath = path.join(datasetDir, file);

    try {
      const docs = await parseAnnotatedActsFile(
        filePath
      );
if (docs.length === 0) {
  zeroSectionFiles++;
}
      console.log(
        `${file}: ${docs.length} sections`
      );

      allDocuments.push(...docs);
    } catch (error) {
      console.error(
        `Failed to process ${file}`,
        error
      );
    }
  }
console.log(`Zero section files: ${zeroSectionFiles}`);
  console.log(
    `Total documents: ${allDocuments.length}`
  );

  return allDocuments;
}