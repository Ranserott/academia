"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function NewCourseDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugPreview = slugTouched && slug ? slugify(slug) : slugify(title);

  const reset = () => {
    setTitle("");
    setSlug("");
    setSlugTouched(false);
    setDescription("");
    setPrice(0);
    setImage("");
    setPublished(false);
    setError(null);
  };

  const close = () => {
    if (loading) return;
    setOpen(false);
    reset();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slugPreview,
          description,
          price,
          image,
          published,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al crear el curso");
        return;
      }

      router.push(`/admin/courses/${data.course.id}`);
    } catch (err) {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors"
      >
        <Plus className="w-4 h-4" />
        Nuevo curso
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={close}
              disabled={loading}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground disabled:opacity-30"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="px-6 pt-6 pb-2">
              <h2 className="text-xl font-bold mb-1">Crear nuevo curso</h2>
              <p className="text-sm text-muted-foreground">
                Después podés agregar módulos y bloques desde el editor.
              </p>
            </div>

            <form onSubmit={submit} className="px-6 pb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">
                  Título del curso
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={3}
                  placeholder="Ej: Fundamentos de Python"
                  className="w-full p-2 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">
                  Slug <span className="text-muted-foreground text-xs">(URL pública, se genera del título)</span>
                </label>
                <div className="flex items-stretch">
                  <span className="inline-flex items-center px-3 bg-secondary/30 border border-r-0 border-border rounded-l-lg text-sm text-muted-foreground">
                    /cursos/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugTouched(true);
                    }}
                    placeholder={slugify(title) || "fundamentos-python"}
                    className="flex-1 p-2 bg-secondary/50 border border-border rounded-r-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {slugPreview && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Vista previa: <span className="text-foreground font-mono">/cursos/{slugPreview}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  minLength={5}
                  rows={3}
                  placeholder="¿Qué va a aprender el alumno en este curso?"
                  className="w-full p-2 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    Precio (CLP)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value || "0") || 0)}
                    min={0}
                    step={100}
                    placeholder="0 = gratis"
                    className="w-full p-2 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">En pesos chilenos. 0 = gratis.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    URL de imagen
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">Publicar inmediatamente</span>
                <span className="text-xs text-muted-foreground">
                  (si no, queda en borrador)
                </span>
              </label>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={close}
                  disabled={loading}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim() || !description.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {loading ? "Creando…" : "Crear y abrir editor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}