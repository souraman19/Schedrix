import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (date: Date | null | undefined): string => {
  if (date instanceof Date && !isNaN(date.getTime())) {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', // Optional: full weekday name (e.g., "Monday")
      year: 'numeric',
      month: 'long', // Full month name (e.g., "April")
      day: 'numeric',
      hour: '2-digit', // 2-digit hour
      minute: '2-digit', // 2-digit minute
      hour12: true, // 12-hour time format (AM/PM)
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  return "N/A";
};
