'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

export default function NotificationBanner({ message }: { message: string }) {
  const [visible, setVisible] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      // Clear the query parameter from the URL silently
      router.replace(pathname, { scroll: false })
    }, 2000)

    return () => clearTimeout(timer)
  }, [message, router, pathname])

  if (!visible) return null

  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-medium flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
      <span>{message}</span>
      <button 
        onClick={() => {
          setVisible(false)
          router.replace(pathname, { scroll: false })
        }}
        className="text-green-600 hover:text-green-800 p-1 rounded-md hover:bg-green-100 transition-colors"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}
