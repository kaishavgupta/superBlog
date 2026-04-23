import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/Footer"
import { ThemeProvider } from "@/components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "SuperBlog"
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: `${siteName} — The Modern Blogging Platform`,
    template: `%s | ${siteName}`,
  },
  description:
    "A premium blogging platform for writers and readers. Discover amazing stories powered by Next.js and Supabase.",
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} — The Modern Blogging Platform`,
    description: "Discover amazing stories from our community of writers.",
    url: appUrl,
  },
  twitter: {
    card: "summary_large_image",
  },
}

/**
 * Blocking inline script that applies the correct theme class to <html>
 * before the page renders — prevents a flash of wrong theme.
 */
const themeScript = `
  (function() {
    try {
      var saved = localStorage.getItem('theme');
      var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if ((saved || preferred) === 'dark') document.documentElement.classList.add('dark');
    } catch(e) {}
  })();
`

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning className={inter.className}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 flex flex-col w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
