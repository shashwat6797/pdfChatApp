import { type ClassValue, clsx } from "clsx";
import { warn } from "console";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToAscii(inputString: string) {
  //remove any nonascii characters
  const asciiString = inputString.replace(/[^\x00-\x7F]/g, "");
  return asciiString;
}