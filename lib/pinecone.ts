//lib/pinecone.ts
import { Pinecone } from "@pinecone-database/pinecone";

// Define metadata interface matching your Pinecone data
interface JobMetadata {
  title?: string;
  company?: string;
  location?: string;
  url?: string;
}

// Define the match type explicitly
interface PineconeMatch {
  id: string;
  score: number;
  metadata?: Record<string, any>; // Flexible to handle Pinecone's metadata
}

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const INDEX_NAME = process.env.PINECONE_INDEX || "job-embeddings";

export async function getPineconeContext(query: string, topK: number = 15, minScore: number = 0.3): Promise<string> {
  try {
    // Generate embedding for the query
    const embedding = await getEmbedding(query);
    
    // Get Pinecone index
    const index = pinecone.Index(INDEX_NAME);
    
    // Query Pinecone with explicit typing
    const queryResult = await index.query({
      vector: embedding,
      topK,
      includeMetadata: true,
    });

    console.log("PINECONE QUERY RESULTS", JSON.stringify(queryResult, null, 2));

    // Ensure matches exist and log raw data
    const rawMatches = queryResult.matches || [];
    if (rawMatches.length === 0) {
      return "No job matches found in Pinecone.";
    } else {
      return JSON.stringify(queryResult, null, 2);
    }


  } catch (error) {
    console.error("Error querying Pinecone:", error);
    return "Error fetching job recommendations.";
  }
}

// Helper to fetch embedding from Python API
async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch(process.env.EMBEDDING_API_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate embedding: ${errorText}`);
  }
  const { embedding } = await response.json();
  return embedding;
}