import "dotenv/config";

import fs from "fs/promises";
import path from "path";

import { pipeline } from "@xenova/transformers";
import { QdrantClient } from "@qdrant/js-client-rest";

const COLLECTION = "legal_documents";

async function main() {
  const client = new QdrantClient({
    url: process.env.QDRANT_URL!,
    apiKey: process.env.QDRANT_API_KEY!,
  });

  const embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );

  const chunksPath = path.join(
    process.cwd(),
    "output",
    "chunks.json"
  );

  const chunks = JSON.parse(
    await fs.readFile(chunksPath, "utf8")
  );

  console.log(
    `Loaded ${chunks.length} chunks`
  );

  try {
    await client.deleteCollection(
      COLLECTION
    );
  } catch {}

  await client.createCollection(
    COLLECTION,
    {
      vectors: {
        size: 384,
        distance: "Cosine",
      },
    }
  );

  const batchSize = 100;

  for (
    let i = 0;
    i < chunks.length;
    i += batchSize
  ) {
    const batch = chunks.slice(
      i,
      i + batchSize
    );

    const points = [];

    for (let j = 0; j < batch.length; j++) {
      const chunk = batch[j];

      const output = await embedder(
        chunk.content,
        {
          pooling: "mean",
          normalize: true,
        }
      );

      points.push({
        id: i + j + 1,
        vector: Array.from(
          output.data
        ),
        payload: {
          content: chunk.content,
          ...chunk.metadata,
        },
      });
    }

    await client.upsert(
      COLLECTION,
      {
        wait: true,
        points,
      }
    );

    console.log(
      `${Math.min(
        i + batchSize,
        chunks.length
      )}/${chunks.length}`
    );
  }

  console.log(
    "Embedding complete"
  );
}

main().catch(console.error);