import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get user's enrollments with progress
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

  const totalCourses = enrollments.length;
  const completedCourses = enrollmentsWithProgress.filter(
    (e) => e.progress === 100
  ).length;
  const totalLessonsCompleted = enrollmentsWithProgress.reduce(
    (acc, e) => acc + e.completedLessons,
    0
  );

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Mi Dashboard</h1>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Cursos Inscritos</p>
            <p className="text-3xl font-bold">{totalCourses}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Cursos Completados</p>
            <p className="text-3xl font-bold">{completedCourses}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Lecciones Completadas</p>
            <p className="text-3xl font-bold">{totalLessonsCompleted}</p>
          </div>
        </div>

        {/* Recent Courses */}
        <h2 className="text-xl font-bold mb-4">Mis Cursos</h2>
        
        {enrollmentsWithProgress.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 mb-4">
              Aún no tienes cursos inscritos
            </p>
            <Link
              href="/cursos"
              className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Explorar Cursos
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {enrollmentsWithProgress.slice(0, 4).map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/cursos/${enrollment.course.slug}`}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {enrollment.course.image && (
                    <img
                      src={enrollment.course.image}
                      alt={enrollment.course.title}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">
                      {enrollment.course.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">
                        {enrollment.progress}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {enrollment.completedLessons} / {enrollment.totalLessons} lecciones
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {enrollmentsWithProgress.length > 4 && (
          <div className="mt-4 text-center">
            <Link
              href="/dashboard/mis-cursos"
              className="text-primary hover:underline"
            >
              Ver todos mis cursos →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
