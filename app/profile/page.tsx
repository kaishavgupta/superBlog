import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { updateProfile } from '@/app/actions/profile'

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const resolvedParams = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const displayName = user.user_metadata?.display_name || ''

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div
        className="rounded-3xl p-8"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white text-2xl font-black">
            {(displayName || user.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Your Profile</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
          </div>
        </div>

        {/* Success message */}
        {resolvedParams?.message && (
          <div className="mb-6 p-4 rounded-2xl text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            {resolvedParams.message}
          </div>
        )}

        {/* Form */}
        <form action={updateProfile} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="displayName" className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Display Name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              defaultValue={displayName}
              placeholder="What should we call you?"
              required
              className="rounded-2xl border-2 px-5 py-3.5 outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 transition-all text-base font-medium"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              This name appears on all your posts and comments — including past ones.
            </p>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  )
}
