import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type Settings = Database["public"]["Tables"]["site_settings"]["Row"];

export const getProjects = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data;
});

export const getServices = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient().from("services").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data;
});

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
});

export const projectsQuery = queryOptions({ queryKey: ["projects"], queryFn: () => getProjects() });
export const servicesQuery = queryOptions({ queryKey: ["services"], queryFn: () => getServices() });
export const settingsQuery = queryOptions({ queryKey: ["settings"], queryFn: () => getSettings() });

export const CATEGORY_LABELS: Record<string, string> = {
  "motion-graphics": "Motion Graphics",
  "gym-fitness": "Gym & Fitness",
  commercial: "Commercial",
  "social-reels": "Social Reels",
  "travel-lifestyle": "Travel & Lifestyle",
  "talking-head": "Talking Head",
  "saas-demo": "SaaS Demo",
};
export const categoryLabel = (c: string) => CATEGORY_LABELS[c] ?? c;

/** Filter projects by category ("all" = no filter) and case-insensitive search on title/category. */
export function filterProjects(list: Project[], category: string, q: string) {
  const needle = q.trim().toLowerCase();
  return list.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (!needle) return true;
    return (
      p.title.toLowerCase().includes(needle) ||
      categoryLabel(p.category).toLowerCase().includes(needle) ||
      p.software.some((s) => s.toLowerCase().includes(needle))
    );
  });
}

export const WHATSAPP_URL = (num: string) => `https://wa.me/${num.replace(/\D/g, "")}`;
