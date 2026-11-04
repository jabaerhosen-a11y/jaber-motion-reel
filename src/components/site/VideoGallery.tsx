import { useState } from "react";
import { Play, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryLabel, filterProjects, type Project } from "@/lib/portfolio";
import { videoAspect } from "@/lib/video-format";
import { playbackSource } from "@/lib/video-media";

export function InlineVideo({ project, active, onPlay, onClose }: {
  project: Pick<Project, "title" | "orientation" | "thumbnail_url" | "video_url" | "duration">;
  active: boolean;
  onPlay: () => void;
  onClose: () => void;
}) {
  const portrait = videoAspect(project.orientation) === "9/16";
  const source = playbackSource(project.video_url);
  const embedded = source.includes("drive.google.com");
  return (
    <div data-video-format={videoAspect(project.orientation)} className={`relative overflow-hidden rounded-lg border border-border bg-surface ${portrait ? "aspect-[9/16]" : "aspect-video"}`}>
      {active ? (
        <>
          {embedded ? <iframe src={`${source}?autoplay=1`} title={project.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full border-0" /> : <video src={source} aria-label={project.title} autoPlay playsInline controls preload="metadata" className="absolute inset-0 h-full w-full object-contain bg-background" />}
          <Button variant="secondary" size="icon" onClick={onClose} aria-label={`Close ${project.title}`} title="Close video" className="absolute right-2 top-2 z-10"><X /></Button>
        </>
      ) : (
        <Button variant="ghost" onClick={onPlay} aria-label={`Play ${project.title}`} className="group absolute inset-0 h-full w-full overflow-hidden rounded-none p-0">
          <img src={project.thumbnail_url} alt={project.title} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain" />
          <span className="absolute inset-0 bg-background/15 transition-colors group-hover:bg-background/30" />
          <span className="absolute flex h-14 w-14 items-center justify-center rounded-full border border-primary/60 bg-background/70 text-primary backdrop-blur transition-transform group-hover:scale-110"><Play className="size-6 fill-current" /></span>
          {project.duration && <span className="absolute bottom-3 right-3 rounded bg-background/80 px-2 py-1 font-mono text-xs text-foreground">{project.duration}</span>}
        </Button>
      )}
    </div>
  );
}

export function VideoGallery({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [playing, setPlaying] = useState<string | null>(null);
  const categories = Array.from(new Set(projects.map((p) => p.category)));
  const filtered = filterProjects(projects, category, query);
  const groups = [
    { label: "Films & motion", orientation: "landscape" },
    { label: "Reels & vertical stories", orientation: "portrait" },
  ];
  return (
    <section id="work" className="scroll-mt-24 border-t border-border py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div><p className="eyebrow">The portfolio / {projects.length} projects</p><h2 className="text-mega mt-4 text-4xl md:text-6xl">Selected <span className="text-primary">work.</span></h2></div>
          <label className="flex h-11 w-full items-center gap-2 rounded-lg border border-border bg-surface px-4 sm:w-72"><Search className="size-4 shrink-0 text-muted-foreground" /><input aria-label="Search projects" value={query} onChange={(e) => { setQuery(e.target.value); setPlaying(null); }} placeholder="Search projects…" className="min-w-0 w-full bg-transparent text-sm outline-none" /></label>
        </div>
        <div className="mt-8 flex flex-wrap gap-2" aria-label="Project categories">
          {["all", ...categories].map((c) => <Button key={c} variant={category === c ? "default" : "outline"} aria-pressed={category === c} onClick={() => { setCategory(c); setPlaying(null); }}>{c === "all" ? "All projects" : categoryLabel(c)}</Button>)}
        </div>
        {groups.map((group) => {
          const list = filtered.filter((p) => p.orientation === group.orientation);
          if (!list.length) return null;
          return <div key={group.orientation} className="mt-12">
            <div className="mb-5 flex items-center gap-4"><h3 className="font-display text-xl font-semibold">{group.label}</h3><span className="font-mono text-xs text-muted-foreground">{list.length.toString().padStart(2, "0")}</span><span className="h-px flex-1 bg-border" /></div>
            <div className={`grid gap-x-5 gap-y-8 ${group.orientation === "portrait" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
              {list.map((p) => <article key={p.id} className="work-tile min-w-0">
                <InlineVideo project={p} active={playing === p.id} onPlay={() => setPlaying(p.id)} onClose={() => setPlaying(null)} />
                <div className="mt-3"><p className="font-mono text-[10px] uppercase text-muted-foreground">{categoryLabel(p.category)}</p><h4 className="mt-1 break-words font-display text-lg font-semibold">{p.title}</h4></div>
              </article>)}
            </div>
          </div>;
        })}
        {!filtered.length && <p className="py-16 text-center text-muted-foreground">No projects match your search.</p>}
      </div>
    </section>
  );
}