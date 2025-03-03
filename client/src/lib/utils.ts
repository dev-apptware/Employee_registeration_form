import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function that combines multiple class names.
 * It uses clsx to conditionally join class names and twMerge to properly merge Tailwind CSS classes.
 * 
 * @param {...string} inputs - Class names or conditional class names
 * @returns {string} - Merged class string
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a readable string
 * 
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
}

/**
 * Truncates a string to a specified length
 * 
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated string
 */
export function truncateString(str: string | null | undefined, length: number = 50): string {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
