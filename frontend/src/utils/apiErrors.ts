/* eslint-disable @typescript-eslint/no-explicit-any */
export type ParsedApiError = {
  title: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export function parseApiError(err: unknown): ParsedApiError {
  const fallback: ParsedApiError = {
    title: "Something went wrong",
    message: "Please try again in a moment.",
  };

  if (!err || typeof err !== "object" || !("response" in err)) return fallback;

  const axiosErr = err as {
    response?: { status?: number; data?: any };
  };
  const status = axiosErr.response?.status ?? 0;
  const data = axiosErr.response?.data ?? {};

  const apiMessage: string | undefined = data.message;
  const fieldErrors: Record<string, string[]> | undefined = data.errors;

  switch (status) {
    case 400:
      return {
        title: "Bad request",
        message: "We couldn’t process that request.",
        fieldErrors,
      };
    case 401:
      return {
        title: "Please log in",
        message: "Your session has expired. Sign in and try again.",
        fieldErrors,
      };
    case 403:
      return {
        title: "Not allowed",
        message: "You don’t have permission to do that.",
        fieldErrors,
      };
    case 404:
      return {
        title: "Not found",
        message: "We couldn’t find what you were looking for.",
        fieldErrors,
      };
    case 422:
      return {
        title: "Check your input",
        message:
          (fieldErrors && Object.values(fieldErrors)[0]?.[0]) ||
          apiMessage ||
          "Some fields need your attention.",
        fieldErrors,
      };
    case 429:
      return {
        title: "Too many requests",
        message: "You’re going a bit fast. Try again shortly.",
        fieldErrors,
      };
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        title: "Server error",
        message: "Our servers are having a moment. Please try again.",
        fieldErrors,
      };
    default:
      return {
        title: "Unexpected error",
        message: fallback.message,
        fieldErrors,
      };
  }
}
