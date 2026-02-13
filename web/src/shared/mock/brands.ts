export type MockBrand = {
  id: string;
  name: string;
  description: string;
  voiceTone: string;
  targetAudience: string;
  perspective: string;
  emojiUsage: "none" | "minimal" | "moderate" | "frequent";
  wordsToUse: string[];
  wordsToAvoid: string[];
  guidelines: string;
  connectedPlatforms: { platformId: string; accountName: string }[];
  isDefault: boolean;
  pipelineCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export const mockBrands: MockBrand[] = [
  {
    id: "brn_01",
    name: "Sarah Creates",
    description:
      "Tech educator and content creator helping developers level up with practical, real-world advice.",
    voiceTone:
      "Professional but approachable, uses analogies and real-world examples",
    targetAudience:
      "Tech professionals aged 25-45, primarily software developers and engineering managers",
    perspective: "first_person",
    emojiUsage: "minimal",
    wordsToUse: ["innovative", "practical", "actionable", "streamline"],
    wordsToAvoid: ["synergy", "leverage", "disruptive", "paradigm shift"],
    guidelines:
      "Avoid political topics. Always include practical takeaways. Credit sources when referencing studies.",
    connectedPlatforms: [
      { platformId: "twitter", accountName: "@sarahcreates" },
      { platformId: "youtube", accountName: "Sarah Creates" },
      { platformId: "linkedin", accountName: "Sarah Johnson" },
    ],
    isDefault: true,
    pipelineCount: 4,
    createdAt: new Date("2025-10-15"),
    updatedAt: new Date("2026-01-20"),
  },
  {
    id: "brn_02",
    name: "Agency Client A",
    description:
      "Enterprise SaaS brand focused on B2B content marketing and thought leadership.",
    voiceTone:
      "Authoritative and data-driven, formal but not stiff",
    targetAudience:
      "CTOs, VPs of Engineering, and technical decision-makers at mid-market companies",
    perspective: "third_person",
    emojiUsage: "none",
    wordsToUse: ["scalable", "enterprise-grade", "ROI", "mission-critical"],
    wordsToAvoid: ["cheap", "hack", "workaround", "simple"],
    guidelines:
      "Always cite data sources. Maintain vendor-neutral positioning. Include case study references where possible.",
    connectedPlatforms: [
      { platformId: "twitter", accountName: "@agencyclienta" },
      { platformId: "linkedin", accountName: "Agency Client A" },
    ],
    isDefault: false,
    pipelineCount: 2,
    createdAt: new Date("2025-12-01"),
    updatedAt: new Date("2026-02-05"),
  },
  {
    id: "brn_03",
    name: "Side Project Gaming",
    description:
      "Casual gaming channel with walkthroughs, reviews, and entertaining commentary.",
    voiceTone:
      "Energetic and humorous, casual language with gaming slang",
    targetAudience:
      "Gamers aged 18-30, primarily interested in indie and retro games",
    perspective: "first_person",
    emojiUsage: "frequent",
    wordsToUse: ["epic", "clutch", "grind", "let's go"],
    wordsToAvoid: ["corporate", "stakeholder", "enterprise", "synergy"],
    guidelines:
      "Keep it fun and authentic. No sponsored content without disclosure. Avoid spoilers in thumbnails.",
    connectedPlatforms: [
      { platformId: "youtube", accountName: "Side Project Gaming" },
      { platformId: "instagram", accountName: "@sideprojgaming" },
    ],
    isDefault: false,
    pipelineCount: 1,
    createdAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-02-10"),
  },
];
