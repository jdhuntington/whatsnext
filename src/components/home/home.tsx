import { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { Tag, TaskSet, UUID } from "./../../types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
import { Task } from "./../../lib/models/task";
import { Button } from "./../../components/ui/button";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TaskList } from "./../../components/task/list";
import {
  Stage,
  StageContent,
  StageHeader,
} from "./../../components/shell/stage";
import { useAppSelector } from "../../hooks";
import { ClearCompleted } from "../clear/clear";
import dayjs from "dayjs";

export const Home: React.FC = () => {
  const docUrl = useAppSelector((s) => s.configuration.documentId);
  if (!docUrl) {
    return null;
  }
  return <HomeInner docUrl={docUrl} />;
};

const HomeInner: React.FC<{ docUrl: AutomergeUrl }> = (props) => {
  const { docUrl } = props;
  const [doc, changeDoc] = useDocument<TaskSet>(docUrl);
  const rootTask = useMemo(() => Task.deserializeTasks(doc?.tasks), [doc]);
  const addTask = useCallback(
    (task: Task) => {
      changeDoc((d) => {
        d.tasks[task.id] = task.serialize();
      });
    },
    [changeDoc]
  );
  const addNewTask = useCallback(() => {
    const task = new Task();
    task.name = `${faker.hacker.adjective()} ${faker.hacker.noun()} ${faker.hacker.verb()} ${faker.hacker.ingverb()} ${faker.hacker.adjective()} ${faker.hacker.noun()} ${faker.hacker.verb()} ${faker.hacker.ingverb()}`;
    task.tags = [faker.hacker.verb() as Tag, faker.hacker.ingverb() as Tag];
    addTask(task);
  }, [addTask]);
  const addChild = useCallback(
    (parentId: UUID) => {
      const task = new Task();
      task.name = `${faker.hacker.adjective()}`;
      task.parentId = parentId;
      addTask(task);
    },
    [addTask]
  );

  const reparent = useCallback(
    (sourceId: UUID, newParent: UUID) => {
      changeDoc((d) => {
        d.tasks[sourceId].parentId = newParent;
      });
    },
    [changeDoc]
  );
  const reorder = useCallback(
    (sourceId: UUID, afterId: UUID) => {
      changeDoc((d) => {
        const targetTask = d.tasks[sourceId];
        const newOrderValue = d.tasks[afterId].order + 1;
        console.log("making order for", targetTask.name, "to", newOrderValue);
        Object.values(d.tasks)
          .filter(
            (t) =>
              t.parentId === targetTask.parentId && t.order >= newOrderValue
          )
          .forEach((t) => {
            console.log("incrementing order for", t.name);
            t.order += 1;
          });
        targetTask.order = newOrderValue;
      });
    },
    [changeDoc]
  );

  const onChange = useCallback(
    (taskId: UUID, values: Partial<Task>) => {
      changeDoc((d) => {
        const task = Task.deserializeTasks(d.tasks, taskId);
        Object.keys(values).forEach((key) => {
          const typedKey = key as keyof Task;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          task[typedKey as any] = values[typedKey]!;
        });
        const serialized = task.serialize();
        Object.keys(values).forEach((key) => {
          d.tasks[taskId][key] = serialized[key];
        });
      });
    },
    [changeDoc]
  );

  const cutoffTimeIsoDate = useAppSelector(
    (s) => s.nextActions.completedItemsCutoffTime
  );
  const cutoffTime = useMemo(
    () => dayjs(cutoffTimeIsoDate),
    [cutoffTimeIsoDate]
  );

  return (
    <Stage>
      <StageHeader>
        <div className="flex space-x-4 items-center">
          <Button primary onClick={addNewTask}>
            Add Task
          </Button>
          <ClearCompleted />
        </div>
      </StageHeader>
      <StageContent>
        <DndProvider backend={HTML5Backend}>
          <div className="space-y-1 p-2">
            <TaskList
              hideBefore={cutoffTime}
              onChange={onChange}
              task={rootTask}
              reparent={reparent}
              reorder={reorder}
              addChild={addChild}
            />
          </div>
        </DndProvider>
      </StageContent>
    </Stage>
  );
};
