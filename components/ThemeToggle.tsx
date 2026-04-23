'use client'

import { useTheme } from './ThemeProvider'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { toggle } = useTheme()
  const [isDark, setIsDark] = useState(false)

  // Read directly from the DOM so the icon is always correct
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()

    // Watch for class changes
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark/light mode"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:scale-110 active:scale-90"
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        borderColor: 'var(--border)',
        color: 'var(--text-secondary)',
      }}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  )
}
