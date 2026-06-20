"use client";

import { useState, useEffect } from "react";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  order: number;
}

interface Course {
  id: string;
  title: string;
  lessons: Lesson[];
}

export function LessonManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/lessons");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
        if (data.length > 0 && !selectedCourse) {
          setSelectedCourse(data[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const saveLesson = async () => {
    if (!editingLesson) return;
    setLoading(true);

    try {
      const res = await fetch("/api/admin/lessons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingLesson),
      });

      if (res.ok) {
        await fetchCourses();
        setEditingLesson(null);
      }
    } catch (error) {
      console.error("Failed to save lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  const addLesson = async () => {
    if (!selectedCourse) return;
    setLoading(true);

    try {
      const newLesson = {
        courseId: selectedCourse,
        title: "Nueva Lección",
        description: "",
        videoUrl: "",
        order: 0,
      };

      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLesson),
      });

      if (res.ok) {
        await fetchCourses();
      }
    } catch (error) {
      console.error("Failed to add lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentCourse = courses.find((c) => c.id === selectedCourse);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Gestionar Lecciones</h2>
        <button
          onClick={addLesson}
          disabled={!selectedCourse || loading}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          + Agregar Lección
        </button>
      </div>

      {/* Course Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Curso</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Seleccionar curso...</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title} ({course.lessons.length} lecciones)
            </option>
          ))}
        </select>
      </div>

      {/* Lessons List */}
      {currentCourse && (
        <div className="space-y-4">
          {currentCourse.lessons.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Este curso aún no tiene lecciones
            </p>
          ) : (
            currentCourse.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{lesson.title}</h3>
                    {lesson.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {lesson.description}
                      </p>
                    )}
                    {lesson.videoUrl && (
                      <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                        <span>🎬</span>
                        {lesson.videoUrl.includes("youtube") && "YouTube"}
                        {lesson.videoUrl.includes("vimeo") && "Vimeo"}
                        {!lesson.videoUrl.includes("youtube") &&
                          !lesson.videoUrl.includes("vimeo") &&
                          "Video link"}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setEditingLesson(lesson)}
                    className="ml-4 px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-bold mb-4">Editar Lección</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={editingLesson.title}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, title: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  value={editingLesson.description || ""}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Video URL (YouTube o Vimeo)
                </label>
                <input
                  type="url"
                  value={editingLesson.videoUrl || ""}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      videoUrl: e.target.value,
                    })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-2 border rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pega el link de YouTube o Vimeo. Se embedear automáticamente.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Orden</label>
                <input
                  type="number"
                  value={editingLesson.order}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={saveLesson}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
              <button
                onClick={() => setEditingLesson(null)}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
