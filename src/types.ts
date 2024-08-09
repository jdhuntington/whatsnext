export type UUID = string & { __typename: "UUID" };
export const genId = (): UUID => {
  return crypto.randomUUID() as UUID;
};

export type TaskMode = "serial" | "parallel";

export interface SerializedTask {
  id: string;
  name: string;
  tags: string[];
  parentId: string;
  createdAt: string;
  order: number;
  completedAt: string | null;
  deferUntil: string | null;
  mode: TaskMode;
}

export interface TaskSet {
  tasks: { [id: string]: SerializedTask };
}

export const DraggableItemTypes = {
  TASK: "TASK",
};

export type Tag = string & { __typename: "Tag" };
export type IsoDate = string & { __typename: "IsoDate" };
export type AutomergeDocId = string & { __typename: "AutomergeDocId" };
