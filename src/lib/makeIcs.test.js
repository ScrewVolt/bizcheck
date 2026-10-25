import { test } from "node:test";
import assert from "node:assert/strict";
import { makeIcs } from "./makeIcs.js";

const NOW = new Date(Date.UTC(2026, 9, 24, 18, 0, 0));
const ONE_DEADLINE = [{ periodEnd: "2026-09-30", dueDate: "2026-10-26" }];

test("one deadline produces the exact expected text", () => {
  const expected =
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Bizcheck NM//Deadlines//EN",
      "BEGIN:VEVENT",
      "UID:grt-2026-09-30@bizcheck-nm",
      "DTSTAMP:20261024T180000Z",
      "DTSTART;VALUE=DATE:20261026",
      "DTEND;VALUE=DATE:20261027",
      "SUMMARY:Gross receipts tax return due",
      "DESCRIPTION:Period ending 2026-09-30. File even if no tax is due.",
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "DESCRIPTION:Gross receipts tax return due in 14 days",
      "TRIGGER:-P14D",
      "END:VALARM",
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "DESCRIPTION:Gross receipts tax return due in 7 days",
      "TRIGGER:-P7D",
      "END:VALARM",
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "DESCRIPTION:Gross receipts tax return due in 1 day",
      "TRIGGER:-P1D",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n") + "\r\n";
  assert.equal(makeIcs(ONE_DEADLINE, NOW), expected);
});

test("end date rolls over a year boundary", () => {
  const text = makeIcs(
    [{ periodEnd: "2026-11-30", dueDate: "2026-12-31" }],
    NOW
  );
  assert.match(text, /DTEND;VALUE=DATE:20270101/);
});

test("every line fits the 75 character limit", () => {
  const lines = makeIcs(ONE_DEADLINE, NOW).split("\r\n");
  for (const line of lines) assert.ok(line.length <= 75, `too long: ${line}`);
});
