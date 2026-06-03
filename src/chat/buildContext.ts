export function buildContext(
  results: any[]
) {
  return results
    .map(
      (r, i) =>
        `[Source ${i + 1}]
${r.content}`
    )
    .join("\n\n");
}