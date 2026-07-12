import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CourseTable } from "@/components/admin/CourseTable";
import { LessonManager } from "@/components/admin/LessonManager";

export default async function AdminCoursesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      published: true,
      price: true,
      createdAt: true,
      _count: { select: { lessons: true, enrollments: true } },
    },
  });

  const tableCourses = courses.map((c) => ({
    id: c.id,
    title: c.title,
    published: c.published,
    price: c.price,
    createdAt: c.createdAt,
    lessonCount: c._count.lessons,
    enrollmentCount: c._count.enrollments,
  }));

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <AdminHeader title="Gestión de Cursos" />

      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Cursos</h2>
          <p className="text-muted-foreground">
            Administra los cursos publicados y sus lecciones
          </p>
        </div>

        <LessonManager />

        <div>
          <h3 className="text-lg font-bold mb-4">Listado de Cursos</h3>
          <CourseTable courses={tableCourses} />
        </div>
      </main>
    </div>
  );
}