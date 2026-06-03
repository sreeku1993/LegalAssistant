import { ingestAnnotatedActs } from "../ingest/adapters/annotatedActs";
import { ingestConstitution } from "../ingest/adapters/constitution";
import { ingestIndianLaw } from "../ingest/adapters/indianLawRepo";
import { saveDocuments } from "../ingest/saveDocuments";

async function main() {
  const documents =
    await ingestAnnotatedActs();

  const constitution =
    await ingestConstitution();

  const indianLaw =
    await ingestIndianLaw();

  documents.push(
    ...constitution,
    ...indianLaw
  );

  console.log(
    `Loaded ${documents.length} documents`
  );

  await saveDocuments(documents);
}

main().catch(console.error);