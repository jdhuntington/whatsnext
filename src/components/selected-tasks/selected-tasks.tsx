import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useCallback } from "react";
import { selectionSlice } from "../../features/selection";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Button } from "./../../components/ui/button";
import { SerializedTask, Tag, TaskId, TaskMode, TaskSet } from "./../../types";
import { Input } from "../ng-ui/input";
import { Section } from "../shell/section";
import { Checkbox } from "../ui/checkbox";
import { Tags } from "../tags/tags";

export const SelectedTasks: React.FC = () => {
  const docUrl = useAppSelector((s) => s.configuration.documentId);
  if (!docUrl) {
    return null;
  }
  return <SelectedTasksInner />;
};

const SelectedTasksInner: React.FC = () => {
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
  const task = doc?.tasks[props.taskId];

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

  const handleModeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const mode: TaskMode = e.target.checked ? "parallel" : "serial";
      onChange(props.taskId, { mode });
    },
    [props.taskId, onChange]
  );

  const handleAddTag = useCallback(
    (newTag: Tag) => {
      const existingTags = task?.tags ?? [];
      const payload = {
        tags: [...existingTags, newTag],
      };
      onChange(props.taskId, payload);
    },
    [props.taskId, task, onChange]
  );

  const handleRemoveTag = useCallback(
    (newTag: Tag) => {
      const existingTags = task?.tags ?? [];
      const payload = {
        tags: existingTags.filter((t) => t !== newTag),
      };
      onChange(props.taskId, payload);
    },
    [props.taskId, task, onChange]
  );

  interface Partial<SerializedTask> {
    [key: string]: SerializedTask[keyof SerializedTask];
  }

  if (!task) {
    return null;
  }
  const allTags = new Set<Tag>();
  Object.values(doc!.tasks).forEach((t) => {
    t.tags.forEach((tag) => allTags.add(tag as Tag));
  });
  return (
    <Section>
      <form className="space-y-3">
        <label className="space-y-1">
          <div className="text-sm">Description</div>
          <Input
            value={task.name}
            onChange={(e) => onChange(props.taskId, { name: e.target.value })}
          />
        </label>
        <label className="flex space-x-2 items-center hover:bg-gray-50 p-1 -m-1">
          <Checkbox
            checked={task.mode === "parallel"}
            onChange={handleModeChange}
          />
          <div className="text-sm">Parallel</div>
        </label>
        <Tags
          selectedTags={task.tags as Tag[]}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
        <Button primary onClick={() => selectTask(props.taskId)}>
          Done
        </Button>
      </form>
    </Section>
  );
};
