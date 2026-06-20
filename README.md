# Academia

Plataforma de cursos online construida con Next.js 14, React, y Prisma.

## Stack

- **Frontend:** Next.js 14 (App Router), React 19, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** SQLite (dev), PostgreSQL (prod)
- **Auth:** NextAuth.js with credentials provider

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Setup environment:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your values
   \`\`\`

3. Initialize database:
   \`\`\`bash
   npx prisma generate
   npx prisma db push
   \`\`\`

4. Seed sample data:
   \`\`\`bash
   curl http://localhost:3000/api/seed -X POST
   \`\`\`

5. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## Default Credentials

- Admin: admin@academia.cl / admin123

## Features

- ✅ User authentication (sign up, sign in)
- ✅ Course enrollment
- ✅ Lesson progress tracking
- ✅ Dashboard with enrolled courses
- ✅ Responsive design
- ⚠️ Video lessons (in progress)
- ⚠️ Payment integration (coming soon)

## Project Structure

\`\`\`
app/
  api/           # API routes
  auth/          # Auth pages
  cursos/        # Course pages
  dashboard/     # Student dashboard
  admin/        # Admin pages
components/
  ui/           # Reusable UI components
  admin/        # Admin components
lib/
  auth.ts       # NextAuth configuration
  prisma.ts     # Prisma client
prisma/
  schema.prisma  # Database schema
\`\`\`
