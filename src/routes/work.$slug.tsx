import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/work/$slug")({
  beforeLoad: () => { throw redirect({ to: "/", hash: "work", replace: true }); },
});
