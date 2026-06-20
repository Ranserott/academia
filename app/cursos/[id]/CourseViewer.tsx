"use client";

import { useEffect, useRef, useState } from "react";
import { getVideoEmbedUrl } from "@/lib/video";

interface CourseViewerProps {
  lessonId: string;
  videoUrl: string | null;
  title: string;
  onComplete?: () => void;
}

export function CourseViewer({ lessonId, videoUrl, title, onComplete }: CourseViewerProps) {
  const [watched, setWatched] = useState(false);
  const embedUrl = getVideoEmbedUrl(videoUrl);

  if (!videoUrl || !embedUrl) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-gray-500">Esta lección aún no tiene video disponible.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => {
            // Auto-mark as watched when video loads
            if (!watched) {
              setWatched(true);
              onComplete?.();
            }
          }}
        />
      </div>
      <p className="text-sm text-gray-500">
        Enlaces de YouTube y Vimeo detectados automáticamente
      </p>
    </div>
  );
}
