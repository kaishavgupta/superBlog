import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { LogOut } from 'lucide-react'
import { logout } from '@/app/login/actions'
import DevBanner from './DevBanner'
import ThemeToggle from './ThemeToggle'

export default async function Navbar() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userRole = null
  
  if (user) {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('id', user.id)
      .single()
      
    userRole = roleData?.role || 'viewer'
  }

  return (
    <>
      <DevBanner />
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 85%, transparent)',
          borderColor: 'var(--border)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight flex items-center gap-0.5" style={{ color: 'var(--text-primary)' }}>
            Super<span className="text-blue-500">Blog</span><span className="text-blue-500">.</span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {userRole === 'admin' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Admin
                  </span>
                )}
                {userRole === 'author' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    Writer
                  </span>
                )}
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Profile
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-bold bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
              >
                Sign In
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </>
  )
}
