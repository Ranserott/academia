import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";

export default async function CursosPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      lessons: true,
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // If no courses in DB, show message
  if (courses.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Explorar Cursos</h1>
            <p className="text-gray-500 mb-8">
              Aún no hay cursos disponibles. ¡Pronto vendrá algo increíble!
            </p>
            <Link
              href="/api/seed"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Cargar cursos de prueba
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explorar Cursos</h1>
          <p className="text-gray-500">
            Encuentra el curso perfecto para ti
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/cursos/${course.slug}`}
              className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/50 transition-all"
            >
              {course.image && (
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="font-bold mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {course.lessons.length} lecciones
                  </span>
                  <span className="font-bold text-primary">
                    {course.price === 0 ? "Gratis" : `$${course.price.toLocaleString("es-CL")}`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
