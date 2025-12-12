<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1GxSWYohpIIuesi5kV2ukzCU9LKueq5yb

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
## Deploy

### Vercel (Recommended)

1. Go to https://vercel.com and log in or sign up.
2. Click "New Project" and select this GitHub repository (`adeycodes/preschool-managemmet-software`).
3. In "Environment Variables", add:
   - `GEMINI_API_KEY` — your Google Gemini API key
   - `SUPABASE_URL` — (optional) your Supabase URL
   - `SUPABASE_KEY` — (optional) your Supabase anon key
4. Click "Deploy" — Vercel will automatically build and deploy your app.
5. After deployment, visit your live URL (e.g., `https://preschool-managemmet-software.vercel.app`).

**Auto-deploy:** Push changes to `main` branch — Vercel will re-deploy automatically.

### Netlify

1. Go to https://netlify.com and log in or sign up.
2. Click "Add new site" → "Import an existing project" and select this GitHub repo.
3. In "Build settings", use:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. In "Environment variables", add `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`.
5. Click "Deploy site" — Netlify will build and host your app.

### Docker

1. Build the image:
   ```bash
   docker build -t preschool-report .
   ```
2. Run locally:
   ```bash
   docker run -p 3000:3000 \
     -e GEMINI_API_KEY=your_key \
     preschool-report
   ```
3. Push to Docker Hub or deploy to a container orchestration service (Kubernetes, AWS ECS, etc.).