import { FileText, Video as VideoIcon } from "lucide-react";
import { getVideoEmbedUrl } from "@/lib/video";

interface Block {
  id: string;
  type: "text" | "video";
  title: string | null;
  body: string;
}

export function BlockRenderer({ block }: { block: Block }) {
  if (block.type === "video") {
    const embed = getVideoEmbedUrl(block.body);
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-secondary/30">
          <VideoIcon className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Video</span>
          {block.title && (
            <span className="text-sm font-medium text-foreground truncate">{block.title}</span>
          )}
        </div>
        <div className="aspect-video bg-black">
          {embed ? (
            <iframe
              src={embed}
              title={block.title ?? "Video del módulo"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <video src={block.body} controls className="w-full h-full" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-secondary/30">
        <FileText className="w-4 h-4 text-blue-400" />
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Lectura</span>
        {block.title && (
          <span className="text-sm font-medium text-foreground truncate">{block.title}</span>
        )}
      </div>
      <div className="p-5 prose prose-invert prose-sm max-w-none">
        {block.body.split(/\n{2,}/).map((paragraph, i) => (
          <p key={i} className="text-foreground/90 leading-relaxed whitespace-pre-wrap mb-3 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}