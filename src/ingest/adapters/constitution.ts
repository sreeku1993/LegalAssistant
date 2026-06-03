import fs from "fs/promises";
import path from "path";

export async function ingestConstitution() {
  const filePath = path.join(
    process.cwd(),
    "legal-data",
    "datasets",
    "constitution",
    "COI.json"
  );

  const raw = JSON.parse(
    await fs.readFile(filePath, "utf8")
  );

  const articles = raw[0];

  const documents: any[] = [];

  for (const article of articles) {
    let content = "";

    if (article.ArtDesc) {
      content += article.ArtDesc;
    }

    if (article.Clauses) {
      for (const clause of article.Clauses) {
        content += `\n\nClause ${clause.ClauseNo}: ${clause.ClauseDesc}`;

        if (clause.SubClauses) {
          for (const sub of clause.SubClauses) {
            content += `\n${sub.SubClauseNo}) ${sub.SubClauseDesc}`;
          }
        }
      }
    }

    documents.push({
  content: `Article ${article.ArtNo}: ${article.Name}\n\n${content.trim()}`,
  metadata: {
    source: "constitution",
    article: article.ArtNo,
    title: article.Name
  }
});
  }

  console.log(
    `Constitution documents: ${documents.length}`
  );

  return documents;
}