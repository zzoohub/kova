export type MockTrend = {
  id: string;
  name: string;
  lifecycle: "emerging" | "rising" | "peak" | "declining";
  source: "reddit" | "youtube" | "google_trends";
  score: number;
  niche: string;
};

export const mockTrends: MockTrend[] = [
  {
    id: "trd_01",
    name: "AI Agent Frameworks",
    lifecycle: "rising",
    source: "reddit",
    score: 87,
    niche: "AI/ML",
  },
  {
    id: "trd_02",
    name: "Vibe Coding",
    lifecycle: "peak",
    source: "youtube",
    score: 94,
    niche: "Developer Tools",
  },
  {
    id: "trd_03",
    name: "MCP Protocol",
    lifecycle: "emerging",
    source: "reddit",
    score: 62,
    niche: "AI/ML",
  },
  {
    id: "trd_04",
    name: "Local-first Software",
    lifecycle: "rising",
    source: "google_trends",
    score: 75,
    niche: "Software Architecture",
  },
  {
    id: "trd_05",
    name: "Voice Cloning Ethics",
    lifecycle: "peak",
    source: "youtube",
    score: 88,
    niche: "AI Ethics",
  },
  {
    id: "trd_06",
    name: "Serverless GPUs",
    lifecycle: "emerging",
    source: "google_trends",
    score: 54,
    niche: "Infrastructure",
  },
  {
    id: "trd_07",
    name: "Creator Economy 3.0",
    lifecycle: "declining",
    source: "youtube",
    score: 41,
    niche: "Content Creation",
  },
  {
    id: "trd_08",
    name: "Multimodal RAG",
    lifecycle: "rising",
    source: "reddit",
    score: 79,
    niche: "AI/ML",
  },
];
