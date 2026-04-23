import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import CommentForm from '@/components/CommentForm'
import DeleteCommentButton from '@/components/DeleteCommentButton'
import { Sparkles } from 'lucide-react'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  let userRole = 'viewer'
  if (user) {
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single()
    if (roleData) userRole = roleData.role
  }

  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (postError || !post) notFound()

  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', resolvedParams.id)
    .order('created_at', { ascending: true })

  return (
    <div
      className="max-w-4xl mx-auto w-full py-14 px-8 sm:px-14 flex flex-col gap-12 rounded-[2.5rem] my-10"
      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* ── Header ── */}
      <header className="flex flex-col gap-5 pb-10" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex justify-between items-start gap-6">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-[1.1]" style={{ color: 'var(--text-primary)' }}>
            {post.title}
          </h1>
          {(userRole === 'admin' || user?.id === post.author_id) && (
            <a
              href={`/dashboard/posts/${post.id}/edit`}
              className="shrink-0 bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              Edit Post
            </a>
          )}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Author chip */}
          {post.author_name && (
            <div
              className="flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-bold"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-black">
                {post.author_name.charAt(0).toUpperCase()}
              </div>
              {post.author_name}
            </div>
          )}
          <time
            dateTime={post.created_at}
            className="text-sm font-semibold flex items-center gap-2"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </time>
          {post.status === 'draft' && (
            <span className="bg-amber-500/15 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
              Draft · Private
            </span>
          )}
        </div>
      </header>

      {/* ── Cover Image ── */}
      {post.cover_image && (
        <div className="w-full aspect-[21/9] relative rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <img src={post.cover_image} alt="Cover" className="w-full h-full object-cover" />
        </div>
      )}

      {/* ── AI Summary ── */}
      {post.summary && (
        <div
          className="rounded-2xl p-7 relative overflow-hidden"
          style={{ backgroundColor: 'color-mix(in srgb, #d97706 8%, var(--bg-primary))', border: '1px solid color-mix(in srgb, #d97706 25%, transparent)' }}
        >
          <div className="absolute top-3 right-4 opacity-10">
            <Sparkles className="w-20 h-20 text-amber-500" />
          </div>
          <div className="flex items-center gap-2 text-amber-500 font-black mb-3 text-sm uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            AI Summary
          </div>
          <div className="relative z-10 text-base font-medium space-y-3" style={{ color: 'var(--text-primary)' }}>
            {post.summary.split('\n').map((line: string, idx: number) => {
              const trimmed = line.trim()
              if (!trimmed) return null
              return <p key={idx} className="leading-relaxed">{trimmed}</p>
            })}
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <article className="pb-12" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="whitespace-pre-wrap font-serif text-xl leading-[1.9] tracking-wide" style={{ color: 'var(--text-primary)' }}>
          {post.content}
        </div>
      </article>

      {/* ── Comments ── */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Discussion</h2>
          <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-4 py-1.5 rounded-full font-bold text-sm">
            {comments?.length || 0} Comments
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {comments?.map((comment) => {
            const canDelete = user?.id === comment.user_id
            const isAuthor = comment.user_id === post.author_id
            const displayName = comment.author_name || (isAuthor ? 'Author' : 'Reader')
            const avatarInitial = displayName.charAt(0).toUpperCase()
            const hue = parseInt(comment.user_id.substring(0, 8), 16) % 360

            return (
              <div
                key={comment.id}
                className="p-5 rounded-2xl flex flex-col gap-3 relative group transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: isAuthor
                    ? 'color-mix(in srgb, #3b82f6 8%, var(--bg-primary))'
                    : 'var(--bg-tertiary)',
                  border: `1px solid ${isAuthor ? 'color-mix(in srgb, #3b82f6 25%, transparent)' : 'var(--border)'}`,
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-base"
                      style={{ background: isAuthor ? '#3b82f6' : `hsl(${hue}, 65%, 50%)` }}
                    >
                      {avatarInitial}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{displayName}</span>
                        {isAuthor && (
                          <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Creator
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  {canDelete && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DeleteCommentButton commentId={comment.id} postId={post.id} />
                    </div>
                  )}
                </div>
                <p className="pl-13 text-base leading-relaxed font-medium" style={{ color: 'var(--text-primary)', paddingLeft: '52px' }}>
                  {comment.content}
                </p>
              </div>
            )
          })}

          {(!comments || comments.length === 0) && (
            <div
              className="text-center py-10 rounded-2xl border-2 border-dashed"
              style={{ borderColor: 'var(--border)' }}
            >
              <p className="font-medium" style={{ color: 'var(--text-muted)' }}>No comments yet. Be the first to start the discussion!</p>
            </div>
          )}
        </div>

        {/* Comment form / CTA */}
        <div>
          {user ? (
            user.id === post.author_id ? (
              <div
                className="rounded-2xl p-7 text-center"
                style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
              >
                <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>As the author, you can view the discussion here.</p>
              </div>
            ) : (
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
              >
                <CommentForm postId={post.id} />
              </div>
            )
          ) : (
            <div
              className="rounded-2xl p-8 text-center"
              style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
            >
              <p className="mb-5 font-medium" style={{ color: 'var(--text-secondary)' }}>Sign in to join the discussion.</p>
              <a
                href="/login"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                Sign In to Comment
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
