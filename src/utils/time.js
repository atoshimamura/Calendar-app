import { addDays, startOfWeek, format, addMinutes, setHours, setMinutes } from "date-fns";

export function getWeekDays(baseDate = new Date()) {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 }); // 月始まり
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function generateSlots(date, { openHour, closeHour, slotMinutes }) {
  // 指定日の 10:00〜19:00 開始（20:00 閉店）
  const slots = [];
  let cur = setMinutes(setHours(date, openHour), 0);
  const end = setMinutes(setHours(date, closeHour), 0);
  while (cur < end) {
    slots.push(cur);
    cur = addMinutes(cur, slotMinutes);
  }
  return slots;
}

export const fmtDate = (d) => format(d, "yyyy-MM-dd");
export const fmtTime = (d) => format(d, "HH:mm");
export const slotId = (dateObj, staff) => `${fmtDate(dateObj)}_${format(dateObj, "HHmm")}_${staff}`; // 例: 2025-10-02_1300_佐藤