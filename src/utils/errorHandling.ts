/**
 * Error handling utilities for OpenAI and other services
 */

export type ErrorType = "network" | "rate_limit" | "api_key" | "quota" | "model" | "content" | "unknown";

export type ErrorInfo = {
  type: ErrorType;
  retryable: boolean;
  userMessage: string;
  retryAfter?: number;
};

/**
 * Error messages in both languages
 */
const errorMessages = {
  en: {
    rate_limit: "AI service is busy. Please try again in a few moments.",
    api_key: "AI service configuration error. Please contact support.",
    quota: "AI service is temporarily unavailable. Please try again later.",
    model: "AI service error. Please try again or contact support.",
    content: "Request cannot be processed due to content guidelines.",
    network: "Connection error. Please check your internet and try again.",
    unknown: "An unexpected error occurred. Please try again.",
  },
  ar: {
    rate_limit: "خدمة الذكاء الاصطناعي مشغولة. يرجى المحاولة مرة أخرى بعد قليل.",
    api_key: "خطأ في تكوين خدمة الذكاء الاصطناعي. يرجى الاتصال بالدعم.",
    quota: "خدمة الذكاء الاصطناعي غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى لاحقاً.",
    model: "خطأ في خدمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.",
    content: "لا يمكن معالجة الطلب بسبب إرشادات المحتوى.",
    network: "خطأ في الاتصال. يرجى فحص الاتصال بالإنترنت والمحاولة مرة أخرى.",
    unknown: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
  },
};

/**
 * Extract retry-after value from rate limit error messages
 */
export function extractRetryAfter(message: string): number | undefined {
  const match = message.match(/retry after (\d+)/i) || message.match(/wait (\d+)/i);
  return match ? parseInt(match[1]) : undefined;
}

/**
 * Categorizes error type and determines if it's retryable
 */
export function categorizeError(error: Error, language: string = "en"): ErrorInfo {
  const message = error.message.toLowerCase();
  const messages = errorMessages[language as keyof typeof errorMessages] || errorMessages.en;

  // Rate limit errors
  if (message.includes("rate limit") || message.includes("429")) {
    const retryAfter = extractRetryAfter(error.message);
    return {
      type: "rate_limit",
      retryable: true,
      userMessage: messages.rate_limit,
      retryAfter,
    };
  }

  // Authentication errors
  if (message.includes("unauthorized") || message.includes("401") || message.includes("api key")) {
    return {
      type: "api_key",
      retryable: false,
      userMessage: messages.api_key,
    };
  }

  // Quota/billing errors
  if (message.includes("quota") || message.includes("billing") || message.includes("insufficient")) {
    return {
      type: "quota",
      retryable: false,
      userMessage: messages.quota,
    };
  }

  // Model errors
  if (message.includes("model") || message.includes("engine")) {
    return {
      type: "model",
      retryable: false,
      userMessage: messages.model,
    };
  }

  // Content policy errors
  if (message.includes("content policy") || message.includes("safety") || message.includes("filtered")) {
    return {
      type: "content",
      retryable: false,
      userMessage: messages.content,
    };
  }

  // Network/connection errors
  if (
    message.includes("network") ||
    message.includes("connection") ||
    message.includes("timeout") ||
    message.includes("502") ||
    message.includes("503") ||
    message.includes("504")
  ) {
    return {
      type: "network",
      retryable: true,
      userMessage: messages.network,
    };
  }

  // Default unknown error
  return {
    type: "unknown",
    retryable: false,
    userMessage: messages.unknown,
  };
}

/**
 * Determines if an error is retryable
 */
export function isRetryableError(error: Error): boolean {
  return categorizeError(error).retryable;
}

/**
 * Retry function with exponential backoff for retryable errors
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  baseDelay: number = 1000,
  language: string = "en"
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on the last attempt
      if (attempt === retries) {
        throw lastError;
      }

      // Check if error is retryable (rate limit, network issues, etc.)
      const isRetryable = isRetryableError(lastError);
      if (!isRetryable) {
        throw lastError;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, attempt);
      const errorInfo = categorizeError(lastError, language);

      // Use retry-after header if available for rate limits
      const actualDelay = errorInfo.retryAfter ? errorInfo.retryAfter * 1000 : delay;

      await new Promise((resolve) => setTimeout(resolve, actualDelay));
    }
  }

  throw lastError!;
}

/**
 * Additional contextual error messages for UI
 */
export const additionalErrorMessages = {
  en: {
    rate_limit_with_time: (seconds: number) => ` Please wait ${seconds} seconds before trying again.`,
    rate_limit: " Please wait a moment before trying again.",
    network: " Please check your internet connection.",
    support: " This issue has been logged for our team.",
  },
  ar: {
    rate_limit_with_time: (seconds: number) => ` يرجى الانتظار ${seconds} ثانية قبل المحاولة مرة أخرى.`,
    rate_limit: " يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.",
    network: " يرجى فحص الاتصال بالإنترنت.",
    support: " تم تسجيل هذه المشكلة لفريقنا.",
  },
};

/**
 * Get additional error message based on error type and language
 */
export function getAdditionalErrorMessage(errorType: ErrorType, language: string, retryAfter?: number): string {
  const messages = additionalErrorMessages[language as keyof typeof additionalErrorMessages] || additionalErrorMessages.en;

  switch (errorType) {
    case "rate_limit":
      return retryAfter ? messages.rate_limit_with_time(retryAfter) : messages.rate_limit;
    case "network":
      return messages.network;
    case "api_key":
    case "quota":
      return messages.support;
    default:
      return "";
  }
}

/**
 * Get unexpected error message based on language
 */
export function getUnexpectedErrorMessage(language: string): string {
  return language === "ar"
    ? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
    : "An unexpected error occurred. Please try again.";
}
