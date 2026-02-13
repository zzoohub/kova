import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getGreeting } from "./greeting";

function localDate(hour: number, minute = 0, second = 0): Date {
  const d = new Date(2024, 0, 15, hour, minute, second);
  return d;
}

describe("getGreeting", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns morning greeting for hour 0 (midnight)", () => {
    vi.setSystemTime(localDate(0));
    expect(getGreeting()).toEqual({ en: "Good morning", ko: "좋은 아침이에요" });
  });

  it("returns morning greeting for hour 6 (early morning)", () => {
    vi.setSystemTime(localDate(6));
    expect(getGreeting()).toEqual({ en: "Good morning", ko: "좋은 아침이에요" });
  });

  it("returns morning greeting for hour 11 (late morning)", () => {
    vi.setSystemTime(localDate(11, 59, 59));
    expect(getGreeting()).toEqual({ en: "Good morning", ko: "좋은 아침이에요" });
  });

  it("returns afternoon greeting for hour 12 (noon)", () => {
    vi.setSystemTime(localDate(12));
    expect(getGreeting()).toEqual({ en: "Good afternoon", ko: "좋은 오후에요" });
  });

  it("returns afternoon greeting for hour 14 (afternoon)", () => {
    vi.setSystemTime(localDate(14, 30));
    expect(getGreeting()).toEqual({ en: "Good afternoon", ko: "좋은 오후에요" });
  });

  it("returns afternoon greeting for hour 17 (late afternoon)", () => {
    vi.setSystemTime(localDate(17, 59, 59));
    expect(getGreeting()).toEqual({ en: "Good afternoon", ko: "좋은 오후에요" });
  });

  it("returns evening greeting for hour 18", () => {
    vi.setSystemTime(localDate(18));
    expect(getGreeting()).toEqual({ en: "Good evening", ko: "좋은 저녁이에요" });
  });

  it("returns evening greeting for hour 20 (evening)", () => {
    vi.setSystemTime(localDate(20));
    expect(getGreeting()).toEqual({ en: "Good evening", ko: "좋은 저녁이에요" });
  });

  it("returns evening greeting for hour 23 (late night)", () => {
    vi.setSystemTime(localDate(23, 59, 59));
    expect(getGreeting()).toEqual({ en: "Good evening", ko: "좋은 저녁이에요" });
  });

  it("returns object with both en and ko keys", () => {
    const result = getGreeting();
    expect(result).toHaveProperty("en");
    expect(result).toHaveProperty("ko");
    expect(typeof result.en).toBe("string");
    expect(typeof result.ko).toBe("string");
  });

  it("returns non-empty strings for both languages", () => {
    const result = getGreeting();
    expect(result.en.length).toBeGreaterThan(0);
    expect(result.ko.length).toBeGreaterThan(0);
  });

  describe("boundary conditions", () => {
    it("hour 11:59:59 returns morning", () => {
      vi.setSystemTime(localDate(11, 59, 59));
      expect(getGreeting().en).toBe("Good morning");
    });

    it("hour 12:00:00 returns afternoon", () => {
      vi.setSystemTime(localDate(12, 0, 0));
      expect(getGreeting().en).toBe("Good afternoon");
    });

    it("hour 17:59:59 returns afternoon", () => {
      vi.setSystemTime(localDate(17, 59, 59));
      expect(getGreeting().en).toBe("Good afternoon");
    });

    it("hour 18:00:00 returns evening", () => {
      vi.setSystemTime(localDate(18, 0, 0));
      expect(getGreeting().en).toBe("Good evening");
    });
  });
});
