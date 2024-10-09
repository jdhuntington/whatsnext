import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useCallback } from "react";
import { selectionSlice } from "../../features/selection";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Button } from "../ng-ui/button";
import { SerializedTask, Tag, TaskId, TaskMode, TaskSet } from "./../../types";
import { Input } from "../ng-ui/input";
import { Section } from "../shell/section";
import { Checkbox } from "../ng-ui/checkbox";
import { Tags } from "../tags/tags";
import { Subheading } from "../ng-ui/heading";
import { Field, Label } from "../ng-ui/fieldset";
import { CheckboxField } from "../ng-ui/checkbox";
import { Select } from "../ng-ui/select";
import { universalRootTaskId } from "../../lib/models/task";

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
      <Subheading>Tasks</Subheading>

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
    (value: boolean) => {
      const mode: TaskMode = value ? "parallel" : "serial";
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
        <Field>
          <Label>Description</Label>
          <Input
            value={task.name}
            onChange={(e) => onChange(props.taskId, { name: e.target.value })}
          />
        </Field>
        <CheckboxField>
          <Checkbox
            checked={task.mode === "parallel"}
            onChange={handleModeChange}
          />
          <Label>Parallel</Label>
        </CheckboxField>
        <Tags
          selectedTags={task.tags as Tag[]}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
        <Field>
          <Label>Parent</Label>
          <Select
            onChange={(e) =>
              onChange(props.taskId, { parentId: e.target.value })
            }
            value={task.parentId}
          >
            {optionsForParent(doc, task.parentId as TaskId)}
          </Select>
        </Field>
        <Button onClick={() => selectTask(props.taskId)}>Done</Button>
      </form>
    </Section>
  );
};
const optionsForParent = (doc: TaskSet, currentParentId?: TaskId) => {
  const pairs = Object.keys(doc!.tasks)
    .filter(
      (taskId) =>
        taskId !== universalRootTaskId &&
        (!doc!.tasks[taskId].completedAt || currentParentId === taskId)
    )
    .map((taskId) => [taskId, doc!.tasks[taskId].name]);
  const result = pairs
    .sort((a, b) =>
      (a[1] ?? "")
        .toLocaleLowerCase()
        .localeCompare((b[1] ?? "").toLocaleLowerCase())
    )
    .map(([taskId, name]) => (
      <option key={taskId} value={taskId}>
        {name}
      </option>
    ));
  result.unshift(
    <option key={universalRootTaskId} value={universalRootTaskId}>
      None
    </option>
  );
  return result;
};
