// Gross receipts tax due dates. From the verified facts in CLAUDE.md: a return is due
// on the 25th of the month after the reporting period, or the next business day if
// the 25th is a weekend or holiday.

// Months a period is allowed to end in (1 = January, 12 = December).
// Semiannual halves are assumed to be Jan to Jun and Jul to Dec. Confirm on an official page.
const PERIOD_END_MONTHS = {
  monthly: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  quarterly: [3, 6, 9, 12],
  semiannual: [6, 12],
};

// Everything below uses UTC methods so the user's time zone can never shift a date by a day.

function lastDayOfMonth(year, month) {
  // Day 0 of the next month is the last day of this month.
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function isWeekend(date) {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

function toDateString(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// frequency: "monthly", "quarterly" or "semiannual"
// periodEnd: "YYYY-MM-DD", the last day of the reporting period
// holidays: list of "YYYY-MM-DD" strings from the state's official calendar
// Returns the due date as "YYYY-MM-DD", or null if periodEnd is not a valid period end.
export function getDueDate(frequency, periodEnd, holidays = []) {
  const allowedMonths = PERIOD_END_MONTHS[frequency];
  if (!allowedMonths) return null;

  const [year, month, day] = periodEnd.split("-").map(Number);
  if (!allowedMonths.includes(month)) return null;
  if (day !== lastDayOfMonth(year, month)) return null;

  // month is 1-based, but Date.UTC wants 0-based, so passing it unchanged means
  // "the next month". December (12) rolls over to January of the next year.
  const due = new Date(Date.UTC(year, month, 25));

  // A loop, not a single check: a holiday can sit next to a weekend.
  while (isWeekend(due) || holidays.includes(toDateString(due))) {
    due.setUTCDate(due.getUTCDate() + 1);
  }

  return toDateString(due);
}

// today: "YYYY-MM-DD" in the user's own calendar
// Returns the next `count` deadlines that are due today or later, as { periodEnd, dueDate }.
export function getUpcomingDeadlines(
  frequency,
  today,
  holidays = [],
  count = 6
) {
  const allowedMonths = PERIOD_END_MONTHS[frequency];
  if (!allowedMonths) return [];

  const [year, month] = today.split("-").map(Number);
  const deadlines = [];

  // Start with last month: its return can still be due this month. Older periods are already past due.
  for (let offset = -1; deadlines.length < count; offset++) {
    // Date.UTC rolls month numbers over, so offset can run past December into the next year.
    const monthStart = new Date(Date.UTC(year, month - 1 + offset, 1));
    const y = monthStart.getUTCFullYear();
    const m = monthStart.getUTCMonth() + 1;
    if (!allowedMonths.includes(m)) continue;

    const periodEnd = toDateString(new Date(Date.UTC(y, m, 0)));
    const dueDate = getDueDate(frequency, periodEnd, holidays);
    // "YYYY-MM-DD" strings sort like dates, so a plain comparison works.
    if (dueDate >= today) deadlines.push({ periodEnd, dueDate });
  }

  return deadlines;
}

// Whole days from today to a due date, both "YYYY-MM-DD". Negative if the date has passed.
// UTC math keeps daylight saving changes from making a day 23 or 25 hours long.
export function daysUntil(today, dueDate) {
  const [ty, tm, td] = today.split('-').map(Number)
  const [dy, dm, dd] = dueDate.split('-').map(Number)
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((Date.UTC(dy, dm - 1, dd) - Date.UTC(ty, tm - 1, td)) / msPerDay)
}

// Deadlines in a year later than the newest year in the holiday list.
// For those, the app only skips weekends, because it has no holiday data for that year.
export function deadlinesBeyondHolidays(deadlines, holidayDates) {
  const latestHolidayYear = Math.max(0, ...holidayDates.map((date) => Number(date.slice(0, 4))))
  return deadlines.filter((d) => Number(d.dueDate.slice(0, 4)) > latestHolidayYear)
}
