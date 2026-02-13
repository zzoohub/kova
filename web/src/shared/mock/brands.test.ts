import { describe, it, expect } from "vitest";
import { mockBrands, type MockBrand } from "./brands";

describe("mockBrands", () => {
  it("exports an array of brands", () => {
    expect(Array.isArray(mockBrands)).toBe(true);
    expect(mockBrands.length).toBeGreaterThan(0);
  });

  it("contains valid brand objects", () => {
    mockBrands.forEach((brand) => {
      expect(brand).toHaveProperty("id");
      expect(brand).toHaveProperty("name");
      expect(brand).toHaveProperty("description");
      expect(brand).toHaveProperty("voiceTone");
      expect(brand).toHaveProperty("targetAudience");
      expect(brand).toHaveProperty("perspective");
      expect(brand).toHaveProperty("emojiUsage");
      expect(brand).toHaveProperty("wordsToUse");
      expect(brand).toHaveProperty("wordsToAvoid");
      expect(brand).toHaveProperty("guidelines");
      expect(brand).toHaveProperty("connectedPlatforms");
      expect(brand).toHaveProperty("isDefault");
      expect(brand).toHaveProperty("pipelineCount");
      expect(brand).toHaveProperty("createdAt");
      expect(brand).toHaveProperty("updatedAt");
    });
  });

  it("has valid string IDs", () => {
    mockBrands.forEach((brand) => {
      expect(typeof brand.id).toBe("string");
      expect(brand.id.length).toBeGreaterThan(0);
    });
  });

  it("has unique brand IDs", () => {
    const ids = mockBrands.map((b) => b.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("has valid string names", () => {
    mockBrands.forEach((brand) => {
      expect(typeof brand.name).toBe("string");
      expect(brand.name.length).toBeGreaterThan(0);
    });
  });

  it("has unique brand names", () => {
    const names = mockBrands.map((b) => b.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it("has valid description strings", () => {
    mockBrands.forEach((brand) => {
      expect(typeof brand.description).toBe("string");
      expect(brand.description.length).toBeGreaterThan(0);
    });
  });

  it("has valid voiceTone strings", () => {
    mockBrands.forEach((brand) => {
      expect(typeof brand.voiceTone).toBe("string");
      expect(brand.voiceTone.length).toBeGreaterThan(0);
    });
  });

  it("has valid targetAudience strings", () => {
    mockBrands.forEach((brand) => {
      expect(typeof brand.targetAudience).toBe("string");
      expect(brand.targetAudience.length).toBeGreaterThan(0);
    });
  });

  it("has valid perspective values", () => {
    const validPerspectives = ["first_person", "third_person"];
    mockBrands.forEach((brand) => {
      expect(typeof brand.perspective).toBe("string");
      expect(validPerspectives).toContain(brand.perspective);
    });
  });

  it("has valid emojiUsage values", () => {
    const validEmojiUsage = ["none", "minimal", "moderate", "frequent"];
    mockBrands.forEach((brand) => {
      expect(typeof brand.emojiUsage).toBe("string");
      expect(validEmojiUsage).toContain(brand.emojiUsage);
    });
  });

  it("has non-empty wordsToUse arrays", () => {
    mockBrands.forEach((brand) => {
      expect(Array.isArray(brand.wordsToUse)).toBe(true);
      expect(brand.wordsToUse.length).toBeGreaterThan(0);
    });
  });

  it("has valid strings in wordsToUse arrays", () => {
    mockBrands.forEach((brand) => {
      brand.wordsToUse.forEach((word) => {
        expect(typeof word).toBe("string");
        expect(word.length).toBeGreaterThan(0);
      });
    });
  });

  it("has non-empty wordsToAvoid arrays", () => {
    mockBrands.forEach((brand) => {
      expect(Array.isArray(brand.wordsToAvoid)).toBe(true);
      expect(brand.wordsToAvoid.length).toBeGreaterThan(0);
    });
  });

  it("has valid strings in wordsToAvoid arrays", () => {
    mockBrands.forEach((brand) => {
      brand.wordsToAvoid.forEach((word) => {
        expect(typeof word).toBe("string");
        expect(word.length).toBeGreaterThan(0);
      });
    });
  });

  it("has valid guidelines strings", () => {
    mockBrands.forEach((brand) => {
      expect(typeof brand.guidelines).toBe("string");
      expect(brand.guidelines.length).toBeGreaterThan(0);
    });
  });

  it("has non-empty connectedPlatforms arrays", () => {
    mockBrands.forEach((brand) => {
      expect(Array.isArray(brand.connectedPlatforms)).toBe(true);
      expect(brand.connectedPlatforms.length).toBeGreaterThan(0);
    });
  });

  it("has valid connectedPlatforms objects", () => {
    mockBrands.forEach((brand) => {
      brand.connectedPlatforms.forEach((platform) => {
        expect(platform).toHaveProperty("platformId");
        expect(platform).toHaveProperty("accountName");
        expect(typeof platform.platformId).toBe("string");
        expect(platform.platformId.length).toBeGreaterThan(0);
        expect(typeof platform.accountName).toBe("string");
        expect(platform.accountName.length).toBeGreaterThan(0);
      });
    });
  });

  it("has valid boolean isDefault values", () => {
    mockBrands.forEach((brand) => {
      expect(typeof brand.isDefault).toBe("boolean");
    });
  });

  it("has exactly one default brand", () => {
    const defaultBrands = mockBrands.filter((b) => b.isDefault);
    expect(defaultBrands).toHaveLength(1);
  });

  it("has valid pipelineCount numbers", () => {
    mockBrands.forEach((brand) => {
      expect(typeof brand.pipelineCount).toBe("number");
      expect(brand.pipelineCount).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(brand.pipelineCount)).toBe(true);
    });
  });

  it("has valid Date objects for createdAt", () => {
    mockBrands.forEach((brand) => {
      expect(brand.createdAt).toBeInstanceOf(Date);
      expect(brand.createdAt.getTime()).not.toBeNaN();
    });
  });

  it("has createdAt in the past", () => {
    const now = new Date();
    mockBrands.forEach((brand) => {
      expect(brand.createdAt.getTime()).toBeLessThanOrEqual(now.getTime());
    });
  });

  it("has valid Date objects for updatedAt", () => {
    mockBrands.forEach((brand) => {
      expect(brand.updatedAt).toBeInstanceOf(Date);
      expect(brand.updatedAt.getTime()).not.toBeNaN();
    });
  });

  it("has updatedAt in the past", () => {
    const now = new Date();
    mockBrands.forEach((brand) => {
      expect(brand.updatedAt.getTime()).toBeLessThanOrEqual(now.getTime());
    });
  });

  it("has updatedAt after or equal to createdAt", () => {
    mockBrands.forEach((brand) => {
      expect(brand.updatedAt.getTime()).toBeGreaterThanOrEqual(
        brand.createdAt.getTime()
      );
    });
  });

  it("contains expected number of brands", () => {
    expect(mockBrands).toHaveLength(3);
  });

  it("contains expected brand IDs", () => {
    const brandIds = mockBrands.map((b) => b.id);
    expect(brandIds).toContain("brn_01");
    expect(brandIds).toContain("brn_02");
    expect(brandIds).toContain("brn_03");
  });

  describe("brn_01 - Sarah Creates", () => {
    let brand: MockBrand | undefined;

    it("exists", () => {
      brand = mockBrands.find((b) => b.id === "brn_01");
      expect(brand).toBeDefined();
    });

    it("has expected name", () => {
      brand = mockBrands.find((b) => b.id === "brn_01");
      expect(brand?.name).toBe("Sarah Creates");
    });

    it("is the default brand", () => {
      brand = mockBrands.find((b) => b.id === "brn_01");
      expect(brand?.isDefault).toBe(true);
    });

    it("has first_person perspective", () => {
      brand = mockBrands.find((b) => b.id === "brn_01");
      expect(brand?.perspective).toBe("first_person");
    });

    it("has minimal emoji usage", () => {
      brand = mockBrands.find((b) => b.id === "brn_01");
      expect(brand?.emojiUsage).toBe("minimal");
    });

    it("has expected pipeline count", () => {
      brand = mockBrands.find((b) => b.id === "brn_01");
      expect(brand?.pipelineCount).toBe(4);
    });

    it("has expected connected platforms", () => {
      brand = mockBrands.find((b) => b.id === "brn_01");
      expect(brand?.connectedPlatforms).toHaveLength(3);

      const platformIds = brand?.connectedPlatforms.map((p) => p.platformId);
      expect(platformIds).toContain("twitter");
      expect(platformIds).toContain("youtube");
      expect(platformIds).toContain("linkedin");
    });

    it("has expected Twitter account", () => {
      brand = mockBrands.find((b) => b.id === "brn_01");
      const twitter = brand?.connectedPlatforms.find(
        (p) => p.platformId === "twitter"
      );
      expect(twitter?.accountName).toBe("@sarahcreates");
    });

    it("has expected words to use", () => {
      brand = mockBrands.find((b) => b.id === "brn_01");
      expect(brand?.wordsToUse).toContain("innovative");
      expect(brand?.wordsToUse).toContain("practical");
      expect(brand?.wordsToUse).toContain("actionable");
      expect(brand?.wordsToUse).toContain("streamline");
    });

    it("has expected words to avoid", () => {
      brand = mockBrands.find((b) => b.id === "brn_01");
      expect(brand?.wordsToAvoid).toContain("synergy");
      expect(brand?.wordsToAvoid).toContain("leverage");
      expect(brand?.wordsToAvoid).toContain("disruptive");
      expect(brand?.wordsToAvoid).toContain("paradigm shift");
    });
  });

  describe("brn_02 - Agency Client A", () => {
    let brand: MockBrand | undefined;

    it("exists", () => {
      brand = mockBrands.find((b) => b.id === "brn_02");
      expect(brand).toBeDefined();
    });

    it("has expected name", () => {
      brand = mockBrands.find((b) => b.id === "brn_02");
      expect(brand?.name).toBe("Agency Client A");
    });

    it("is not the default brand", () => {
      brand = mockBrands.find((b) => b.id === "brn_02");
      expect(brand?.isDefault).toBe(false);
    });

    it("has third_person perspective", () => {
      brand = mockBrands.find((b) => b.id === "brn_02");
      expect(brand?.perspective).toBe("third_person");
    });

    it("has no emoji usage", () => {
      brand = mockBrands.find((b) => b.id === "brn_02");
      expect(brand?.emojiUsage).toBe("none");
    });

    it("has expected pipeline count", () => {
      brand = mockBrands.find((b) => b.id === "brn_02");
      expect(brand?.pipelineCount).toBe(2);
    });

    it("has expected connected platforms", () => {
      brand = mockBrands.find((b) => b.id === "brn_02");
      expect(brand?.connectedPlatforms).toHaveLength(2);

      const platformIds = brand?.connectedPlatforms.map((p) => p.platformId);
      expect(platformIds).toContain("twitter");
      expect(platformIds).toContain("linkedin");
    });

    it("has enterprise-focused words to use", () => {
      brand = mockBrands.find((b) => b.id === "brn_02");
      expect(brand?.wordsToUse).toContain("scalable");
      expect(brand?.wordsToUse).toContain("enterprise-grade");
      expect(brand?.wordsToUse).toContain("ROI");
      expect(brand?.wordsToUse).toContain("mission-critical");
    });

    it("avoids casual language", () => {
      brand = mockBrands.find((b) => b.id === "brn_02");
      expect(brand?.wordsToAvoid).toContain("cheap");
      expect(brand?.wordsToAvoid).toContain("hack");
      expect(brand?.wordsToAvoid).toContain("workaround");
      expect(brand?.wordsToAvoid).toContain("simple");
    });
  });

  describe("brn_03 - Side Project Gaming", () => {
    let brand: MockBrand | undefined;

    it("exists", () => {
      brand = mockBrands.find((b) => b.id === "brn_03");
      expect(brand).toBeDefined();
    });

    it("has expected name", () => {
      brand = mockBrands.find((b) => b.id === "brn_03");
      expect(brand?.name).toBe("Side Project Gaming");
    });

    it("is not the default brand", () => {
      brand = mockBrands.find((b) => b.id === "brn_03");
      expect(brand?.isDefault).toBe(false);
    });

    it("has first_person perspective", () => {
      brand = mockBrands.find((b) => b.id === "brn_03");
      expect(brand?.perspective).toBe("first_person");
    });

    it("has frequent emoji usage", () => {
      brand = mockBrands.find((b) => b.id === "brn_03");
      expect(brand?.emojiUsage).toBe("frequent");
    });

    it("has expected pipeline count", () => {
      brand = mockBrands.find((b) => b.id === "brn_03");
      expect(brand?.pipelineCount).toBe(1);
    });

    it("has expected connected platforms", () => {
      brand = mockBrands.find((b) => b.id === "brn_03");
      expect(brand?.connectedPlatforms).toHaveLength(2);

      const platformIds = brand?.connectedPlatforms.map((p) => p.platformId);
      expect(platformIds).toContain("youtube");
      expect(platformIds).toContain("instagram");
    });

    it("has gaming-focused words to use", () => {
      brand = mockBrands.find((b) => b.id === "brn_03");
      expect(brand?.wordsToUse).toContain("epic");
      expect(brand?.wordsToUse).toContain("clutch");
      expect(brand?.wordsToUse).toContain("grind");
      expect(brand?.wordsToUse).toContain("let's go");
    });

    it("avoids corporate language", () => {
      brand = mockBrands.find((b) => b.id === "brn_03");
      expect(brand?.wordsToAvoid).toContain("corporate");
      expect(brand?.wordsToAvoid).toContain("stakeholder");
      expect(brand?.wordsToAvoid).toContain("enterprise");
      expect(brand?.wordsToAvoid).toContain("synergy");
    });
  });

  describe("data consistency", () => {
    it("has no overlap in wordsToUse and wordsToAvoid within same brand", () => {
      mockBrands.forEach((brand) => {
        const toUse = new Set(brand.wordsToUse.map((w) => w.toLowerCase()));
        const toAvoid = new Set(brand.wordsToAvoid.map((w) => w.toLowerCase()));

        brand.wordsToUse.forEach((word) => {
          expect(toAvoid.has(word.toLowerCase())).toBe(false);
        });
      });
    });

    it("has unique words in wordsToUse for each brand", () => {
      mockBrands.forEach((brand) => {
        const words = brand.wordsToUse;
        const uniqueWords = new Set(words);
        expect(uniqueWords.size).toBe(words.length);
      });
    });

    it("has unique words in wordsToAvoid for each brand", () => {
      mockBrands.forEach((brand) => {
        const words = brand.wordsToAvoid;
        const uniqueWords = new Set(words);
        expect(uniqueWords.size).toBe(words.length);
      });
    });

    it("has unique platform combinations for each brand", () => {
      mockBrands.forEach((brand) => {
        const platformIds = brand.connectedPlatforms.map((p) => p.platformId);
        const uniquePlatformIds = new Set(platformIds);
        expect(uniquePlatformIds.size).toBe(platformIds.length);
      });
    });

    it("has valid platform IDs in connectedPlatforms", () => {
      const validPlatformIds = [
        "twitter",
        "youtube",
        "instagram",
        "linkedin",
        "wordpress",
        "facebook",
        "tiktok",
      ];

      mockBrands.forEach((brand) => {
        brand.connectedPlatforms.forEach((platform) => {
          expect(validPlatformIds).toContain(platform.platformId);
        });
      });
    });
  });

  describe("type safety", () => {
    it("conforms to MockBrand type", () => {
      mockBrands.forEach((brand) => {
        const typedBrand: MockBrand = brand;
        expect(typedBrand).toBeDefined();
      });
    });

    it("has correct emojiUsage type constraint", () => {
      mockBrands.forEach((brand) => {
        expect(["none", "minimal", "moderate", "frequent"]).toContain(
          brand.emojiUsage
        );
      });
    });

    it("has connectedPlatforms with required structure", () => {
      mockBrands.forEach((brand) => {
        brand.connectedPlatforms.forEach((platform) => {
          const keys = Object.keys(platform);
          expect(keys).toContain("platformId");
          expect(keys).toContain("accountName");
          expect(keys).toHaveLength(2);
        });
      });
    });
  });
});
