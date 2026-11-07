import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { sitemapStaticPaths, sitemapXML } from "@/lib/sitemap";

describe("Public portfolio sitemap", () => {
  it("includes only Home, excluding legacy redirects and the sitemap itself", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(sitemapStaticPaths(router)).toEqual(["/"]);
  });

  it("uses the published origin and omits invented content modification dates", () => {
    const xml = sitemapXML("https://jabers-portfolio.lovable.app", [{ path: "/" }]);
    expect(xml).toContain("<loc>https://jabers-portfolio.lovable.app/</loc>");
    expect(xml).not.toContain("<lastmod>");
  });
});