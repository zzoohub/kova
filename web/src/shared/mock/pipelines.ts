export type MockPipeline = {
  id: string;
  name: string;
  description: string;
  status: "running" | "completed" | "failed" | "draft" | "scheduled";
  steps: string[];
  lastRunAt: Date | null;
  schedule: string | null;
  templateName: string;
  createdAt: Date;
};

export const mockPipelines: MockPipeline[] = [
  {
    id: "pip_01",
    name: "Weekly YouTube Breakdown",
    description:
      "Analyze trending YouTube videos in the AI niche and produce a script, thumbnail, and social posts.",
    status: "running",
    steps: [
      "Trend Research",
      "Script Generation",
      "Thumbnail Design",
      "Social Posts",
      "Review",
    ],
    lastRunAt: new Date(Date.now() - 1000 * 60 * 12),
    schedule: "Every Monday 9:00 AM",
    templateName: "YouTube Long-form",
    createdAt: new Date("2025-11-15"),
  },
  {
    id: "pip_02",
    name: "LinkedIn Thought Leadership",
    description:
      "Transform internal research docs into a LinkedIn post series with carousel slides.",
    status: "completed",
    steps: [
      "Source Extraction",
      "Post Drafting",
      "Carousel Generation",
      "Scheduling",
    ],
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    schedule: "Every Wednesday 8:00 AM",
    templateName: "LinkedIn Series",
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "pip_03",
    name: "Newsletter Digest",
    description:
      "Curate top stories from tracked sources and compile a weekly newsletter with commentary.",
    status: "failed",
    steps: [
      "Source Collection",
      "Story Ranking",
      "Commentary Writing",
      "Newsletter Assembly",
      "Publish",
    ],
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    schedule: "Every Friday 6:00 AM",
    templateName: "Newsletter",
    createdAt: new Date("2025-10-20"),
  },
  {
    id: "pip_04",
    name: "Instagram Reel Series",
    description:
      "Generate short-form video scripts and captions based on style reference for Instagram Reels.",
    status: "draft",
    steps: [
      "Style Analysis",
      "Script Writing",
      "Caption Generation",
      "Hashtag Research",
    ],
    lastRunAt: null,
    schedule: null,
    templateName: "Instagram Reels",
    createdAt: new Date("2026-01-10"),
  },
  {
    id: "pip_05",
    name: "X Thread Generator",
    description:
      "Convert long-form blog posts into engaging X thread format with hooks and call-to-actions.",
    status: "scheduled",
    steps: [
      "Content Extraction",
      "Thread Structuring",
      "Hook Writing",
      "CTA Optimization",
      "Review",
    ],
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    schedule: "Every Tuesday 10:00 AM",
    templateName: "X Thread",
    createdAt: new Date("2025-12-18"),
  },
  {
    id: "pip_06",
    name: "Podcast Show Notes",
    description:
      "Transcribe podcast episodes, extract key points, and generate show notes with timestamps.",
    status: "completed",
    steps: [
      "Transcription",
      "Key Point Extraction",
      "Show Notes Draft",
      "Timestamp Mapping",
      "Publish",
    ],
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
    schedule: null,
    templateName: "Podcast Notes",
    createdAt: new Date("2026-01-25"),
  },
];
