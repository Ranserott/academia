"use client";

import { useState } from "react";
import { VideoPlayer } from "@/components/ui/VideoPlayer";

interface CourseViewerProps {
  lessonId: string;
  videoUrl: string | null;
  title: string;
  onComplete?: () => void;
}

export function CourseViewer({ lessonId, videoUrl, title, onComplete }: CourseViewerProps) {
  const [watched, setWatched] = useState(false);

  if (!videoUrl) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-500">Esta lección aún no tiene video disponible.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">{title}</h3>
      <VideoPlayer 
        url={videoUrl} 
        onProgress={(p) => {
          if (p > 90 && !watched) {
            setWatched(true);
            onComplete?.();
          }
        }} 
      />
    </div>
  );
}
