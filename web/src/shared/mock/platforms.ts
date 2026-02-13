export type MockPlatform = {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  account?: string;
  connectedAt?: Date;
  permissions?: string[];
  description: string;
  comingSoon?: boolean;
};

export const mockPlatforms: MockPlatform[] = [
  {
    id: "x",
    name: "X / Twitter",
    icon: "twitter",
    color: "#000000",
    connected: true,
    account: "@sarahcreates",
    connectedAt: new Date(2025, 0, 10),
    permissions: ["Post threads", "Upload media"],
    description: "Post threads and individual tweets.",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "youtube",
    color: "#FF0000",
    connected: true,
    account: "Sarah's Tech Channel",
    connectedAt: new Date(2025, 0, 12),
    permissions: ["Upload videos", "Manage metadata"],
    description: "Upload videos and manage your channel.",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "instagram",
    color: "#E4405F",
    connected: false,
    description:
      "Publish carousels and reels to your Business or Creator account.",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "linkedin",
    color: "#0A66C2",
    connected: false,
    description: "Publish posts and articles.",
    comingSoon: true,
  },
  {
    id: "wordpress",
    name: "WordPress",
    icon: "wordpress",
    color: "#21759B",
    connected: false,
    description: "Publish blog articles directly.",
    comingSoon: true,
  },
];
