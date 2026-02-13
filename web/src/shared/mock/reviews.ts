export type MockReview = {
  id: string;
  pipelineName: string;
  stepName: string;
  formatType: "thread" | "post" | "newsletter" | "video_script";
  contentPreview: string;
  status: "pending" | "approved" | "rejected";
  waitingSince: Date;
  runId: string;
  stepId: string;
};

export const mockReviews: MockReview[] = [
  {
    id: "rev_01",
    pipelineName: "Weekly YouTube Breakdown",
    stepName: "Script Generation",
    formatType: "video_script",
    contentPreview:
      "Ever wondered why every AI startup claims to be the next big thing? Today we are diving into the three patterns that actually separate...",
    status: "pending",
    waitingSince: new Date(Date.now() - 1000 * 60 * 45),
    runId: "run_01",
    stepId: "step_02",
  },
  {
    id: "rev_02",
    pipelineName: "X Thread Generator",
    stepName: "Thread Structuring",
    formatType: "thread",
    contentPreview:
      "I spent 6 months studying how the best creators repurpose content. Here is the framework nobody talks about. A thread on compound...",
    status: "pending",
    waitingSince: new Date(Date.now() - 1000 * 60 * 60 * 2),
    runId: "run_05",
    stepId: "step_02",
  },
  {
    id: "rev_03",
    pipelineName: "LinkedIn Thought Leadership",
    stepName: "Post Drafting",
    formatType: "post",
    contentPreview:
      "Last quarter, our team shipped 47 features. But the one that moved the needle was not on any roadmap. Here is what we learned about...",
    status: "approved",
    waitingSince: new Date(Date.now() - 1000 * 60 * 60 * 5),
    runId: "run_02",
    stepId: "step_02",
  },
  {
    id: "rev_04",
    pipelineName: "Newsletter Digest",
    stepName: "Commentary Writing",
    formatType: "newsletter",
    contentPreview:
      "This week in AI: OpenAI quietly dropped a reasoning model update, Google DeepMind published new results on protein folding, and a 19...",
    status: "rejected",
    waitingSince: new Date(Date.now() - 1000 * 60 * 60 * 12),
    runId: "run_03",
    stepId: "step_03",
  },
];
