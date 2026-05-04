/**
 * DevBanner — shown on the /login page.
 * Displays testing credentials.
 */
"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function DevBanner() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only show on /login page
  if (!mounted || pathname !== "/login") return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm py-2 px-4 text-center">
      <p className="font-semibold">🛠 Testing Mode</p>
      <p className="text-xs mt-0.5 text-amber-700">
        Admin credentials — Email: <strong>admin@superBlog.com</strong> | Password: <strong>admin123</strong>
      </p>
    </div>
  )
}
