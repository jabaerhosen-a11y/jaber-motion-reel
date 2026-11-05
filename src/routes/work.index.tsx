import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/work/")({
  staticData: { sitemap: false },
  beforeLoad: () => { throw redirect({ to: "/", hash: "work", replace: true }); },
});
