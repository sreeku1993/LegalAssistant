import { pipeline } from "@xenova/transformers";

let embedder: any;

export async function embedQuery(
  query: string
) {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }

  const output = await embedder(
    query,
    {
      pooling: "mean",
      normalize: true,
    }
  );

  return Array.from(
  output.data
) as number[];
}