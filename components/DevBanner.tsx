/**
 * DevBanner — shown on the /login page only in non-production environments.
 * Hides automatically in production to avoid leaking test credentials.
 */
"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const IS_PRODUCTION = process.env.NODE_ENV === "production"

export default function DevBanner() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only show on /login page and in non-production environments
  if (!mounted || IS_PRODUCTION || pathname !== "/login") return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm py-2 px-4 text-center">
      <p className="font-semibold">🛠 Development Mode</p>
      <p className="text-xs mt-0.5 text-amber-700">
        Admin credentials — Email: <strong>admin@superBlog.com</strong> | Password: <strong>admin123</strong>
      </p>
    </div>
  )
}
