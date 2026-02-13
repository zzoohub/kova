import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatRelativeTime, formatNumber } from "./format";

describe("formatRelativeTime", () => {
  let mockNow: Date;

  beforeEach(() => {
    mockNow = new Date("2024-01-15T12:00:00.000Z");
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'Just now' for less than 1 minute ago", () => {
    const date = new Date("2024-01-15T11:59:30.000Z"); // 30 seconds ago
    expect(formatRelativeTime(date)).toBe("Just now");
  });

  it("returns 'Just now' for exactly 0 seconds ago", () => {
    const date = new Date("2024-01-15T12:00:00.000Z"); // now
    expect(formatRelativeTime(date)).toBe("Just now");
  });

  it("returns minutes for 1-59 minutes ago", () => {
    const date1 = new Date("2024-01-15T11:59:00.000Z"); // 1 minute ago
    expect(formatRelativeTime(date1)).toBe("1m ago");

    const date30 = new Date("2024-01-15T11:30:00.000Z"); // 30 minutes ago
    expect(formatRelativeTime(date30)).toBe("30m ago");

    const date59 = new Date("2024-01-15T11:01:00.000Z"); // 59 minutes ago
    expect(formatRelativeTime(date59)).toBe("59m ago");
  });

  it("returns hours for 1-23 hours ago", () => {
    const date1 = new Date("2024-01-15T11:00:00.000Z"); // 1 hour ago
    expect(formatRelativeTime(date1)).toBe("1h ago");

    const date12 = new Date("2024-01-15T00:00:00.000Z"); // 12 hours ago
    expect(formatRelativeTime(date12)).toBe("12h ago");

    const date23 = new Date("2024-01-14T13:00:00.000Z"); // 23 hours ago
    expect(formatRelativeTime(date23)).toBe("23h ago");
  });

  it("returns days for 1-6 days ago", () => {
    const date1 = new Date("2024-01-14T11:00:00.000Z"); // 1 day ago
    expect(formatRelativeTime(date1)).toBe("1d ago");

    const date3 = new Date("2024-01-12T12:00:00.000Z"); // 3 days ago
    expect(formatRelativeTime(date3)).toBe("3d ago");

    const date6 = new Date("2024-01-09T12:00:00.000Z"); // 6 days ago
    expect(formatRelativeTime(date6)).toBe("6d ago");
  });

  it("returns formatted date for 7+ days ago", () => {
    const date7 = new Date("2024-01-08T12:00:00.000Z"); // 7 days ago
    expect(formatRelativeTime(date7)).toBe("Jan 8");

    const date30 = new Date("2023-12-16T12:00:00.000Z"); // 30 days ago
    expect(formatRelativeTime(date30)).toBe("Dec 16");
  });

  it("handles edge case at exactly 60 minutes", () => {
    const date = new Date("2024-01-15T11:00:00.000Z"); // exactly 60 minutes ago
    expect(formatRelativeTime(date)).toBe("1h ago");
  });

  it("handles edge case at exactly 24 hours", () => {
    const date = new Date("2024-01-14T12:00:00.000Z"); // exactly 24 hours ago
    expect(formatRelativeTime(date)).toBe("1d ago");
  });

  it("handles edge case at exactly 7 days", () => {
    const date = new Date("2024-01-08T12:00:00.000Z"); // exactly 7 days ago
    expect(formatRelativeTime(date)).toBe("Jan 8");
  });
});

describe("formatNumber", () => {
  it("returns number as string for values less than 1000", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(1)).toBe("1");
    expect(formatNumber(42)).toBe("42");
    expect(formatNumber(500)).toBe("500");
    expect(formatNumber(999)).toBe("999");
  });

  it("formats numbers >= 1000 with k suffix and one decimal", () => {
    expect(formatNumber(1000)).toBe("1.0k");
    expect(formatNumber(1500)).toBe("1.5k");
    expect(formatNumber(2345)).toBe("2.3k");
    expect(formatNumber(9999)).toBe("10.0k");
  });

  it("formats large numbers correctly", () => {
    expect(formatNumber(10000)).toBe("10.0k");
    expect(formatNumber(100000)).toBe("100.0k");
    expect(formatNumber(1000000)).toBe("1000.0k");
  });

  it("handles decimal rounding correctly", () => {
    expect(formatNumber(1234)).toBe("1.2k"); // rounds down
    expect(formatNumber(1567)).toBe("1.6k"); // rounds up
    expect(formatNumber(1999)).toBe("2.0k"); // rounds up to 2.0
  });

  it("handles exactly 1000", () => {
    expect(formatNumber(1000)).toBe("1.0k");
  });

  it("handles negative numbers less than 1000", () => {
    expect(formatNumber(-1)).toBe("-1");
    expect(formatNumber(-500)).toBe("-500");
  });

  it("handles negative numbers as plain strings", () => {
    expect(formatNumber(-1000)).toBe("-1000");
    expect(formatNumber(-2500)).toBe("-2500");
  });
});
