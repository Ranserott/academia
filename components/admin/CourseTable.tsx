"use client";

import { BookOpen } from "lucide-react";

interface Course {
  id: string;
  title: string;
  published: boolean;
  price: number;
  createdAt: Date;
}

interface CourseTableProps {
  courses: Course[];
}

export function CourseTable({ courses }: CourseTableProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-secondary/30">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Curso
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {courses.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-4">
                <div className="py-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-medium mb-1">No hay cursos aún</p>
                  <p className="text-sm text-muted-foreground">
                    Cuando crees cursos desde el panel, aparecerán acá
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">
                    {course.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                      course.published
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    }`}
                  >
                    {course.published ? "Publicado" : "Borrador"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {course.price === 0 ? "Gratis" : `$${course.price.toLocaleString("es-CL")}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  <button className="text-primary hover:text-primary/80">
                    Editar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
