/**
 * lib/env.ts
 * Single source of truth for all environment variables.
 * Throws at startup if required server-side variables are missing.
 */

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

// ── Server-side (never exposed to client) ──────────────────────────────────
export const env = {
  geminiApiKey: requireEnv("GEMINI_API_KEY"),
} as const

// ── Client-safe (NEXT_PUBLIC_ prefix) ─────────────────────────────────────
export const publicEnv = {
  supabaseUrl: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "SuperBlog",
} as const
