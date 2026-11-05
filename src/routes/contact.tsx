import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: false },
  beforeLoad: () => { throw redirect({ to: "/", hash: "contact", replace: true }); },
});
