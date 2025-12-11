<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1GxSWYohpIIuesi5kV2ukzCU9LKueq5yb

## Run Locally

**Prerequisites:** Node.js (16+ recommended)

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` (or `.env`) and fill in your keys:
   - `GEMINI_API_KEY` — Google Gemini API key
   - `SUPABASE_URL` and `SUPABASE_KEY` — (optional) if you use Supabase auth
3. Run the app:
   `npm run dev`

Notes:
- Never commit real API keys to source control. Use `.env.local` which is gitignored by default.
- If you run into CORS or network issues, ensure the dev server port `3000` is accessible.
