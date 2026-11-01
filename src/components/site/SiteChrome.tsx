import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link to="/" className="font-display text-lg font-bold tracking-tight">
          JABER<span className="text-primary">.</span>NAFIZ
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground bg-accent" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/contact"
          className="hidden items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover md:inline-flex"
        >
          Hire me <ArrowUpRight className="h-4 w-4" />
        </Link>
        <button aria-label="Menu" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-background px-5 py-4 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: n.to === "/" }}
              className="py-3 font-display text-2xl font-semibold text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-alt">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-mega text-5xl md:text-7xl">
            LET'S <span className="text-primary">CUT.</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Video editing & motion graphics for brands, creators and businesses worldwide.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="hover:text-primary">
              {n.label}
            </Link>
          ))}
        </div>
      </div>
      <p className="pb-8 text-center eyebrow">© {new Date().getFullYear()} Jaber Nafiz</p>
    </footer>
  );
}

export function PageHeader({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <section className="grid-lines relative overflow-hidden border-b border-border pt-32 pb-14">
      <div className="absolute inset-0 fade-bottom" />
      <div className="relative mx-auto max-w-7xl px-5">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="text-mega mt-4 text-5xl sm:text-7xl md:text-8xl">{title}</h1>
        {sub && <p className="mt-6 max-w-xl text-muted-foreground">{sub}</p>}
      </div>
    </section>
  );
}
