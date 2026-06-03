import { LegalDocument } from "../types/legalDocument";

export interface Chunk {
  content: string;

  metadata: Record<string, any>;
}

export function chunkDocuments(
  docs: LegalDocument[]
): Chunk[] {
  return docs.map((doc) => ({
    content: doc.content,
    metadata: doc.metadata,
  }));
}