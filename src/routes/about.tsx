import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import hero from "@/assets/jaber-hero.jpg";
import { projectsQuery, settingsQuery } from "@/lib/portfolio";
import { PageHeader } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Jaber Nafiz" },
      { name: "description", content: "Meet Jaber Nafiz, video editor and motion graphics designer." },
      { property: "og:title", content: "About — Jaber Nafiz" },
      { property: "og:description", content: "The editor behind the cuts." },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(settingsQuery), context.queryClient.ensureQueryData(projectsQuery)]),
  component: About,
  errorComponent: ({ error }) => <p className="p-32 text-center">{error instanceof Error ? error.message : "Error"}</p>,
  notFoundComponent: () => <p className="p-32 text-center">Not found</p>,
});

const TOOLS = ["Premiere Pro", "After Effects", "DaVinci Resolve", "CapCut", "Photoshop"];

function About() {
  const { data: s } = useSuspenseQuery(settingsQuery);
  const { data: projects } = useSuspenseQuery(projectsQuery);
  return (
    <>
      <PageHeader eyebrow="About" title={<>HI, I'M <span className="text-primary">JABER.</span></>} />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2">
        <img src={hero} alt="Jaber Nafiz" className="aspect-[4/5] w-full rounded-xl border border-border object-cover" />
        <div className="flex flex-col justify-center">
          <p className="text-xl leading-relaxed">{s?.intro}</p>
          {s?.about_text && <p className="mt-4 text-muted-foreground">{s.about_text}</p>}
          {s?.philosophy && (
            <blockquote className="mt-8 border-l-2 border-primary pl-4 font-display text-2xl">"{s.philosophy}"</blockquote>
          )}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4">
              <p className="text-mega text-4xl text-primary">{projects.length}+</p>
              <p className="eyebrow mt-2">Projects shown</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-mega text-4xl text-primary">8</p>
              <p className="eyebrow mt-2">Services</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {TOOLS.map((t) => <span key={t} className="rounded-full border border-border px-3 py-1 text-sm">{t}</span>)}
          </div>
          <Link to="/contact" className="mt-8 self-start rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Work with me</Link>
        </div>
      </section>
    </>
  );
}
