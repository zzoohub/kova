import { describe, it, expect } from "vitest";
import { ROUTES } from "./routes";

describe("ROUTES", () => {
  describe("static routes", () => {
    it("has DASHBOARD route", () => {
      expect(ROUTES.DASHBOARD).toBe("/");
    });

    it("has PIPELINES route", () => {
      expect(ROUTES.PIPELINES).toBe("/pipelines");
    });

    it("has PIPELINE_NEW route", () => {
      expect(ROUTES.PIPELINE_NEW).toBe("/pipelines/new");
    });

    it("has REVIEW route", () => {
      expect(ROUTES.REVIEW).toBe("/review");
    });

    it("has STYLES route", () => {
      expect(ROUTES.STYLES).toBe("/styles");
    });

    it("has STYLE_NEW route", () => {
      expect(ROUTES.STYLE_NEW).toBe("/styles/new");
    });

    it("has BRANDS route", () => {
      expect(ROUTES.BRANDS).toBe("/brands");
    });

    it("has BRAND_NEW route", () => {
      expect(ROUTES.BRAND_NEW).toBe("/brands/new");
    });

    it("has CONTENT route", () => {
      expect(ROUTES.CONTENT).toBe("/content");
    });

    it("has TRENDS route", () => {
      expect(ROUTES.TRENDS).toBe("/trends");
    });

    it("has SETTINGS route", () => {
      expect(ROUTES.SETTINGS).toBe("/settings");
    });

    it("has SETTINGS_PLATFORMS route", () => {
      expect(ROUTES.SETTINGS_PLATFORMS).toBe("/settings/platforms");
    });

    it("has SETTINGS_MODELS route", () => {
      expect(ROUTES.SETTINGS_MODELS).toBe("/settings/models");
    });

    it("has SETTINGS_DEFAULTS route", () => {
      expect(ROUTES.SETTINGS_DEFAULTS).toBe("/settings/defaults");
    });
  });

  describe("dynamic route functions", () => {
    describe("PIPELINE_DETAIL", () => {
      it("returns correct route for a given pipeline id", () => {
        expect(ROUTES.PIPELINE_DETAIL("123")).toBe("/pipelines/123");
      });

      it("handles alphanumeric ids", () => {
        expect(ROUTES.PIPELINE_DETAIL("abc-123-xyz")).toBe(
          "/pipelines/abc-123-xyz"
        );
      });

      it("handles uuid-style ids", () => {
        expect(
          ROUTES.PIPELINE_DETAIL("550e8400-e29b-41d4-a716-446655440000")
        ).toBe("/pipelines/550e8400-e29b-41d4-a716-446655440000");
      });

      it("handles empty string id", () => {
        expect(ROUTES.PIPELINE_DETAIL("")).toBe("/pipelines/");
      });
    });

    describe("PIPELINE_RUN", () => {
      it("returns correct route for pipeline id and run id", () => {
        expect(ROUTES.PIPELINE_RUN("123", "456")).toBe(
          "/pipelines/123/runs/456"
        );
      });

      it("handles complex ids", () => {
        expect(ROUTES.PIPELINE_RUN("pipeline-abc", "run-xyz")).toBe(
          "/pipelines/pipeline-abc/runs/run-xyz"
        );
      });

      it("handles uuid-style ids", () => {
        expect(
          ROUTES.PIPELINE_RUN(
            "550e8400-e29b-41d4-a716-446655440000",
            "660e8400-e29b-41d4-a716-446655440001"
          )
        ).toBe(
          "/pipelines/550e8400-e29b-41d4-a716-446655440000/runs/660e8400-e29b-41d4-a716-446655440001"
        );
      });

      it("handles empty strings", () => {
        expect(ROUTES.PIPELINE_RUN("", "")).toBe("/pipelines//runs/");
      });
    });

    describe("REVIEW_DETAIL", () => {
      it("returns correct route for run id and step id", () => {
        expect(ROUTES.REVIEW_DETAIL("run-123", "step-456")).toBe(
          "/review/run-123/step-456"
        );
      });

      it("handles alphanumeric ids", () => {
        expect(ROUTES.REVIEW_DETAIL("abc123", "xyz789")).toBe(
          "/review/abc123/xyz789"
        );
      });

      it("handles uuid-style ids", () => {
        expect(
          ROUTES.REVIEW_DETAIL(
            "550e8400-e29b-41d4-a716-446655440000",
            "660e8400-e29b-41d4-a716-446655440001"
          )
        ).toBe(
          "/review/550e8400-e29b-41d4-a716-446655440000/660e8400-e29b-41d4-a716-446655440001"
        );
      });

      it("handles empty strings", () => {
        expect(ROUTES.REVIEW_DETAIL("", "")).toBe("/review//");
      });
    });

    describe("STYLE_DETAIL", () => {
      it("returns correct route for a given style id", () => {
        expect(ROUTES.STYLE_DETAIL("789")).toBe("/styles/789");
      });

      it("handles alphanumeric ids", () => {
        expect(ROUTES.STYLE_DETAIL("style-abc-123")).toBe(
          "/styles/style-abc-123"
        );
      });

      it("handles uuid-style ids", () => {
        expect(ROUTES.STYLE_DETAIL("550e8400-e29b-41d4-a716-446655440000")).toBe(
          "/styles/550e8400-e29b-41d4-a716-446655440000"
        );
      });

      it("handles empty string id", () => {
        expect(ROUTES.STYLE_DETAIL("")).toBe("/styles/");
      });
    });

    describe("BRAND_DETAIL", () => {
      it("returns correct route for a given brand id", () => {
        expect(ROUTES.BRAND_DETAIL("brn_01")).toBe("/brands/brn_01");
      });

      it("handles alphanumeric ids", () => {
        expect(ROUTES.BRAND_DETAIL("brand-abc-123")).toBe(
          "/brands/brand-abc-123"
        );
      });

      it("handles uuid-style ids", () => {
        expect(
          ROUTES.BRAND_DETAIL("550e8400-e29b-41d4-a716-446655440000")
        ).toBe("/brands/550e8400-e29b-41d4-a716-446655440000");
      });

      it("handles empty string id", () => {
        expect(ROUTES.BRAND_DETAIL("")).toBe("/brands/");
      });
    });
  });

  describe("ROUTES object structure", () => {
    it("is a const object", () => {
      expect(typeof ROUTES).toBe("object");
      expect(ROUTES).not.toBeNull();
    });

    it("contains all expected keys", () => {
      const expectedKeys = [
        "DASHBOARD",
        "PIPELINES",
        "PIPELINE_NEW",
        "PIPELINE_DETAIL",
        "PIPELINE_RUN",
        "REVIEW",
        "REVIEW_DETAIL",
        "STYLES",
        "STYLE_NEW",
        "STYLE_DETAIL",
        "BRANDS",
        "BRAND_NEW",
        "BRAND_DETAIL",
        "CONTENT",
        "TRENDS",
        "SETTINGS",
        "SETTINGS_PLATFORMS",
        "SETTINGS_MODELS",
        "SETTINGS_DEFAULTS",
      ];

      expectedKeys.forEach((key) => {
        expect(ROUTES).toHaveProperty(key);
      });
    });

    it("has correct types for static routes", () => {
      expect(typeof ROUTES.DASHBOARD).toBe("string");
      expect(typeof ROUTES.PIPELINES).toBe("string");
      expect(typeof ROUTES.PIPELINE_NEW).toBe("string");
      expect(typeof ROUTES.REVIEW).toBe("string");
      expect(typeof ROUTES.STYLES).toBe("string");
      expect(typeof ROUTES.STYLE_NEW).toBe("string");
      expect(typeof ROUTES.BRANDS).toBe("string");
      expect(typeof ROUTES.BRAND_NEW).toBe("string");
      expect(typeof ROUTES.CONTENT).toBe("string");
      expect(typeof ROUTES.TRENDS).toBe("string");
      expect(typeof ROUTES.SETTINGS).toBe("string");
      expect(typeof ROUTES.SETTINGS_PLATFORMS).toBe("string");
      expect(typeof ROUTES.SETTINGS_MODELS).toBe("string");
      expect(typeof ROUTES.SETTINGS_DEFAULTS).toBe("string");
    });

    it("has correct types for dynamic route functions", () => {
      expect(typeof ROUTES.PIPELINE_DETAIL).toBe("function");
      expect(typeof ROUTES.PIPELINE_RUN).toBe("function");
      expect(typeof ROUTES.REVIEW_DETAIL).toBe("function");
      expect(typeof ROUTES.STYLE_DETAIL).toBe("function");
      expect(typeof ROUTES.BRAND_DETAIL).toBe("function");
    });
  });

  describe("route path patterns", () => {
    it("all static routes start with /", () => {
      const staticRoutes = [
        ROUTES.DASHBOARD,
        ROUTES.PIPELINES,
        ROUTES.PIPELINE_NEW,
        ROUTES.REVIEW,
        ROUTES.STYLES,
        ROUTES.STYLE_NEW,
        ROUTES.BRANDS,
        ROUTES.BRAND_NEW,
        ROUTES.CONTENT,
        ROUTES.TRENDS,
        ROUTES.SETTINGS,
        ROUTES.SETTINGS_PLATFORMS,
        ROUTES.SETTINGS_MODELS,
        ROUTES.SETTINGS_DEFAULTS,
      ];

      staticRoutes.forEach((route) => {
        expect(route).toMatch(/^\//);
      });
    });

    it("all dynamic routes return paths starting with /", () => {
      expect(ROUTES.PIPELINE_DETAIL("test")).toMatch(/^\//);
      expect(ROUTES.PIPELINE_RUN("test1", "test2")).toMatch(/^\//);
      expect(ROUTES.REVIEW_DETAIL("test1", "test2")).toMatch(/^\//);
      expect(ROUTES.STYLE_DETAIL("test")).toMatch(/^\//);
      expect(ROUTES.BRAND_DETAIL("test")).toMatch(/^\//);
    });

    it("settings routes are nested under /settings", () => {
      expect(ROUTES.SETTINGS_PLATFORMS).toMatch(/^\/settings\//);
      expect(ROUTES.SETTINGS_MODELS).toMatch(/^\/settings\//);
      expect(ROUTES.SETTINGS_DEFAULTS).toMatch(/^\/settings\//);
    });
  });
});
