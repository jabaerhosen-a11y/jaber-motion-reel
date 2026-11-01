import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { categoryLabel, type Project } from "@/lib/portfolio";

export function ProjectCard({ p }: { p: Project }) {
  return (
    <Link
      to="/work/$slug"
      params={{ slug: p.slug }}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/60 hover:shadow-glow"
    >
      <div className="relative aspect-video overflow-hidden bg-surface">
        <img
          src={p.thumbnail_url}
          alt={p.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-background/30 opacity-0 transition group-hover:opacity-100">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Play className="h-6 w-6 fill-current" />
          </span>
        </div>
        {p.duration && (
          <span className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-0.5 font-mono text-xs">
            {p.duration}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <h3 className="font-display text-lg font-semibold">{p.title}</h3>
        <span className="eyebrow shrink-0">{categoryLabel(p.category)}</span>
      </div>
    </Link>
  );
}
