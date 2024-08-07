import dayjs, { Dayjs } from "dayjs";
import { SerializedTask, Tag, TaskMode, UUID, genId } from "../../types";

export const universalRootTaskId =
  "E2FFE8B4-92C8-4336-9B4B-D309E2A7C41B" as UUID;

export class Task {
  public parentId: UUID = universalRootTaskId;
  public id: UUID = genId();
  public name: string = "";
  public tags: Tag[] = [];
  public createdAt: string = new Date().toISOString();
  public completedAt: string | null = null;
  public children: Task[] = [];
  public order: number = 0;
  public mode: TaskMode = "serial";

  public serialize(): SerializedTask {
    return {
      id: this.id,
      name: this.name,
      tags: this.tags,
      parentId: this.parentId,
      createdAt: this.createdAt,
      order: this.order,
      completedAt: this.completedAt,
      mode: this.mode,
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
    task.mode = this.mode;
    return task;
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

  static deserializeTasks(
    doc: { [id: string]: SerializedTask } | undefined
  ): Task {
    if (!doc) {
      return universalRootTask;
    }
    const taskMap = new Map<UUID, Task>();
    for (const id in doc) {
      const task = new Task();
      const serialized = doc[id];
      task.id = serialized.id as UUID;
      task.name = serialized.name;
      task.tags = serialized.tags as Tag[];
      task.parentId = serialized.parentId as UUID;
      task.createdAt = serialized.createdAt;
      task.order = serialized.order;
      task.completedAt = serialized.completedAt;
      task.mode = serialized.mode as TaskMode;
      taskMap.set(task.id, task);
    }
    for (const task of taskMap.values()) {
      if (task.id === universalRootTaskId) {
        continue;
      }
      const parent = taskMap.get(task.parentId);
      if (parent) {
        parent.children.push(task);
      } else {
        throw new Error(`Parent task not found for task ${task.id}`);
      }
    }
    return taskMap.get(universalRootTaskId) as Task;
  }
}

export const universalRootTask = new Task();
universalRootTask.id = universalRootTaskId;
universalRootTask.mode = "parallel";
universalRootTask.name = "_";
