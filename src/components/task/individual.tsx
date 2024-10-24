import { Bars4Icon } from "@heroicons/react/16/solid";
import { useCallback, useState } from "react";
import { ConnectDragSource, useDrop } from "react-dnd";
import { useAppSelector } from "../../hooks";
import { classNames } from "../../lib/class-names";
import { now } from "../../lib/date-parser";
import { Task } from "../../lib/models/task";
import { DraggableItemTypes, Tag, TaskId, TaskMode } from "../../types";
import { Tags } from "../tags/tags";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ng-ui/input";
import { TaskModeIndicator } from "./indicators";
import { Text } from "../ng-ui/text";
import { Badge } from "../ng-ui/badge";
import { Button } from "../ng-ui/button";

interface Props {
  indentLevel: number;
  task: Task;
  dragHandle: ConnectDragSource;
  onChange: (taskId: TaskId, values: Partial<Task>) => void;
  addChild: (parentId: TaskId) => void;
  selectTask: (taskId: TaskId) => void;
}

export const RenderIndividualTask: React.FC<Props> = (props) => {
  const { task, dragHandle, onChange, selectTask } = props;
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = useCallback(() => setIsEditing((v) => !v), []);
  const disableEdit = useCallback((e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setIsEditing(false);
  }, []);
  const isSelected = useAppSelector((s) =>
    s.selection.selectedTaskIds.includes(task.id)
  );
  const [{ isOver: isOverReorder }, refDropReorder] = useDrop(
    () => ({
      accept: DraggableItemTypes.TASK,
      canDrop: () => true,
      drop: () => {
        return { id: task.id, action: "reorder" };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [task]
  );
  const [{ isOver: isOverReparent }, refDropReparent] = useDrop(
    () => ({
      accept: DraggableItemTypes.TASK,
      canDrop: () => true,
      drop: () => {
        return { id: task.id, action: "reparent" };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
        isDragging: !!monitor.getItem(),
      }),
    }),
    [task]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const payload: Partial<Task> = { name: e.target.value };
      onChange(task.id, payload);
    },
    [task, onChange]
  );

  const handleOrderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const payload: Partial<Task> = { order: parseInt(e.target.value, 10) };
      onChange(task.id, payload);
    },
    [task, onChange]
  );

  const handleModeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const mode: TaskMode = e.target.checked ? "parallel" : "serial";
      const payload: Partial<Task> = { mode };
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

  const selectTaskCallback = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;

      // Check if the target is not a checkbox or any other specific element
      if (
        target.tagName !== "INPUT" ||
        target.getAttribute("type") !== "checkbox"
      ) {
        selectTask(task.id as unknown as TaskId);
      }
    },
    [selectTask, task.id]
  );

  const style = classNames([
    "border-2 border-transparent hover:border-dotted hover:border-emerald-800 hover:border-emerald-200",
    ["bg-indigo-300 dark:bg-indigo-800", isOverReparent && !isSelected],
    ["bg-indigo-400 dark:bg-indigo-800", isOverReparent && isSelected],
    ["bg-emerald-100 dark:bg-emerald-900", isSelected && !isOverReparent],
  ]);

  return (
    <>
      <div ref={refDropReparent} onClick={selectTaskCallback} className={style}>
        <div className="p-1 flex justify-between items-center">
          <div className="flex-1">
            <div className="flex space-x-1 items-center">
              <div className="w-6">
                {task.completionAvailable ? (
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
              <div
                onDoubleClick={toggleEdit}
                className="flex space-x-1 items-center"
              >
                {task.hasChildren ? (
                  <TaskModeIndicator mode={task.mode} />
                ) : null}
                <Text className={`${task.isComplete ? "line-through" : ""}`}>
                  {task.name}
                </Text>
              </div>
              <div className="flex items-center space-x-1">
                {task.tags.map((tag) => (
                  <Badge color="sky" key={tag}>
                    {tag}
                  </Badge>
                ))}
              </div>
              {task.estimatedDuration ? (
                <div>
                  <Text>{task.estimatedDuration}m</Text>
                </div>
              ) : null}
              <div>
                <Button outline to={`/tasks/${task.id}`}>
                  Go
                </Button>
              </div>
            </div>

            {isEditing ? (
              <div className="p-1 lg:p-2 space-y-1 lg:space-y-2">
                <div>
                  <form onSubmit={disableEdit} className="flex space-x-1">
                    <label>
                      Description
                      <br />
                      <Input value={task.name} onChange={handleNameChange} />
                    </label>
                    <label>
                      Order
                      <br />
                      <Input
                        value={`${task.order}`}
                        onChange={handleOrderChange}
                      />
                    </label>
                    <label className="flex space-x-1 items-center">
                      <Checkbox
                        checked={task.mode === "parallel"}
                        onChange={handleModeChange}
                      />
                      <div>Parallel</div>
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
              </div>
            ) : null}
          </div>
          <div className="flex-0 flex space-x-2 items-center">
            <div ref={dragHandle}>
              <Bars4Icon className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={refDropReorder}
        className={`h-2 ${isOverReorder ? "bg-indigo-600" : ""} `}
      />
    </>
  );
};
