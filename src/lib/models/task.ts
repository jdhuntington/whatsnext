import { SerializedTask, UUID, genId } from "../../types";

const universalRootTaskId = "E2FFE8B4-92C8-4336-9B4B-D309E2A7C41B" as UUID;

export class Task {
  public parentId: UUID = universalRootTaskId;
  public id: UUID = genId();
  public name: string = "";
  public tags: string[] = [];
  public createdAt: string = new Date().toISOString();
  public children: Task[] = [];
  public order: number = 0;

  serialize(): SerializedTask {
    return {
      id: this.id,
      name: this.name,
      tags: this.tags,
      parentId: this.parentId,
      createdAt: this.createdAt,
      order: this.order,
    };
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
      task.tags = serialized.tags;
      task.parentId = serialized.parentId as UUID;
      task.createdAt = serialized.createdAt;
      task.order = serialized.order;
      console.log("Task", task);
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
universalRootTask.name = "_";
