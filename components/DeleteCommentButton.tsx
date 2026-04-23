'use client'

import { deleteComment } from '@/app/actions/comment'
import { Trash2 } from 'lucide-react'
import { useTransition } from 'react'

export default function DeleteCommentButton({ commentId, postId }: { commentId: string; postId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        if (confirm('Are you sure you want to delete this comment?')) {
          startTransition(() => {
            deleteComment(commentId, postId)
          })
        }
      }}
      disabled={isPending}
      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
      title="Delete Comment"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
