import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { TrendingUp, Award, Target, Activity } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const [
    coursesByEnrollment,
    monthlyEnrollments,
    totalEnrollments,
    totalCompleted,
    totalProgress,
    freeVsPaid,
  ] = await Promise.all([
    prisma.course.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        _count: { select: { enrollments: true } },
      },
      orderBy: { enrollments: { _count: "desc" } },
      take: 10,
    }),
    prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COUNT(*) as count
      FROM "Enrollment"
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 6
    `,
    prisma.enrollment.count(),
    prisma.progress.count({ where: { completed: true } }),
    prisma.progress.count(),
    prisma.course.groupBy({
      by: ["published"],
      _count: { _all: true },
    }),
  ]);

  const completionRate =
    totalProgress > 0 ? Math.round((totalCompleted / totalProgress) * 100) : 0;

  const enrollmentsByMonth = monthlyEnrollments.reverse();

  const maxMonthCount = enrollmentsByMonth.reduce(
    (max, m) => Math.max(max, Number(m.count)),
    0,
  );

  const paidEnrollments = coursesByEnrollment
    .filter((c) => c.price > 0)
    .reduce((sum, c) => sum + c._count.enrollments, 0);
  const paidShare =
    totalEnrollments > 0
      ? Math.round((paidEnrollments / totalEnrollments) * 100)
      : 0;

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <AdminHeader title="Analytics" />

      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Analíticas</h2>
          <p className="text-muted-foreground">
            Métricas de uso y rendimiento de la plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Inscripciones Totales"
            value={totalEnrollments}
            icon={TrendingUp}
          />
          <StatsCard
            title="Tasa de Completitud"
            value={`${completionRate}%`}
            icon={Target}
          />
          <StatsCard
            title="Lecciones Completadas"
            value={totalCompleted}
            icon={Award}
          />
          <StatsCard
            title="% Inscripciones Pagadas"
            value={`${paidShare}%`}
            icon={Activity}
          />
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">
            Inscripciones por Mes (últimos 6 meses)
          </h3>
          {enrollmentsByMonth.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aún no hay inscripciones
            </p>
          ) : (
            <div className="space-y-3">
              {enrollmentsByMonth.map((m) => {
                const pct =
                  maxMonthCount > 0
                    ? Math.round((Number(m.count) / maxMonthCount) * 100)
                    : 0;
                return (
                  <div key={m.month} className="flex items-center gap-4">
                    <span className="w-20 text-sm text-muted-foreground font-mono">
                      {m.month}
                    </span>
                    <div className="flex-1 h-8 bg-secondary/30 rounded overflow-hidden">
                      <div
                        className="h-full bg-primary flex items-center px-3 text-xs text-white font-medium"
                        style={{ width: `${Math.max(pct, 8)}%` }}
                      >
                        {m.count.toString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Top 10 Cursos por Inscripciones</h3>
          {coursesByEnrollment.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aún no hay cursos con inscripciones
            </p>
          ) : (
            <div className="space-y-2">
              {coursesByEnrollment.map((c, i) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="font-medium">{c.title}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {c.price === 0 ? "Gratis" : `$${c.price.toLocaleString("es-CL")}`}
                    </span>
                    <span className="font-bold text-primary min-w-[3ch] text-right">
                      {c._count.enrollments}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}