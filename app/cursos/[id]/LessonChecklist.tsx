"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface LessonChecklistProps {
  lessonId: string;
  completed: boolean;
  courseId: string;
}

export function LessonChecklist({
  lessonId,
  completed: initialCompleted,
  courseId,
}: LessonChecklistProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  const toggleComplete = async () => {
    setLoading(true);
    
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          completed: !completed,
        }),
      });

      if (res.ok) {
        setCompleted(!completed);
      }
    } catch (err) {
      console.error("Failed to update progress:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleComplete}
      disabled={loading}
      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
        completed
          ? "bg-green-500 border-green-500 text-white"
          : "border-gray-300 hover:border-green-500"
      }`}
    >
      {completed && <Check className="w-4 h-4" />}
    </button>
  );
}
