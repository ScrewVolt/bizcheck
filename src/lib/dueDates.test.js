import { test } from "node:test";
import assert from "node:assert/strict";
import { getDueDate, getUpcomingDeadlines, daysUntil, deadlinesBeyondHolidays } from "./dueDates.js";

// Holidays are passed in as an argument so these tests can use made-up dates.
// FAKE_HOLIDAY is test data only. Real holidays come from src/data/holidays.json.
const FAKE_HOLIDAY = "2026-05-25";

test("25th is a Sunday: moves to Monday", () => {
  // Oct 25, 2026 is a Sunday
  assert.equal(getDueDate("monthly", "2026-09-30", []), "2026-10-26");
});

test("25th is a listed holiday: moves to the next business day", () => {
  // May 25, 2026 is a Monday; marked as a holiday for this test
  assert.equal(
    getDueDate("monthly", "2026-04-30", [FAKE_HOLIDAY]),
    "2026-05-26"
  );
});

test("December period crosses into the next year", () => {
  // Jan 25, 2027 is a Monday
  assert.equal(getDueDate("monthly", "2026-12-31", []), "2027-01-25");
});

test("semiannual period ending in June", () => {
  // Jul 25, 2026 is a Saturday
  assert.equal(getDueDate("semiannual", "2026-06-30", []), "2026-07-27");
});

// Compare period end dates only, to keep the expected lists short.
function upcomingPeriodEnds(frequency, today) {
  return getUpcomingDeadlines(frequency, today, []).map((d) => d.periodEnd);
}

test("upcoming monthly: last month is still listed while its return is not yet due", () => {
  // September's return is due Oct 26, 2026, so on Oct 24 it is still upcoming
  assert.deepEqual(upcomingPeriodEnds("monthly", "2026-10-24"), [
    "2026-09-30",
    "2026-10-31",
    "2026-11-30",
    "2026-12-31",
    "2027-01-31",
    "2027-02-28",
  ]);
});

test("upcoming monthly: a past due date is dropped", () => {
  assert.equal(upcomingPeriodEnds("monthly", "2026-10-27")[0], "2026-10-31");
});

test("upcoming quarterly: crosses into the next year", () => {
  assert.deepEqual(upcomingPeriodEnds("quarterly", "2026-10-24"), [
    "2026-09-30",
    "2026-12-31",
    "2027-03-31",
    "2027-06-30",
    "2027-09-30",
    "2027-12-31",
  ]);
});

test("upcoming with unknown frequency: empty list", () => {
  assert.deepEqual(getUpcomingDeadlines("unknown", "2026-10-24", []), []);
});

test("daysUntil counts whole days, including across a month end", () => {
  assert.equal(daysUntil("2026-10-24", "2026-10-26"), 2);
  assert.equal(daysUntil("2026-10-31", "2026-11-01"), 1);
  assert.equal(daysUntil("2026-10-26", "2026-10-26"), 0);
  assert.equal(daysUntil("2026-10-27", "2026-10-26"), -1);
});

test("daysUntil is not thrown off by the November clock change", () => {
  // US clocks go back on Nov 1, 2026. Oct 31 to Nov 2 is still exactly 2 days.
  assert.equal(daysUntil("2026-10-31", "2026-11-02"), 2);
});

test("deadlinesBeyondHolidays flags years the holiday list does not cover", () => {
  const deadlines = [
    { periodEnd: "2026-11-30", dueDate: "2026-12-28" },
    { periodEnd: "2026-12-31", dueDate: "2027-01-25" },
  ];
  assert.deepEqual(deadlinesBeyondHolidays(deadlines, ["2026-12-25"]), [deadlines[1]]);
  assert.deepEqual(deadlinesBeyondHolidays(deadlines, []), deadlines);
  assert.deepEqual(deadlinesBeyondHolidays(deadlines, ["2026-12-25", "2027-01-01"]), []);
});
