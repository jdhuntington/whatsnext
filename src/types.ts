export type UUID = string & { __typename: "UUID" };
export const genId = (): UUID => {
  return crypto.randomUUID() as UUID;
};

export interface SerializedTask {
  id: string;
  name: string;
  tags: string[];
  parentId: string;
  createdAt: string;
  order: number;
  completedAt: string | null;
}

export interface TaskSet {
  tasks: { [id: string]: SerializedTask };
}

export const DraggableItemTypes = {
  TASK: "TASK",
};

export type Tag = string & { __typename: "Tag" };
