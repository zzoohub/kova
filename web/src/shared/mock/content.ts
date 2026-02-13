export type MockContent = {
  id: string;
  title: string;
  format: string;
  platform: "x" | "linkedin" | "youtube" | "instagram" | "newsletter";
  status: "draft" | "published" | "scheduled";
  publishedAt: Date | null;
  pipelineName: string;
};

export const mockContent: MockContent[] = [
  {
    id: "cnt_01",
    title: "Why AI Agents Will Replace SaaS Dashboards",
    format: "Thread (12 tweets)",
    platform: "x",
    status: "published",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    pipelineName: "X Thread Generator",
  },
  {
    id: "cnt_02",
    title: "The Compound Content Framework",
    format: "Long-form post",
    platform: "linkedin",
    status: "published",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    pipelineName: "LinkedIn Thought Leadership",
  },
  {
    id: "cnt_03",
    title: "3 Patterns That Separate Real AI Startups",
    format: "Video script (8 min)",
    platform: "youtube",
    status: "draft",
    publishedAt: null,
    pipelineName: "Weekly YouTube Breakdown",
  },
  {
    id: "cnt_04",
    title: "Build in Public: Week 12 Update",
    format: "Reel script (60s)",
    platform: "instagram",
    status: "scheduled",
    publishedAt: null,
    pipelineName: "Instagram Reel Series",
  },
  {
    id: "cnt_05",
    title: "This Week in AI: Issue #47",
    format: "Newsletter",
    platform: "newsletter",
    status: "published",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    pipelineName: "Newsletter Digest",
  },
];
