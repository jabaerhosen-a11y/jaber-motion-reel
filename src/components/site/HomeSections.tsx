import { useEffect, useMemo, useState } from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Film, Scissors, Sparkles, MonitorPlay, MessageCircle, Mail, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatProjectBrief, VIDEO_TYPES } from "@/lib/project-brief";
import { WHATSAPP_URL, type Service, type Settings } from "@/lib/portfolio";
import portrait from "@/assets/jaber-about-natural.jpg";

export function ServicesSlideshow({ services }: { services: Service[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const autoScroll = useMemo(() => AutoScroll({ speed: 0.7, startDelay: 0, playOnInit: false, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: true }), []);
  useEffect(() => {
    if (!api) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { if (motion.matches) autoScroll.stop(); else autoScroll.play(); };
    sync();
    motion.addEventListener("change", sync);
    return () => { motion.removeEventListener("change", sync); autoScroll.stop(); };
  }, [api, autoScroll]);
  const icons = [Scissors, Sparkles, Film, MonitorPlay];
  return <section id="services" className="services-section scroll-mt-24 overflow-hidden border-y border-border bg-background-alt py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-5">
      <div className="flex flex-wrap items-end justify-between gap-6"><div><p className="eyebrow flex items-center gap-3"><span className="h-px w-10 bg-primary" />What I do</p><h2 className="text-mega mt-5 text-4xl md:text-6xl">From footage.<br /><span className="text-primary">To feeling.</span></h2></div><div className="flex items-center gap-4 border-l-2 border-primary pl-5"><Sparkles className="size-8 text-primary" /><p className="max-w-52 font-display text-lg text-muted-foreground">Sharp cuts. Bold motion.<br /><span className="text-foreground">Your story, amplified.</span></p></div></div>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">Video editing and motion graphics for talking-head content, SaaS demos, commercials and social reels. Explore the services below, watch examples in my work, then send your footage, preferred style and deadline in a project brief.</p>
      <Carousel setApi={setApi} plugins={[autoScroll]} opts={{ loop: true, align: "start", dragFree: true }} className="services-carousel mt-10" aria-label="Editing services">
        <CarouselContent className="py-6">{services.map((s, i) => {
          const Icon = icons[i % icons.length] ?? Film;
          return <CarouselItem key={s.id} className="sm:basis-1/2 lg:basis-1/3">
            <article className="service-card group relative flex h-full min-h-96 flex-col rounded-lg border border-border bg-card p-7 transition duration-300 hover:border-primary/60 hover:shadow-glow focus-within:border-primary/60 focus-within:shadow-glow">
              <div className="flex items-center justify-between"><span className="flex size-14 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 transition-transform duration-300 group-hover:rotate-6"><Icon className="size-7 text-primary" /></span><span className="font-display text-5xl font-bold text-faint/40 transition-colors group-hover:text-primary/60">{String(i + 1).padStart(2, "0")}</span></div>
              <h3 className="mt-8 font-display text-2xl font-semibold">{s.name}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              <ul className="mt-5 space-y-2 text-sm">{s.deliverables.map((d) => <li key={d} className="flex gap-2"><span className="text-primary">↗</span>{d}</li>)}</ul>
              <Button asChild variant="link" className="mt-auto justify-start px-0 pt-6"><a href="#contact">{s.cta_label || "Start a project"}<ArrowUpRight /></a></Button>
            </article>
          </CarouselItem>;
        })}</CarouselContent>
      </Carousel>
    </div>
  </section>;
}

export function AboutSection({ settings, count }: { settings: Settings | null; count: number }) {
  return <section id="about" className="scroll-mt-24 mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:gap-20 md:py-24">
    <div className="relative mx-auto w-full max-w-md"><img src={portrait} alt="Jaber Nafiz, video editor and motion graphics designer" loading="lazy" className="aspect-[4/5] w-full rounded-lg object-cover object-top" /><p className="absolute bottom-5 left-5 font-mono text-xs text-primary">THE EDITOR BEHIND THE FRAME</p></div>
    <div><p className="eyebrow">About me</p><h2 className="text-mega mt-4 text-4xl md:text-6xl">Hi, I'm<br /><span className="text-primary">Jaber Nafiz.</span></h2><p className="mt-7 text-lg leading-relaxed">{settings?.intro?.trim() || "I'm Jaber Nafiz, a video editor and motion graphics designer."}</p><p className="mt-4 leading-relaxed text-muted-foreground">{settings?.about_text?.trim() || "My portfolio brings together commercial edits, talking-head videos, travel films, social reels and motion graphics. Watch the projects above to see my editing and animation work, and share a brief to discuss your next video."}</p>{settings?.philosophy && <blockquote className="mt-7 border-l-2 border-primary pl-5 font-display text-xl">“{settings.philosophy}”</blockquote>}<div className="mt-8 flex items-center gap-4 border-t border-border pt-6"><span className="text-mega text-5xl text-primary">{count.toString().padStart(2, "0")}</span><span className="eyebrow">Projects. Every frame intentional.</span></div><Button asChild className="mt-8" size="lg"><a href="#contact">Let's work together<ArrowUpRight /></a></Button></div>
  </section>;
}

export function ContactSection({ settings }: { settings: Settings | null }) {
  const [form, setForm] = useState({ name: "", type: "", message: "", duration: "", deadline: "" });
  const email = settings?.email;
  const whatsapp = settings?.whatsapp;
  const message = formatProjectBrief(form);
  const field = "w-full rounded-md border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 hover:border-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/15";
  return <section id="contact" className="scroll-mt-24 border-t border-border bg-background-alt py-16 md:py-24"><div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2">
    <div><p className="eyebrow">Your next project</p><h2 className="text-mega mt-4 text-4xl md:text-6xl">Let's make<br /><span className="text-primary">it happen.</span></h2><div className="contact-links mt-9 space-y-5 border-l-2 border-primary pl-5">{email && <a href={`mailto:${email}`} className="flex items-center gap-3 break-all hover:text-primary"><Mail className="size-5 shrink-0 text-primary" />{email}</a>}{whatsapp && <a href={WHATSAPP_URL(whatsapp)} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary"><MessageCircle className="size-5 text-primary" />+{whatsapp}</a>}</div></div>
    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); if (whatsapp) window.open(`${WHATSAPP_URL(whatsapp)}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer"); }}>
      <div className="mb-7 flex items-center gap-3 border-b border-border pb-5"><Film className="size-5 text-primary" /><h3 className="font-display text-xl font-semibold">Your project brief</h3></div>
      <label className="block space-y-2 text-sm"><span>Your name <span className="text-primary">*</span></span><input required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} autoComplete="name" placeholder="e.g. Alex Rahman" /></label>
      <div className="space-y-2 text-sm"><label htmlFor="video-type">Video type <span className="text-primary">*</span></label><Select required value={form.type} onValueChange={(type) => setForm({ ...form, type })}><SelectTrigger id="video-type" aria-label="Video type" className={`${field} h-12`}><SelectValue placeholder="Choose your video type" /></SelectTrigger><SelectContent>{VIDEO_TYPES.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select></div>
      <div className="grid gap-5 sm:grid-cols-2"><label className="block space-y-2 text-sm"><span>Video length <span className="text-muted-foreground">(optional)</span></span><input maxLength={100} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className={field} placeholder="e.g. 30–60 seconds" /></label><label className="block space-y-2 text-sm"><span>Deadline <span className="text-muted-foreground">(optional)</span></span><input maxLength={100} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className={field} placeholder="e.g. Next Friday" /></label></div>
      <label className="block space-y-2 text-sm"><span>Project details <span className="text-primary">*</span></span><textarea required maxLength={4000} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${field} resize-y`} placeholder="What is your video about? Share your goal, preferred style, footage or reference links." /></label>
      <div className="flex flex-wrap gap-3">{whatsapp && <Button type="submit" size="lg"><MessageCircle />Send on WhatsApp</Button>}{email && <Button variant="outline" asChild size="lg"><a href={`mailto:${email}?subject=Project%20inquiry&body=${encodeURIComponent(message)}`}><Mail />Email</a></Button>}</div>
    </form>
  </div></section>;
}