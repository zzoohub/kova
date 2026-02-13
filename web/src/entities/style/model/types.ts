export type StyleSourceType = "url" | "text" | "audio" | "video" | "image";

export type StyleAttribute = {
  label: string;
  value: string;
};

export type StyleProfile = {
  id: string;
  name: string;
  sourceType: StyleSourceType;
  topAttributes: StyleAttribute[];
  usageCount: number;
  createdAt: Date;
};
