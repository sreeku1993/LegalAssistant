// src/types/legal.ts

export interface LegalChunk {
  content: string;

  metadata: {
    documentName: string;

    section: string;

    part: number;

    totalParts: number;
  };
}