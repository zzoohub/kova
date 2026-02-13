import { ROUTES } from "@/shared/config/routes";

export type MockNotification = {
  id: string;
  message: string;
  type:
    | "pipeline_completed"
    | "review_ready"
    | "style_created"
    | "content_published";
  read: boolean;
  createdAt: Date;
  linkPath: string;
};

export const mockNotifications: MockNotification[] = [
  {
    id: "ntf_01",
    message: "LinkedIn Thought Leadership pipeline completed successfully.",
    type: "pipeline_completed",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    linkPath: ROUTES.PIPELINE_DETAIL("pip_02"),
  },
  {
    id: "ntf_02",
    message: "New content is waiting for your review: YouTube script draft.",
    type: "review_ready",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    linkPath: ROUTES.REVIEW_DETAIL("run_01", "step_02"),
  },
  {
    id: "ntf_03",
    message: 'Style profile "Newsletter Curator" has been created.',
    type: "style_created",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    linkPath: ROUTES.STYLE_DETAIL("sty_05"),
  },
  {
    id: "ntf_04",
    message:
      'Published "Why AI Agents Will Replace SaaS Dashboards" to X/Twitter.',
    type: "content_published",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    linkPath: ROUTES.CONTENT,
  },
  {
    id: "ntf_05",
    message: "X Thread Generator pipeline is waiting for approval.",
    type: "review_ready",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    linkPath: ROUTES.REVIEW_DETAIL("run_05", "step_02"),
  },
];
