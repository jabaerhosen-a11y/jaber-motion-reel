import { useState } from "react";
import { Menu, X, ArrowUpRight, ArrowUp, Instagram, Facebook, Linkedin, BriefcaseBusiness, Globe, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Settings } from "@/lib/portfolio";

const NAV = ["Home", "Work", "Services", "About", "Contact"];
export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
    <a href="#home" className="font-display text-lg font-bold">JABER<span className="text-primary">.</span>NAFIZ</a>
    <nav className="hidden gap-1 md:flex" aria-label="Main navigation">{NAV.map((n) => <Button key={n} asChild variant="ghost"><a href={`#${n.toLowerCase()}`}>{n}</a></Button>)}</nav>
    <Button asChild className="hidden md:inline-flex"><a href="#contact">Hire me<ArrowUpRight /></a></Button>
    <Button variant="ghost" size="icon" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
  </div>{open && <nav className="flex flex-col border-t border-border bg-background px-5 py-4 md:hidden" aria-label="Mobile navigation">{NAV.map((n) => <Button key={n} asChild variant="ghost" className="justify-start"><a href={`#${n.toLowerCase()}`} onClick={() => setOpen(false)}>{n}</a></Button>)}</nav>}</header>;
}
export function Footer({ settings }: { settings?: Settings | null }) {
  const socials = Object.entries(settings?.socials ?? {}).filter((entry): entry is [string, string] => typeof entry[1] === "string" && /^https:\/\//.test(entry[1]));
  const icons = { instagram: Instagram, facebook: Facebook, linkedin: Linkedin, fiverr: BriefcaseBusiness, upwork: BriefcaseBusiness, x: X };
  return <footer className="border-t border-border bg-background"><div className="mx-auto max-w-7xl px-5 pt-16">
    <div className="flex flex-wrap items-end justify-between gap-8 border-b border-border pb-12"><div><p className="eyebrow">Have a story worth telling?</p><p className="text-mega mt-5 text-5xl md:text-7xl">LET'S <span className="text-primary">CUT.</span></p></div><Button asChild variant="hero" size="xl"><a href="#contact">Start a project<ArrowUpRight /></a></Button></div>
    <div className="grid gap-10 py-10 md:grid-cols-[1fr_auto_1fr]"><div><p className="font-display text-2xl font-bold">Jaber Nafiz<span className="text-primary">.</span></p><p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{settings?.footer_text}</p></div><nav className="flex flex-wrap gap-4 md:flex-col" aria-label="Footer navigation">{NAV.map((n) => <a key={n} href={`#${n.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary">{n}</a>)}</nav><div className="md:justify-self-end"><p className="eyebrow">Find me online</p><div className="mt-4 flex flex-wrap gap-2">{socials.map(([name, url]) => { const Icon = icons[name as keyof typeof icons] ?? Globe; return <Button key={name} asChild variant="outline" size="icon"><a href={url} target="_blank" rel="noreferrer" aria-label={name} title={name}><Icon /></a></Button>; })}</div>{settings?.email && <a href={`mailto:${settings.email}`} className="mt-5 flex items-center gap-2 break-all text-sm text-muted-foreground hover:text-primary"><Mail className="size-4 shrink-0" />{settings.email}</a>}</div></div>
    <div className="flex items-center justify-between gap-4 border-t border-border py-6"><p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Jaber Nafiz</p><Button asChild variant="ghost" size="icon"><a href="#home" aria-label="Back to top" title="Back to top"><ArrowUp /></a></Button></div>
  </div></footer>;
}
export function PageHeader({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return <section className="border-b border-border pt-32 pb-14"><div className="mx-auto max-w-7xl px-5"><p className="eyebrow">{eyebrow}</p><h1 className="text-mega mt-4 text-5xl md:text-8xl">{title}</h1>{sub && <p className="mt-6 max-w-xl text-muted-foreground">{sub}</p>}</div></section>;
}
