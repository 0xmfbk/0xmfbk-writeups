// src/lib/readingTime.ts
export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 225); // average 225 wpm
}