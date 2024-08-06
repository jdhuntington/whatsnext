import { expect, test } from "vitest";

test("sorts an array", () => {
  const arr = [3, 1, 2];
  arr.sort();
  expect(arr).toEqual([1, 2, 3]);
});
