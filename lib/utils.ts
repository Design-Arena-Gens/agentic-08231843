import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

export const PLATFORM_LABELS: Record<string, string> = {
  x: "X (Twitter)",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  youtube: "YouTube"
};

export const PLATFORM_COLORS: Record<string, string> = {
  x: "bg-slate-900 text-white",
  instagram: "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white",
  facebook: "bg-blue-600 text-white",
  linkedin: "bg-sky-600 text-white",
  tiktok: "bg-slate-800 text-slate-100",
  youtube: "bg-red-600 text-white"
};

export function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
