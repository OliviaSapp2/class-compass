/**
 * Stack AI API Service
 * Handles communication with the Stack AI inference API
 */

export interface AnalysisQuery {
  query: string;
  userId?: string;
}

export interface AnalysisResponse {
  [key: string]: any;
}

const STACK_AI_API_URL = import.meta.env.VITE_STACK_AI_API_URL || 
  "https://api.stack-ai.com/inference/v0/run/9036f9f4-68a7-42a6-9fe7-2a86693b3c46/698657b86529f3880f2e7282";

const STACK_AI_API_KEY = import.meta.env.VITE_STACK_AI_API_KEY;

/**
 * Query the Stack AI analysis API
 * @param data - The analysis query data
 * @returns Promise resolving to the API response
 * @throws Error if API key is missing or request fails
 */
export async function queryAnalysis(data: AnalysisQuery): Promise<AnalysisResponse> {
  if (!STACK_AI_API_KEY) {
    throw new Error("Stack AI API key is not configured. Please set VITE_STACK_AI_API_KEY in your .env file.");
  }

  const response = await fetch(STACK_AI_API_URL, {
    headers: {
      'Authorization': `Bearer ${STACK_AI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      "in-0": data.query,
      "user_id": data.userId || ""
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorText}`);
  }

  const result = await response.json();
  return result;
}
