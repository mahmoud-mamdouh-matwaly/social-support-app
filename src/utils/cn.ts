import { type ClassValue, clsx } from "clsx";

/**
 * Utility function to merge class names conditionally
 * Combines clsx for conditional classes with proper string concatenation
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
