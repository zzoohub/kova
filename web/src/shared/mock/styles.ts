export type MockStyle = {
  id: string;
  name: string;
  sourceType: "url" | "text" | "audio" | "video";
  topAttributes: { label: string; value: string }[];
  usageCount: number;
  createdAt: Date;
};

export const mockStyles: MockStyle[] = [
  {
    id: "sty_01",
    name: "Tech Explainer Voice",
    sourceType: "url",
    topAttributes: [
      { label: "Tone", value: "Conversational yet authoritative" },
      { label: "Hook Pattern", value: "Contrarian question opener" },
      { label: "Rhythm", value: "Short-long-short sentence cadence" },
    ],
    usageCount: 24,
    createdAt: new Date("2025-11-20"),
  },
  {
    id: "sty_02",
    name: "Podcast Narrator",
    sourceType: "audio",
    topAttributes: [
      { label: "Tone", value: "Warm and storytelling-driven" },
      { label: "Hook Pattern", value: "Anecdotal cold open" },
      { label: "Rhythm", value: "Measured pacing with dramatic pauses" },
    ],
    usageCount: 18,
    createdAt: new Date("2025-12-05"),
  },
  {
    id: "sty_03",
    name: "LinkedIn Professional",
    sourceType: "text",
    topAttributes: [
      { label: "Tone", value: "Insightful and polished" },
      { label: "Hook Pattern", value: "Bold statement with data" },
      { label: "Rhythm", value: "Paragraph-bullet-paragraph flow" },
    ],
    usageCount: 31,
    createdAt: new Date("2025-10-15"),
  },
  {
    id: "sty_04",
    name: "YouTube Tutorial",
    sourceType: "video",
    topAttributes: [
      { label: "Tone", value: "Friendly and encouraging" },
      { label: "Hook Pattern", value: "Problem-solution teaser" },
      { label: "Rhythm", value: "Step-by-step with recap breaks" },
    ],
    usageCount: 12,
    createdAt: new Date("2026-01-08"),
  },
  {
    id: "sty_05",
    name: "Newsletter Curator",
    sourceType: "url",
    topAttributes: [
      { label: "Tone", value: "Witty and opinionated" },
      { label: "Hook Pattern", value: "Provocative one-liner" },
      { label: "Rhythm", value: "Quick hits with deep-dive sections" },
    ],
    usageCount: 9,
    createdAt: new Date("2026-02-01"),
  },
];
