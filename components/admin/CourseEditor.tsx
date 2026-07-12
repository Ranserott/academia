"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, FileText, Video, ChevronUp, ChevronDown, Loader2, BookOpen } from "lucide-react";

type BlockType = "text" | "video";

interface ContentBlock {
  id: string;
  type: BlockType;
  title: string | null;
  body: string;
  order: number;
  moduleId: string;
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  courseId: string;
  blocks: ContentBlock[];
}

interface CourseEditorProps {
  courseId: string;
  initialModules: Module[];
}

export function CourseEditor({ courseId, initialModules }: CourseEditorProps) {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [creatingModule, setCreatingModule] = useState(false);

  const reload = async () => {
    const res = await fetch(`/api/admin/modules?courseId=${courseId}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setModules(data.modules ?? []);
    }
  };

  const createModule = async () => {
    setCreatingModule(true);
    try {
      const res = await fetch("/api/admin/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          title: `Módulo ${modules.length + 1}`,
          description: "",
        }),
      });
      if (res.ok) await reload();
    } finally {
      setCreatingModule(false);
    }
  };

  const updateModule = async (id: string, data: Partial<Pick<Module, "title" | "description">>) => {
    setModules((curr) => curr.map((m) => (m.id === id ? { ...m, ...data } : m)));
    await fetch(`/api/admin/modules/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const deleteModule = async (id: string) => {
    if (!confirm("¿Eliminar este módulo y todos sus bloques?")) return;
    await fetch(`/api/admin/modules/${id}`, { method: "DELETE" });
    setModules((curr) => curr.filter((m) => m.id !== id));
  };

  const moveModule = async (id: string, direction: -1 | 1) => {
    const idx = modules.findIndex((m) => m.id === id);
    if (idx < 0) return;
    const target = idx + direction;
    if (target < 0 || target >= modules.length) return;

    const newOrder = [...modules];
    const [item] = newOrder.splice(idx, 1);
    newOrder.splice(target, 0, item);
    setModules(newOrder);

    await Promise.all(
      newOrder.map((m, i) =>
        m.order !== i
          ? fetch(`/api/admin/modules/${m.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order: i }),
            })
          : null,
      ),
    );
  };

  const addBlock = async (moduleId: string, type: BlockType) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;

    const placeholder = type === "text" ? "Escribe el contenido acá…" : "https://www.youtube.com/watch?v=…";
    const res = await fetch("/api/admin/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        moduleId,
        type,
        title: "",
        body: placeholder,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setModules((curr) =>
        curr.map((m) =>
          m.id === moduleId ? { ...m, blocks: [...m.blocks, data.block] } : m,
        ),
      );
    }
  };

  const updateBlock = async (
    moduleId: string,
    blockId: string,
    data: Partial<Pick<ContentBlock, "title" | "body" | "type">>,
  ) => {
    setModules((curr) =>
      curr.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              blocks: m.blocks.map((b) => (b.id === blockId ? { ...b, ...data } : b)),
            }
          : m,
      ),
    );
    const payload: Record<string, unknown> = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.body !== undefined) payload.body = data.body;
    if (data.type !== undefined) payload.type = data.type;
    await fetch(`/api/admin/blocks/${blockId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  const deleteBlock = async (moduleId: string, blockId: string) => {
    if (!confirm("¿Eliminar este bloque?")) return;
    await fetch(`/api/admin/blocks/${blockId}`, { method: "DELETE" });
    setModules((curr) =>
      curr.map((m) =>
        m.id === moduleId ? { ...m, blocks: m.blocks.filter((b) => b.id !== blockId) } : m,
      ),
    );
  };

  const moveBlock = async (moduleId: string, blockId: string, direction: -1 | 1) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;
    const idx = module.blocks.findIndex((b) => b.id === blockId);
    if (idx < 0) return;
    const target = idx + direction;
    if (target < 0 || target >= module.blocks.length) return;

    const newBlocks = [...module.blocks];
    const [item] = newBlocks.splice(idx, 1);
    newBlocks.splice(target, 0, item);

    setModules((curr) =>
      curr.map((m) => (m.id === moduleId ? { ...m, blocks: newBlocks } : m)),
    );

    await Promise.all(
      newBlocks.map((b, i) =>
        b.order !== i
          ? fetch(`/api/admin/blocks/${b.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order: i }),
            })
          : null,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {modules.length === 0
            ? "Este curso no tiene módulos todavía."
            : `${modules.length} módulo${modules.length === 1 ? "" : "s"} · ${modules.reduce((acc, m) => acc + m.blocks.length, 0)} bloque${modules.reduce((acc, m) => acc + m.blocks.length, 0) === 1 ? "" : "s"}`}
        </p>
        <button
          onClick={createModule}
          disabled={creatingModule}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm font-medium transition-colors"
        >
          {creatingModule ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Nuevo módulo
        </button>
      </div>

      {modules.map((mod, modIdx) => (
        <ModuleCard
          key={mod.id}
          module={mod}
          moduleIndex={modIdx}
          totalModules={modules.length}
          onUpdateModule={updateModule}
          onDeleteModule={deleteModule}
          onMoveModule={moveModule}
          onAddBlock={addBlock}
          onUpdateBlock={updateBlock}
          onDeleteBlock={deleteBlock}
          onMoveBlock={moveBlock}
        />
      ))}

      {modules.length === 0 && (
        <div className="bg-card border border-dashed border-border rounded-lg p-12 text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">Empezá con tu primer módulo</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Los módulos agrupan bloques de texto y video para tus alumnos.
          </p>
          <button
            onClick={createModule}
            disabled={creatingModule}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Crear primer módulo
          </button>
        </div>
      )}
    </div>
  );
}

interface ModuleCardProps {
  module: Module;
  moduleIndex: number;
  totalModules: number;
  onUpdateModule: (id: string, data: Partial<Pick<Module, "title" | "description">>) => Promise<void>;
  onDeleteModule: (id: string) => Promise<void>;
  onMoveModule: (id: string, direction: -1 | 1) => Promise<void>;
  onAddBlock: (moduleId: string, type: BlockType) => Promise<void>;
  onUpdateBlock: (moduleId: string, blockId: string, data: Partial<Pick<ContentBlock, "title" | "body" | "type">>) => Promise<void>;
  onDeleteBlock: (moduleId: string, blockId: string) => Promise<void>;
  onMoveBlock: (moduleId: string, blockId: string, direction: -1 | 1) => Promise<void>;
}

function ModuleCard({
  module,
  moduleIndex,
  totalModules,
  onUpdateModule,
  onDeleteModule,
  onMoveModule,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
}: ModuleCardProps) {
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description ?? "");

  useEffect(() => {
    setTitle(module.title);
    setDescription(module.description ?? "");
  }, [module.title, module.description]);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="bg-secondary/30 px-5 py-4 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="flex flex-col gap-1 pt-1">
            <button
              type="button"
              onClick={() => onMoveModule(module.id, -1)}
              disabled={moduleIndex === 0}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Subir"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onMoveModule(module.id, 1)}
              disabled={moduleIndex === totalModules - 1}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Bajar"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-medium bg-primary/15 text-primary rounded">
                Módulo {moduleIndex + 1}
              </span>
              <span className="text-xs text-muted-foreground">
                {module.blocks.length} bloque{module.blocks.length === 1 ? "" : "s"}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => title !== module.title && onUpdateModule(module.id, { title })}
              placeholder="Título del módulo"
              className="w-full bg-transparent border-0 text-lg font-semibold text-foreground focus:outline-none focus:ring-0 px-0 placeholder:text-muted-foreground"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() =>
                description !== (module.description ?? "") &&
                onUpdateModule(module.id, { description })
              }
              placeholder="Descripción breve del módulo (opcional)"
              rows={2}
              className="w-full bg-transparent border-0 text-sm text-muted-foreground focus:outline-none focus:ring-0 px-0 resize-none placeholder:text-muted-foreground"
            />
          </div>

          <button
            type="button"
            onClick={() => onDeleteModule(module.id)}
            className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
            aria-label="Eliminar módulo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {module.blocks.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            Este módulo aún no tiene contenido. Agregá un bloque de texto o video.
          </p>
        )}

        {module.blocks.map((block, blockIdx) => (
          <BlockEditor
            key={block.id}
            block={block}
            blockIndex={blockIdx}
            totalBlocks={module.blocks.length}
            onUpdate={(data) => onUpdateBlock(module.id, block.id, data)}
            onDelete={() => onDeleteBlock(module.id, block.id)}
            onMove={(dir) => onMoveBlock(module.id, block.id, dir)}
          />
        ))}

        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => onAddBlock(module.id, "text")}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            Agregar texto
          </button>
          <button
            type="button"
            onClick={() => onAddBlock(module.id, "video")}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
          >
            <Video className="w-4 h-4" />
            Agregar video
          </button>
        </div>
      </div>
    </div>
  );
}

interface BlockEditorProps {
  block: ContentBlock;
  blockIndex: number;
  totalBlocks: number;
  onUpdate: (data: Partial<Pick<ContentBlock, "title" | "body" | "type">>) => Promise<void>;
  onDelete: () => Promise<void>;
  onMove: (direction: -1 | 1) => Promise<void>;
}

function BlockEditor({ block, blockIndex, totalBlocks, onUpdate, onDelete, onMove }: BlockEditorProps) {
  const [title, setTitle] = useState(block.title ?? "");
  const [body, setBody] = useState(block.body);
  const [type, setType] = useState<BlockType>(block.type);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(block.title ?? "");
    setBody(block.body);
    setType(block.type);
  }, [block.title, block.body, block.type]);

  const dirty =
    title !== (block.title ?? "") ||
    body !== block.body ||
    type !== block.type;

  const save = async () => {
    if (!dirty) return;
    setSaving(true);
    try {
      await onUpdate({ title, body, type });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-secondary/20 border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-1 pt-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={blockIndex === 0}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Subir bloque"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={blockIndex === totalBlocks - 1}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Bajar bloque"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1">
          {type === "text" ? (
            <FileText className="w-4 h-4 text-blue-400" />
          ) : (
            <Video className="w-4 h-4 text-purple-400" />
          )}
          <select
            value={type}
            onChange={(e) => setType(e.target.value as BlockType)}
            className="bg-secondary/50 border border-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="text">Texto</option>
            <option value="video">Video</option>
          </select>
          <span className="text-xs text-muted-foreground">#{blockIndex + 1}</span>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"
          aria-label="Eliminar bloque"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={type === "video" ? "Título del video (opcional)" : "Título del bloque (opcional)"}
        className="w-full bg-background border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />

      {type === "text" ? (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Escribí el contenido del módulo. Podés usar saltos de línea."
          rows={6}
          className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
        />
      ) : (
        <>
          <input
            type="url"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=… o link directo .mp4"
            className="w-full bg-background border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {body && (
            <p className="text-xs text-muted-foreground">
              Acepta YouTube, Vimeo o links directos .mp4 / .webm / .ogg.
            </p>
          )}
        </>
      )}

      <div className="flex justify-end gap-2 pt-1">
        {dirty && (
          <span className="text-xs text-amber-400 self-center mr-auto">Cambios sin guardar</span>
        )}
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Guardar bloque
        </button>
      </div>
    </div>
  );
}