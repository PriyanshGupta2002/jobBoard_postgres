import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  if (!name) return "";

  const words = name.trim().split(" ").filter(Boolean);

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase();
}
