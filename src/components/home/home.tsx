import { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { selectionSlice } from "../../features/selection";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { ClearCompleted } from "../clear/clear";
import { SelectedTasks } from "../selected-tasks/selected-tasks";
import {
  Stage,
  StageContent,
  StageHeader,
} from "./../../components/shell/stage";
import { TaskList } from "./../../components/task/list";
import { Task } from "./../../lib/models/task";
import { Tag, TaskId, TaskSet } from "./../../types";
import { Button } from "../ng-ui/button";

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

  const appDispatch = useAppDispatch();

  const selectTask = useCallback(
    (taskId: TaskId) => {
      appDispatch(selectionSlice.actions.toggleSelection(taskId));
    },
    [appDispatch]
  );

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
    (parentId: TaskId) => {
      const task = new Task();
      task.name = `${faker.hacker.adjective()}`;
      task.parentId = parentId;
      addTask(task);
    },
    [addTask]
  );

  const reparent = useCallback(
    (sourceId: TaskId, newParent: TaskId) => {
      changeDoc((d) => {
        d.tasks[sourceId].parentId = newParent;
      });
    },
    [changeDoc]
  );
  const reorder = useCallback(
    (sourceId: TaskId, afterId: TaskId) => {
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
    (taskId: TaskId, values: Partial<Task>) => {
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
          <Button onClick={addNewTask}>Add Task</Button>
          <ClearCompleted />
        </div>
      </StageHeader>
      <StageContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            <DndProvider backend={HTML5Backend}>
              <div className="space-y-1 p-2">
                <TaskList
                  selectTask={selectTask}
                  hideBefore={cutoffTime}
                  onChange={onChange}
                  task={rootTask}
                  reparent={reparent}
                  reorder={reorder}
                  addChild={addChild}
                />
              </div>
            </DndProvider>
          </div>
          <div>
            <SelectedTasks />
          </div>
        </div>
      </StageContent>
    </Stage>
  );
};
