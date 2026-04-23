import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Edit3, FileText, CheckCircle2, MessageSquare, User as UserIcon } from 'lucide-react'
import NotificationBanner from '@/components/NotificationBanner'

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const resolvedParams = await searchParams;
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single()
  const role = roleData?.role || 'viewer'
  const displayName = user.user_metadata?.display_name || user.email

  let query = supabase.from('posts').select('*').order('created_at', { ascending: false })
  if (role === 'author' || role === 'viewer') {
    query = query.eq('author_id', user.id)
  }
  const { data: posts } = await query

  let commentsData: any[] = [];
  if (role === 'admin') {
    const { data } = await supabase.from('comments').select('id, content, created_at, posts(id, title)').order('created_at', { ascending: false });
    commentsData = data || [];
  } else if (role === 'author') {
    const postIds = posts?.map(p => p.id) || [];
    let cQuery = supabase.from('comments').select('id, content, created_at, posts(id, title)').order('created_at', { ascending: false });
    if (postIds.length > 0) {
      cQuery = cQuery.or(`user_id.eq.${user.id},post_id.in.(${postIds.join(',')})`);
    } else {
      cQuery = cQuery.eq('user_id', user.id);
    }
    const { data } = await cQuery;
    commentsData = data || [];
  } else {
    const { data } = await supabase.from('comments').select('id, content, created_at, posts(id, title)').eq('user_id', user.id).order('created_at', { ascending: false });
    commentsData = data || [];
  }
  const comments = commentsData;

  return (
    <div className="flex flex-col gap-10">
      {resolvedParams?.message && <NotificationBanner message={resolvedParams.message} />}

      {/* Profile card */}
      <div
        className="flex items-center gap-5 p-6 rounded-2xl"
        style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
          {displayName?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-black truncate" style={{ color: 'var(--text-primary)' }}>{displayName}</h2>
          <p className="text-sm mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
            {user.email} · <span className="capitalize">{role}</span>
          </p>
          <Link href="/profile" className="text-xs font-bold text-blue-500 hover:text-blue-400 mt-1 inline-block">
            Edit Profile →
          </Link>
        </div>
      </div>

      {/* Posts section */}
      {(role === 'author' || role === 'admin') && (
        <div>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{role === 'admin' ? 'All Posts' : 'Your Posts'}</h2>
            {role === 'author' && (
              <Link
                href="/dashboard/posts/create"
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
              >
                + New Post
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {posts?.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 rounded-xl transition-all"
                style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <Link href={`/post/${post.id}`} className="text-base font-bold truncate hover:text-blue-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1">
                      {post.status === 'published'
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        : <FileText className="w-3.5 h-3.5 text-amber-500" />}
                      <span className="capitalize font-semibold">{post.status}</span>
                    </span>
                    <span>·</span>
                    <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                {(role === 'admin' || post.author_id === user.id) && (
                  <Link href={`/dashboard/posts/${post.id}/edit`}
                    className="p-2 rounded-lg transition-colors hover:text-blue-500"
                    style={{ color: 'var(--text-muted)' }}>
                    <Edit3 className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}

            {(!posts || posts.length === 0) && (
              <div className="text-center py-14 rounded-2xl border-2 border-dashed" style={{ borderColor: 'var(--border)' }}>
                <FileText className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>No posts yet. Start writing!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comments section */}
      <div>
        <h2 className="text-xl font-black mb-5" style={{ color: 'var(--text-primary)' }}>
          {role === 'admin' ? 'All Recent Comments' : role === 'author' ? 'Comments on your posts & Your Comments' : 'Your Comments'}
        </h2>
        <div className="flex flex-col gap-3">
          {comments?.map((comment) => {
            const post = Array.isArray(comment.posts) ? comment.posts[0] : comment.posts;
            return (
              <div
                key={comment.id}
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {comment.user_id === user.id ? 'You' : 'A reader'} commented
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    on{' '}
                    {post ? (
                      <Link href={`/post/${post.id}`} className="font-bold text-blue-500 hover:underline">{post.title}</Link>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Deleted post</span>
                    )}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                </div>
                <p className="text-sm leading-relaxed pl-5 border-l-2 border-blue-500/30 whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                  {comment.content}
                </p>
              </div>
            )
          })}

          {(!comments || comments.length === 0) && (
            <div className="text-center py-12 rounded-2xl border-2 border-dashed" style={{ borderColor: 'var(--border)' }}>
              <MessageSquare className="w-7 h-7 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>No comments yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
