# Summary for Kopi Kita CRM

This document outlines the project standards, technical flow, naming conventions, and architectural patterns to be strictly followed when generating or refactoring code for the Kopi Kita CRM application.

## Tech Stack

- **Framework**: Next.js (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + `shadcn/ui` (Custom `lyra` style, amber theme)
- **Database**: Supabase (PostgreSQL) + Drizzle ORM
- **Authentication**: NextAuth.js (Credentials Provider)
- **State Management & Data Fetching**: `@tanstack/react-query`
- **Data Tables**: `@tanstack/react-table`
- **Notifications**: `sonner` Toasts
- **Icons**: `lucide-react`

## Code Organization & Architecture

### Directory Structure

- `app/(auth)/`: Unauthenticated routes (e.g., login).
- `app/(app)/`: Authenticated/protected routes containing the main CRM layout.
- `components/ui/`: Generic, reusable base components (managed primarily by `shadcn/ui`).
- `components/[feature]/`: Feature-specific components. E.g., `components/customers/`.
- `lib/db/`: Database configuration, Drizzle schema, and seed scripts.
- `lib/data/`: Server-side functions mapping to database queries and mutations.

### Modularity

- **Component Separation**: Avoid massive components. Separate the "Manager" (state and hook coordination) from the "Presentation" (Tables, Modals).
- **Hook Extraction**: When implementing feature-heavy logic, extract React Query `useQuery` and `useMutation` hooks into a separate `use-[feature].ts` file (e.g., `use-customers.ts`).
- **Type Extraction**: To prevent circular dependencies between modals, managers, and tables, define shared TypeScript interfaces and types in a `types.ts` file within the feature's component folder.

## Database & Server-Side Rules

- **Single Source of Truth**: The Drizzle schema (`lib/db/schema.ts`) is the ultimate source of truth.
- **Migration Workflow**:
  - ALWAYS use Drizzle migrations for schema changes: `npm run db:generate` followed by `npm run db:migrate`.
  - NEVER execute manual SQL queries to alter tables in the Supabase SQL Editor.
- **API Routes vs Server Actions**: Use Next.js Route Handlers (`app/api/.../route.ts`) returning JSON for client-side fetching via React Query, or Server Actions where appropriate.

## React Query & Data Flow

- **Avoid useState/useEffect chains** for server data. Use `@tanstack/react-query` exclusively for remote data synchronization.
- **Invalidation**: Always invoke `queryClient.invalidateQueries({ queryKey: [...] })` inside the `onSuccess` callback of mutations to keep the UI perfectly synced.

## UI/UX Guidelines

- **Consistent Styling**: Strictly adhere to the established custom `shadcn/ui` theme.
- **Tactile Feedback (Toasts)**: Every user action that alters server state (Create, Edit, Delete, Login, Logout) must be accompanied by a `sonner` toast (`toast.success()`, `toast.error()`, `toast.info()`).
- **Loading States**:
  - Use `Skeleton` loaders for initial page/table data fetching.
  - Use granular loading blocks on buttons (e.g., `<Loader2 className="animate-spin" />`) bound to `mutation.isPending` values.
  - Disable inputs and buttons while `isSaving` or `isPending` is true to prevent duplicate submissions.
- **Data Tables**:
  - All tabular data must utilize the generic `<DataTable>` component (`components/ui/data-table.tsx`).
  - Features like pagination (rows per page, total rows), search, and filtering should be standard.

## Naming Conventions

- **Files & Directories**: `kebab-case` (e.g., `customer-form-modal.tsx`, `use-customers.ts`).
- **React Components**: `PascalCase` (e.g., `CustomersManager`, `DataTable`).
- **Functions, Hooks & Variables**: `camelCase` (e.g., `useCustomersQuery`, `resetForm`, `getColumns`).
- **Types & Interfaces**: `PascalCase` (e.g., `CustomerItem`, `FormState`).
- **Database Tables (Schema)**: Plural `snake_case` for the physical table names (e.g., `promo_campaigns`), but mapped to `camelCase` in TypeScript structures.
