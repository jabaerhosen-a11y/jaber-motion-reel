import { useEffect, useMemo, useState } from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Film, Scissors, Sparkles, MonitorPlay, MessageCircle, Mail, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
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
  return <section id="services" className="scroll-mt-24 border-y border-border bg-background-alt py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-5">
      <p className="eyebrow">What I do</p><h2 className="text-mega mt-4 text-4xl md:text-6xl">From footage.<br /><span className="text-primary">To feeling.</span></h2>
      <Carousel setApi={setApi} plugins={[autoScroll]} opts={{ loop: true, align: "start", dragFree: true }} className="services-carousel mt-10" aria-label="Editing services">
        <CarouselContent className="py-6">{services.map((s, i) => {
          const Icon = icons[i % icons.length] ?? Film;
          return <CarouselItem key={s.id} className="sm:basis-1/2 lg:basis-1/3">
            <article className="flex h-full min-h-80 flex-col rounded-lg border border-border bg-card p-7 transition duration-300 hover:border-primary/60 hover:shadow-glow focus-within:border-primary/60 focus-within:shadow-glow">
              <div className="flex items-center justify-between"><Icon className="size-8 text-primary" /><span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</span></div>
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
    <div><p className="eyebrow">About me</p><h2 className="text-mega mt-4 text-4xl md:text-6xl">Hi, I'm<br /><span className="text-primary">Jaber Nafiz.</span></h2><p className="mt-7 text-lg leading-relaxed">{settings?.intro}</p><p className="mt-4 leading-relaxed text-muted-foreground">{settings?.about_text}</p>{settings?.philosophy && <blockquote className="mt-7 border-l-2 border-primary pl-5 font-display text-xl">“{settings.philosophy}”</blockquote>}<div className="mt-8 flex items-center gap-4 border-t border-border pt-6"><span className="text-mega text-5xl text-primary">{count.toString().padStart(2, "0")}</span><span className="eyebrow">Projects. Every frame intentional.</span></div><Button asChild className="mt-8" size="lg"><a href="#contact">Let's work together<ArrowUpRight /></a></Button></div>
  </section>;
}

export function ContactSection({ settings }: { settings: Settings | null }) {
  const [form, setForm] = useState({ name: "", type: "", message: "" });
  const email = settings?.email;
  const whatsapp = settings?.whatsapp;
  const message = `Hi Jaber! I'm ${form.name}. Project: ${form.type}. ${form.message}`;
  const field = "w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none focus:border-primary";
  return <section id="contact" className="scroll-mt-24 border-t border-border bg-background-alt py-16 md:py-24"><div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2">
    <div><p className="eyebrow">Your next project</p><h2 className="text-mega mt-4 text-4xl md:text-6xl">Let's make<br /><span className="text-primary">it happen.</span></h2><div className="mt-9 space-y-5">{email && <a href={`mailto:${email}`} className="flex items-center gap-3 break-all hover:text-primary"><Mail className="size-5 shrink-0 text-primary" />{email}</a>}{whatsapp && <a href={WHATSAPP_URL(whatsapp)} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary"><MessageCircle className="size-5 text-primary" />+{whatsapp}</a>}</div></div>
    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); if (whatsapp) window.open(`${WHATSAPP_URL(whatsapp)}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer"); }}>
      <label className="block space-y-2 text-sm"><span>Your name</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} autoComplete="name" placeholder="Name" /></label>
      <label className="block space-y-2 text-sm"><span>Project type</span><input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={field} placeholder="Film, reel, ad, motion graphics…" /></label>
      <label className="block space-y-2 text-sm"><span>Project details</span><textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={field} placeholder="Tell me what you have in mind" /></label>
      <div className="flex flex-wrap gap-3">{whatsapp && <Button type="submit" size="lg"><MessageCircle />Send on WhatsApp</Button>}{email && <Button variant="outline" asChild size="lg"><a href={`mailto:${email}?subject=Project%20inquiry&body=${encodeURIComponent(message)}`}><Mail />Email</a></Button>}</div>
    </form>
  </div></section>;
}