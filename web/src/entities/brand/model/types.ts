export type EmojiUsage = "none" | "minimal" | "moderate" | "frequent";

export type BrandPlatform = {
  platformId: string;
  accountName: string;
};

export type Brand = {
  id: string;
  name: string;
  description: string;
  voiceTone: string;
  targetAudience: string;
  perspective: string;
  emojiUsage: EmojiUsage;
  wordsToUse: string[];
  wordsToAvoid: string[];
  guidelines: string;
  connectedPlatforms: BrandPlatform[];
  isDefault: boolean;
  pipelineCount: number;
  createdAt: Date;
  updatedAt: Date;
};
