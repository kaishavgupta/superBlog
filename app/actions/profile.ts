"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

/**
 * Updates the authenticated user's display name in Supabase Auth metadata
 * and syncs the new name across all their posts and comments.
 */
export async function updateProfile(formData: FormData): Promise<never> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const displayName = (formData.get("displayName") as string)?.trim()
  if (!displayName) {
    throw new Error("Display name cannot be empty.")
  }

  // Update Supabase Auth user metadata
  const { error: authError } = await supabase.auth.updateUser({
    data: { display_name: displayName },
  })
  if (authError) {
    console.error("[updateProfile] Auth update error:", authError)
    throw new Error("Failed to update profile.")
  }

  // Sync author_name on all posts by this user
  const { error: postsError } = await supabase
    .from("posts")
    .update({ author_name: displayName })
    .eq("author_id", user.id)
  if (postsError) {
    console.error("[updateProfile] Posts sync error:", postsError)
  }

  // Sync author_name on all comments by this user
  const { error: commentsError } = await supabase
    .from("comments")
    .update({ author_name: displayName })
    .eq("user_id", user.id)
  if (commentsError) {
    console.error("[updateProfile] Comments sync error:", commentsError)
  }

  revalidatePath("/profile")
  revalidatePath("/")
  redirect("/profile?message=" + encodeURIComponent("Profile updated successfully!"))
}
