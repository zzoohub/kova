export type PipelineStatus = "running" | "completed" | "failed" | "draft" | "scheduled";

export type Pipeline = {
  id: string;
  name: string;
  description: string;
  status: PipelineStatus;
  steps: string[];
  lastRunAt: Date | null;
  schedule: string | null;
  templateName: string;
  createdAt: Date;
};
