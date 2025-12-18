# Deployment Guide

## 1. Get a Database (Supabase)
1.  Go to [Supabase](https://supabase.com/) and create a new project.
2.  Go to **Project Settings** -> **Database**.
3.  Copy the **Connection String** (URI mode). It looks like:
    `postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
    *Note: Use the "Transaction Mode" (Port 6543) if available for serverless apps.*

## 2. Deploy to Vercel
1.  Push your code to GitHub.
2.  Go to [Vercel](https://vercel.com/) -> **Add New** -> **Project**.
3.  Import your repository.
4.  In the **Environment Variables** section, add:
    - **Key**: `DATABASE_URL`
    - **Value**: (Paste your Supabase connection string)
5.  Click **Deploy**.

## 3. Initialize Database
After deployment, Vercel will build the app. However, the database tables might not exist yet.
You need to run the migration command.

### Option A: Run from Local Machine (Easiest)
1.  In your local `.env` file, replace `DATABASE_URL` with your Supabase connection string.
2.  Run:
    ```bash
    npx prisma db push
    ```
    This pushes your schema to the Supabase database.

### Option B: Build Command
In Vercel Settings -> **Build & Development Settings**, change the **Build Command** to:
```bash
npx prisma db push && next build
```
*(This ensures the DB is synced on every deploy).*
