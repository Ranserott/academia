import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import {
  BookOpen,
  Users,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const [
    totalCourses,
    publishedCourses,
    totalStudents,
    totalEnrollments,
    totalLessons,
    completedLessons,
    revenueAgg,
    recentEnrollments,
  ] = await Promise.all([
    prisma.course.count(),
    prisma.course.count({ where: { published: true } }),
    prisma.user.count({ where: { role: "student" } }),
    prisma.enrollment.count(),
    prisma.lesson.count(),
    prisma.progress.count({ where: { completed: true } }),
    prisma.course.aggregate({
      _sum: { price: true },
      where: { enrollments: { some: {} } },
    }),
    prisma.enrollment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true, slug: true } },
      },
    }),
  ]);

  const totalRevenue = revenueAgg._sum.price ?? 0;
  const completionRate =
    totalLessons > 0 && totalEnrollments > 0
      ? Math.round((completedLessons / (totalLessons * totalEnrollments)) * 100)
      : 0;

  const formatCLP = (n: number) =>
    n === 0 ? "Gratis" : `$${n.toLocaleString("es-CL")}`;

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <AdminHeader title="Dashboard" />

      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Bienvenido, {session.user.name ?? "Admin"}
          </h2>
          <p className="text-muted-foreground">
            Resumen general de la plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Cursos Publicados"
            value={`${publishedCourses} / ${totalCourses}`}
            icon={BookOpen}
          />
          <StatsCard
            title="Estudiantes"
            value={totalStudents}
            icon={Users}
          />
          <StatsCard
            title="Revenue Total"
            value={formatCLP(totalRevenue)}
            icon={DollarSign}
          />
          <StatsCard
            title="Tasa de Finalización"
            value={`${completionRate}%`}
            icon={GraduationCap}
          />
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Inscripciones Recientes</h3>
            <Link
              href="/admin/students"
              className="text-sm text-primary hover:underline"
            >
              Ver todas →
            </Link>
          </div>

          {recentEnrollments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aún no hay inscripciones
            </p>
          ) : (
            <div className="space-y-3">
              {recentEnrollments.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {e.user.name ?? e.user.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      se inscribió en{" "}
                      <span className="text-foreground">{e.course.title}</span>
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(e.createdAt).toLocaleDateString("es-CL")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="pt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Academia. Todos los derechos reservados.
          </p>
        </footer>
      </main>
    </div>
  );
}