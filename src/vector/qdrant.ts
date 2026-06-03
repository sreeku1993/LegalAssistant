import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config({
  path: ".env.local"
});

import {
  QdrantClient
} from "@qdrant/js-client-rest";

const COLLECTION =
  "legal-rag";

export const client =
  new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    checkCompatibility: false
  });

export async function getCollection() {

  try {

    await client.getCollection(
      COLLECTION
    );

  } catch {

    await client.createCollection(
      COLLECTION,
      {
        vectors: {
          size: 384,
          distance: "Cosine"
        }
      }
    );

  }

}
export async function addDocuments(
  docs: {
    pageContent: string;
    metadata: any;
    embedding: number[];
  }[]
) {

  await getCollection();

  await client.upsert(
    COLLECTION,
    {
      points: docs.map(
        doc => ({
          id:
            crypto.randomUUID(),

          vector:
            doc.embedding,

          payload: {

            text:
              doc.pageContent,

            ...doc.metadata

          }
        })
      )
    }
  );

}
export async function searchDocuments(
  embedding: number[],
  query = "",
  limit = 5
) {

  const results =
    await client.search(
      COLLECTION,
      {
        vector: embedding,
        limit,
        with_payload: true
      }
    );

  return results.map(
    r => ({
      score: r.score,
      item: {
        metadata: r.payload
      }
    })
  );

}