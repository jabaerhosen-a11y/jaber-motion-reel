import { describe, expect, it } from "vitest";
import { videoAspect } from "@/lib/video-format";

describe("Portfolio video proportions", () => {
  it("keeps landscape videos at 16:9", () => {
    expect(videoAspect("landscape")).toBe("16/9");
  });
  it("keeps portrait videos at 9:16", () => {
    expect(videoAspect("portrait")).toBe("9/16");
  });
});