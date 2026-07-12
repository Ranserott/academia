"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface ModuleChecklistProps {
  moduleId: string;
  completed: boolean;
}

export function ModuleChecklist({ moduleId, completed: initial }: ModuleChecklistProps) {
  const [completed, setCompleted] = useState(initial);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, completed: !completed }),
      });
      if (res.ok) setCompleted(!completed);
    } catch (err) {
      console.error("Failed to update module progress:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={completed ? "Marcar módulo como no completado" : "Marcar módulo como completado"}
      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all disabled:opacity-50 ${
        completed
          ? "bg-green-500 border-green-500 text-white"
          : "border-border hover:border-green-500"
      }`}
    >
      {completed && <Check className="w-4 h-4" />}
    </button>
  );
}