# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev          # Start Vite dev server on port 3000
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Deployment
```bash
vercel --prod        # Deploy to Vercel production
git push origin2 main # Push to GitHub (origin2 uses SSH)
```

## Environment Variables

Required environment variables (create `.env.local` for local development):

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `GEMINI_API_KEY` - Google Gemini API key (optional, for AI analysis)

**Important**: All client-side env vars must use `VITE_` prefix in Vite. The code also supports legacy `process.env` for compatibility (see `vite.config.ts` define configuration).

## Architecture

### Application Structure

This is a React 19 + TypeScript + Vite application for AI project ROI assessment with authentication and data persistence.

**View Flow**:
```
App.tsx → Auth.tsx (if no session)
         → Dashboard.tsx (list assessments)
         → CalculatorView.tsx (create/edit assessment)
```

The app uses a simple state-based router in `App.tsx` with `currentView` state (`'dashboard' | 'calculator'`) and `currentAssessment` state for passing selected assessment to calculator.

### Key Components

- **Auth.tsx**: Handles login/signup with Supabase Auth. Toggles between modes via `isLogin` state. Detects email confirmation requirements from Supabase response.
- **Dashboard.tsx**: Lists user's assessments from Supabase with create/edit/delete actions.
- **CalculatorView.tsx**: Main ROI calculator with InputSection and ResultsPanel. Handles both new and existing assessments.
- **InputSection.tsx**: Form for project inputs (background, costs, savings).
- **ResultsPanel.tsx**: Displays calculated ROI metrics and optional AI analysis.

### Data Flow

1. User inputs → `ProjectInputs` type (monthly hours, salaries, costs)
2. ROI calculation → `CalculationResult` type (hourly rate, monthly benefit, break-even month, ROI %)
3. Optional AI analysis → `getAIAnalysis()` calls Google Gemini API
4. Save to Supabase → `assessments` table with RLS policies

### Supabase Configuration

**Client Initialization** (`services/supabaseClient.ts`):
- Handles missing credentials gracefully with `isSupabaseConfigured` flag
- Falls back to offline/demo mode if env vars missing
- Supports both `import.meta.env` (Vite) and `process.env` (legacy)

**Database Schema** (`supabase/migrations/001_initial_schema.sql`):
- `assessments` table with UUID primary key
- Row Level Security (RLS) enabled: users can only access their own data
- Automatic `updated_at` trigger
- Indexed on `user_id` and `updated_at`

**RLS Policies**:
- SELECT/INSERT/UPDATE/DELETE all require `auth.uid() = user_id`
- Data isolation per user is enforced at database level

### AI Integration

**Gemini Service** (`services/geminiService.ts`):
- Uses `@google/genai` package with model `gemini-3-flash-preview`
- Requires `GEMINI_API_KEY` env var (or `VITE_API_KEY`)
- Graceful degradation: returns helpful message if API key missing
- Generates Chinese financial analysis reports with what-if scenarios

**Prompt Structure**: The AI acts as a "CFO" analyzing HR+AI projects, providing investment recommendation, risk assessment, optimization suggestions, and what-if conditions.

### Environment Variable Handling

The codebase has dual environment variable support:

1. **Vite standard**: `VITE_*` prefix (automatically exposed to client)
2. **Legacy fallback**: `process.env` support via `vite.config.ts` define

**Critical**: When adding new env vars:
- Add to `.env.local` (gitignored)
- Add to `.env.example` (documented)
- Add to `vite.config.ts` define block if client-side
- Update `services/supabaseClient.ts` or `services/geminiService.ts` getters

### Styling

Uses Tailwind CSS via CDN (not npm installed). Classes are utility-first:
- `teal-600` for primary actions
- `slate-*` for backgrounds and text
- Responsive classes like `md:grid-cols-2`

**Note**: Tailwind is loaded via CDN script in `index.html`, not as a dependency.

## Supabase Auth Configuration

**Email Confirmation** (v1.1.1):
- Site URL: `https://airoiforshare.vercel.app`
- Email confirmations: Enabled
- Redirect URLs configured for production domain

Users must verify email before accessing the app. The Auth component detects email confirmation requirements and displays appropriate messaging.

## Common Patterns

### Supabase Query Pattern
```typescript
const { data, error } = await supabase
  .from('assessments')
  .select('*')
  .eq('user_id', user.id)
  .order('updated_at', { ascending: false });
```

### Guard Against Missing Supabase
```typescript
if (!isSupabaseConfigured) {
  // Handle offline mode gracefully
  return;
}
```

### AI Service Call
```typescript
const analysis = await getAIAnalysis(inputs, results);
// Returns either AI analysis or helpful message about missing API key
```

## Important Files

- `types.ts` - Shared TypeScript interfaces (ProjectInputs, CalculationResult, Assessment, ChartDataPoint)
- `services/supabaseClient.ts` - Supabase client with env var handling
- `services/geminiService.ts` - AI analysis service
- `supabase/migrations/001_initial_schema.sql` - Database schema with RLS
- `vite.config.ts` - Build configuration with env var injection
