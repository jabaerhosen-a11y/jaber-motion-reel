import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/services")({
  staticData: { sitemap: false },
  beforeLoad: () => { throw redirect({ to: "/", hash: "services", replace: true }); },
});
