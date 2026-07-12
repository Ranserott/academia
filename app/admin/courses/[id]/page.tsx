import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CourseEditor } from "@/components/admin/CourseEditor";
import { ArrowLeft } from "lucide-react";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          blocks: { orderBy: { order: "asc" } },
        },
      },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) notFound();

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <AdminHeader title={`Editar: ${course.title}`} />

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a cursos
          </Link>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-secondary/40 rounded">
              {course._count.enrollments} inscripto{course._count.enrollments === 1 ? "" : "s"}
            </span>
            <span className="px-2 py-1 bg-secondary/40 rounded">
              {course.published ? "Publicado" : "Borrador"}
            </span>
            <span className="px-2 py-1 bg-secondary/40 rounded">
              {course.price === 0 ? "Gratis" : `$${course.price.toLocaleString("es-CL")}`}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-1">Contenido del curso</h2>
          <p className="text-sm text-muted-foreground">
            Cada módulo puede tener bloques de texto y video. Los cambios se guardan al hacer foco fuera del campo o al apretar <span className="text-foreground font-medium">Guardar bloque</span>.
          </p>
        </div>

        <CourseEditor courseId={course.id} initialModules={course.modules} />
      </main>
    </div>
  );
}