import { describe, expect, it, vi } from "vitest";
import {
  categorizeError,
  extractRetryAfter,
  getAdditionalErrorMessage,
  getUnexpectedErrorMessage,
  isRetryableError,
  retryWithBackoff,
} from "../errorHandling";

describe("Error Handling Utilities", () => {
  describe("extractRetryAfter", () => {
    it("extracts retry-after value from error messages", () => {
      expect(extractRetryAfter("Rate limit exceeded. Retry after 30 seconds")).toBe(30);
      expect(extractRetryAfter("Please wait 60 seconds")).toBe(60);
      expect(extractRetryAfter("No retry info")).toBeUndefined();
    });
  });

  describe("categorizeError", () => {
    it("categorizes rate limit errors correctly", () => {
      const error = new Error("Rate limit exceeded");
      const result = categorizeError(error, "en");

      expect(result.type).toBe("rate_limit");
      expect(result.retryable).toBe(true);
      expect(result.userMessage).toBe("AI service is busy. Please try again in a few moments.");
    });

    it("categorizes network errors correctly", () => {
      const error = new Error("Network timeout occurred");
      const result = categorizeError(error, "en");

      expect(result.type).toBe("network");
      expect(result.retryable).toBe(true);
      expect(result.userMessage).toBe("Connection error. Please check your internet and try again.");
    });

    it("categorizes API key errors correctly", () => {
      const error = new Error("Unauthorized: Invalid API key");
      const result = categorizeError(error, "en");

      expect(result.type).toBe("api_key");
      expect(result.retryable).toBe(false);
      expect(result.userMessage).toBe("AI service configuration error. Please contact support.");
    });

    it("provides Arabic error messages", () => {
      const error = new Error("Rate limit exceeded");
      const result = categorizeError(error, "ar");

      expect(result.type).toBe("rate_limit");
      expect(result.userMessage).toBe("خدمة الذكاء الاصطناعي مشغولة. يرجى المحاولة مرة أخرى بعد قليل.");
    });

    it("falls back to English for unsupported languages", () => {
      const error = new Error("Rate limit exceeded");
      const result = categorizeError(error, "fr");

      expect(result.userMessage).toBe("AI service is busy. Please try again in a few moments.");
    });
  });

  describe("isRetryableError", () => {
    it("identifies retryable errors", () => {
      expect(isRetryableError(new Error("Rate limit exceeded"))).toBe(true);
      expect(isRetryableError(new Error("Network timeout"))).toBe(true);
      expect(isRetryableError(new Error("502 Bad Gateway"))).toBe(true);
    });

    it("identifies non-retryable errors", () => {
      expect(isRetryableError(new Error("Unauthorized"))).toBe(false);
      expect(isRetryableError(new Error("Content policy violation"))).toBe(false);
      expect(isRetryableError(new Error("Unknown error"))).toBe(false);
    });
  });

  describe("retryWithBackoff", () => {
    it("succeeds on first attempt", async () => {
      const mockFn = vi.fn().mockResolvedValue("success");

      const result = await retryWithBackoff(mockFn, 3, 100, "en");

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("retries on retryable errors", async () => {
      const mockFn = vi.fn().mockRejectedValueOnce(new Error("Rate limit exceeded")).mockResolvedValue("success");

      const result = await retryWithBackoff(mockFn, 3, 100, "en");

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it("throws immediately on non-retryable errors", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("Unauthorized"));

      await expect(retryWithBackoff(mockFn, 3, 100, "en")).rejects.toThrow("Unauthorized");
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("exhausts retries and throws", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("Rate limit exceeded"));

      await expect(retryWithBackoff(mockFn, 2, 100, "en")).rejects.toThrow("Rate limit exceeded");
      expect(mockFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });

  describe("getAdditionalErrorMessage", () => {
    it("returns rate limit message with time", () => {
      const message = getAdditionalErrorMessage("rate_limit", "en", 30);
      expect(message).toBe(" Please wait 30 seconds before trying again.");
    });

    it("returns rate limit message without time", () => {
      const message = getAdditionalErrorMessage("rate_limit", "en");
      expect(message).toBe(" Please wait a moment before trying again.");
    });

    it("returns network message", () => {
      const message = getAdditionalErrorMessage("network", "en");
      expect(message).toBe(" Please check your internet connection.");
    });

    it("returns support message for API/quota errors", () => {
      expect(getAdditionalErrorMessage("api_key", "en")).toBe(" This issue has been logged for our team.");
      expect(getAdditionalErrorMessage("quota", "en")).toBe(" This issue has been logged for our team.");
    });

    it("returns Arabic messages", () => {
      const message = getAdditionalErrorMessage("network", "ar");
      expect(message).toBe(" يرجى فحص الاتصال بالإنترنت.");
    });

    it("returns empty string for unknown types", () => {
      const message = getAdditionalErrorMessage("unknown", "en");
      expect(message).toBe("");
    });
  });

  describe("getUnexpectedErrorMessage", () => {
    it("returns English message", () => {
      const message = getUnexpectedErrorMessage("en");
      expect(message).toBe("An unexpected error occurred. Please try again.");
    });

    it("returns Arabic message", () => {
      const message = getUnexpectedErrorMessage("ar");
      expect(message).toBe("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    });
  });
});
