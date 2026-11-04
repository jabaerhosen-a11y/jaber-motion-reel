import cinematic from "@/assets/cinematic-4k-edit.mp4.asset.json";

export const SHOWREEL_TITLE = "Cinematic 4K Edit";
const assets = import.meta.glob<{ url: string }>("../assets/video-*.mp4.asset.json", { eager: true, import: "default" });

/** Published media copies remove Drive's second play button and preserve the full frame. */
export function playbackSource(url: string) {
  const id = url.match(/\/file\/d\/([^/]+)/)?.[1];
  if (id === "12JQ0Tm8HUyIkWqRicARHvbObJySDhOis") return cinematic.url;
  return id ? assets[`../assets/video-${id}.mp4.asset.json`]?.url ?? url : url;
}

export function selectShowreel<T extends { title: string; video_url: string }>(projects: T[], fallback?: string | null) {
  return projects.find((project) => project.title === SHOWREEL_TITLE) ?? projects.find((project) => project.video_url === fallback);
}