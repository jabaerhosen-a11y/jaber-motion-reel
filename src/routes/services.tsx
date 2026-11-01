import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import * as Icons from "lucide-react";
import { servicesQuery } from "@/lib/portfolio";
import { PageHeader } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Jaber Nafiz Video Editing" },
      { name: "description", content: "YouTube, ads, reels, SaaS demos, fitness and motion graphics editing services." },
      { property: "og:title", content: "Services — Jaber Nafiz Video Editing" },
      { property: "og:description", content: "What I can edit and animate for you." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  component: Services,
  errorComponent: ({ error }) => <p className="p-32 text-center">{error instanceof Error ? error.message : "Error"}</p>,
  notFoundComponent: () => <p className="p-32 text-center">Not found</p>,
});

function Services() {
  const { data } = useSuspenseQuery(servicesQuery);
  return (
    <>
      <PageHeader eyebrow="What I do" title={<>SERVICES<span className="text-primary">.</span></>} sub="From raw footage to scroll-stopping content." />
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((s, i) => {
          const Icon = ((Icons as unknown as Record<string, Icons.LucideIcon>)[s.icon] ?? Icons.Film);
          return (
            <div key={s.id} className="flex flex-col rounded-xl border border-border bg-card p-6 transition hover:border-primary/60">
              <div className="flex items-center justify-between">
                <Icon className="h-8 w-8 text-primary" />
                <span className="font-mono text-xs text-faint">0{i + 1}</span>
              </div>
              <h3 className="mt-6 font-display text-xl font-bold">{s.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              <ul className="mt-4 space-y-1 text-sm">
                {s.deliverables.map((d) => <li key={d}>✦ {d}</li>)}
              </ul>
              <Link to="/contact" className="mt-auto pt-6 text-sm font-semibold text-primary">{s.cta_label} →</Link>
            </div>
          );
        })}
      </section>
    </>
  );
}
