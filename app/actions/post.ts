"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { generatePostSummary } from "./ai"

/**
 * Creates a new post and optionally attaches an AI-generated summary.
 * The author_name is captured from the user's profile at write time.
 */
export async function createPost(formData: FormData): Promise<{ success: true; id: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const title = (formData.get("title") as string)?.trim()
  const content = (formData.get("content") as string)?.trim()
  const status = formData.get("status") as string
  const summary = (formData.get("summary") as string)?.trim() || null
  const cover_image = (formData.get("cover_image") as string)?.trim() || null
  const author_name =
    (user.user_metadata?.display_name as string) ||
    user.email?.split("@")[0] ||
    "Anonymous"

  if (!title || !content || !status) {
    throw new Error("Title, content, and status are required.")
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ title, content, status, summary, cover_image, author_id: user.id, author_name })
    .select("id")
    .single()

  if (error) {
    console.error("[createPost] Supabase error:", error)
    throw new Error("Failed to create post.")
  }

  revalidatePath("/")
  revalidatePath("/dashboard")
  return { success: true, id: data.id }
}

/**
 * Updates an existing post's fields.
 * Does not change author_id or author_name (those stay as originally set).
 */
export async function updatePost(postId: string, formData: FormData): Promise<{ success: true }> {
  const supabase = await createClient()

  const title = (formData.get("title") as string)?.trim()
  const content = (formData.get("content") as string)?.trim()
  const status = formData.get("status") as string
  const summary = (formData.get("summary") as string)?.trim() || null
  const cover_image = (formData.get("cover_image") as string)?.trim() || null

  if (!title || !content || !status) {
    throw new Error("Title, content, and status are required.")
  }

  const { error } = await supabase
    .from("posts")
    .update({ title, content, status, summary, cover_image })
    .eq("id", postId)

  if (error) {
    console.error("[updatePost] Supabase error:", error)
    throw new Error("Failed to update post.")
  }

  revalidatePath("/")
  revalidatePath("/dashboard")
  revalidatePath(`/post/${postId}`)
  return { success: true }
}

/**
 * Deletes a post by ID. Redirects to the dashboard with a success message.
 * Supabase RLS ensures only the owner or admin can delete.
 */
export async function deletePost(postId: string): Promise<never> {
  const supabase = await createClient()

  const { error } = await supabase.from("posts").delete().eq("id", postId)

  if (error) {
    console.error("[deletePost] Supabase error:", error)
    throw new Error("Failed to delete post.")
  }

  revalidatePath("/")
  revalidatePath("/dashboard")
  redirect(
    "/dashboard?message=" + encodeURIComponent("Your post has been successfully deleted.")
  )
}
