import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToAscii(inputString: string) {
  //remove any nonascii characters
  var asciiString = inputString.replace(/[^\x00-\x7F]/g, "");
  asciiString = asciiString.replace(/\s/g, "");
  return asciiString;
}
