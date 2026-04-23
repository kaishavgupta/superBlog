import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { LayoutDashboard, PenTool } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  let userRole = 'viewer'
  
  if (user) {
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single()
    if (roleData) userRole = roleData.role
  }

  const canCreatePost = userRole === 'author'

  return (
    <div className="flex flex-col md:flex-row gap-6 py-8 w-full">
      {/* Sidebar */}
      <aside className="w-full md:w-56 shrink-0">
        <div
          className="p-4 rounded-2xl sticky top-24"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
          <p className="text-[10px] font-black uppercase tracking-widest mb-3 px-2" style={{ color: 'var(--text-muted)' }}>Navigation</p>
          <nav className="flex flex-col gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors"
              style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-tertiary)' }}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-500" />
              Overview
            </Link>

            {canCreatePost && (
              <Link
                href="/dashboard/posts/create"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                <PenTool className="w-4 h-4 text-violet-500" />
                Write a Post
              </Link>
            )}
          </nav>

          <div className="mt-6 pt-4 px-2" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Your Role</p>
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize bg-blue-500/10 text-blue-500 border border-blue-500/20"
            >
              {userRole}
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className="flex-1 p-6 md:p-8 rounded-2xl min-h-[500px]"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
      >
        {children}
      </main>
    </div>
  )
}
