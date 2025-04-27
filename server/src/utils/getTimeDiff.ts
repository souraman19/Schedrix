// Utility function to calculate days difference
export function getDaysBetween(start: Date, end: Date): number {
  const startTime = new Date(start);
  const endTime = new Date(end);

  startTime.setHours(0, 0, 0, 0);
  endTime.setHours(0, 0, 0, 0);

  const diffTime = endTime.getTime() - startTime.getTime();
  return Math.floor(diffTime / (1000 * 3600 * 24)); // Milliseconds to days
}

// Utility function to calculate weeks difference
export function getWeeksBetween(start: Date, end: Date): number {
  const diffDays = getDaysBetween(start, end); // Get total days difference
  return Math.floor(diffDays / 7); // Convert days to weeks
}

// Utility function to calculate months difference
export function getMonthsBetween(start: Date, end: Date): number {
  const startTime = new Date(start);
  const endTime = new Date(end);

  const yearsDiff = endTime.getFullYear() - startTime.getFullYear();
  const monthsDiff = endTime.getMonth() - startTime.getMonth();

  return yearsDiff * 12 + monthsDiff; // Convert the difference to months
}

// Utility function to calculate years difference
export function getYearsBetween(start: Date, end: Date): number {
  const startTime = new Date(start);
  const endTime = new Date(end);

  let yearsDiff = endTime.getFullYear() - startTime.getFullYear();

  // If the current year's month/day is before the start date, reduce the year difference
  if (
    endTime.getMonth() < startTime.getMonth() ||
    (endTime.getMonth() === startTime.getMonth() &&
      endTime.getDate() < startTime.getDate())
  ) {
    yearsDiff--;
  }

  return yearsDiff;
}
