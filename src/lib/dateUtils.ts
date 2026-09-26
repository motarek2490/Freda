export function formatTime12Hour(timeStr?: string, isRtl?: boolean): string {
  if (!timeStr) return '';
  const cleanTime = timeStr.trim();
  
  // Match HH:MM or HH:MM:SS
  const match = cleanTime.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) {
    return cleanTime;
  }

  let hours = parseInt(match[1], 10);
  const minutes = match[2];

  if (isNaN(hours)) return cleanTime;

  const periodEn = hours >= 12 ? 'PM' : 'AM';
  const periodAr = hours >= 12 ? 'مساءً' : 'صباحاً';

  hours = hours % 12;
  if (hours === 0) hours = 12;

  if (isRtl) {
    return `${hours}:${minutes} ${periodAr}`;
  }
  return `${hours}:${minutes} ${periodEn}`;
}
