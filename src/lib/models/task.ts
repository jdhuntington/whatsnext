import dayjs, { Dayjs } from "dayjs";
import {
  LocalDate,
  OptionalLink,
  OptionalLocalDate,
  OptionalMinutes,
  SerializedTask,
  Tag,
  TaskId,
  TaskMode,
  genId,
} from "../../types";
import {
  now,
  parseIsoDate,
  parseOptionalIsoDate,
  toIsoDate,
  toOptionalIsoDate,
} from "../date-parser";

export const universalRootTaskId =
  "E2FFE8B4-92C8-4336-9B4B-D309E2A7C41B" as TaskId;

export class Task {
  public parentId: TaskId = universalRootTaskId;
  public id: TaskId = genId();
  public name: string = "";
  public tags: Tag[] = [];
  public createdAt: LocalDate = now();
  public completedAt: OptionalLocalDate = null;
  public deferUntil: OptionalLocalDate = null;
  public children: Task[] = [];
  public order: number = 0;
  public mode: TaskMode = "serial";
  public estimatedDuration: OptionalMinutes = null;
  public link: OptionalLink = null;
  parent?: Task;

  public serialize(): SerializedTask {
    return {
      id: this.id,
      name: this.name,
      tags: this.tags,
      parentId: this.parentId,
      createdAt: toIsoDate(this.createdAt),
      order: this.order,
      completedAt: toOptionalIsoDate(this.completedAt),
      deferUntil: toOptionalIsoDate(this.deferUntil),
      mode: this.mode,
      estimatedDuration: this.estimatedDuration,
      link: this.link,
    };
  }

  get sortedChildren(): Task[] {
    return this.children.sort((a, b) => a.order - b.order);
  }

  public get totalNodes(): number {
    return this.children.reduce((acc, child) => acc + child.totalNodes, 1);
  }

  public getNthNode(selectedIndex: number): Task {
    if (selectedIndex === 0) {
      return this;
    }
    let index = 1;
    for (const child of this.children) {
      const childTotalNodes = child.totalNodes;
      if (index + childTotalNodes > selectedIndex) {
        return child.getNthNode(selectedIndex - index);
      }
      index += childTotalNodes;
    }
    throw new Error(`Index ${selectedIndex} out of bounds`);
  }

  public clone(): Task {
    const task = new Task();
    task.id = this.id;
    task.name = this.name;
    task.tags = this.tags;
    task.parentId = this.parentId;
    task.createdAt = this.createdAt;
    task.order = this.order;
    task.children = this.children;
    task.completedAt = this.completedAt;
    task.deferUntil = this.deferUntil;
    task.mode = this.mode;
    task.estimatedDuration = this.estimatedDuration;
    task.link = this.link;
    return task;
  }

  get isRoot(): boolean {
    return this.id === universalRootTaskId;
  }

  get allTags(): Tag[] {
    const tags = new Set<Tag>();
    for (const child of this.children) {
      for (const tag of child.allTags) {
        tags.add(tag);
      }
    }
    for (const tag of this.tags) {
      tags.add(tag);
    }
    return Array.from(tags);
  }

  get ancestors(): Task[] {
    if (this.parent) {
      return [...this.parent.ancestors, this];
    }
    return [this];
  }

  get isAvailable(): boolean {
    if (this.isComplete) {
      return false;
    }
    if (this.children.length > 0) {
      return false;
    }
    return true;
  }

  public actionCompletedAfter(cutoffTime: Dayjs): boolean {
    if (this.isComplete) {
      const completedAt = this.completedAt;
      if (!completedAt) {
        return false;
      }
      return dayjs(completedAt).isAfter(cutoffTime);
    }
    return false;
  }

  public availableActionsSince(cutoffTime: Dayjs): Task[] {
    const actions: Task[] = [];
    if (this.isAvailable || this.actionCompletedAfter(cutoffTime)) {
      actions.push(this);
    }
    if (this.mode === "serial") {
      const nextAvailableChild = this.sortedChildren.find(
        (child) => !child.isComplete
      );
      if (!nextAvailableChild) {
        return actions;
      }
      actions.push(...nextAvailableChild.availableActionsSince(cutoffTime));
    } else {
      for (const child of this.children) {
        actions.push(...child.availableActionsSince(cutoffTime));
      }
    }
    return actions;
  }

  needsAttention(): Task[] {
    if (this.isComplete) {
      return [];
    }
    if (this.children.length === 0) {
      return [];
    }
    if (this.children.every((child) => child.isComplete)) {
      return [this];
    }
    return this.children.flatMap((child) => child.needsAttention());
  }

  get isComplete(): boolean {
    return this.completedAt !== null && this.completedAt !== undefined;
  }

  /**
   * Returns true if someone might want to check this as "complete" in the UI.
   * Only false if there are incomplete children.
   */
  get completionAvailable(): boolean {
    if (this.isComplete) {
      return true;
    }
    if (this.children.length === 0) {
      return true;
    }
    return this.children.every((child) => child.isComplete);
  }

  get hasChildren(): boolean {
    return this.children.length > 0;
  }

  isAvailableBefore(availableBefore: OptionalLocalDate): boolean {
    if (availableBefore === null) {
      return true;
    }
    if (this.deferUntil === null) {
      return true;
    }
    return this.deferUntil.isBefore(availableBefore);
  }

  static deserializeTasks(
    doc: { [id: string]: SerializedTask } | undefined,
    desiredTaskId: TaskId = universalRootTaskId
  ): Task {
    if (!doc) {
      return universalRootTask;
    }
    const taskMap = new Map<TaskId, Task>();
    for (const id in doc) {
      const task = new Task();
      const serialized = doc[id];
      task.id = serialized.id as TaskId;
      task.name = serialized.name;
      task.tags = serialized.tags as Tag[];
      task.parentId = serialized.parentId as TaskId;
      task.createdAt = parseIsoDate(serialized.createdAt);
      task.order = serialized.order;
      task.completedAt = parseOptionalIsoDate(serialized.completedAt);
      task.deferUntil = parseOptionalIsoDate(serialized.deferUntil);
      task.mode = serialized.mode as TaskMode;
      task.estimatedDuration = serialized.estimatedDuration;
      task.link = serialized.link;
      taskMap.set(task.id, task);
    }
    for (const task of taskMap.values()) {
      if (task.id === universalRootTaskId) {
        continue;
      }
      const parent = taskMap.get(task.parentId);
      if (parent) {
        task.parent = parent;
        parent.children.push(task);
      } else {
        throw new Error(`Parent task not found for task ${task.id}`);
      }
    }
    return taskMap.get(desiredTaskId) as Task;
  }
}

export const universalRootTask = new Task();
universalRootTask.id = universalRootTaskId;
universalRootTask.mode = "parallel";
universalRootTask.name = "_";
