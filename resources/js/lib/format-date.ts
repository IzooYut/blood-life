// @/lib/format-date.ts
import dayjs from 'dayjs';

export function formatHumanDate(dateStr?: string | null): string {
  return dateStr ? dayjs(dateStr).format('MMM D, YYYY') : '-';
}

export function formatHumanDateTime(dateStr?: string | null): string {
  return dateStr ? dayjs(dateStr).format('MMM D, YYYY [at] h:mm A') : '-';
}

