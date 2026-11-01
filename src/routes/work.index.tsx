import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Search } from "lucide-react";
import { categoryLabel, filterProjects, projectsQuery } from "@/lib/portfolio";
import { ProjectCard } from "@/components/site/ProjectCard";
import { PageHeader } from "@/components/site/SiteChrome";

const schema = z.object({
  cat: fallback(z.string(), "all").default("all"),
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/work/")({
  validateSearch: zodValidator(schema),
  head: () => ({
    meta: [
      { title: "Work — Jaber Nafiz Portfolio" },
      { name: "description", content: "Ads, gym films, vlogs and motion graphics edited by Jaber Nafiz." },
      { property: "og:title", content: "Work — Jaber Nafiz Portfolio" },
      { property: "og:description", content: "Browse video edits and motion graphics projects." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQuery),
  component: Work,
  errorComponent: ({ error }) => <p className="p-32 text-center">{error instanceof Error ? error.message : "Error"}</p>,
  notFoundComponent: () => <p className="p-32 text-center">Not found</p>,
});

function Work() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const { cat, q } = Route.useSearch();
  const navigate = useNavigate({ from: "/work/" });
  const cats = ["all", ...Array.from(new Set(projects.map((p) => p.category)))];
  const list = filterProjects(projects, cat, q);

  return (
    <>
      <PageHeader eyebrow={`${projects.length} projects`} title={<>THE <span className="text-primary">WORK.</span></>} />
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => navigate({ search: (p) => ({ ...p, cat: c }), replace: true })}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                  cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {c === "all" ? "All" : categoryLabel(c)}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 md:w-72">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => navigate({ search: (p) => ({ ...p, q: e.target.value }), replace: true })}
              placeholder="Search projects…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
            />
          </label>
        </div>
        {list.length === 0 ? (
          <p className="py-24 text-center text-muted-foreground">No projects match. Try another filter.</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => <ProjectCard key={p.id} p={p} />)}
          </div>
        )}
      </section>
    </>
  );
}
