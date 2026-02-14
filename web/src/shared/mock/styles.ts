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
      { label: "Hook Pattern", value: "Contrarian question opener" },
      { label: "Content Structure", value: "Problem-context-insight arc" },
      { label: "Section Pacing", value: "Short-long-short sentence cadence" },
    ],
    usageCount: 24,
    createdAt: new Date("2025-11-20"),
  },
  {
    id: "sty_02",
    name: "Podcast Narrator",
    sourceType: "audio",
    topAttributes: [
      { label: "Hook Pattern", value: "Anecdotal cold open" },
      { label: "Content Structure", value: "Storytelling-driven segments" },
      { label: "Section Pacing", value: "Measured pacing with dramatic pauses" },
    ],
    usageCount: 18,
    createdAt: new Date("2025-12-05"),
  },
  {
    id: "sty_03",
    name: "LinkedIn Professional",
    sourceType: "text",
    topAttributes: [
      { label: "Hook Pattern", value: "Bold statement with data" },
      { label: "Content Structure", value: "Paragraph-bullet-paragraph flow" },
      { label: "Information Density", value: "High — data-backed insights" },
    ],
    usageCount: 31,
    createdAt: new Date("2025-10-15"),
  },
  {
    id: "sty_04",
    name: "YouTube Tutorial",
    sourceType: "video",
    topAttributes: [
      { label: "Hook Pattern", value: "Problem-solution teaser" },
      { label: "Content Structure", value: "Step-by-step with recap breaks" },
      { label: "Transition Technique", value: "Visual cue + verbal bridge" },
    ],
    usageCount: 12,
    createdAt: new Date("2026-01-08"),
  },
  {
    id: "sty_05",
    name: "Newsletter Curator",
    sourceType: "url",
    topAttributes: [
      { label: "Hook Pattern", value: "Provocative one-liner" },
      { label: "Content Structure", value: "Quick hits with deep-dive sections" },
      { label: "Closing/CTA Pattern", value: "Reader challenge + share prompt" },
    ],
    usageCount: 9,
    createdAt: new Date("2026-02-01"),
  },
];
