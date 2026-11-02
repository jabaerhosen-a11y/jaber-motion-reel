import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { Route as WorkRoute } from "@/routes/work.index";
import { Route as ProjectRoute } from "@/routes/work.$slug";
import { Route as ServicesRoute } from "@/routes/services";
import { Route as AboutRoute } from "@/routes/about";
import { Route as ContactRoute } from "@/routes/contact";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it.each([
    [WorkRoute, "work"], [ProjectRoute, "work"], [ServicesRoute, "services"],
    [AboutRoute, "about"], [ContactRoute, "contact"],
  ])("keeps legacy sections on Home", (route, section) => {
    try {
      const beforeLoad = route.options.beforeLoad;
      if (typeof beforeLoad !== "function") throw new Error("Missing Home redirect");
      beforeLoad({} as never);
      throw new Error("Expected a redirect");
    } catch (redirect) {
      expect((redirect as { options: unknown }).options).toMatchObject({ to: "/", hash: section, replace: true });
    }
  });
});
