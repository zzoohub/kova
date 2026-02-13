export type ReviewFormatType = "thread" | "post" | "newsletter" | "video_script" | "carousel";

export type ReviewItem = {
  id: string;
  pipelineName: string;
  stepName: string;
  formatType: ReviewFormatType;
  contentPreview: string;
  status: "pending" | "approved" | "rejected";
  waitingSince: Date;
  runId: string;
  stepId: string;
};
