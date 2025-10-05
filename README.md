# SignalsGEO - GEO Scorecard Web App

SignalsGEO is a production-ready, evidence-based GEO scorecard web app for SMBs that analyzes website content quality, AI-readiness, and trust signals.

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **UI**: TailwindCSS + @redefinition/ui components
- **Database & Auth**: Supabase (Postgres + Auth)
- **API Providers**: Perplexity AI, Google Gemini (with Search Grounding)

## Getting Started

### 1. Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# API Keys (for Phase 4+)
PERPLEXITY_API_KEY=your-perplexity-api-key
GEMINI_API_KEY=your-gemini-api-key

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3030
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to `.env.local`
3. Run the database migration:
   - Go to Supabase Dashboard → SQL Editor
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Execute the migration

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Development Server

```bash
pnpm dev
```

The app will be available at [http://localhost:3030](http://localhost:3030)

## Development Phases

This project is being built in 9 phases following the MVP Build Plan:

- ✅ **Phase 1**: Project scaffold and Auth
  - Supabase client setup
  - Authentication (sign-up, login, logout)
  - Organization creation and management
  - Row Level Security (RLS) policies

- ✅ **Phase 2**: Data model & Admin plumbing
  - Admin dashboard with database statistics
  - Scoring version management system
  - Weight configuration (JSON-based)
  - Default v1.0 scoring weights

- ⏳ **Phase 3**: Crawl engine (Current)
- ⏳ **Phase 4**: Provider adapters
- ⏳ **Phase 5**: Scoring & ranks
- ⏳ **Phase 6**: Evidence & snapshots
- ⏳ **Phase 7**: Jobs, cron, and cost caps
- ⏳ **Phase 8**: UI polish & onboarding
- ⏳ **Phase 9**: Beta calibration & fixes

## Project Structure

```
apps/signals_geo/
├── app/
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Main app dashboard
│   ├── account/        # User account settings
│   └── ...
├── lib/
│   ├── supabase/       # Supabase client utilities
│   └── database.types.ts
├── supabase/
│   └── migrations/     # Database schema migrations
└── middleware.ts       # Auth middleware
```

## Key Features

- **Authentication**: Email-based sign-up and login with Supabase Auth
- **Organization Management**: Create and manage multiple organizations
- **GEO Scoring**: Comprehensive 100-point scoring system across 4 sections
- **Evidence-Based**: Every metric backed by verifiable evidence
- **Row Level Security**: Secure data access with Supabase RLS

## Documentation

See the full build plan in `SignalsGEO_MVP_Build_Plan_v1.0.md` for detailed specifications.

## License

Copyright © 2025 Redefinition Technologies Inc.
