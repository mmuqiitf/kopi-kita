# Mini CRM — AI Global Promo Helper Plan

## Project Goal

Build a full-stack Next.js app for Mimi’s Coffee Shop to manage customers, track interests, generate AI-based global promo ideas from aggregate trends, and chat with store data.

## Chosen Stack

- Framework: Next.js 16 + App Router + TypeScript
- UI: Existing shadcn custom theme components
- Database: Supabase Postgres
- ORM: Drizzle ORM
- Auth: NextAuth (Credentials)
- AI: Groq via Vercel AI SDK
- Validation/Forms: Zod + React Hook Form

## Delivery Milestones

### Milestone 1 — Foundation (Start Here)

1. Install dependencies for DB, auth, AI, forms, and charts.
2. Add environment template (`.env.example`).
3. Set up Drizzle config and database client.
4. Define database schema:
   - `users`
   - `customers`
   - `interest_tags`
   - `customer_interests`
   - `promo_campaigns`
5. Add seed script and starter seed data.
6. Configure NextAuth credentials login and route handler.
7. Add protected app route groups:
   - `(auth)/login`
   - `(app)/dashboard`
   - `(app)/customers`
   - `(app)/promo`
   - `(app)/chat`

### Milestone 2 — Customer CRM

1. Build customer list page with:
   - Search by name
   - Interest filters
   - Table list
2. Implement customer CRUD:
   - Add customer
   - Edit customer
   - Delete customer
3. Manage interest tags (existing + create-on-input).
4. Add validation and UX feedback (toasts/errors).

### Milestone 3 — AI Promo Ideas (Core Feature)

1. Build Promo Ideas page UI.
2. Aggregate customer interests/trends from DB.
3. Create prompt templates in `lib/prompts/promo.ts`.
4. Implement API route to generate **2–3 campaign ideas** with:
   - Theme
   - Segment + count
   - Why now
   - Ready message + CTA
   - Optional time window
5. Add save-to-database for generated campaigns.

### Milestone 4 — Dashboard

1. Show total customers.
2. Show top interests with counts.
3. Display this week’s saved campaigns.
4. Add copy-message quick action.

### Milestone 5 — AI Chatbot

1. Build chat UI page.
2. Implement streaming chat endpoint using Groq.
3. Connect chatbot context to customer/promo data.
4. Ensure chatbot can answer with current data trends.

### Milestone 6 — Hardening & Deploy

1. Route protection checks.
2. Basic security practices (env handling, validation).
3. Lint/build pass.
4. Vercel deployment setup notes in README.

## File/Folder Target Structure

```text
app/
  (auth)/login/page.tsx
  (app)/layout.tsx
  (app)/dashboard/page.tsx
  (app)/customers/page.tsx
  (app)/promo/page.tsx
  (app)/chat/page.tsx
  api/
    auth/[...nextauth]/route.ts
    promo/generate/route.ts
    chat/route.ts
lib/
  auth.ts
  db/
    index.ts
    schema.ts
    seed.ts
  actions/
    customers.ts
  prompts/
    promo.ts
    chat.ts
proxy.ts
docs/
  PLAN.md
```

## Database Workflow

Use one source of truth for schema changes: Drizzle migrations.

1. Update schema in `lib/db/schema.ts`
2. Generate migration SQL:
   - `npm run db:generate`
3. Apply migration to database:
   - `npm run db:migrate`
4. For first-time setup (empty DB):
   - `npm run db:setup`

Notes:

- Do not run manual SQL for schema in Supabase SQL Editor if using this workflow.

## Acceptance Criteria Mapping

- Login page exists and protects app pages.
- Customer list supports add/edit/delete/search/filter.
- Promo Ideas page generates and displays global campaigns from aggregate customer data.
- Dashboard shows totals, top interests, and weekly campaign suggestions.
- AI chatbot can answer using existing store data.
- Seed data is available to demo all features.
- Prompt files are committed in repository.

## Implementation Order in This Session

1. Complete Milestone 1 foundation.
2. Deliver minimal, working versions of dashboard/customers/promo/chat routes.
3. Ensure lint passes.
4. Then continue Milestone 2 onward in iterative passes.
