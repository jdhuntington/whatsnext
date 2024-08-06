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

test("a parallel task with 2 children has 2 next actions", () => {
  const t = new Task();
  t.mode = "parallel";
  const childTask1 = new Task();
  const childTask2 = new Task();
  t.children.push(childTask1);
  t.children.push(childTask2);
  const nextActions = t.availableActionsSince(dayjs());
  expect(nextActions).toHaveLength(2);
  expect(nextActions).toContain(childTask1);
  expect(nextActions).toContain(childTask2);
});

test("a serial task with 1 parallel child has the children as the next actions", () => {
  const t = new Task();
  t.mode = "serial";
  const middleman = new Task();
  middleman.mode = "parallel";
  t.children.push(middleman);
  const childTask1 = new Task();
  const childTask2 = new Task();
  t.children.push(childTask1);
  t.children.push(childTask2);
  const nextActions = t.availableActionsSince(dayjs());
  expect(nextActions).toHaveLength(2);
  expect(nextActions).toContain(childTask1);
  expect(nextActions).toContain(childTask2);
});
