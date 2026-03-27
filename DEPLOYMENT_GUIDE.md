# CAS Humanities Training Hub — Deployment Guide

Follow these steps in order. Total time: ~15 minutes.
No coding required — everything is clicking buttons.

---

## STEP 1 — Create a Supabase database (5 minutes)

Supabase is a free database service. This stores all your teacher data permanently.

1. Go to https://supabase.com
2. Click "Start your project" → sign up with your school email (free)
3. Click "New project"
   - Name: `cas-humanities-hub`
   - Database password: choose a strong password and SAVE IT somewhere
   - Region: choose the one closest to UAE (Europe West or similar)
   - Click "Create new project" — wait about 2 minutes
4. Once ready, click "SQL Editor" in the left sidebar
5. Click "New query"
6. Copy and paste the entire contents of `supabase_setup.sql` into the editor
7. Click "Run" — you should see "Success"
8. Now go to Project Settings → API (in the left sidebar)
9. Copy two values — you'll need them in Step 3:
   - **Project URL** (looks like: https://xxxxxxxxxxxx.supabase.co)
   - **anon public key** (long string starting with eyJ...)

---

## STEP 2 — Upload code to GitHub (5 minutes)

GitHub stores your code so Vercel can deploy it.

1. Go to https://github.com → sign up or sign in (free)
2. Click the "+" icon → "New repository"
   - Name: `cas-humanities-hub`
   - Keep it Private
   - Click "Create repository"
3. On the next page, click "uploading an existing file"
4. Drag and drop ALL the files from this folder EXCEPT:
   - Do NOT upload: `node_modules` folder
   - Do NOT upload: `.env` file (if it exists)
   - DO upload everything else including: `src/`, `public/`, `index.html`, `package.json`, `vite.config.js`, `.gitignore`, `supabase_setup.sql`
5. Scroll down, click "Commit changes"

---

## STEP 3 — Deploy on Vercel (5 minutes)

Vercel hosts your app and gives you a permanent URL.

1. Go to https://vercel.com → sign up with your GitHub account (free)
2. Click "Add New Project"
3. Find `cas-humanities-hub` in the list → click "Import"
4. Under "Environment Variables" — this is important:
   Click "Add" and enter:
   - Name: `VITE_SUPABASE_URL` → Value: (paste your Supabase Project URL from Step 1)
   - Click "Add" again:
   - Name: `VITE_SUPABASE_ANON_KEY` → Value: (paste your anon public key from Step 1)
5. Click "Deploy"
6. Wait ~1 minute — Vercel builds and deploys automatically
7. You get a URL like: `https://cas-humanities-hub.vercel.app`

That's it. Your app is live permanently.

---

## STEP 4 — Test it

1. Open your Vercel URL
2. Go to Admin tab → enter the password
3. The default teachers should appear
4. Add a teacher, refresh the page — they should still be there
5. Open the same URL on your phone — the same teachers should appear

---

## Updating the app in future

When you want to make changes to the toolkit:
1. Get the updated JSX file from Claude
2. Replace `src/App.jsx` in your GitHub repository (click the file → pencil icon → paste → commit)
3. Vercel automatically redeploys within 1 minute

---

## Your permanent URL format

Once deployed, share this URL with your department:
`https://cas-humanities-hub.vercel.app`

Or go to Vercel settings to add a custom domain if your school has one.

---

## Troubleshooting

**"Invalid API key" error on the app:**
→ Check you copied the full anon key from Supabase, not the service_role key

**Teachers not saving:**
→ Make sure you ran the SQL in supabase_setup.sql exactly as shown

**Blank page after deploy:**
→ Check Vercel → your project → Deployments → click the latest → View logs
