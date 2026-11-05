import { describe, expect, it } from "vitest";
import { formatProjectBrief, VIDEO_TYPES } from "../lib/project-brief";

describe("project inquiry", () => {
  it("offers video-type choices including a custom project", () => {
    expect(VIDEO_TYPES).toContain("Motion Graphics");
    expect(VIDEO_TYPES).toContain("Social Reels");
    expect(VIDEO_TYPES).toContain("Other");
  });
  it("keeps all supplied project details in separate brief fields", () => {
    const brief = formatProjectBrief({ name: "  Sami  ", type: "Social Reels", duration: "30 seconds", deadline: "Next Friday", message: "  Edit my fitness footage.  " });
    expect(brief).toContain("*Name:* Sami\n*Video type:* Social Reels\n*Video length:* 30 seconds\n*Deadline:* Next Friday");
    expect(brief).toContain("*Project details:*\nEdit my fitness footage.");
    expect(decodeURIComponent(encodeURIComponent(brief))).toBe(brief);
  });
  it("does not invent duration or deadline when omitted", () => {
    const brief = formatProjectBrief({ name: "Sami", type: "Other", duration: "", deadline: "", message: "A short film" });
    expect(brief).toContain("*Video length:* To discuss");
    expect(brief).toContain("*Deadline:* Flexible");
  });
});