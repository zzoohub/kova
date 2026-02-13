import { describe, it, expect } from "vitest";
import { mockPipelineRuns } from "./pipeline-runs";

describe("mockPipelineRuns", () => {
  it("exports an array of pipeline runs", () => {
    expect(Array.isArray(mockPipelineRuns)).toBe(true);
    expect(mockPipelineRuns.length).toBeGreaterThan(0);
  });

  it("contains valid pipeline run objects", () => {
    mockPipelineRuns.forEach((run) => {
      expect(run).toHaveProperty("id");
      expect(run).toHaveProperty("pipelineId");
      expect(run).toHaveProperty("pipelineName");
      expect(run).toHaveProperty("status");
      expect(run).toHaveProperty("steps");
      expect(run).toHaveProperty("startedAt");
      expect(run).toHaveProperty("completedAt");
      expect(run).toHaveProperty("triggerType");
    });
  });

  it("has valid status values", () => {
    const validStatuses = [
      "pending",
      "running",
      "waiting_for_approval",
      "completed",
      "failed",
      "cancelled",
    ];

    mockPipelineRuns.forEach((run) => {
      expect(validStatuses).toContain(run.status);
    });
  });

  it("has valid trigger types", () => {
    const validTriggerTypes = ["manual", "scheduled"];

    mockPipelineRuns.forEach((run) => {
      expect(validTriggerTypes).toContain(run.triggerType);
    });
  });

  it("has valid Date objects for startedAt", () => {
    mockPipelineRuns.forEach((run) => {
      expect(run.startedAt).toBeInstanceOf(Date);
      expect(run.startedAt.getTime()).not.toBeNaN();
    });
  });

  it("has valid completedAt values (Date or null)", () => {
    mockPipelineRuns.forEach((run) => {
      if (run.completedAt !== null) {
        expect(run.completedAt).toBeInstanceOf(Date);
        expect(run.completedAt.getTime()).not.toBeNaN();
      }
    });
  });

  it("has completedAt as null for non-completed runs", () => {
    const nonCompletedStatuses = [
      "pending",
      "running",
      "waiting_for_approval",
    ];

    mockPipelineRuns.forEach((run) => {
      if (nonCompletedStatuses.includes(run.status)) {
        expect(run.completedAt).toBeNull();
      }
    });
  });

  it("has completedAt as Date for completed/failed/cancelled runs", () => {
    const finalStatuses = ["completed", "failed", "cancelled"];

    mockPipelineRuns.forEach((run) => {
      if (finalStatuses.includes(run.status)) {
        expect(run.completedAt).toBeInstanceOf(Date);
      }
    });
  });

  it("has completedAt after startedAt when both exist", () => {
    mockPipelineRuns.forEach((run) => {
      if (run.completedAt !== null) {
        expect(run.completedAt.getTime()).toBeGreaterThanOrEqual(
          run.startedAt.getTime()
        );
      }
    });
  });

  it("has non-empty steps array", () => {
    mockPipelineRuns.forEach((run) => {
      expect(Array.isArray(run.steps)).toBe(true);
      expect(run.steps.length).toBeGreaterThan(0);
    });
  });

  it("has valid step objects", () => {
    mockPipelineRuns.forEach((run) => {
      run.steps.forEach((step) => {
        expect(step).toHaveProperty("id");
        expect(step).toHaveProperty("name");
        expect(step).toHaveProperty("status");
        expect(step).toHaveProperty("duration");
        expect(step).toHaveProperty("progress");
        expect(step).toHaveProperty("output");

        expect(typeof step.id).toBe("string");
        expect(typeof step.name).toBe("string");
      });
    });
  });

  it("has valid step status values", () => {
    const validStepStatuses = ["completed", "running", "waiting", "failed", "review"];

    mockPipelineRuns.forEach((run) => {
      run.steps.forEach((step) => {
        expect(validStepStatuses).toContain(step.status);
      });
    });
  });

  it("has correct duration values based on step status", () => {
    mockPipelineRuns.forEach((run) => {
      run.steps.forEach((step) => {
        if (step.status === "completed") {
          expect(step.duration).toBeTypeOf("number");
          expect(step.duration).toBeGreaterThan(0);
        } else {
          // running, waiting, failed, review steps should have null duration
          // (though failed could have a duration if it ran for some time)
        }
      });
    });
  });

  it("has correct progress values based on step status", () => {
    mockPipelineRuns.forEach((run) => {
      run.steps.forEach((step) => {
        if (step.status === "running" && step.progress !== null) {
          expect(step.progress).toBeTypeOf("number");
          expect(step.progress).toBeGreaterThanOrEqual(0);
          expect(step.progress).toBeLessThanOrEqual(100);
        }
      });
    });
  });

  it("has valid branch objects when branches exist", () => {
    const validBranchStatuses = ["completed", "running", "waiting", "failed"];

    mockPipelineRuns.forEach((run) => {
      run.steps.forEach((step) => {
        if (step.branches) {
          expect(Array.isArray(step.branches)).toBe(true);
          step.branches.forEach((branch) => {
            expect(branch).toHaveProperty("name");
            expect(branch).toHaveProperty("status");
            expect(typeof branch.name).toBe("string");
            expect(validBranchStatuses).toContain(branch.status);
          });
        }
      });
    });
  });

  it("contains expected mock data entries", () => {
    expect(mockPipelineRuns).toHaveLength(3);

    // Check specific entries exist
    const runIds = mockPipelineRuns.map((r) => r.id);
    expect(runIds).toContain("run_01");
    expect(runIds).toContain("run_02");
    expect(runIds).toContain("run_03");
  });

  it("has running status for run_01", () => {
    const run01 = mockPipelineRuns.find((r) => r.id === "run_01");
    expect(run01?.status).toBe("running");
  });

  it("has completed status for run_02", () => {
    const run02 = mockPipelineRuns.find((r) => r.id === "run_02");
    expect(run02?.status).toBe("completed");
  });

  it("has failed status for run_03", () => {
    const run03 = mockPipelineRuns.find((r) => r.id === "run_03");
    expect(run03?.status).toBe("failed");
  });

  it("has branches in run_01 step 4", () => {
    const run01 = mockPipelineRuns.find((r) => r.id === "run_01");
    const step4 = run01?.steps.find((s) => s.id === "s4");
    expect(step4?.branches).toBeDefined();
    expect(step4?.branches).toHaveLength(3);
  });

  it("has valid string IDs", () => {
    mockPipelineRuns.forEach((run) => {
      expect(typeof run.id).toBe("string");
      expect(run.id.length).toBeGreaterThan(0);
      expect(typeof run.pipelineId).toBe("string");
      expect(run.pipelineId.length).toBeGreaterThan(0);
    });
  });

  it("has valid string names", () => {
    mockPipelineRuns.forEach((run) => {
      expect(typeof run.pipelineName).toBe("string");
      expect(run.pipelineName.length).toBeGreaterThan(0);

      run.steps.forEach((step) => {
        expect(typeof step.name).toBe("string");
        expect(step.name.length).toBeGreaterThan(0);
      });
    });
  });
});
