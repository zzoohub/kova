export type TrendLifecycle = "emerging" | "rising" | "peak" | "declining";

export type TrendTopic = {
  id: string;
  name: string;
  lifecycle: TrendLifecycle;
  source: "reddit" | "youtube" | "google_trends";
  score: number;
  niche: string;
};
