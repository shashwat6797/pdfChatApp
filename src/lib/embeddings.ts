import { pipeline,env } from "@xenova/transformers";

env.allowLocalModels = false;   

export async function getEmbeddings(text: string) {
  try {
    const extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
    );
    const result = await extractor("reached", {
      pooling: "mean",
      normalize: true,
    });
    return result;
  } catch (error) {
    console.log("error calling openai embeddings api" + error);
    throw error;
  }
}
