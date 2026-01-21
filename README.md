<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1x0mgWg-6UEZRphCtFffNmBATVO5oYd9O

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_KEY=your_gemini_api_key
   ```
   See [.env.example](.env.example) for reference.

3. Run the app:
   ```bash
   npm run dev
   ```

## Deployment

This app is deployed on **Vercel** with **Supabase** as the backend.

### Quick Start

1. **Supabase Setup**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions
   - Project Ref: `qgzgjbyazgmghgjqwkzi`
   - Execute database migrations from `supabase/migrations/`

2. **Vercel Configuration**:
   - Project is already configured: `airoi_forshare`
   - Add environment variables in Vercel Dashboard:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_API_KEY`

3. **Deploy**:
   - Automatic: Push to `main` branch (if GitHub is connected)
   - Manual: Run `vercel --prod`

For complete deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## Project Structure

```
airoi_forshare/
├── components/          # React components
├── services/            # Supabase client and Gemini service
├── supabase/
│   └── migrations/     # Database migration files
├── types.ts            # TypeScript type definitions
└── vite.config.ts      # Vite configuration
```

## Features

- ✅ User authentication (Supabase Auth)
- ✅ AI ROI assessment calculator
- ✅ Google Gemini AI analysis
- ✅ Data persistence (Supabase PostgreSQL)
- ✅ Row Level Security (RLS) for data protection

## Troubleshooting

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#故障排查) for common issues and solutions.
