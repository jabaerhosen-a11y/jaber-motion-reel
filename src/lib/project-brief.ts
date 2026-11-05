export const VIDEO_TYPES = [
  "Talking Head", "SaaS Demo", "Commercial / Ad", "Gym & Fitness",
  "Real Estate", "Travel & Lifestyle", "Motion Graphics", "Social Reels", "Other",
] as const;

export type ProjectInquiry = { name: string; type: string; message: string; duration: string; deadline: string };

export function formatProjectBrief(form: ProjectInquiry) {
  return [
    "Hi Jaber! I'd like to discuss a video project.",
    "", "*PROJECT BRIEF*", "",
    `*Name:* ${form.name.trim()}`,
    `*Video type:* ${form.type.trim() || "To discuss"}`,
    `*Video length:* ${form.duration.trim() || "To discuss"}`,
    `*Deadline:* ${form.deadline.trim() || "Flexible"}`,
    "", "*Project details:*", form.message.trim(),
    "", "Please let me know your availability and a quote. Thank you!",
  ].join("\n");
}