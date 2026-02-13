import { describe, it, expect } from "vitest";
import { mockStyleDetail } from "./style-detail";

describe("mockStyleDetail", () => {
  it("exports a valid style detail object", () => {
    expect(mockStyleDetail).toBeDefined();
    expect(typeof mockStyleDetail).toBe("object");
  });

  it("has required top-level properties", () => {
    expect(mockStyleDetail).toHaveProperty("id");
    expect(mockStyleDetail).toHaveProperty("name");
    expect(mockStyleDetail).toHaveProperty("sourceUrl");
    expect(mockStyleDetail).toHaveProperty("sourceType");
    expect(mockStyleDetail).toHaveProperty("createdAt");
    expect(mockStyleDetail).toHaveProperty("usageCount");
    expect(mockStyleDetail).toHaveProperty("attributes");
    expect(mockStyleDetail).toHaveProperty("pipelines");
  });

  it("has valid string ID", () => {
    expect(typeof mockStyleDetail.id).toBe("string");
    expect(mockStyleDetail.id.length).toBeGreaterThan(0);
  });

  it("has valid string name", () => {
    expect(typeof mockStyleDetail.name).toBe("string");
    expect(mockStyleDetail.name.length).toBeGreaterThan(0);
  });

  it("has valid sourceUrl", () => {
    expect(typeof mockStyleDetail.sourceUrl).toBe("string");
    expect(mockStyleDetail.sourceUrl).toMatch(/^https?:\/\//);
  });

  it("has sourceType as 'url'", () => {
    expect(mockStyleDetail.sourceType).toBe("url");
  });

  it("has valid Date object for createdAt", () => {
    expect(mockStyleDetail.createdAt).toBeInstanceOf(Date);
    expect(mockStyleDetail.createdAt.getTime()).not.toBeNaN();
  });

  it("has createdAt in the past", () => {
    const now = new Date();
    expect(mockStyleDetail.createdAt.getTime()).toBeLessThanOrEqual(
      now.getTime()
    );
  });

  it("has valid usageCount number", () => {
    expect(typeof mockStyleDetail.usageCount).toBe("number");
    expect(mockStyleDetail.usageCount).toBeGreaterThanOrEqual(0);
  });

  it("has non-empty attributes array", () => {
    expect(Array.isArray(mockStyleDetail.attributes)).toBe(true);
    expect(mockStyleDetail.attributes.length).toBeGreaterThan(0);
  });

  it("has valid attribute objects", () => {
    mockStyleDetail.attributes.forEach((attr) => {
      expect(attr).toHaveProperty("label");
      expect(attr).toHaveProperty("value");
      expect(typeof attr.label).toBe("string");
      expect(attr.label.length).toBeGreaterThan(0);
      expect(typeof attr.value).toBe("string");
      expect(attr.value.length).toBeGreaterThan(0);
    });
  });

  it("has expected number of attributes", () => {
    expect(mockStyleDetail.attributes).toHaveLength(10);
  });

  it("has expected attribute labels", () => {
    const expectedLabels = [
      "Hook Pattern",
      "Tone",
      "Rhythm",
      "Structure",
      "Emoji Usage",
      "Engagement Techniques",
      "Formatting",
      "Vocabulary Level",
      "Perspective",
      "Platform Conventions",
    ];

    const actualLabels = mockStyleDetail.attributes.map((attr) => attr.label);
    expect(actualLabels).toEqual(expectedLabels);
  });

  it("has unique attribute labels", () => {
    const labels = mockStyleDetail.attributes.map((attr) => attr.label);
    const uniqueLabels = new Set(labels);
    expect(uniqueLabels.size).toBe(labels.length);
  });

  it("has pipelines array", () => {
    expect(Array.isArray(mockStyleDetail.pipelines)).toBe(true);
  });

  it("has valid pipeline objects", () => {
    mockStyleDetail.pipelines.forEach((pipeline) => {
      expect(pipeline).toHaveProperty("name");
      expect(pipeline).toHaveProperty("lastRunAt");
      expect(typeof pipeline.name).toBe("string");
      expect(pipeline.name.length).toBeGreaterThan(0);
      expect(pipeline.lastRunAt).toBeInstanceOf(Date);
      expect(pipeline.lastRunAt.getTime()).not.toBeNaN();
    });
  });

  it("has pipelines with lastRunAt in the past", () => {
    const now = new Date();
    mockStyleDetail.pipelines.forEach((pipeline) => {
      expect(pipeline.lastRunAt.getTime()).toBeLessThanOrEqual(now.getTime());
    });
  });

  it("has expected number of pipelines", () => {
    expect(mockStyleDetail.pipelines).toHaveLength(2);
  });

  it("has expected pipeline names", () => {
    const pipelineNames = mockStyleDetail.pipelines.map((p) => p.name);
    expect(pipelineNames).toContain("My Weekly Thread Pipeline");
    expect(pipelineNames).toContain("Blog to Social");
  });

  it("has expected ID value", () => {
    expect(mockStyleDetail.id).toBe("sty_01");
  });

  it("has expected name value", () => {
    expect(mockStyleDetail.name).toBe("Sarah's Tech Voice");
  });

  it("has expected usageCount value", () => {
    expect(mockStyleDetail.usageCount).toBe(47);
  });

  it("has Hook Pattern attribute with expected content", () => {
    const hookPattern = mockStyleDetail.attributes.find(
      (attr) => attr.label === "Hook Pattern"
    );
    expect(hookPattern).toBeDefined();
    expect(hookPattern?.value).toContain("Personal story");
    expect(hookPattern?.value).toContain("bold contrarian claim");
  });

  it("has Tone attribute with expected content", () => {
    const tone = mockStyleDetail.attributes.find(
      (attr) => attr.label === "Tone"
    );
    expect(tone).toBeDefined();
    expect(tone?.value).toContain("Casual authority");
  });

  it("has Rhythm attribute with expected content", () => {
    const rhythm = mockStyleDetail.attributes.find(
      (attr) => attr.label === "Rhythm"
    );
    expect(rhythm).toBeDefined();
    expect(rhythm?.value).toContain("Short. Punchy.");
  });
});
