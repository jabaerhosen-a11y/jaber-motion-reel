import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { settingsQuery, WHATSAPP_URL } from "@/lib/portfolio";
import { PageHeader } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Hire Jaber Nafiz" },
      { name: "description", content: "Start a video editing or motion graphics project with Jaber Nafiz." },
      { property: "og:title", content: "Contact — Hire Jaber Nafiz" },
      { property: "og:description", content: "Send your project details via WhatsApp or email." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: Contact,
  errorComponent: ({ error }) => <p className="p-32 text-center">{error instanceof Error ? error.message : "Error"}</p>,
  notFoundComponent: () => <p className="p-32 text-center">Not found</p>,
});

function Contact() {
  const { data: s } = useSuspenseQuery(settingsQuery);
  const [f, setF] = useState({ name: "", type: "", message: "" });
  const wa = s?.whatsapp ?? "8801330176473";
  const email = s?.email ?? "jabaerhosen@gmail.com";
  const text = `Hi Jaber! I'm ${f.name}. Project: ${f.type}. ${f.message}`;
  const socials = (s?.socials ?? {}) as Record<string, string>;
  const input = "w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none focus:border-primary";

  return (
    <>
      <PageHeader eyebrow="Contact" title={<>LET'S <span className="text-primary">TALK.</span></>} sub="Tell me about your footage and goals. I usually reply within a few hours." />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            window.open(`${WHATSAPP_URL(wa)}?text=${encodeURIComponent(text)}`, "_blank");
          }}
        >
          <input required placeholder="Your name" className={input} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input placeholder="Project type (e.g. YouTube, Ad, Reel)" className={input} value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} />
          <textarea required rows={5} placeholder="Tell me about your project" className={input} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">
              <MessageCircle className="h-4 w-4" /> Send on WhatsApp
            </button>
            <a href={`mailto:${email}?subject=${encodeURIComponent("Project inquiry")}&body=${encodeURIComponent(text)}`} className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold hover:border-primary">
              <Mail className="h-4 w-4" /> Send by email
            </a>
          </div>
        </form>
        <div className="space-y-4">
          <a href={WHATSAPP_URL(wa)} target="_blank" rel="noreferrer" className="block rounded-xl border border-border p-6 hover:border-primary">
            <p className="eyebrow">WhatsApp</p>
            <p className="mt-2 font-display text-2xl font-bold">+{wa}</p>
          </a>
          <a href={`mailto:${email}`} className="block rounded-xl border border-border p-6 hover:border-primary">
            <p className="eyebrow">Email</p>
            <p className="mt-2 break-all font-display text-2xl font-bold">{email}</p>
          </a>
          <div className="flex flex-wrap gap-2">
            {Object.entries(socials).map(([k, v]) => (
              <a key={k} href={v} target="_blank" rel="noreferrer" className="rounded-full border border-border px-4 py-2 text-sm capitalize hover:border-primary hover:text-primary">{k}</a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
