# Agentic Social Manager

An autonomous, AI-assisted control center that plans, drafts, schedules, and analyses multi-channel social media programs. Built with Next.js 14 (App Router), Prisma, Tailwind CSS, and a modular agent stack that can be deployed to Vercel in a single command.

## ✨ Capabilities

- **Mission Control dashboard** with agent status, queue coverage, campaign snapshot, and performance trends.
- **Account hub** to register social surfaces, review health metrics, and monitor outgoing drops.
- **Campaign builder** that orchestrates connected platforms, automation tasks, and idea backlogs.
- **AI ideation studio** for single-drop drafts and multi-pillar strategy generation (uses OpenAI when `OPENAI_API_KEY` is present; otherwise falls back to deterministic stubs).
- **Automation swarm manager** to configure listening, response, and curation workflows as JSON playbooks.
- **Scheduler** for cross-channel post programming with simulated cron endpoint (`GET /api/cron`).
- **Analytics command deck** translating aggregated metrics into an actionable weekly brief.

## 🧰 Tech Stack

- [Next.js 14](https://nextjs.org/) with the App Router and Server Actions
- [React 18](https://react.dev/)
- [Prisma ORM](https://www.prisma.io/) + SQLite (swap to any Prisma-compatible database via `DATABASE_URL`)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/), Recharts, React Query, React Hook Form, Zod
- Optional [OpenAI Responses API](https://platform.openai.com/docs/guides/responses) for agentic content generation

## 🚀 Quick Start

```bash
# install dependencies
npm install

# sync the local SQLite schema
npx prisma db push

# run the development server
npm run dev
```

Visit http://localhost:3000 to access the control center.

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Prisma connection string. Defaults to the bundled SQLite file (`file:./prisma/dev.db`). |
| `OPENAI_API_KEY` | Optional. Enables live AI copy/strategy generation. Without it, deterministic fallbacks are used. |

Create `.env` from the provided `.env.example` and adjust values as needed.

## 📦 Project Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server |
| `npm run build` | Produce an optimized production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run Next.js ESLint checks |

## 🧠 AI Agent Flow

1. **Ideation** – Users (or automations) prompt the Idea Studio or Topbar quick action. If `OPENAI_API_KEY` is present, the agent calls OpenAI; otherwise, curated templates are returned.
2. **Campaign orchestration** – Campaigns bundle surfaces, automation tasks, and idea backlogs. Automation configs are stored as JSON for extensibility.
3. **Scheduling** – Posts are persisted with Prisma. The `/api/cron` endpoint simulates autoposting by promoting due items from `QUEUED` to `PUBLISHED`.
4. **Analytics & Insight** – Metrics snapshots feed the analytics dashboard. The summariser agent transforms reach/engagement data into a weekly directive.

## ☁️ Vercel Deployment

Deploy straight to production (the CLI stores project linkage in `.vercel/`):

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN
```

After DNS warms, verify with:

```bash
curl https://agentic-08231843.vercel.app
```

### Production Configuration Notes

- Replace the SQLite connection with a hosted database (Neon, Supabase, PlanetScale, etc.) by setting `DATABASE_URL`.
- Configure `OPENAI_API_KEY` if you want live content generation in production.
- Add your preferred Vercel Cron job to hit `/api/cron` for unattended publishing.

## 🗂️ Structure Overview

```
app/                    # App Router routes & server actions
├─ (dashboard)/        # Authenticated workspace pages
├─ api/cron/route.ts   # Simulated autopost endpoint
components/            # UI primitives & dashboard widgets
lib/                   # Prisma client, AI helpers, seed data
prisma/schema.prisma   # Database schema (easily retarget to Postgres/MySQL)
```

## 🔒 Security & Credentials

- Secrets stay in environment variables; nothing sensitive is committed.
- Server Actions validate input with Zod before touching Prisma.
- Automation configs are stored as JSON strings—update the schema to use native JSON when migrating to Postgres.

## 🧭 Next Steps

- Wire platform-specific connectors (Twitter/X, LinkedIn, Meta) using stored tokens.
- Swap SQLite for a production-grade database and enable background workers for cron execution.
- Extend automation state tracking to reflect real-time agent feedback loops.

## 📄 License

MIT — feel free to adapt and extend for your own autonomous social media workflows.
