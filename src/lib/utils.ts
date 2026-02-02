import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sorted<T>(arr: T[], compareFunction: (a: T, b: T) => number) {
  return [...arr].sort(compareFunction);
}
