// Builds an iCalendar (.ics) file that calendar apps can import.
// Format rules come from RFC 5545: lines end in \r\n and should be at most 75 characters.
// Our text is short and has no commas or semicolons, so it needs no folding or escaping.

// "2026-10-26" becomes "20261026", the date format .ics files use.
function icsDate(dateString) {
  return dateString.replaceAll("-", "");
}

// All-day events end on the day after (the end date is not included), so we need the next day.
function nextDay(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
}

// Reminders shown before each due date. -P14D means "14 days before the event starts" (ISO 8601 duration).
// Calendar apps may show them at their own default time of day, because the event has no clock time.
const REMINDERS = [
  { trigger: "-P14D", en: "14 days", es: "14 dias" },
  { trigger: "-P7D", en: "7 days", es: "7 dias" },
  { trigger: "-P1D", en: "1 day", es: "1 dia" },
];

// Calendar text per language. No commas or semicolons, so no escaping is needed (see top of file).
// Spanish accents are left out on purpose so every calendar app shows the text correctly.
const TEXT = {
  en: {
    summary: "Gross receipts tax return due",
    description: (periodEnd) => `Period ending ${periodEnd}. File even if no tax is due.`,
    alarm: (label) => `Gross receipts tax return due in ${label}`,
  },
  es: {
    summary: "Vence la declaracion del impuesto sobre los ingresos brutos",
    description: (periodEnd) => `Periodo que termina ${periodEnd}. Presente la declaracion aunque no deba impuesto.`,
    alarm: (label) => `La declaracion del impuesto sobre los ingresos brutos vence en ${label}`,
  },
};

// One VALARM block per reminder. ACTION:DISPLAY needs a DESCRIPTION, which is the text shown.
function alarmLines(lang) {
  return REMINDERS.flatMap((reminder) => [
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${TEXT[lang].alarm(reminder[lang])}`,
    `TRIGGER:${reminder.trigger}`,
    "END:VALARM",
  ]);
}

// deadlines: list of { periodEnd, dueDate } from getUpcomingDeadlines
// now: a Date, used for DTSTAMP (when the file was made). Passed in so tests get the same text.
export function makeIcs(deadlines, now, lang = "en") {
  // "2026-10-24T18:00:00.000Z" becomes "20261024T180000Z"
  const stamp = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bizcheck NM//Deadlines//EN",
  ];

  for (const { periodEnd, dueDate } of deadlines) {
    lines.push(
      "BEGIN:VEVENT",
      // Same period always gets the same UID, so importing again updates instead of duplicating.
      `UID:grt-${periodEnd}@bizcheck-nm`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(dueDate)}`,
      `DTEND;VALUE=DATE:${icsDate(nextDay(dueDate))}`,
      `SUMMARY:${TEXT[lang].summary}`,
      `DESCRIPTION:${TEXT[lang].description(periodEnd)}`,
      ...alarmLines(lang),
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

// Saves text as a file by pointing a temporary link at an in-memory Blob and clicking it.
export function downloadIcs(
  text,
  filename = "gross-receipts-tax-deadlines.ics"
) {
  const blob = new Blob([text], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  // Free the memory the Blob URL holds once the download has started.
  URL.revokeObjectURL(url);
}
