import { HfInference } from "@huggingface/inference";
import "dotenv/config";

// Initialize the client using your token
const hf = new HfInference(process.env.HF_TOKEN);

export async function embedQuery(query: string): Promise<number[]> {
  if (!process.env.HF_TOKEN) {
    throw new Error("Missing HF_TOKEN environment variable.");
  }

  try {
    // The SDK manages the correct endpoint URL and headers automatically
    const result = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: query,
    });

    // Ensure the structure is flattened into a 1D number array for Qdrant
    const embedding = Array.isArray(result) ? result.flat(2) : result;

    // Type guard validation
    if (!Array.isArray(embedding) || typeof embedding[0] !== "number") {
      throw new Error("Received an unexpected non-numeric payload from Hugging Face.");
    }

    return embedding as number[];
  } catch (error: any) {
    throw new Error(`Hugging Face SDK Inference Failed: ${error.message}`);
  }
}
