import { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useCallback } from "react";
import { selectionSlice } from "../../features/selection";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Button } from "./../../components/ui/button";
import { SerializedTask, TaskId, TaskSet } from "./../../types";
import { Input } from "../ui/input";

export const SelectedTasks: React.FC = () => {
  const docUrl = useAppSelector((s) => s.configuration.documentId);
  if (!docUrl) {
    return null;
  }
  return <SelectedTasksInner docUrl={docUrl} />;
};

const SelectedTasksInner: React.FC<{ docUrl: AutomergeUrl }> = (props) => {
  const { docUrl } = props;
  const [doc, changeDoc] = useDocument<TaskSet>(docUrl);

  const appDispatch = useAppDispatch();

  const selectTask = useCallback(
    (taskId: TaskId) => {
      appDispatch(selectionSlice.actions.toggleSelection(taskId));
    },
    [appDispatch]
  );
  const selectionState = useAppSelector((s) => s.selection);

  return (
    <div className="space-y-2 lg:space-y-2">
      <h1>Tasks</h1>

      <ul className="space-y-1">
        {selectionState.selectedTaskIds.map((taskId) => (
          <li key={taskId}>
            <SelectedTask taskId={taskId} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const SelectedTask: React.FC<{ taskId: TaskId }> = (props) => {
  const docUrl = useAppSelector((s) => s.configuration.documentId);
  const [doc, changeDoc] = useDocument<TaskSet>(docUrl!);

  const appDispatch = useAppDispatch();

  const selectTask = useCallback(
    (taskId: TaskId) => {
      appDispatch(selectionSlice.actions.toggleSelection(taskId));
    },
    [appDispatch]
  );

  const onChange = useCallback(
    (taskId: TaskId, values: Partial<SerializedTask>) => {
      changeDoc((d) => {
        const existingTask = d.tasks[taskId];
        Object.keys(values).forEach((_key) => {
          existingTask[_key as keyof SerializedTask] = values[
            _key
          ]! as SerializedTask[keyof SerializedTask] as never;
        });
      });
    },
    [changeDoc]
  ) as (taskId: TaskId, values: Partial<SerializedTask>) => void;

  interface Partial<SerializedTask> {
    [key: string]: SerializedTask[keyof SerializedTask];
  }

  const task = doc?.tasks[props.taskId];
  if (!task) {
    return null;
  }
  return (
    <div>
      <form>
        <label>
          Description
          <br />
          <Input
            value={task.name}
            onChange={(e) => onChange(props.taskId, { name: e.target.value })}
          />
        </label>
      </form>
      <Button onClick={() => selectTask(props.taskId)}>Done</Button>
    </div>
  );
};
