# CLAUDE.md

## Project

Next.js 16 HR management app (employees, departments, leave requests) backed by Supabase Auth + Postgres, deployed on Vercel.

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Backend:** Supabase (`@supabase/ssr`) — auth + database
- **Styling:** Tailwind CSS v4, shadcn/ui (Radix UI primitives)
- **Charts:** Recharts
- **Forms:** react-hook-form + zod (installed; partially used)
- **Toasts:** sonner

## Commands

```bash
pnpm dev      # start dev server
pnpm build    # production build
pnpm start    # start production server
pnpm lint     # eslint
```

> Use `pnpm`. Both `pnpm-lock.yaml` and `package-lock.json` are present (see TODO.md — pick one).

## Directory Layout

```
app/
  (dashboard)/          # protected routes — dashboard, employees, departments, leave, settings
  auth/                 # login, sign-up, callback, error
components/
  ui/                   # shadcn primitives — do not edit casually
  dashboard/            # sidebar, header, stats, charts
  employees/            # employee table, add/edit dialogs
  leave/                # leave requests table, new-request dialog
  settings/             # profile form
lib/
  supabase/
    client.ts           # browser client (client components)
    server.ts           # RSC/server action client
    proxy.ts            # middleware session refresh
  types.ts              # domain types: Employee, Department, LeaveRequest, etc.
middleware.ts           # auth gating
```

## Auth Model

Supabase Auth. Each `auth.users` row has a matching `employees` row with the same `id`. User roles (`admin | manager | employee`) live on `employees.role`. Authorization decisions read that field.

## Conventions

- **Data fetching:** server components call `createClient()` from `lib/supabase/server.ts` and fetch directly.
- **Mutations:** client components use `lib/supabase/client.ts`, then call `router.refresh()` to re-sync server state.
- **Error/confirm UI:** use `sonner` toasts and shadcn `AlertDialog` — never `alert()` or `confirm()`.
- **New employees:** creation requires a server action with the service role key — not the browser anon client.

## After Every Edit Session

After making any code changes, always run these checks in order and fix any failures before reporting the task done:

```bash
pnpm lint        # must pass with no errors
pnpm build       # must complete without type errors or build failures
```

- Fix all lint errors — do not suppress them with `eslint-disable` comments unless there is a documented reason.
- Fix all TypeScript errors surfaced by the build — do not use `any` or `@ts-ignore` as a shortcut.
- If the build reveals a runtime issue that can't be caught statically (e.g. a missing env var), note it explicitly rather than silently ignoring it.

## Known Issues

See [TODO.md](./TODO.md) for the prioritized backlog.
