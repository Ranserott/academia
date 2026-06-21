# Admin Panel Visual Redesign — Design Spec

**Date:** 2026-06-21
**Status:** Approved by user
**Scope:** Cosmetic only (theme consistency, layout extraction, modal/empty-state polish)

---

## Goal

Unify the visual language of the `/admin/*` pages with the rest of the academia platform. Eliminate the "Frankenstein" look caused by mixing dark theme tokens with hardcoded light-theme classes in admin components (`bg-white`, `text-gray-500`, `bg-slate-900`, etc.). Deliver a panel that looks like it was designed alongside the public site, not bolted on.

## Non-goals (explicitly out of scope)

- **No new admin pages.** `Students`, `Analytics`, `Settings` routes do not exist and will not be created in this change.
- **No real data wiring.** Stats stay hardcoded; `CourseTable` keeps receiving `courses={[]}` in the page.
- **No admin authorization.** `middleware.ts` will not be updated; `/api/admin/lessons` will not gain a role check.
- **No bug fixes in API logic.** The `LessonManager` PUT endpoint (`lessonId` vs `id` mismatch) will not be touched, even though the same file is being styled.
- **No schema changes.** Prisma schema, auth config, and seed data are untouched.
- **No dark/light toggle work.** The app is dark-only by current CSS. `ThemeToggle` remains a no-op for non-root tokens.

## Decisions (locked from brainstorming)

| Topic | Decision |
|---|---|
| Redesign scope | Cosmetic only |
| Visual direction | "Consistent" (matches public site, dark theme, minimal decoration) |
| Dead sidebar links | Render as disabled nav items with a "Pronto" badge |
| Inert header UI | Keep search bar and notification bell as decoration |
| Mock stats data | Keep current fake values (`$124,500`, `3,420`, etc.) |
| Empty `CourseTable` | Render styled empty state (not a blank row) |

---

## Architecture

### File structure (after change)

```
app/admin/
  layout.tsx                 ← NEW: shared Sidebar + main container
  courses/
    page.tsx                 ← MODIFIED: main content only (no inline Sidebar/Header)

components/admin/
  AdminSidebar.tsx           ← MODIFIED: theme tokens + "Pronto" badges
  AdminHeader.tsx            ← MODIFIED: theme tokens
  StatsCard.tsx              ← MODIFIED: theme tokens
  CourseTable.tsx            ← MODIFIED: theme tokens + empty state
  LessonManager.tsx          ← MODIFIED: theme tokens + dark modal
```

### Layout pattern

`app/admin/layout.tsx` is a Server Component. It owns the `AdminSidebar` and the outer main wrapper. Each admin page owns its own `AdminHeader` and main content (so the page title can vary per route without prop drilling).

```tsx
// app/admin/layout.tsx
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
```

`app/admin/courses/page.tsx` keeps its content, including `<AdminHeader title="Courses Overview" />` and `<main>` wrapper. The outer `min-h-screen bg-slate-950 flex` div and the `<AdminSidebar />` import are removed.

---

## Component changes

### `AdminSidebar.tsx`

**Token mapping:**

| Before | After |
|---|---|
| `bg-slate-900` | `bg-card` |
| `border-slate-800` | `border-border` |
| `text-slate-400` | `text-muted-foreground` |
| `hover:bg-slate-800` | `hover:bg-secondary` |
| `hover:text-white` | `hover:text-foreground` |

**Coming Soon treatment:**

The `navItems` array gains an `available: boolean` flag. Items where `available: false` get:

- The nav link gets `opacity-60 cursor-not-allowed pointer-events-none`
- A badge rendered after the label: `<span className="ml-auto text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full uppercase tracking-wider font-medium">Pronto</span>`

The active-state highlight (`bg-primary text-white`) only applies to `available: true` items.

### `AdminHeader.tsx`

| Before | After |
|---|---|
| `bg-slate-950/50 backdrop-blur-md` | `bg-background/80 backdrop-blur-md` |

Other classes (`border-border`, `text-white`, `text-muted-foreground`, `bg-secondary/30`, `bg-orange-500`) are already consistent or need no change. The mobile menu button is decorative only (no behavior change required).

### `StatsCard.tsx`

| Before | After |
|---|---|
| `bg-white p-6 rounded-xl shadow-sm border` | `bg-card text-card-foreground p-6 rounded-xl border border-border` |
| `text-gray-500` (title) | `text-muted-foreground` |
| `text-gray-500` (neutral trend) | `text-muted-foreground` |

`bg-primary/10` icon backgrounds and `text-primary` icon color stay.

### `CourseTable.tsx`

| Before | After |
|---|---|
| `bg-white` (container) | `bg-card border border-border` |
| `bg-gray-50` (thead) | `bg-secondary/30` |
| `divide-gray-200` | `divide-border` |
| `text-gray-500` (th + meta) | `text-muted-foreground` |
| `text-gray-900` (course title) | `text-foreground` |
| `bg-green-100 text-green-800` (Publicado) | `bg-green-500/10 text-green-400 border border-green-500/20` |
| `bg-yellow-100 text-yellow-800` (Borrador) | `bg-yellow-500/10 text-yellow-400 border border-yellow-500/20` |

**Empty state:** When `courses.length === 0`, replace the current centered cell with a vertical block:

```tsx
<div className="px-6 py-16 text-center">
  <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
    <BookOpen className="w-6 h-6 text-muted-foreground" />
  </div>
  <p className="text-foreground font-medium mb-1">No hay cursos aún</p>
  <p className="text-sm text-muted-foreground">
    Cuando crees cursos desde el panel, aparecerán acá
  </p>
</div>
```

Add `import { BookOpen } from "lucide-react"`.

### `LessonManager.tsx`

**Outer card:**

| Before | After |
|---|---|
| `bg-white rounded-lg shadow p-6` | `bg-card text-card-foreground border border-border rounded-lg p-6` |
| `text-gray-500` (empty lessons msg) | `text-muted-foreground` |
| `border rounded-lg p-4 hover:border-primary/50` (lesson items) | `bg-secondary/30 border border-border rounded-lg p-4 hover:border-primary/50` |
| `text-green-600` (video link) | `text-green-400` |
| `bg-gray-100 rounded hover:bg-gray-200` (Editar button) | `bg-secondary hover:bg-secondary/80 text-foreground` |

**Modal:**

| Before | After |
|---|---|
| `bg-white rounded-lg p-6` | `bg-card text-card-foreground border border-border rounded-lg p-6` |
| `<label>` (no color) | `text-foreground font-medium text-sm` |
| `<input>` / `<textarea>` `w-full p-2 border rounded-lg` | `w-full p-2 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none` |
| Helper `text-xs text-gray-500` | `text-xs text-muted-foreground` |
| Save button `bg-primary text-white` | unchanged (already correct) |
| Cancel button `bg-gray-100 rounded-lg hover:bg-gray-200` | Replace with `<Button variant="ghost">Cancelar</Button>` from `@/components/ui/Button` |

Add a close (×) icon button in the modal's top-right corner: `<button onClick={() => setEditingLesson(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>`. The modal container gets `relative` positioning.

Modal size stays `max-w-lg`. The dark overlay (`bg-black/50` → `bg-black/60`) gets a small contrast bump.

---

## Things to avoid

- Don't add behavior. No new event handlers beyond what already exists.
- Don't change the lesson data flow (state, fetch, save). Only restyle.
- Don't fix the PUT bug even if it would be trivial — out of scope.
- Don't remove the `Courses` link from the sidebar (it's the only working admin page).
- Don't introduce new theme tokens. Use only what `app/globals.css` already defines.
- Don't add a `<table>` empty row for the empty state. Use the dedicated block.
- Don't change the LessonManager's `fetchCourses` / `saveLesson` / `addLesson` logic.

---

## Acceptance criteria

- [ ] `app/admin/layout.tsx` exists and wraps admin pages with `Sidebar` + main flex container using `bg-background`.
- [ ] `app/admin/courses/page.tsx` no longer imports `AdminSidebar`; no longer sets `min-h-screen bg-slate-950 flex` on its outer div.
- [ ] No admin component file contains the strings `bg-white`, `bg-slate-`, `text-gray-`, `text-slate-`, or `divide-gray-`.
- [ ] `AdminSidebar` shows a "Pronto" badge on `Students`, `Analytics`, `Settings`; those items are not navigable.
- [ ] The active sidebar item ("Courses") retains the primary blue highlight.
- [ ] `StatsCard`, `CourseTable`, and `LessonManager` all render on `bg-card` with `border-border` and `text-foreground` / `text-muted-foreground`.
- [ ] The lesson edit modal renders with `bg-card`; inputs are readable; the cancel button uses `Button` with `variant="ghost"`.
- [ ] `CourseTable` empty state shows an icon in a muted circle + title + subtitle.
- [ ] `npm run dev` (already running on port 3001) renders `/admin/courses` without console errors.
- [ ] No file under `app/api/**` or `prisma/**` was modified.

## Verification

After implementation, the dev server is already running on `http://localhost:3001` (background task `bm51xcfkt`). Log in as `admin@academia.cl` / `admin123` and visit `http://localhost:3001/admin/courses`. Visual check: panel should look uniformly dark, sidebar should show "Pronto" badges, the edit-lesson modal should be dark with readable inputs.