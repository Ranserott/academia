'use client'

import { useState } from 'react'

interface VideoPlayerProps {
  url: string
  onProgress?: (progress: number) => void
}

export function VideoPlayer({ url, onProgress }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  
  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <video 
        src={url}
        className="w-full h-full"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        controls
      />
    </div>
  )
}
