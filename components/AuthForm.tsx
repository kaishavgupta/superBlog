'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { login, signup } from '@/app/login/actions'

function SubmitButton({ isLogin }: { isLogin: boolean }) {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className={`bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-3.5 w-full transition-all font-bold shadow-lg shadow-blue-500/30 active:scale-[0.98] ${pending ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {pending ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
    </button>
  )
}

export default function AuthForm({ message }: { message?: string }) {
  const [isLogin, setIsLogin] = useState(false) // Default to Signup

  return (
    <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 sm:p-10">
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Sign In
        </button>
      </div>

      {isLogin ? (
        <form action={login} className="animate-in fade-in slide-in-from-bottom-2 flex flex-col w-full justify-center gap-5 text-slate-800">
          <div className="flex flex-col gap-2 text-center mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-sm">
              Sign in to your account to continue.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700" htmlFor="email">
                Email Address
              </label>
              <input
                className="rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                className="rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <SubmitButton isLogin={true} />
          </div>

          {message && (
            <div className="mt-2 p-4 bg-red-50/80 backdrop-blur border border-red-100 text-red-600 rounded-xl text-sm text-center font-semibold animate-in fade-in slide-in-from-bottom-2">
              {message}
            </div>
          )}
        </form>
      ) : (
        <form action={signup} className="animate-in fade-in slide-in-from-bottom-2 flex flex-col w-full justify-center gap-5 text-slate-800">
          <div className="flex flex-col gap-2 text-center mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Create Account
            </h1>
            <p className="text-slate-500 text-sm">
              Join us to start reading and writing.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700" htmlFor="email">
                Email Address
              </label>
              <input
                className="rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                className="rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-sm font-bold text-slate-700" htmlFor="role">
                Account Role
              </label>
              <select
                name="role"
                defaultValue="viewer"
                className="rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 cursor-pointer appearance-none font-medium"
              >
                <option value="viewer">Viewer (Read & Comment)</option>
                <option value="author">Author (Write Posts)</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <SubmitButton isLogin={false} />
          </div>

          {message && (
            <div className="mt-2 p-4 bg-red-50/80 backdrop-blur border border-red-100 text-red-600 rounded-xl text-sm text-center font-semibold animate-in fade-in slide-in-from-bottom-2">
              {message}
            </div>
          )}
        </form>
      )}
    </div>
  )
}
