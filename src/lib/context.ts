import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index("chat-pdf");
    // const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    const queryResult = await pineconeIndex
      .namespace(convertToAscii(fileKey))
      .query({
        vector: embeddings,
        topK: 10,
        includeMetadata: true,
      });
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  console.log(query);
  const queryEmbeddings = await getEmbeddings(query);
  var emb: number[] = [];
  queryEmbeddings.data.map((v: number) => emb.push(v));
  console.log(emb);
  const matches = await getMatchesFromEmbeddings(emb, fileKey);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.007
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  // 5 vectors
  return docs.join("\n").substring(0, 3000);
}
