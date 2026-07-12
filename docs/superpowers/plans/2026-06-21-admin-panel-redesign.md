# Admin Panel Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the visual language of `/admin/*` pages with the rest of academia (dark theme tokens, no hardcoded light-theme classes), extract a shared admin layout, and polish the lesson edit modal and empty state — cosmetic-only, no new pages, no new data wiring, no API changes.

**Architecture:** Add `app/admin/layout.tsx` as a Server Component owning the `AdminSidebar`. Each admin page keeps its `AdminHeader` and main content (page title varies per route, so the header stays co-located). Five existing admin components are refactored in place to replace hardcoded `bg-white` / `bg-slate-*` / `text-gray-*` / `text-slate-*` classes with theme tokens (`bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-secondary`). Sidebar disabled items get a "Pronto" badge.

**Tech Stack:** Next.js 16.1.6 (App Router, Turbopack), React 19, Tailwind CSS v4 with `@theme inline` token mapping, lucide-react icons, vitest + Testing Library for existing tests.

**Spec:** `docs/superpowers/specs/2026-06-21-admin-panel-redesign-design.md`

**Worktree (recommended):** If the user wants isolation from `main`, run on a branch. This plan does not require it but works equally well in either.

---

## File Structure

| File | Responsibility | Status |
|---|---|---|
| `app/admin/layout.tsx` | Wraps every `/admin/*` page with `AdminSidebar` + outer flex container | NEW |
| `app/admin/courses/page.tsx` | Admin courses overview (stats + lesson manager + courses table) | MODIFY |
| `components/admin/AdminSidebar.tsx` | Side nav with disabled "Pronto" badges for non-existent routes | MODIFY |
| `components/admin/AdminHeader.tsx` | Top bar with title + decorative search + notification bell | MODIFY |
| `components/admin/StatsCard.tsx` | Stat display card (4-up grid on dashboard) | MODIFY |
| `components/admin/CourseTable.tsx` | Courses table with empty state | MODIFY |
| `components/admin/LessonManager.tsx` | Course selector + lesson list + dark edit modal | MODIFY |

Files that must NOT change: `app/api/**`, `prisma/**`, `lib/auth.ts`, `middleware.ts`, `app/globals.css`.

---

## Task 1: Create the shared admin layout

**Files:**
- Create: `app/admin/layout.tsx`

- [ ] **Step 1: Create the file with the layout wrapper**

Write `app/admin/layout.tsx`:

```tsx
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

- [ ] **Step 2: Verify the page still renders (layout isn't wired yet, so it shouldn't break anything yet)**

Run: `curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3001/admin/courses --cookie /tmp/cookies.txt --max-time 10`
Expected: `200` (the existing inline layout still works)

If you don't have a session cookie, log in first:
```bash
csrf=$(curl -sS -c /tmp/cookies.txt http://localhost:3001/api/auth/csrf | sed -E 's/.*"csrfToken":"([^"]+)".*/\1/')
curl -sS -b /tmp/cookies.txt -c /tmp/cookies.txt -X POST http://localhost:3001/api/auth/callback/credentials \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "csrfToken=$csrf" \
  --data-urlencode "email=admin@academia.cl" \
  --data-urlencode "password=admin123" \
  --data-urlencode "redirect=false" \
  -o /dev/null
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/layout.tsx
git commit -m "feat(admin): add shared admin layout with sidebar wrapper"
```

---

## Task 2: Drop inline Sidebar from the courses page

**Files:**
- Modify: `app/admin/courses/page.tsx:18-21`

- [ ] **Step 1: Remove the inline sidebar import and outer wrapper**

In `app/admin/courses/page.tsx`:
- Delete line 4: `import { AdminSidebar } from "@/components/admin/AdminSidebar";`
- In the JSX, delete the comment `{/* Sidebar */}` and the line `<AdminSidebar />`
- Delete the outer `<div className="min-h-screen bg-slate-950 flex">` wrapper opening
- Delete the corresponding closing `</div>`
- Keep `<AdminHeader title="Courses Overview" />` and the inner flex column div (which wraps header + main)

The resulting outer JSX should look like:

```tsx
export default function AdminCoursesPage() {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <AdminHeader title="Courses Overview" />
      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* existing stats grid */}
        {/* existing lesson manager */}
        {/* existing courses table */}
        {/* existing footer */}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify the page still renders and looks identical**

Run: `curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3001/admin/courses --cookie /tmp/cookies.txt --max-time 10`
Expected: `200`

Visual check: log in via the browser and visit `/admin/courses`. Sidebar should appear on the left, header at top, content below — same as before. This task should be a no-op visually.

- [ ] **Step 3: Commit**

```bash
git add app/admin/courses/page.tsx
git commit -m "refactor(admin): rely on shared layout instead of inline sidebar"
```

---

## Task 3: Refactor `AdminSidebar` (tokens + Pronto badges)

**Files:**
- Modify: `components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Add the `available` flag to each nav item**

Replace the `navItems` array (lines 14-20) with:

```tsx
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, available: true },
  { href: "/admin/courses", label: "Courses", icon: BookOpen, available: true },
  { href: "/admin/students", label: "Students", icon: Users, available: false },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, available: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, available: false },
];
```

- [ ] **Step 2: Replace the sidebar's hardcoded classes**

Replace the `<aside>` opening tag (line 26) so the classes become:

```tsx
<aside className="w-64 bg-card border-r border-border flex flex-col min-h-0">
```

Replace the logo border (line 28):

```tsx
<div className="p-6 border-b border-border">
```

Replace the nav link classes (lines 47-51) with the disabled-aware version:

```tsx
className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
  !item.available
    ? "opacity-60 cursor-not-allowed pointer-events-none"
    : isActive
      ? "bg-primary text-white"
      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
}`}
```

Replace the Log Out button classes (line 62):

```tsx
className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-colors"
```

- [ ] **Step 3: Add the "Pronto" badge to disabled nav items**

Inside the `<Link>` body (after the `<span>{item.label}</span>` on line 54), add the badge (only when `!item.available`):

```tsx
{!item.available && (
  <span className="ml-auto text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full uppercase tracking-wider font-medium">
    Pronto
  </span>
)}
```

- [ ] **Step 4: Verify the sidebar renders correctly**

Run: `curl -sS http://localhost:3001/admin/courses --cookie /tmp/cookies.txt --max-time 10 | rg -c "Pronto"`
Expected: At least `3` matches (one per disabled nav item).

Run: `curl -sS http://localhost:3001/admin/courses --cookie /tmp/cookies.txt --max-time 10 | rg -c "bg-slate-|text-slate-"`
Expected: `0` matches (no leftover hardcoded classes).

- [ ] **Step 5: Commit**

```bash
git add components/admin/AdminSidebar.tsx
git commit -m "refactor(admin): theme tokens + Pronto badges on disabled nav items"
```

---

## Task 4: Refactor `AdminHeader`

**Files:**
- Modify: `components/admin/AdminHeader.tsx:12`

- [ ] **Step 1: Replace the header background classes**

On line 12, change:

```tsx
<header className="h-20 border-b border-border bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
```

to:

```tsx
<header className="h-20 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
```

- [ ] **Step 2: Verify no leftover hardcoded slate classes**

Run: `rg "bg-slate-|text-slate-|bg-gray-|text-gray-" components/admin/AdminHeader.tsx`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add components/admin/AdminHeader.tsx
git commit -m "refactor(admin): align header background with theme tokens"
```

---

## Task 5: Refactor `StatsCard`

**Files:**
- Modify: `components/admin/StatsCard.tsx`

- [ ] **Step 1: Replace the card's hardcoded classes**

On line 23, change:

```tsx
<div className="bg-white p-6 rounded-xl shadow-sm border">
```

to:

```tsx
<div className="bg-card text-card-foreground p-6 rounded-xl border border-border">
```

- [ ] **Step 2: Replace gray text classes**

On line 26, change `<p className="text-sm text-gray-500">{title}</p>` to `<p className="text-sm text-muted-foreground">{title}</p>`.

On line 13, change `return "text-gray-500";` to `return "text-muted-foreground";` (in the `getTrendColor` function).

- [ ] **Step 3: Verify**

Run: `rg "bg-white|text-gray-|text-slate-" components/admin/StatsCard.tsx`
Expected: no matches.

Run: `npm test -- --run` (runs the full vitest suite to make sure nothing else broke).
Expected: existing tests pass.

- [ ] **Step 4: Commit**

```bash
git add components/admin/StatsCard.tsx
git commit -m "refactor(admin): StatsCard uses theme tokens"
```

---

## Task 6: Refactor `CourseTable` (tokens + empty state)

**Files:**
- Modify: `components/admin/CourseTable.tsx`

- [ ] **Step 1: Update imports**

At the top of the file, change:

```tsx
"use client";
```

to:

```tsx
"use client";
import { BookOpen } from "lucide-react";
```

(`BookOpen` already comes from the same package the page already uses.)

- [ ] **Step 2: Replace the table container's classes**

On line 17, change:

```tsx
<div className="bg-white rounded-lg shadow overflow-hidden">
```

to:

```tsx
<div className="bg-card border border-border rounded-lg overflow-hidden">
```

- [ ] **Step 3: Replace thead and divider classes**

On line 18, change `<table className="min-w-full divide-y divide-gray-200">` to `<table className="min-w-full divide-y divide-border">`.

On line 19, change `<thead className="bg-gray-50">` to `<thead className="bg-secondary/30">`.

On lines 21-31, change each `<th className="... text-gray-500 ...">` to `<th className="... text-muted-foreground ...">` (4 occurrences).

- [ ] **Step 4: Replace tbody and row classes**

On line 35, change `<tbody className="bg-white divide-y divide-gray-200">` to `<tbody className="bg-card divide-y divide-border">`.

On line 38, change `<td colSpan={4} className="px-6 py-4 text-center text-gray-500">No hay cursos aún</td>` to a styled empty state:

```tsx
<td colSpan={4} className="px-6 py-4">
  <div className="py-10 text-center">
    <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
      <BookOpen className="w-6 h-6 text-muted-foreground" />
    </div>
    <p className="text-foreground font-medium mb-1">No hay cursos aún</p>
    <p className="text-sm text-muted-foreground">
      Cuando crees cursos desde el panel, aparecerán acá
    </p>
  </div>
</td>
```

- [ ] **Step 5: Replace remaining gray classes**

On line 46, change `<div className="text-sm font-medium text-gray-900">{course.title}</div>` to `<div className="text-sm font-medium text-foreground">{course.title}</div>`.

On line 52-56, change the badge classes:

```tsx
className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
  course.published
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800"
}`}
```

to:

```tsx
className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
  course.published
    ? "bg-green-500/10 text-green-400 border-green-500/20"
    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
}`}
```

On lines 61 and 64, change `text-sm text-gray-500` to `text-sm text-muted-foreground` (2 occurrences).

- [ ] **Step 6: Verify**

Run: `rg "bg-white|bg-gray-|text-gray-|divide-gray-" components/admin/CourseTable.tsx`
Expected: no matches.

Run: `npm test -- --run`
Expected: existing tests pass.

- [ ] **Step 7: Commit**

```bash
git add components/admin/CourseTable.tsx
git commit -m "refactor(admin): CourseTable uses theme tokens + styled empty state"
```

---

## Task 7: Refactor `LessonManager` (tokens + dark modal)

**Files:**
- Modify: `components/admin/LessonManager.tsx`

- [ ] **Step 1: Update imports**

At the top of the file, add:

```tsx
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
```

(Keep existing imports.)

- [ ] **Step 2: Replace the outer card's classes**

On line 98, change `<div className="bg-white rounded-lg shadow p-6">` to `<div className="bg-card text-card-foreground border border-border rounded-lg p-6">`.

- [ ] **Step 3: Replace the lesson list and helper text classes**

On line 131, change `<p className="text-gray-500 text-center py-4">Este curso aún no tiene lecciones</p>` to `<p className="text-muted-foreground text-center py-4">Este curso aún no tiene lecciones</p>`.

On line 138, change `className="border rounded-lg p-4 hover:border-primary/50 transition-colors"` to `className="bg-secondary/30 border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"`.

On line 149, change `<p className="text-sm text-green-600 mt-1 ...">` to `<p className="text-sm text-green-400 mt-1 ...">`.

On line 161, change `<button onClick={() => setEditingLesson(lesson)} className="ml-4 px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">` to `<button onClick={() => setEditingLesson(lesson)} className="ml-4 px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 text-foreground rounded">`.

- [ ] **Step 4: Replace the modal's outer container**

On line 174, change `<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">` to `<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">` (unchanged — overlay stays).

On line 175, change `<div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">` to `<div className="relative bg-card text-card-foreground border border-border rounded-lg p-6 w-full max-w-lg mx-4">`.

- [ ] **Step 5: Add the close (×) icon to the modal**

Right after the opening `<div>` of the modal (line 175), add the close button as the first child:

```tsx
<button
  type="button"
  onClick={() => setEditingLesson(null)}
  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
  aria-label="Cerrar"
>
  <X className="w-5 h-5" />
</button>
```

- [ ] **Step 6: Replace modal form field classes**

On line 176, change `<h3 className="text-lg font-bold mb-4">Editar Lección</h3>` to `<h3 className="text-lg font-bold mb-4 pr-8">Editar Lección</h3>` (extra right padding avoids overlapping the close ×).

On lines 180, 193, 207, 228 (the four `<label>` tags), change `block text-sm font-medium mb-1` to `block text-sm font-medium mb-1 text-foreground`.

On lines 187, 200, 219, 238 (the four `<input>` and `<textarea>` tags), change the `className="w-full p-2 border rounded-lg"` to:

```tsx
className="w-full p-2 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
```

On line 222 (helper text), change `text-xs text-gray-500 mt-1` to `text-xs text-muted-foreground mt-1`.

- [ ] **Step 7: Replace modal action buttons**

On lines 244-256, replace the buttons block with:

```tsx
<div className="flex gap-3 mt-6">
  <Button
    onClick={saveLesson}
    disabled={loading}
    variant="primary"
    className="flex-1"
  >
    {loading ? "Guardando..." : "Guardar"}
  </Button>
  <Button
    onClick={() => setEditingLesson(null)}
    variant="ghost"
  >
    Cancelar
  </Button>
</div>
```

(`Button` from `@/components/ui/Button` already supports `variant="primary"` and `variant="ghost"` — verified at `components/ui/Button.tsx:18-23`.)

- [ ] **Step 8: Verify**

Run: `rg "bg-white|bg-gray-|text-gray-" components/admin/LessonManager.tsx`
Expected: no matches.

Run: `npm test -- --run`
Expected: existing tests pass.

- [ ] **Step 9: Commit**

```bash
git add components/admin/LessonManager.tsx
git commit -m "refactor(admin): LessonManager dark modal with theme tokens"
```

---

## Task 8: Final verification and visual check

**Files:**
- None (read-only check)

- [ ] **Step 1: Run the existing test suite**

Run: `npm test -- --run`
Expected: all existing tests pass (no regressions).

- [ ] **Step 2: Run TypeScript compiler check**

Run: `npx tsc --noEmit`
Expected: no type errors.

If `tsc` is not in devDependencies, use `npx next lint` instead:
Run: `npx next lint`
Expected: no errors.

- [ ] **Step 3: Verify no leftover hardcoded admin classes**

Run: `rg "bg-white|bg-slate-|text-gray-|text-slate-|divide-gray-" components/admin/ app/admin/`
Expected: no matches.

- [ ] **Step 4: Visual check on the live server**

The dev server is already running on port 3001 (background task `bm51xcfkt`).

1. Open `http://localhost:3001/auth/signin` in the browser
2. Log in as `admin@academia.cl` / `admin123`
3. Visit `http://localhost:3001/admin/courses`
4. Verify:
   - [ ] Sidebar is dark with "Pronto" badges on Students, Analytics, Settings
   - [ ] The active sidebar item ("Courses") is highlighted in primary blue
   - [ ] Header has a dark blurred background; search and bell are visible
   - [ ] The 4 stats cards are dark with subtle borders
   - [ ] The lesson manager card is dark; lesson items are dark
   - [ ] The courses table is dark (rows + badges for Publicado/Borrador are dark-friendly)
   - [ ] Open the lesson edit modal — it should be dark with readable inputs
   - [ ] The modal has a close (×) button in the top-right; Cancel uses the `ghost` button variant
5. Click the three "Pronto" nav items — nothing should happen (no navigation)
6. Click "Courses" — should remain active

- [ ] **Step 5: Commit any final cleanup (only if needed)**

If any of the above checks surfaced a tweak (e.g., a stray class, a spacing nit), make the change, run `npm test -- --run` once more, then commit:

```bash
git add -A
git commit -m "fix(admin): visual polish after redesign"
```

If nothing changed, skip this step.

---

## Out of scope reminder (do NOT do these)

- Add admin pages (Students, Analytics, Settings)
- Wire real data (stats, courses)
- Add admin role check in `middleware.ts` or `/api/admin/lessons`
- Fix the `LessonManager` PUT bug (the server expects `lessonId` but the client sends `id`)
- Add dark/light theme toggle logic
- Touch `app/api/**`, `prisma/**`, `lib/auth.ts`, `middleware.ts`, `app/globals.css`