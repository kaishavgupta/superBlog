"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import type { Role } from "@/lib/types"

/**
 * Signs in an existing user with email + password.
 * Redirects authors/admins to the dashboard, viewers to the home page.
 */
export async function login(formData: FormData): Promise<never> {
  const supabase = await createClient()

  const email = (formData.get("email") as string)?.trim()
  const password = formData.get("password") as string

  if (!email || !password) {
    redirect("/login?message=" + encodeURIComponent("Email and password are required."))
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !user) {
    redirect("/login?message=" + encodeURIComponent(error?.message ?? "Sign in failed."))
  }

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", user.id)
    .single()

  const role = (roleData?.role as Role) ?? "viewer"

  revalidatePath("/", "layout")

  if (role === "admin" || role === "author") {
    redirect("/dashboard")
  }
  redirect("/")
}

/**
 * Creates a new user account.
 * Redirects to the dashboard upon successful registration.
 */
export async function signup(formData: FormData): Promise<never> {
  const supabase = await createClient()

  const email = (formData.get("email") as string)?.trim()
  const password = formData.get("password") as string
  const role = (formData.get("role") as Role) || "viewer"

  if (!email || !password) {
    redirect("/login?message=" + encodeURIComponent("Email and password are required."))
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role } },
  })

  if (error) {
    redirect("/login?message=" + encodeURIComponent(error.message))
  }

  // Email confirmation required
  if (!authData.session) {
    redirect("/login?message=" + encodeURIComponent("Check your email for a confirmation link."))
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

/**
 * Signs out the current user and redirects to the login page.
 */
export async function logout(): Promise<never> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
