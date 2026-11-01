import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, Play } from "lucide-react";
import hero from "@/assets/jaber-hero.jpg";
import { projectsQuery, servicesQuery, settingsQuery } from "@/lib/portfolio";
import { ProjectCard } from "@/components/site/ProjectCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jaber Nafiz — Video Editor & Motion Graphics Designer" },
      { name: "description", content: "Strategic video editing, storytelling and motion graphics for brands, creators and businesses." },
      { property: "og:title", content: "Jaber Nafiz — Video Editor & Motion Graphics Designer" },
      { property: "og:description", content: "Videos that make people stop scrolling. See the work." },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(projectsQuery),
      context.queryClient.ensureQueryData(servicesQuery),
      context.queryClient.ensureQueryData(settingsQuery),
    ]),
  component: Home,
  errorComponent: ({ error }) => <p className="p-32 text-center">{error instanceof Error ? error.message : "Error"}</p>,
  notFoundComponent: () => <p className="p-32 text-center">Not found</p>,
});

function Home() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const { data: services } = useSuspenseQuery(servicesQuery);
  const { data: s } = useSuspenseQuery(settingsQuery);
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <section className="grain relative min-h-[100svh] overflow-hidden pt-16">
        <img src={hero} alt="Jaber Nafiz" className="absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-60 md:object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 fade-bottom" />
        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-end px-5 pb-16 md:justify-center">
          <p className="eyebrow flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse-ring rounded-full bg-primary" /> Available for projects
          </p>
          <h1 className="text-mega mt-6 max-w-4xl text-[13vw] sm:text-7xl lg:text-8xl">
            I CREATE VIDEOS THAT MAKE PEOPLE <span className="text-primary text-glow">STOP SCROLLING.</span>
          </h1>
          <p className="mt-6 max-w-lg text-muted-foreground">{s?.hero_subtext}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/work" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover">
              <Play className="h-4 w-4 fill-current" /> View my work
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold hover:border-primary">
              Start a project <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-border bg-primary py-3 text-primary-foreground">
        <div className="flex w-max animate-marquee gap-10 font-display text-xl font-bold uppercase">
          {[...services, ...services].map((sv, i) => (
            <span key={i}>{sv.name} ✦</span>
          ))}
        </div>
      </div>

      {s?.showreel_url && (
        <section className="mx-auto max-w-7xl px-5 py-20">
          <p className="eyebrow">Showreel</p>
          <div className="mt-6 aspect-video overflow-hidden rounded-xl border border-border">
            <iframe src={s.showreel_url} title="Showreel" allow="autoplay; fullscreen" allowFullScreen className="h-full w-full" />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="flex items-end justify-between">
          <h2 className="text-mega text-4xl md:text-6xl">Selected work</h2>
          <Link to="/work" className="eyebrow hover:text-primary">All {projects.length} projects →</Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {featured.map((p) => <ProjectCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="border-t border-border bg-background-alt py-20">
        <div className="mx-auto max-w-7xl px-5 text-center">
          <h2 className="text-mega text-4xl md:text-6xl">Got footage? <span className="text-primary">Let's make it hit.</span></h2>
          <Link to="/contact" className="mt-8 inline-flex rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground">Get in touch</Link>
        </div>
      </section>
    </>
  );
}
