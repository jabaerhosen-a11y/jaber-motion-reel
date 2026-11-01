import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { categoryLabel, projectsQuery } from "@/lib/portfolio";

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ context, params }) => {
    const all = await context.queryClient.ensureQueryData(projectsQuery);
    const p = all.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.title} — Jaber Nafiz` : "Project — Jaber Nafiz";
    const d = loaderData ? `${categoryLabel(loaderData.category)} project edited by Jaber Nafiz.` : "Video project";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        ...(loaderData?.thumbnail_url
          ? [
              { property: "og:image", content: loaderData.thumbnail_url },
              { name: "twitter:image", content: loaderData.thumbnail_url },
            ]
          : []),
      ],
    };
  },
  component: Detail,
  errorComponent: ({ error }) => <p className="p-32 text-center">{error instanceof Error ? error.message : "Error"}</p>,
  notFoundComponent: () => (
    <div className="p-32 text-center">
      <p>Project not found.</p>
      <Link to="/work" className="text-primary">Back to work</Link>
    </div>
  ),
});

function Detail() {
  const { slug } = Route.useParams();
  const { data: all } = useSuspenseQuery(projectsQuery);
  const i = all.findIndex((x) => x.slug === slug);
  const p = all[i]!;
  const next = all[(i + 1) % all.length]!;
  const portrait = p.orientation === "portrait";

  return (
    <article className="mx-auto max-w-6xl px-5 pt-28 pb-20">
      <Link to="/work" className="eyebrow inline-flex items-center gap-2 hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All work
      </Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-mega text-5xl md:text-7xl">{p.title}</h1>
        <span className="rounded-full border border-primary px-4 py-1 text-sm text-primary">{categoryLabel(p.category)}</span>
      </div>

      <div className={`mt-8 overflow-hidden rounded-xl border border-border bg-surface ${portrait ? "mx-auto aspect-[9/16] max-w-sm" : "aspect-video"}`}>
        <iframe src={p.video_url} title={p.title} allow="autoplay; fullscreen" allowFullScreen className="h-full w-full" />
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ["Category", categoryLabel(p.category)],
          ["Duration", p.duration || "—"],
          ["Format", portrait ? "Vertical 9:16" : "Landscape 16:9"],
          ["Software", p.software.join(", ") || "—"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-border bg-card p-4">
            <dt className="eyebrow">{k}</dt>
            <dd className="mt-2 font-display font-semibold">{v}</dd>
          </div>
        ))}
      </dl>

      {[["About", p.description], ["Objective", p.objective], ["Approach", p.approach], ["Result", p.result]]
        .filter(([, v]) => v)
        .map(([k, v]) => (
          <section key={k} className="mt-10">
            <h2 className="eyebrow">{k}</h2>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{v}</p>
          </section>
        ))}

      <Link
        to="/work/$slug"
        params={{ slug: next.slug }}
        className="mt-16 flex items-center justify-between rounded-xl border border-border p-6 transition hover:border-primary"
      >
        <div>
          <p className="eyebrow">Next project</p>
          <p className="mt-2 font-display text-2xl font-bold">{next.title}</p>
        </div>
        <ArrowRight className="h-6 w-6 text-primary" />
      </Link>
    </article>
  );
}
