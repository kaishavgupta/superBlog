"use server"

import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

/**
 * Generates a concise AI summary for a blog post using Google Gemini.
 * Falls back gracefully if the API key is missing or the call fails.
 */
export async function generatePostSummary(content: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn("[AI] GEMINI_API_KEY is not set — skipping summary generation.")
    return "AI summary is unavailable. Please add a GEMINI_API_KEY to your environment."
  }

  if (!content.trim()) {
    return ""
  }

  // Token Reduction Strategy: 
  // Truncate input to the first 6000 characters (roughly 1000-1200 words).
  const optimizedContent = content.length > 6000 ? content.slice(0, 6000) + "..." : content

  const google = createGoogleGenerativeAI({ apiKey })
  const promptText = `Please summarize the following news/blog content using bullet points. Each bullet point MUST start with an arrow symbol (->). Ensure the final summary is approximately 200 words in total, capturing the most critical points concisely and engagingly.\n\nContent to summarize:\n${optimizedContent}`

  try {
    // Try primary highly-available model first (Gemini 2.5 Flash)
    // with 0 retries to prevent accidentally burning through Free Tier RPM limits
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: promptText,
      maxRetries: 0, 
    })
    return text
  } catch (error: any) {
    const errorMsg = error?.message || ""
    if (errorMsg.includes("Quota") || errorMsg.includes("limit") || errorMsg.includes("429")) {
      console.warn("[AI] Quota exceeded. User hit Free Tier API limits.")
      return "Failed to generate summary: Your Google Gemini API Free Tier limits have been exceeded. Please wait a minute and try again."
    }

    console.warn("[AI] Primary model failed. Falling back to gemini-flash-latest...")
    
    try {
      // Fallback to the latest default flash model
      const { text } = await generateText({
        model: google("gemini-flash-latest"),
        prompt: promptText,
        maxRetries: 0,
      })
      return text
    } catch (fallbackError: any) {
      console.error("[AI] Both primary and fallback models failed to generate summary:", fallbackError)
      const fallbackMsg = fallbackError?.message || ""
      if (fallbackMsg.includes("Quota") || fallbackMsg.includes("429")) {
        return "Failed to generate summary: Your Google Gemini API Free Tier limits have been exceeded. Please wait a minute and try again."
      }
      return "Failed to generate summary. The AI servers are currently experiencing issues. You can write one manually below."
    }
  }
}

