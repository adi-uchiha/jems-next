import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const INDEX_NAME = process.env.PINECONE_INDEX || "job-embeddings";

export async function getPineconeContext(query: string, topK: number = 3, minScore: number = 0.7): Promise<string> {
  // Generate embedding for the query
  const embedding = await getEmbedding(query);
  
  // Get Pinecone index
  const index = pinecone.Index(INDEX_NAME);

  // Query Pinecone
  const queryResult = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });

  // Filter matches by score and extract context
  const matches = queryResult.matches
    .filter((match) => match.score && match.score > minScore)
    .map((match) => {
      const metadata = match.metadata as { title?: string; company?: string; location?: string; url?: string };
      return `Title: ${metadata.title || "Unknown"}\nCompany: ${metadata.company || "Unknown"}\nLocation: ${metadata.location || "Unknown"}\nURL: ${metadata.url || "N/A"}`;
    });

  return matches.length > 0 ? matches.join("\n\n") : "No relevant context found.";
}

// Helper to fetch embedding from Python API
async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch(process.env.EMBEDDING_API_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) throw new Error("Failed to generate embedding");
  const { embedding } = await response.json();
  return embedding;
}