/**
 * lib/types.ts
 * Shared TypeScript types for the application data model.
 */

export type Role = "viewer" | "author" | "admin"

export interface Post {
  id: string
  title: string
  content: string
  summary: string | null
  cover_image: string | null
  status: "draft" | "published"
  author_id: string
  author_name: string | null
  created_at: string
  updated_at?: string
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  author_name: string | null
  created_at: string
}

export interface UserRole {
  id: string
  role: Role
}
