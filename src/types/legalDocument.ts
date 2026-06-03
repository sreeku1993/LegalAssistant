export interface LegalDocument {
  content: string;

  metadata: {
    source: string;

    act?: string;

    part?: string;

    chapter?: string;

    chapterTitle?: string;

    section?: string;

    article?: string;

    heading?: string;

    chunk?: number;

    totalChunks?: number;
  };
}