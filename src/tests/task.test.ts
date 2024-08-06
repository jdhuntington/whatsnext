import { expect, test } from "vitest";
import { Task } from "../lib/models/task";
import dayjs from "dayjs";

test("a single task that's set to serial is its own next action", () => {
  const t = new Task();
  t.mode = "serial";
  const nextActions = t.availableActionsSince(dayjs());
  expect(nextActions).toHaveLength(1);
});

test("a single task that's set to parallel is its own next action", () => {
  const t = new Task();
  t.mode = "parallel";
  const nextActions = t.availableActionsSince(dayjs());
  expect(nextActions).toHaveLength(1);
});

test("a serial task with 2 children has 1 next action", () => {
  const t = new Task();
  t.mode = "serial";
  const childTask = new Task();
  t.children.push(childTask);
  t.children.push(new Task());
  const nextActions = t.availableActionsSince(dayjs());
  expect(nextActions).toHaveLength(1);
  expect(nextActions[0]).toBe(childTask);
});
