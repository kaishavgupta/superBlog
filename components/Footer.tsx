import { Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full mt-auto relative overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />
      
      {/* Decorative orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 flex flex-col items-center gap-8">
        
        {/* Brand + tagline */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-2xl font-black tracking-tight text-white">
            SuperBlog<span className="text-blue-400">.</span>
          </span>
          <p className="text-slate-400 text-sm text-center max-w-sm leading-relaxed">
            A modern publishing platform built for writers, readers, and thinkers.
          </p>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        {/* Developer credit */}
        <div className="flex items-center gap-2 text-base font-semibold text-slate-300">
          <span>Crafted with</span>
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
          <span>by</span>
          <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent font-bold">
            Kaishav Gupta
          </span>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-4">
          {/* Email */}
          <a
            href="mailto:kaishavgupta4.2001@gmail.com"
            title="Email"
            className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 text-slate-400 hover:text-blue-300 rounded-2xl px-5 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium hidden sm:inline">
              kaishavgupta4.2001@gmail.com
            </span>
            <span className="text-sm font-medium sm:hidden">Email</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/kaishavgupta/"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 text-slate-400 hover:text-blue-300 rounded-2xl px-5 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <span className="text-sm font-medium">LinkedIn</span>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/kaishavgupta/"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 text-slate-400 hover:text-violet-300 rounded-2xl px-5 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span className="text-sm font-medium">GitHub</span>
          </a>
        </div>

        {/* Bottom copyright */}
        <div className="w-full h-px bg-white/5 mt-2" />
        <p className="text-slate-600 text-xs text-center tracking-wide">
          © {new Date().getFullYear()} SuperBlog. All rights reserved. Built with Next.js &amp; Supabase.
        </p>
      </div>
    </footer>
  )
}
