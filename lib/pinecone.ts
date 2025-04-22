//lib/pinecone.ts
import { Pinecone } from "@pinecone-database/pinecone";
import { db } from "./database/db";

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
    const embedding = await getEmbedding(query);
    const index = pinecone.Index(INDEX_NAME);
    
    const queryResult = await index.query({
      vector: embedding,
      topK,
      includeMetadata: true,
    });

    const rawMatches = queryResult.matches || [];
    if (rawMatches.length === 0) {
      return "No job matches found in Pinecone.";
    }

    // Get URLs from Pinecone matches with type safety
    const jobUrls = rawMatches
      .map(match => match.metadata?.url)
      .filter((url): url is string => typeof url === 'string' && url.length > 0);

    if (jobUrls.length === 0) {
      return "No valid job URLs found.";
    }

    // Fetch full job data from database
    const fullJobsData = await db
      .selectFrom('raw_jobs')
      .select(['raw_data', 'title', 'company', 'location', 'description', 'source_site'])
      .where('job_url', 'in', jobUrls as [string, ...string[]])
      .execute();

    return JSON.stringify({
      matches: fullJobsData.map(job => ({
        ...job,
        raw_data: typeof job.raw_data === 'string' ? JSON.parse(job.raw_data) : job.raw_data
      }))
    }, null, 2);

  } catch (error) {
    console.error("Error querying jobs:", error);
    return "Error fetching job recommendations.";
  }
}

// Helper to fetch embedding from Python API
async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/encode/text`, {
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