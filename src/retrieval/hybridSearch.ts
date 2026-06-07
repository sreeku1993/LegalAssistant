import { bm25Search } from "./bm25Search";
import { vectorSearch } from "./vectorSearch";
import { traceable } from "langsmith/traceable";
export const tracedBm25Search =
  traceable(
    bm25Search,
    {
      name: "bm25-search"
    }
  );
  export const tracedVectorSearch =
  traceable(
    vectorSearch,
    {
      name: "vector-search"
    }
  );

export async function hybridSearch(
  query: string,
  limit = 10
) {
const processedQuery = query;

const vectorResults =
  await tracedVectorSearch(
    processedQuery,
    5
  );

const bm25Results =
  await tracedBm25Search(
    processedQuery,
    5
  );
const q = query.toLowerCase();

if (
  q.includes("article ") ||
  q.includes("section ") ||
  q.includes("ipc ") ||
  q.includes("bns ") ||
  q.includes("crpc ") ||
  q.includes("bnss ")
) {
  return bm25Results;
}
  const fused = new Map<
    string,
    any
  >();

  const K = 60;

  bm25Results.forEach(
    (doc: any, rank: number) => {
      const key =
        JSON.stringify(doc.payload);

      fused.set(key, {
        ...doc,
        rrfScore:
          1 / (K + rank + 1),
      });
    }
  );

  vectorResults.forEach(
    (doc, rank) => {
      const key =
        JSON.stringify(doc.payload);

      if (fused.has(key)) {
        fused.get(key).rrfScore +=
          1 / (K + rank + 1);
      } else {
        fused.set(key, {
          ...doc,
          rrfScore:
            1 / (K + rank + 1),
        });
      }
    }
  );

  return [...fused.values()]
    .sort(
      (a, b) =>
        b.rrfScore -
        a.rrfScore
    )
    .slice(0, limit);
}