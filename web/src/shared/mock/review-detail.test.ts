import { describe, it, expect } from "vitest";
import { mockReviewDetail } from "./review-detail";

describe("mockReviewDetail", () => {
  it("exports a valid review detail object", () => {
    expect(mockReviewDetail).toBeDefined();
    expect(typeof mockReviewDetail).toBe("object");
  });

  it("has required top-level properties", () => {
    expect(mockReviewDetail).toHaveProperty("id");
    expect(mockReviewDetail).toHaveProperty("pipelineName");
    expect(mockReviewDetail).toHaveProperty("stepName");
    expect(mockReviewDetail).toHaveProperty("formatType");
    expect(mockReviewDetail).toHaveProperty("status");
    expect(mockReviewDetail).toHaveProperty("runId");
    expect(mockReviewDetail).toHaveProperty("stepId");
    expect(mockReviewDetail).toHaveProperty("source");
    expect(mockReviewDetail).toHaveProperty("styleProfile");
    expect(mockReviewDetail).toHaveProperty("previousStepOutput");
    expect(mockReviewDetail).toHaveProperty("generatedContent");
  });

  it("has valid string IDs", () => {
    expect(typeof mockReviewDetail.id).toBe("string");
    expect(mockReviewDetail.id.length).toBeGreaterThan(0);
    expect(typeof mockReviewDetail.runId).toBe("string");
    expect(mockReviewDetail.runId.length).toBeGreaterThan(0);
    expect(typeof mockReviewDetail.stepId).toBe("string");
    expect(mockReviewDetail.stepId.length).toBeGreaterThan(0);
  });

  it("has valid string names", () => {
    expect(typeof mockReviewDetail.pipelineName).toBe("string");
    expect(mockReviewDetail.pipelineName.length).toBeGreaterThan(0);
    expect(typeof mockReviewDetail.stepName).toBe("string");
    expect(mockReviewDetail.stepName.length).toBeGreaterThan(0);
  });

  it("has formatType as 'thread'", () => {
    expect(mockReviewDetail.formatType).toBe("thread");
  });

  it("has status as 'pending'", () => {
    expect(mockReviewDetail.status).toBe("pending");
  });

  it("has valid source object", () => {
    expect(mockReviewDetail.source).toBeDefined();
    expect(mockReviewDetail.source).toHaveProperty("type");
    expect(mockReviewDetail.source).toHaveProperty("content");
  });

  it("has source type as 'topic'", () => {
    expect(mockReviewDetail.source.type).toBe("topic");
  });

  it("has valid source content", () => {
    expect(typeof mockReviewDetail.source.content).toBe("string");
    expect(mockReviewDetail.source.content.length).toBeGreaterThan(0);
  });

  it("has valid styleProfile object", () => {
    expect(mockReviewDetail.styleProfile).toBeDefined();
    expect(mockReviewDetail.styleProfile).toHaveProperty("name");
    expect(mockReviewDetail.styleProfile).toHaveProperty("tone");
    expect(mockReviewDetail.styleProfile).toHaveProperty("hookPattern");
    expect(mockReviewDetail.styleProfile).toHaveProperty("rhythm");
  });

  it("has valid styleProfile string values", () => {
    expect(typeof mockReviewDetail.styleProfile.name).toBe("string");
    expect(mockReviewDetail.styleProfile.name.length).toBeGreaterThan(0);
    expect(typeof mockReviewDetail.styleProfile.tone).toBe("string");
    expect(mockReviewDetail.styleProfile.tone.length).toBeGreaterThan(0);
    expect(typeof mockReviewDetail.styleProfile.hookPattern).toBe("string");
    expect(mockReviewDetail.styleProfile.hookPattern.length).toBeGreaterThan(0);
    expect(typeof mockReviewDetail.styleProfile.rhythm).toBe("string");
    expect(mockReviewDetail.styleProfile.rhythm.length).toBeGreaterThan(0);
  });

  it("has valid previousStepOutput string", () => {
    expect(typeof mockReviewDetail.previousStepOutput).toBe("string");
    expect(mockReviewDetail.previousStepOutput.length).toBeGreaterThan(0);
  });

  it("has valid generatedContent object", () => {
    expect(mockReviewDetail.generatedContent).toBeDefined();
    expect(typeof mockReviewDetail.generatedContent).toBe("object");
  });

  it("has thread property in generatedContent", () => {
    expect(mockReviewDetail.generatedContent).toHaveProperty("thread");
    expect(Array.isArray(mockReviewDetail.generatedContent.thread)).toBe(true);
  });

  it("has non-empty thread array", () => {
    expect(mockReviewDetail.generatedContent.thread.length).toBeGreaterThan(0);
  });

  it("has valid thread post objects", () => {
    mockReviewDetail.generatedContent.thread.forEach((post) => {
      expect(post).toHaveProperty("id");
      expect(post).toHaveProperty("text");
      expect(typeof post.id).toBe("string");
      expect(post.id.length).toBeGreaterThan(0);
      expect(typeof post.text).toBe("string");
      expect(post.text.length).toBeGreaterThan(0);
    });
  });

  it("has expected number of thread posts", () => {
    expect(mockReviewDetail.generatedContent.thread).toHaveLength(9);
  });

  it("has sequential thread post IDs", () => {
    const thread = mockReviewDetail.generatedContent.thread;
    thread.forEach((post, index) => {
      expect(post.id).toBe(`p${index + 1}`);
    });
  });

  it("has first post as hook", () => {
    const firstPost = mockReviewDetail.generatedContent.thread[0];
    expect(firstPost).toBeDefined();
    expect(firstPost!.text).toContain("I wasted");
    expect(firstPost!.text.length).toBeGreaterThan(0);
  });

  it("has last post as summary/CTA", () => {
    const lastPost =
      mockReviewDetail.generatedContent.thread[
        mockReviewDetail.generatedContent.thread.length - 1
      ];
    expect(lastPost).toBeDefined();
    expect(lastPost!.text).toContain("TL;DR");
    expect(lastPost!.text).toContain("Follow");
  });

  it("has consistent data relationships", () => {
    // Review is for run_01, step s4 (Multi-Format Transform)
    expect(mockReviewDetail.runId).toBe("run_01");
    expect(mockReviewDetail.stepId).toBe("s4");
    expect(mockReviewDetail.stepName).toBe("Multi-Format Transform");
  });

  it("matches the topic in source and previousStepOutput", () => {
    const topic = "premature optimization";
    expect(mockReviewDetail.source.content.toLowerCase()).toContain(topic);
    expect(mockReviewDetail.previousStepOutput.toLowerCase()).toContain(topic);
  });
});
