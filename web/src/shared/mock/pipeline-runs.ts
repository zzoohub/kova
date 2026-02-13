export type MockPipelineRun = {
  id: string;
  pipelineId: string;
  pipelineName: string;
  status:
    | "pending"
    | "running"
    | "waiting_for_approval"
    | "completed"
    | "failed"
    | "cancelled";
  steps: Array<{
    id: string;
    name: string;
    status: "completed" | "running" | "waiting" | "failed" | "review";
    duration: number | null;
    progress: number | null;
    output: string | null;
    branches?: Array<{
      name: string;
      status: "completed" | "running" | "waiting" | "failed";
    }>;
  }>;
  startedAt: Date;
  completedAt: Date | null;
  triggerType: "manual" | "scheduled";
};

export const mockPipelineRuns: MockPipelineRun[] = [
  {
    id: "run_01",
    pipelineId: "pip_01",
    pipelineName: "Weekly YouTube Breakdown",
    status: "running",
    steps: [
      {
        id: "s1",
        name: "Idea Generation",
        status: "completed",
        duration: 12,
        progress: null,
        output:
          "Why most developers waste time on premature optimization...",
      },
      {
        id: "s2",
        name: "Research",
        status: "completed",
        duration: 28,
        progress: null,
        output: "3 key points identified from 5 sources",
      },
      {
        id: "s3",
        name: "Script Writing",
        status: "running",
        duration: null,
        progress: 62,
        output: null,
      },
      {
        id: "s4",
        name: "Multi-Format Transform",
        status: "waiting",
        duration: null,
        progress: null,
        output: null,
        branches: [
          { name: "Thread (12 posts)", status: "waiting" },
          { name: "LinkedIn post", status: "waiting" },
          { name: "Newsletter", status: "waiting" },
        ],
      },
      {
        id: "s5",
        name: "Human Review",
        status: "waiting",
        duration: null,
        progress: null,
        output: null,
      },
      {
        id: "s6",
        name: "Deploy to X, LinkedIn",
        status: "waiting",
        duration: null,
        progress: null,
        output: null,
      },
    ],
    startedAt: new Date(Date.now() - 180000),
    completedAt: null,
    triggerType: "manual",
  },
  {
    id: "run_02",
    pipelineId: "pip_02",
    pipelineName: "LinkedIn Thought Leadership",
    status: "completed",
    steps: [
      {
        id: "s1",
        name: "Research Agent",
        status: "completed",
        duration: 35,
        progress: null,
        output: "Analyzed 3 research documents",
      },
      {
        id: "s2",
        name: "Script Writer",
        status: "completed",
        duration: 22,
        progress: null,
        output: "The Compound Content Framework: A complete guide...",
      },
      {
        id: "s3",
        name: "Content Editor",
        status: "completed",
        duration: 8,
        progress: null,
        output: "Polished and refined for professional tone",
      },
      {
        id: "s4",
        name: "Deploy to LinkedIn",
        status: "completed",
        duration: 3,
        progress: null,
        output: "Published successfully",
      },
    ],
    startedAt: new Date(Date.now() - 7200000),
    completedAt: new Date(Date.now() - 6800000),
    triggerType: "scheduled",
  },
  {
    id: "run_03",
    pipelineId: "pip_01",
    pipelineName: "Weekly YouTube Breakdown",
    status: "failed",
    steps: [
      {
        id: "s1",
        name: "Idea Generation",
        status: "completed",
        duration: 15,
        progress: null,
        output: "5 video breakdown ideas generated",
      },
      {
        id: "s2",
        name: "Research",
        status: "failed",
        duration: null,
        progress: null,
        output:
          "Failed to fetch video transcript - video may be private",
      },
      {
        id: "s3",
        name: "Script Writing",
        status: "waiting",
        duration: null,
        progress: null,
        output: null,
      },
    ],
    startedAt: new Date(Date.now() - 86400000),
    completedAt: new Date(Date.now() - 86200000),
    triggerType: "manual",
  },
];
