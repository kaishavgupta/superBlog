'use client'

import { useRef, useState } from 'react'
import { addComment } from '@/app/actions/comment'
import { Send } from 'lucide-react'

export default function CommentForm({ postId }: { postId: string }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, setIsPending] = useState(false)
  const [value, setValue] = useState('')

  async function action(formData: FormData) {
    setIsPending(true)
    try {
      await addComment(postId, formData)
      formRef.current?.reset()
      setValue('')
    } catch (error) {
      console.error(error)
      alert('Failed to post comment. Ensure you are logged in.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <label className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        Leave a Comment
      </label>
      <textarea
        name="content"
        rows={3}
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Share your thoughts..."
        className="w-full rounded-2xl border-2 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 resize-none text-sm leading-relaxed transition-all font-medium"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)',
        }}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending || !value.trim()}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-40 flex items-center gap-2 text-sm shadow-md shadow-blue-500/20 active:scale-95"
        >
          <Send className="w-4 h-4" />
          {isPending ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  )
}
