import { QdrantClient } from "@qdrant/js-client-rest";

import { embedQuery } from "../embeddings/embedQuery";
import "dotenv/config";
const COLLECTION =
  process.env.QDRANT_COLLECTION!;

const client = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
});

export async function vectorSearch(
  query: string,
  limit = 20
) {

const embedding =
  await embedQuery(query);

const results =
  await client.search(
    COLLECTION,
    {
      vector: embedding,
      limit: 20,
    }
  );


  return results.map(
    (result: any) => ({
      score: result.score,
      payload: result.payload,
      content:
        result.payload?.content ??
        "",
    })
  );
}