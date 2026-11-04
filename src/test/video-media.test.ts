import { describe, expect, it } from "vitest";
import { playbackSource, selectShowreel } from "@/lib/video-media";

describe("Portfolio playback", () => {
  it("uses Cinematic 4K Edit for the showreel instead of the previous selection", () => {
    const previous = { title: "Gym Film", video_url: "previous" };
    const gig = { title: "Cinematic 4K Edit", video_url: "gig" };
    expect(selectShowreel([previous, gig], "previous")).toBe(gig);
  });
  it("resolves the gig video to a playable media file rather than a nested Drive player", () => {
    const source = playbackSource("https://drive.google.com/file/d/12JQ0Tm8HUyIkWqRicARHvbObJySDhOis/preview");
    expect(source).toContain("cinematic-4k-edit.mp4");
    expect(source).not.toContain("drive.google.com");
  });
});