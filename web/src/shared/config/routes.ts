export const ROUTES = {
  DASHBOARD: "/",
  PIPELINES: "/pipelines",
  PIPELINE_NEW: "/pipelines/new",
  PIPELINE_DETAIL: (id: string) => `/pipelines/${id}`,
  PIPELINE_RUN: (id: string, runId: string) =>
    `/pipelines/${id}/runs/${runId}`,
  REVIEW: "/review",
  REVIEW_DETAIL: (runId: string, stepId: string) =>
    `/review/${runId}/${stepId}`,
  STYLES: "/styles",
  STYLE_NEW: "/styles/new",
  STYLE_DETAIL: (id: string) => `/styles/${id}`,
  BRANDS: "/brands",
  BRAND_NEW: "/brands/new",
  BRAND_DETAIL: (id: string) => `/brands/${id}`,
  CONTENT: "/content",
  TRENDS: "/trends",
  SETTINGS: "/settings",
  SETTINGS_PLATFORMS: "/settings/platforms",
  SETTINGS_MODELS: "/settings/models",
  SETTINGS_DEFAULTS: "/settings/defaults",
} as const;
