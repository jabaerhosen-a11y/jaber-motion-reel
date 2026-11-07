import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { ArrowUpRight, Play, ArrowDown } from "lucide-react";
import hero from "@/assets/jaber-hero.jpg";
import { projectsQuery, servicesQuery, settingsQuery } from "@/lib/portfolio";
import { Button } from "@/components/ui/button";
import { Header, Footer } from "@/components/site/SiteChrome";
import { InlineVideo, VideoGallery } from "@/components/site/VideoGallery";
import { AboutSection, ContactSection, ServicesSlideshow } from "@/components/site/HomeSections";
import { selectShowreel } from "@/lib/video-media";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Jaber Nafiz — Video Editor & Motion Graphics Designer" },
    { name: "description", content: "Watch Jaber Nafiz's video editing and motion graphics portfolio: commercials, social reels, SaaS demos and more. Send a brief for your next video." },
    { property: "og:title", content: "Jaber Nafiz — Video Editor & Motion Graphics Designer" },
    { property: "og:description", content: "Explore Jaber Nafiz's films, social reels, commercials and motion graphics. Watch the work and send a brief for your next video." },
    { property: "og:url", content: "https://jabers-portfolio.lovable.app/" },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "https://jabers-portfolio.lovable.app/" }] }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(projectsQuery), context.queryClient.ensureQueryData(servicesQuery), context.queryClient.ensureQueryData(settingsQuery)]),
  component: Home,
});
function Home() {
  const mainRef = useRef<HTMLElement>(null);
  useScrollReveal(mainRef);
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const { data: services } = useSuspenseQuery(servicesQuery);
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const [showreelPlaying, setShowreelPlaying] = useState(false);
  const reel = selectShowreel(projects, settings?.showreel_url);
  return <><Header /><main ref={mainRef}>
    <section id="home" className="portfolio-hero relative isolate overflow-hidden pt-16">
      <img src={hero} alt="Jaber Nafiz" fetchPriority="high" className="hero-portrait absolute right-0 top-16 h-[calc(100%-4rem)] object-cover object-top" />
      <div className="hero-shade pointer-events-none absolute inset-0" />
      <div className="hero-copy relative mx-auto flex max-w-7xl flex-col justify-center px-5 py-12">
        <p className="eyebrow flex items-center gap-2"><span className="size-2 rounded-full bg-primary" />{settings?.availability === "available" ? "Available for projects" : "Video editor & motion designer"}</p>
        <h1 className="text-mega mt-6 text-5xl sm:text-7xl lg:text-8xl">JABER<br /><span className="text-primary">NAFIZ.</span></h1>
        <p className="mt-5 max-w-md font-display text-xl md:text-2xl">Video Editor.<br />Motion Graphics Designer.</p>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">{settings?.hero_subtext?.trim() || "Video editing and motion graphics for creators, brands and businesses — from talking-head videos and SaaS demos to commercials, travel films and social reels."}</p>
        <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><a href="#work"><Play className="fill-current" />View my work</a></Button><Button asChild variant="outline" size="lg"><a href="#contact">Start a project<ArrowUpRight /></a></Button></div>
        <a href="#work" aria-label="Scroll to work" className="mt-10 self-start text-muted-foreground hover:text-primary"><ArrowDown className="size-5" /></a>
      </div>
    </section>
    <div className="overflow-hidden border-y border-border bg-primary py-3 text-primary-foreground" aria-hidden="true"><div className="flex w-max animate-marquee gap-10 font-display text-lg font-bold uppercase">{[...services, ...services].map((s, i) => <span key={i}>{s.name} ✦</span>)}</div></div>
    {(reel || settings?.showreel_url) && <section id="showreel" className="mx-auto max-w-5xl px-5 py-16"><div className="mb-6"><p className="eyebrow">In the spotlight</p><h2 className="text-mega mt-3 text-3xl md:text-5xl">Showreel<span className="text-primary">.</span></h2></div><div className={reel?.orientation === "portrait" ? "mx-auto max-w-sm" : ""}><InlineVideo project={reel ?? { title: "Jaber Nafiz showreel", orientation: "landscape", video_url: settings?.showreel_url ?? "", thumbnail_url: settings?.showreel_thumbnail ?? hero, duration: "" }} active={showreelPlaying} onPlay={() => setShowreelPlaying(true)} onClose={() => setShowreelPlaying(false)} /></div></section>}
    <VideoGallery projects={projects} /><ServicesSlideshow services={services} /><AboutSection settings={settings} count={projects.length} /><ContactSection settings={settings} />
  </main><Footer settings={settings} /></>;
}
