import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function MisCursosPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get user's enrollments with course data
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          lessons: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Get progress for each enrollment
  const enrollmentsWithProgress = await Promise.all(
    enrollments.map(async (enrollment) => {
      const progress = await prisma.progress.findMany({
        where: {
          userId: session.user.id,
          lessonId: { in: enrollment.course.lessons.map((l) => l.id) },
        },
      });

      const completedLessons = progress.filter((p) => p.completed).length;
      const totalLessons = enrollment.course.lessons.length;
      const progressPercentage =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      return {
        ...enrollment,
        progress: progressPercentage,
        completedLessons,
        totalLessons,
      };
    })
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mis Cursos</h1>

      {enrollmentsWithProgress.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-500 mb-4">
            Aún no estás inscrito en ningún curso
          </p>
          <Link
            href="/cursos"
            className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Explorar Cursos
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {enrollmentsWithProgress.map((enrollment) => (
            <Link
              key={enrollment.id}
              href={`/cursos/${enrollment.course.slug}`}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {enrollment.course.image && (
                <img
                  src={enrollment.course.image}
                  alt={enrollment.course.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              <h2 className="font-semibold mb-2">
                {enrollment.course.title}
              </h2>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Progreso</span>
                  <span>{enrollment.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {enrollment.completedLessons} / {enrollment.totalLessons} lecciones
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
