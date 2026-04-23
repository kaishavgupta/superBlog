import PostEditor from '@/components/PostEditor'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function CreatePostPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single()
  const role = roleData?.role || 'viewer'

  if (role !== 'author') {
    redirect('/dashboard') // Or show unauthorized message
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Write a new post</h1>
      <PostEditor />
    </div>
  )
}
