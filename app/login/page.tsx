import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AuthForm from '@/components/AuthForm'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message: string }> }) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <div className="flex-1 flex flex-col w-full justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="absolute left-4 top-20 sm:left-8 sm:top-24 py-2 px-4 rounded-full text-slate-600 bg-white shadow-sm border border-slate-200 hover:bg-slate-50 flex items-center group text-sm font-medium transition-all"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Home
      </Link>

      <AuthForm message={resolvedSearchParams?.message} />
    </div>
  )
}
