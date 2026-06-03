import { bm25Search } from "./bm25Search";
import { vectorSearch } from "./vectorSearch";
// function preprocessQuery(
//   query: string
// ) {
//   const q = query.toLowerCase();

//   if (q.startsWith("article ")) {
//     return `${query} constitution`;
//   }

//   if (q.startsWith("section ")) {
//     return `${query} law`;
//   }

//   return query;
// }
export async function hybridSearch(
  query: string,
  limit = 10
) {
const processedQuery =query;

const vectorResults =
  await vectorSearch(
    processedQuery,
    5
  );

const bm25Results =
  await bm25Search(
    processedQuery,
    5
  );

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