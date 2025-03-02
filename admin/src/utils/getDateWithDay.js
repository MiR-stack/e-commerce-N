import { format, isToday, isYesterday, isThisWeek, differenceInCalendarDays } from 'date-fns';

/**
 * Format a date to show as "Today - HH:mm", "Yesterday - HH:mm",
 * day name for dates within this week, or a full date for older dates
 *
 * @param {Date|string|number} date - The date to format
 * @returns {string} The formatted date string
 */
function formatRelativeDate(date) {
  const dateObj = new Date(date);
  const timeString = format(dateObj, 'HH:mm');

  if (isToday(dateObj)) {
    return `Today - ${timeString}`;
  }

  if (isYesterday(dateObj)) {
    return `Yesterday - ${timeString}`;
  }

  // If it's within this week but not today or yesterday
  if (isThisWeek(dateObj) && differenceInCalendarDays(new Date(), dateObj) < 7) {
    return `${format(dateObj, 'EEEE')} - ${timeString}`;
  }

  // For older dates, show full date
  return format(dateObj, 'MMM d, yyyy - HH:mm');
}

export { formatRelativeDate };
