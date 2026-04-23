# 📝 Modern AI-Powered Blog Platform

A sleek, premium, and fully-featured blogging platform built with modern web technologies. This platform features a custom authentication system, role-based access control (Admin, Author, Viewer), an integrated AI summarization tool, and a dynamic dark/light theme engine.

---

## ⚡ Tech Stack

This project is built using the latest industry-standard tools for maximum performance, security, and developer experience:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Frontend Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL & Auth)
- **Artificial Intelligence**: [Google Gemini AI](https://ai.google.dev/) via [Vercel AI SDK](https://sdk.vercel.ai/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Formatting**: [date-fns](https://date-fns.org/)

---

## 🛠️ Project Setup Instructions

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/your-username/blog-platform.git
cd blog-platform
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup Supabase
1. Create a new project on [Supabase](https://supabase.com/).
2. Run the provided SQL setup script (`update_schema.sql`) in your Supabase SQL Editor to initialize tables, roles, and Row Level Security (RLS) policies.
3. Obtain your Project URL and Anon Key from the Supabase dashboard (`Project Settings` > `API`).

### 4. Setup Google Gemini AI
1. Go to [Google AI Studio](https://aistudio.google.com/) and create a new API Key.

### 5. Configure Environment Variables
Create a `.env.local` file in the root of your project and add the following keys:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
\`\`\`

---

## 🚀 How to Run Locally

Once your environment variables are configured and dependencies are installed, you can start the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser. 
*(Note: If you are using aggressive ad-blocker extensions, you may occasionally see a red React Hydration mismatch error on your local dev server. This is harmless and caused by the extension injecting code. You can disable the extension for localhost to remove it).*

---

## 🔐 Role-Based Access Control

The platform handles users through three distinct roles:
- **Viewer (Default):** Can read published posts, change their display name, and leave comments.
- **Author:** Can write, edit, and publish their own posts, manage their drafts, and monitor comments on their posts.
- **Admin:** Has global oversight. Admins cannot create posts, but they have full authority to edit/delete any user's post and moderate all comments across the entire platform.

---

## 🌍 Deployment Steps

Deploying this application is highly optimized for [Vercel](https://vercel.com).

1. **Push your code to GitHub**:
   Ensure all changes are committed and pushed to your remote repository.

2. **Import Project to Vercel**:
   Log into Vercel and click **Add New** > **Project**. Select your GitHub repository.

3. **Configure Environment Variables**:
   In the Vercel deployment settings, expand the "Environment Variables" section and add exactly the same variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`

4. **Deploy**:
   Click **Deploy**. Vercel will automatically build the Next.js App Router application and deploy it to a global edge network.

5. **Update Supabase Auth (Crucial Step)**:
   Once deployed, copy your new Vercel production URL (e.g., `https://my-blog.vercel.app`). Go to your Supabase Dashboard > **Authentication** > **URL Configuration**, and add your production URL to the **Site URL** and **Redirect URLs** so that login functions correctly in production.
