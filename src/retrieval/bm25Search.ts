import fs from "fs/promises";
import path from "path";

import BM25 from "wink-bm25-text-search";
import * as nlp from "wink-nlp-utils";

let bm25: any = null;
let documents: any[] = [];

export async function initializeBM25() {
  if (bm25) return;

  const chunksPath = path.join(
    process.cwd(),
    "output",
    "chunks.json"
  );

  documents = JSON.parse(
    await fs.readFile(chunksPath, "utf8")
  );

  bm25 = BM25();

  bm25.defineConfig({
    fldWeights: {
      content: 1
    },
    bm25Params: {
      k1: 1.2,
      b: 0.75
    }
  });

  bm25.definePrepTasks([
    nlp.string.lowerCase,
    nlp.string.tokenize0,
    nlp.tokens.removeWords
  ]);

  documents.forEach(
    (doc: any, index: number) => {
        const searchableText = [
  doc.metadata.article
    ? `Article ${doc.metadata.article}`
    : "",

  doc.metadata.section
    ? `Section ${doc.metadata.section}`
    : "",

  doc.metadata.heading ?? "",
  doc.metadata.title ?? "",
  doc.metadata.act ?? "",

  doc.content
].join(" ");
      bm25.addDoc(
  {
    content: searchableText
  },
  index
);
    }
  );

  bm25.consolidate();

  console.log(
    `BM25 indexed ${documents.length} chunks`
  );
}

export async function bm25Search(
  query: string,
  limit = 20
) {
  await initializeBM25();

  const results =
    bm25.search(query);

  


  return results
    .slice(0, limit)
    .map((r: any) => ({
      score: r[1],
      payload:
        documents[r[0]].metadata,
      content:
        documents[r[0]].content
    }));
}