import { Dayjs } from "dayjs";

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
  createdAt: IsoDate;
  order: number;
  completedAt: OptionalIsoDate;
  deferUntil: OptionalIsoDate;
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
export type OptionalIsoDate = IsoDate | null;
export type TaskId = string & { __typename: "TaskId" };
export type UtcDate = Dayjs & { __typename: "UtcDate" };
export type LocalDate = Dayjs & { __typename: "LocalDate" };
export type OptionalUtcDate = UtcDate | null;
export type OptionalLocalDate = LocalDate | null;
