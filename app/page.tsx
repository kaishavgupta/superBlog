import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Search, ChevronLeft, ChevronRight, ArrowRight, Sparkles, TrendingUp } from 'lucide-react'

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string; page?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.query || ''
  const page = parseInt(resolvedParams?.page || '1', 10)
  const pageSize = 6
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const supabase = await createClient()

  let dbQuery = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (query) {
    dbQuery = dbQuery.ilike('title', `%${query}%`)
  }

  const { data: posts, count, error } = await dbQuery

  if (error) console.error('Error fetching posts:', error)

  const totalPages = count ? Math.ceil(count / pageSize) : 1
  const hues = [221, 262, 189, 334, 28, 142]

  return (
    <div className="flex flex-col gap-14 py-10">

      {/* ── Hero ── */}
      {!query && page === 1 && (
        <section className="relative text-center flex flex-col items-center gap-7 py-16 rounded-[2.5rem] overflow-hidden"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
          {/* Glow blobs */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border"
            style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            <TrendingUp className="w-3 h-3 text-blue-500" />
            <span>Fresh ideas, every day</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] max-w-3xl" style={{ color: 'var(--text-primary)' }}>
            Stories That
            <span className="block bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
              Inspire &amp; Inform
            </span>
          </h1>

          <p className="text-lg max-w-md leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Discover insights from an amazing community of writers — all in one beautiful place.
          </p>

          {/* Search */}
          <form method="GET" action="/" className="w-full max-w-lg mt-2 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              name="query"
              defaultValue={query}
              placeholder="Search articles..."
              className="w-full pl-14 pr-36 py-4 rounded-2xl border-2 outline-none text-base font-medium transition-all"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95 text-sm"
            >
              Search
            </button>
          </form>
        </section>
      )}

      {/* ── Query search result header ── */}
      {query && (
        <div className="flex items-center justify-between">
          <p className="text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
            Results for <span className="font-bold" style={{ color: 'var(--text-primary)' }}>"{query}"</span>
            {count !== null && (
              <span className="ml-2 text-sm bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-bold">
                {count} found
              </span>
            )}
          </p>
          <Link href="/" className="text-sm text-blue-500 font-bold hover:underline">Clear search</Link>
        </div>
      )}

      {/* ── Section divider ── */}
      <div className="flex items-center gap-3 -mt-6">
        <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, var(--border), transparent)' }} />
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          {query ? 'Results' : 'Latest Stories'}
        </div>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, var(--border), transparent)' }} />
      </div>

      {/* ── Post Grid ── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 -mt-6">
        {posts?.map((post, i) => {
          const hue = hues[i % hues.length]
          const authorInitial = (post.author_name || 'A').charAt(0).toUpperCase()
          return (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="group relative flex flex-col justify-between rounded-3xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, hsl(${hue},70%,55%), hsl(${hue+35},70%,60%))` }}
              />

              <div className="flex flex-col gap-4">
                {/* Author row */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, hsl(${hue},65%,55%), hsl(${hue+30},65%,50%))` }}
                  >
                    {authorInitial}
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
                      {post.author_name || 'Anonymous'}
                    </p>
                    <time className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </time>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold leading-snug line-clamp-2 transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {post.title}
                </h2>

                {/* Excerpt */}
                {post.summary && (
                  <p className="text-sm line-clamp-3 leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                    {post.summary}
                  </p>
                )}
              </div>

              {/* Read more CTA */}
              <div
                className="mt-5 flex items-center gap-1.5 text-sm font-bold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                style={{ color: `hsl(${hue}, 65%, 55%)` }}
              >
                Read article <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          )
        })}

        {(!posts || posts.length === 0) && (
          <div
            className="col-span-full text-center py-24 rounded-3xl border-2 border-dashed"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <Search className="w-7 h-7" style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>No stories found</h3>
            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Try a different search or check back later.</p>
            {query && (
              <Link href="/" className="inline-block mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-colors text-sm">
                Browse all stories
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          {page > 1 ? (
            <Link
              href={`/?page=${page - 1}${query ? `&query=${encodeURIComponent(query)}` : ''}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm border transition-all hover:border-blue-500 hover:text-blue-500"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Link>
          ) : (
            <span className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm border cursor-not-allowed opacity-40"
              style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <ChevronLeft className="w-4 h-4" /> Previous
            </span>
          )}
          <span className="font-bold text-sm px-3" style={{ color: 'var(--text-muted)' }}>{page} / {totalPages}</span>
          {page < totalPages ? (
            <Link
              href={`/?page=${page + 1}${query ? `&query=${encodeURIComponent(query)}` : ''}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm border transition-all hover:border-blue-500 hover:text-blue-500"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              Next <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm border cursor-not-allowed opacity-40"
              style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              Next <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      )}
    </div>
  )
}
