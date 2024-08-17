import { expect, test } from "vitest";
import dayjs from "dayjs";
import { parseDate } from "../lib/date-parser";

test("+1d is 1 day from now", () => {
  const now = dayjs();
  expect(parseDate("+1d", now)).toEqual(now.add(1, "day"));
});

test("+2d is 2 days from now", () => {
  const now = dayjs();
  expect(parseDate("+2d", now)).toEqual(now.add(2, "day"));
});

test("+1w is 1 week from now", () => {
  const now = dayjs();
  expect(parseDate("+1w", now)).toEqual(now.add(1, "week"));
});

test("+1m is 1 minute from now", () => {
  const now = dayjs();
  expect(parseDate("+1m", now)).toEqual(now.add(1, "minute"));
});

test("+5mo is 5 months from now", () => {
  const now = dayjs();
  expect(parseDate("+5months", now)).toEqual(now.add(5, "month"));
});
