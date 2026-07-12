import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { EnrollButton } from "./EnrollButton";
import { BlockRenderer, type Block as RendererBlock } from "./BlockRenderer";
import { ModuleChecklist } from "./ModuleChecklist";
import { BookOpen } from "lucide-react";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { slug: id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          blocks: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!course) notFound();

  const session = await auth();

  let isEnrolled = false;
  const completedModules = new Set<string>();

  if (session?.user?.id) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
    });
    isEnrolled = !!enrollment;

    if (isEnrolled) {
      const progressRecords = await prisma.progress.findMany({
        where: {
          userId: session.user.id,
          moduleId: { in: course.modules.map((m) => m.id) },
        },
      });
      progressRecords.forEach((p) => {
        if (p.completed && p.moduleId) completedModules.add(p.moduleId);
      });
    }
  }

  const totalModules = course.modules.length;
  const completedCount = completedModules.size;
  const progressPercent =
    totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  const totalBlocks = course.modules.reduce((acc, m) => acc + m.blocks.length, 0);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <Link
              href="/cursos"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              ← Volver a cursos
            </Link>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-muted-foreground mb-6">{course.description}</p>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {totalModules} módulo{totalModules === 1 ? "" : "s"}
              </span>
              <span className="px-3 py-1 bg-secondary/40 text-foreground rounded-full text-sm">
                {totalBlocks} bloque{totalBlocks === 1 ? "" : "s"} de contenido
              </span>
              <span className="font-bold text-xl text-primary">
                {course.price === 0 ? "Gratis" : `$${course.price.toLocaleString("es-CL")}`}
              </span>
            </div>

            {!session?.user ? (
              <Link
                href="/auth/signin"
                className="inline-flex px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
              >
                Iniciar sesión para inscribirse
              </Link>
            ) : !isEnrolled ? (
              <EnrollButton courseId={course.id} price={course.price} />
            ) : (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-medium mb-2">✓ Ya estás inscripto</p>
                <div className="flex justify-between text-sm text-green-300 mb-1">
                  <span>Progreso del curso</span>
                  <span>
                    {completedCount}/{totalModules} módulos · {progressPercent}%
                  </span>
                </div>
                <div className="h-2 bg-green-500/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {course.image && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Modules */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Contenido del Curso</h2>

          {totalModules === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-lg p-12 text-center">
              <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Este curso todavía no tiene módulos. El administrador los está preparando.
              </p>
            </div>
          ) : (
            course.modules.map((mod, modIdx) => {
              const isModuleDone = completedModules.has(mod.id);
              return (
                <section
                  key={mod.id}
                  className="bg-card border border-border rounded-lg overflow-hidden"
                >
                  <header className="px-6 py-4 border-b border-border flex items-center gap-4 bg-secondary/30">
                    <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                      {modIdx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{mod.title}</h3>
                      {mod.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {mod.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {mod.blocks.length} bloque{mod.blocks.length === 1 ? "" : "s"}
                    </span>
                    {isEnrolled && <ModuleChecklist moduleId={mod.id} completed={isModuleDone} />}
                  </header>

                  <div className="p-6 space-y-4">
                    {mod.blocks.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">
                        Este módulo está vacío.
                      </p>
                    ) : (
                      mod.blocks.map((block) => (
                        <BlockRenderer key={block.id} block={block as RendererBlock} />
                      ))
                    )}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}