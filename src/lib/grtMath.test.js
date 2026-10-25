import { test } from "node:test";
import assert from "node:assert/strict";
import { estimateTax } from "./grtMath.js";

test("whole numbers", () => {
  assert.equal(estimateTax("1000", "8.5"), 85);
});

test("rounds to cents", () => {
  assert.equal(estimateTax("1234.56", "8"), 98.76);
});

test("rate with four decimals", () => {
  assert.equal(estimateTax("2500", "6.25"), 156.25);
});

test("zero sales gives zero tax", () => {
  assert.equal(estimateTax("0", "7"), 0);
});

test("empty input gives null", () => {
  assert.equal(estimateTax("", "7"), null);
  assert.equal(estimateTax("100", "  "), null);
});

test("negative or impossible input gives null", () => {
  assert.equal(estimateTax("-5", "7"), null);
  assert.equal(estimateTax("100", "-1"), null);
  assert.equal(estimateTax("100", "150"), null);
  assert.equal(estimateTax("abc", "7"), null);
});
