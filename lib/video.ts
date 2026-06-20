// Utility functions for YouTube and Vimeo video embedding

export function getVideoEmbedUrl(url: string | null): string | null {
  if (!url) return null;

  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // YouTube Shorts
  const youtubeShortsMatch = url.match(
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
  );
  if (youtubeShortsMatch) {
    return `https://www.youtube.com/embed/${youtubeShortsMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Vimeo with extra path
  const vimeoHashMatch = url.match(/vimeo\.com\/\d+\/(\w+)/);
  if (vimeoHashMatch) {
    return `https://player.vimeo.com/video/${vimeoHashMatch[1]}`;
  }

  // If already an embed URL, return as is
  if (url.includes("/embed/") || url.includes("/player.vimeo.com/")) {
    return url;
  }

  return null;
}

export function getVideoId(url: string): string | null {
  if (!url) return null;

  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch) return youtubeMatch[1];

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return vimeoMatch[1];

  return null;
}

export function getVideoThumbnail(url: string): string | null {
  const videoId = getVideoId(url);
  if (!videoId) return null;

  // YouTube thumbnail
  if (url.includes("youtube") || url.includes("youtu.be")) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  // Vimeo thumbnail - requires API call, return null for now
  return null;
}
