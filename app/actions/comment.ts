"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Adds a new comment to a post.
 * Uses the authenticated user's display_name as author_name.
 */
export async function addComment(postId: string, formData: FormData): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be logged in to comment.")
  }

  const content = (formData.get("content") as string)?.trim()
  if (!content) {
    throw new Error("Comment content cannot be empty.")
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    content,
    author_name: user.user_metadata?.display_name ?? null,
  })

  if (error) {
    console.error("[addComment] Supabase error:", error)
    throw new Error("Failed to post comment. Please try again.")
  }

  revalidatePath(`/post/${postId}`)
}

/**
 * Deletes a comment by ID.
 * Only the comment owner or an admin should call this (enforced by RLS on Supabase side).
 */
export async function deleteComment(commentId: string, postId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("comments").delete().eq("id", commentId)

  if (error) {
    console.error("[deleteComment] Supabase error:", error)
    throw new Error("Failed to delete comment.")
  }

  revalidatePath(`/post/${postId}`)
}
