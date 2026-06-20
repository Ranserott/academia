import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { EnrollButton } from "./EnrollButton";
import { LessonChecklist } from "./LessonChecklist";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const course = await prisma.course.findUnique({
    where: { slug: id },
    include: {
      lessons: { orderBy: { order: "asc" } },
    },
  });

  if (!course) {
    notFound();
  }

  const session = await auth();
  
  // Check if user is enrolled
  let isEnrolled = false;
  let progress: Record<string, boolean> = {};
  
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
          lessonId: { in: course.lessons.map((l) => l.id) },
        },
      });
      progress = Object.fromEntries(
        progressRecords.map((p) => [p.lessonId, p.completed])
      );
    }
  }

  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPercent = course.lessons.length > 0
    ? Math.round((completedCount / course.lessons.length) * 100)
    : 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-500 mb-6">{course.description}</p>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {course.lessons.length} lecciones
              </span>
              <span className="font-bold text-xl text-primary">
                {course.price === 0 ? "Gratis" : `$${course.price.toLocaleString("es-CL")}`}
              </span>
            </div>

            {!isEnrolled ? (
              <EnrollButton courseId={course.id} price={course.price} />
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-700 font-medium">✓ Ya estás inscrito</p>
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-green-600 mb-1">
                    <span>Progreso del curso</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
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

        {/* Lessons */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Contenido del Curso</h2>
          
          {course.lessons.length === 0 ? (
            <p className="text-gray-500">Este curso aún no tiene lecciones.</p>
          ) : (
            <div className="space-y-2">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-primary/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{lesson.title}</h3>
                    {lesson.description && (
                      <p className="text-sm text-gray-500">{lesson.description}</p>
                    )}
                  </div>
                  {isEnrolled && (
                    <LessonChecklist
                      lessonId={lesson.id}
                      completed={progress[lesson.id] ?? false}
                      courseId={course.id}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
