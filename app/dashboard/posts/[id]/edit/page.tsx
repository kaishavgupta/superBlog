import PostEditor from "@/components/PostEditor"
import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { deletePost } from "@/app/actions/post"

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", user.id)
    .single()
  const role = roleData?.role ?? "viewer"

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !post) notFound()

  // Only the author or an admin can edit this post
  if (role !== "admin" && post.author_id !== user.id) {
    redirect("/dashboard")
  }

  async function handleDelete() {
    "use server"
    await deletePost(id)
  }

  return (
    <div>
      <div
        className="flex justify-between items-center mb-8 pb-6"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <h1 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>
          Edit Post
        </h1>
        <form action={handleDelete}>
          <button
            type="submit"
            className="text-red-500 hover:text-red-600 font-bold px-4 py-2 rounded-xl border border-red-500/20 hover:bg-red-500/10 transition-all text-sm"
          >
            Delete Post
          </button>
        </form>
      </div>

      <PostEditor post={post} />
    </div>
  )
}
