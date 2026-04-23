'use client'

import { useState, useRef } from 'react'
import { createPost, updatePost } from '@/app/actions/post'
import { generatePostSummary } from '@/app/actions/ai'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles, CheckCircle } from 'lucide-react'

type Post = {
  id?: string
  title: string
  content: string
  status: string
  summary?: string
}

export default function PostEditor({ post }: { post?: Post }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  
  const [isPending, setIsPending] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const isEditing = !!post?.id

  // Summary state
  const [showSummaryStep, setShowSummaryStep] = useState(false)
  const [generatedSummary, setGeneratedSummary] = useState(post?.summary || '')
  const [contentChanged, setContentChanged] = useState(false)

  async function handleInitialSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const content = formData.get('content') as string
    const status = formData.get('status') as string
    
    // Check if content has changed from the original
    if (isEditing && post?.content !== content) {
      setContentChanged(true)
    } else {
      setContentChanged(false)
    }
    
    // If saving as Draft, completely bypass the summary step and save immediately
    if (status === 'draft') {
      setIsPending(true)
      try {
        if (isEditing) {
          await updatePost(post!.id!, formData)
        } else {
          await createPost(formData)
        }
        router.push('/dashboard')
      } catch (error) {
        console.error(error)
        alert('Failed to save draft.')
        setIsPending(false)
      }
      return
    }
    
    // For Published posts: Just go to the summary review step directly.
    // We no longer auto-generate the AI summary to save API costs.
    setShowSummaryStep(true)
  }

  async function handleGenerateSummary() {
    if (!formRef.current) return
    const formData = new FormData(formRef.current)
    const content = formData.get('content') as string

    setIsGenerating(true)
    try {
      const summary = await generatePostSummary(content)
      setGeneratedSummary(summary || '')
      setContentChanged(false) // clear the warning after regenerating
    } catch (err) {
      console.error(err)
      alert('Failed to generate summary.')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleFinalSave() {
    if (!formRef.current) return
    
    setIsPending(true)
    const formData = new FormData(formRef.current)
    formData.append('summary', generatedSummary)

    try {
      if (isEditing) {
        await updatePost(post!.id!, formData)
      } else {
        await createPost(formData)
      }
      router.push('/dashboard')
    } catch (error) {
      console.error(error)
      alert('Failed to save post.')
      setIsPending(false)
    }
  }

  return (
    <>
      {showSummaryStep && (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-7 h-7 text-blue-500" />
            <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Add a Summary</h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Write a quick summary of your post manually, or let our AI generate one for you to save time!
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl">
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {generatedSummary ? 'Not happy with the current summary?' : 'Want to save time?'}
            </p>
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Generating...' : generatedSummary ? 'Regenerate with AI' : 'Generate with AI'}
            </button>
          </div>

          <textarea
            value={generatedSummary}
            onChange={(e) => setGeneratedSummary(e.target.value)}
            rows={8}
            className="w-full rounded-2xl border-2 p-5 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-y leading-relaxed text-sm"
            placeholder="Your summary will appear here..."
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          />
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => setShowSummaryStep(false)}
              className="px-6 py-3 rounded-2xl font-bold text-sm transition-colors border"
              style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              ← Back to Editor
            </button>
            <button
              onClick={handleFinalSave}
              disabled={isPending}
              className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5" />
              {isPending ? 'Saving...' : 'Confirm & Save Post'}
            </button>
          </div>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleInitialSubmit}
        className={`flex flex-col gap-6 ${showSummaryStep ? 'hidden' : ''}`}
      >
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border transition-colors hover:opacity-80"
            style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Post Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={post?.title}
            placeholder="A captivating title..."
            className="text-2xl font-extrabold rounded-2xl border-2 p-5 outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 transition-all"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cover_image" className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Cover Image URL (Optional)
          </label>
          <input
            id="cover_image"
            name="cover_image"
            type="url"
            defaultValue={post?.cover_image}
            placeholder="https://example.com/image.jpg"
            className="rounded-2xl border-2 p-4 outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 transition-all text-sm"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label htmlFor="content" className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Story Content
          </label>
          <textarea
            id="content"
            name="content"
            required
            defaultValue={post?.content}
            placeholder="Start writing your amazing story here..."
            className="flex-1 rounded-2xl border-2 p-5 outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 resize-y min-h-[400px] text-base leading-relaxed transition-all"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between pt-6 mt-2 gap-6"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label htmlFor="status" className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Status:</label>
            <select
              id="status"
              name="status"
              defaultValue={post?.status || ''}
              required
              className="rounded-xl border-2 px-4 py-2.5 text-sm font-bold outline-none cursor-pointer focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 transition-all"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="" disabled>Select Status...</option>
              <option value="draft">Draft (Private)</option>
              <option value="published">Published (Public)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isGenerating || isPending}
            className="w-full sm:w-auto bg-blue-600 text-white px-10 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? 'Generating Summary...' : 'Review & Publish'}
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </form>
    </>
  )
}

