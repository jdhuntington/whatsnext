import { Task } from "../../lib/models/task";
import { OptionalLocalDate, Tag, TaskId } from "../../types";
import { useCallback, useState } from "react";
import { Tags } from "../tags/tags";
import { TaskFullPath } from "./task-full-path";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ng-ui/input";
import { RelativeDateInput } from "../ui/relative-date-input";
import { now } from "../../lib/date-parser";
import { Link } from "react-router-dom";
import { Text } from "../ng-ui/text";
import { Badge } from "../ng-ui/badge";

interface Props {
  task: Task;
  onChange: (taskId: TaskId, values: Partial<Task>) => void;
  fullPath?: boolean;
}

export const StandaloneTask: React.FC<Props> = (props) => {
  const { task, onChange, fullPath } = props;
  const [isEditing, setIsEditing] = useState(false);
  const enableEdit = useCallback(() => setIsEditing(true), []);
  const disableEdit = useCallback((e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setIsEditing(false);
  }, []);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const payload: Partial<Task> = { name: e.target.value };
      onChange(task.id, payload);
    },
    [task, onChange]
  );

  const handleAddTag = useCallback(
    (newTag: Tag) => {
      if (!newTag || newTag.trim().length === 0) {
        disableEdit();
      } else {
        const payload: Partial<Task> = {
          tags: [...task.tags, newTag],
        };
        onChange(task.id, payload);
      }
    },
    [task, onChange, disableEdit]
  );

  const handleRemoveTag = useCallback(
    (tag: Tag) => {
      const payload: Partial<Task> = {
        tags: task.tags.filter((t) => t !== tag),
      };
      onChange(task.id, payload);
    },
    [task, onChange]
  );

  const handleDeferChange = useCallback(
    (deferUntil: OptionalLocalDate) => {
      onChange(task.id, { deferUntil });
    },
    [task, onChange]
  );

  return (
    <>
      <div
        className={`border-2 border-transparent hover:border-dotted hover:border-emerald-800 dark:hover:border-emerald-200 rounded`}
      >
        <div className="p-1 flex justify-between items-center">
          <div className="flex-1">
            <div className="flex space-x-1 items-center">
              <div className="w-6">
                {task.children.length === 0 ? (
                  <Checkbox
                    checked={task.isComplete}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange(task.id, {
                          completedAt: now(),
                        });
                      } else {
                        onChange(task.id, { completedAt: null });
                      }
                    }}
                  />
                ) : null}
              </div>
              <Text
                onDoubleClick={enableEdit}
                className={`text-md ${task.isComplete ? "line-through" : ""}`}
              >
                {fullPath ? <TaskFullPath task={task} /> : task.name}
              </Text>
              <h2 className="flex items-center space-x-1">
                {task.tags.map((tag) => (
                  <Badge key={tag} color="indigo">
                    {tag}
                  </Badge>
                ))}
              </h2>
              <div className="text-xs">
                <Link className="hover:underline" to={`/tasks/${task.id}`}>
                  Go
                </Link>
              </div>
            </div>

            {isEditing ? (
              <div className="p-1 lg:p-2 space-y-1 lg:space-y-2">
                <div>
                  <form onSubmit={disableEdit}>
                    <label>
                      Description
                      <br />
                      <Input value={task.name} onChange={handleNameChange} />
                    </label>
                  </form>
                </div>
                <div>
                  <Tags
                    selectedTags={task.tags}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                  />
                </div>
                <div>
                  <label>
                    Defer until
                    <br />
                    <RelativeDateInput
                      initial={task.deferUntil}
                      onChangeComplete={handleDeferChange}
                    />
                  </label>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
