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
}

export interface TaskSet {
  tasks: { [id: string]: SerializedTask };
}
