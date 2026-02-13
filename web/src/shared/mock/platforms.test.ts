import { describe, it, expect } from "vitest";
import { mockPlatforms } from "./platforms";

describe("mockPlatforms", () => {
  it("exports an array of platforms", () => {
    expect(Array.isArray(mockPlatforms)).toBe(true);
    expect(mockPlatforms.length).toBeGreaterThan(0);
  });

  it("contains valid platform objects", () => {
    mockPlatforms.forEach((platform) => {
      expect(platform).toHaveProperty("id");
      expect(platform).toHaveProperty("name");
      expect(platform).toHaveProperty("icon");
      expect(platform).toHaveProperty("color");
      expect(platform).toHaveProperty("connected");
      expect(platform).toHaveProperty("description");
    });
  });

  it("has valid string IDs", () => {
    mockPlatforms.forEach((platform) => {
      expect(typeof platform.id).toBe("string");
      expect(platform.id.length).toBeGreaterThan(0);
    });
  });

  it("has unique platform IDs", () => {
    const ids = mockPlatforms.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("has valid string names", () => {
    mockPlatforms.forEach((platform) => {
      expect(typeof platform.name).toBe("string");
      expect(platform.name.length).toBeGreaterThan(0);
    });
  });

  it("has valid icon strings", () => {
    mockPlatforms.forEach((platform) => {
      expect(typeof platform.icon).toBe("string");
      expect(platform.icon.length).toBeGreaterThan(0);
    });
  });

  it("has valid hex color codes", () => {
    mockPlatforms.forEach((platform) => {
      expect(typeof platform.color).toBe("string");
      expect(platform.color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it("has valid boolean connected status", () => {
    mockPlatforms.forEach((platform) => {
      expect(typeof platform.connected).toBe("boolean");
    });
  });

  it("has valid description strings", () => {
    mockPlatforms.forEach((platform) => {
      expect(typeof platform.description).toBe("string");
      expect(platform.description.length).toBeGreaterThan(0);
    });
  });

  it("has account property only for connected platforms", () => {
    mockPlatforms.forEach((platform) => {
      if (platform.connected) {
        expect(platform.account).toBeDefined();
        expect(typeof platform.account).toBe("string");
        expect(platform.account!.length).toBeGreaterThan(0);
      } else {
        expect(platform.account).toBeUndefined();
      }
    });
  });

  it("has connectedAt property only for connected platforms", () => {
    mockPlatforms.forEach((platform) => {
      if (platform.connected) {
        expect(platform.connectedAt).toBeDefined();
        expect(platform.connectedAt).toBeInstanceOf(Date);
        expect(platform.connectedAt!.getTime()).not.toBeNaN();
      } else {
        expect(platform.connectedAt).toBeUndefined();
      }
    });
  });

  it("has connectedAt in the past for connected platforms", () => {
    const now = new Date();
    mockPlatforms.forEach((platform) => {
      if (platform.connected && platform.connectedAt) {
        expect(platform.connectedAt.getTime()).toBeLessThanOrEqual(
          now.getTime()
        );
      }
    });
  });

  it("has permissions property only for connected platforms", () => {
    mockPlatforms.forEach((platform) => {
      if (platform.connected) {
        expect(platform.permissions).toBeDefined();
        expect(Array.isArray(platform.permissions)).toBe(true);
        expect(platform.permissions!.length).toBeGreaterThan(0);
      } else {
        expect(platform.permissions).toBeUndefined();
      }
    });
  });

  it("has valid permission strings for connected platforms", () => {
    mockPlatforms.forEach((platform) => {
      if (platform.connected && platform.permissions) {
        platform.permissions.forEach((permission) => {
          expect(typeof permission).toBe("string");
          expect(permission.length).toBeGreaterThan(0);
        });
      }
    });
  });

  it("has comingSoon as boolean when defined", () => {
    mockPlatforms.forEach((platform) => {
      if (platform.comingSoon !== undefined) {
        expect(typeof platform.comingSoon).toBe("boolean");
      }
    });
  });

  it("has at least one connected platform", () => {
    const connectedPlatforms = mockPlatforms.filter((p) => p.connected);
    expect(connectedPlatforms.length).toBeGreaterThan(0);
  });

  it("has at least one disconnected platform", () => {
    const disconnectedPlatforms = mockPlatforms.filter((p) => !p.connected);
    expect(disconnectedPlatforms.length).toBeGreaterThan(0);
  });

  it("contains expected platforms", () => {
    expect(mockPlatforms).toHaveLength(5);

    const platformIds = mockPlatforms.map((p) => p.id);
    expect(platformIds).toContain("x");
    expect(platformIds).toContain("youtube");
    expect(platformIds).toContain("instagram");
    expect(platformIds).toContain("linkedin");
    expect(platformIds).toContain("wordpress");
  });

  it("has X/Twitter connected", () => {
    const xPlatform = mockPlatforms.find((p) => p.id === "x");
    expect(xPlatform?.connected).toBe(true);
    expect(xPlatform?.account).toBe("@sarahcreates");
  });

  it("has YouTube connected", () => {
    const youtubePlatform = mockPlatforms.find((p) => p.id === "youtube");
    expect(youtubePlatform?.connected).toBe(true);
    expect(youtubePlatform?.account).toBe("Sarah's Tech Channel");
  });

  it("has Instagram disconnected", () => {
    const instagramPlatform = mockPlatforms.find((p) => p.id === "instagram");
    expect(instagramPlatform?.connected).toBe(false);
  });

  it("has LinkedIn as coming soon", () => {
    const linkedinPlatform = mockPlatforms.find((p) => p.id === "linkedin");
    expect(linkedinPlatform?.comingSoon).toBe(true);
  });

  it("has WordPress as coming soon", () => {
    const wordpressPlatform = mockPlatforms.find((p) => p.id === "wordpress");
    expect(wordpressPlatform?.comingSoon).toBe(true);
  });

  it("has correct icons for platforms", () => {
    const xPlatform = mockPlatforms.find((p) => p.id === "x");
    expect(xPlatform?.icon).toBe("twitter");

    const youtubePlatform = mockPlatforms.find((p) => p.id === "youtube");
    expect(youtubePlatform?.icon).toBe("youtube");

    const instagramPlatform = mockPlatforms.find((p) => p.id === "instagram");
    expect(instagramPlatform?.icon).toBe("instagram");

    const linkedinPlatform = mockPlatforms.find((p) => p.id === "linkedin");
    expect(linkedinPlatform?.icon).toBe("linkedin");

    const wordpressPlatform = mockPlatforms.find((p) => p.id === "wordpress");
    expect(wordpressPlatform?.icon).toBe("wordpress");
  });

  it("has correct brand colors", () => {
    const xPlatform = mockPlatforms.find((p) => p.id === "x");
    expect(xPlatform?.color).toBe("#000000");

    const youtubePlatform = mockPlatforms.find((p) => p.id === "youtube");
    expect(youtubePlatform?.color).toBe("#FF0000");

    const instagramPlatform = mockPlatforms.find((p) => p.id === "instagram");
    expect(instagramPlatform?.color).toBe("#E4405F");

    const linkedinPlatform = mockPlatforms.find((p) => p.id === "linkedin");
    expect(linkedinPlatform?.color).toBe("#0A66C2");

    const wordpressPlatform = mockPlatforms.find((p) => p.id === "wordpress");
    expect(wordpressPlatform?.color).toBe("#21759B");
  });

  it("has X platform with expected permissions", () => {
    const xPlatform = mockPlatforms.find((p) => p.id === "x");
    expect(xPlatform?.permissions).toContain("Post threads");
    expect(xPlatform?.permissions).toContain("Upload media");
  });

  it("has YouTube platform with expected permissions", () => {
    const youtubePlatform = mockPlatforms.find((p) => p.id === "youtube");
    expect(youtubePlatform?.permissions).toContain("Upload videos");
    expect(youtubePlatform?.permissions).toContain("Manage metadata");
  });
});
