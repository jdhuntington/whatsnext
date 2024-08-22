import { ConnectDragSource, useDrop } from "react-dnd";
import { Task } from "../../lib/models/task";
import { DraggableItemTypes, Tag, TaskMode, UUID } from "../../types";
import { Bars4Icon } from "@heroicons/react/16/solid";
import { useCallback, useState } from "react";
import { Tags } from "../tags/tags";
import { TaskModeIndicator } from "./indicators";
import { PlusIcon } from "@heroicons/react/20/solid";
import { IconButton } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { now } from "../../lib/date-parser";

interface Props {
  indentLevel: number;
  task: Task;
  dragHandle: ConnectDragSource;
  isSelected: boolean;
  onChange: (taskId: UUID, values: Partial<Task>) => void;
  tags: Tag[];
  addChild: (parentId: UUID) => void;
}

export const RenderIndividualTask: React.FC<Props> = (props) => {
  const { task, dragHandle, isSelected, onChange, tags, addChild } = props;
  const [isEditing, setIsEditing] = useState(false);
  const enableEdit = useCallback(() => setIsEditing(true), []);
  const disableEdit = useCallback((e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setIsEditing(false);
  }, []);
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
    [task],
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
    [task],
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const payload: Partial<Task> = { name: e.target.value };
      onChange(task.id, payload);
    },
    [task, onChange],
  );

  const handleOrderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const payload: Partial<Task> = { order: parseInt(e.target.value, 10) };
      onChange(task.id, payload);
    },
    [task, onChange],
  );

  const handleModeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const mode: TaskMode = e.target.checked ? "parallel" : "serial";
      const payload: Partial<Task> = { mode };
      onChange(task.id, payload);
    },
    [task, onChange],
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
    [task, onChange, disableEdit],
  );

  const handleRemoveTag = useCallback(
    (tag: Tag) => {
      const payload: Partial<Task> = {
        tags: task.tags.filter((t) => t !== tag),
      };
      onChange(task.id, payload);
    },
    [task, onChange],
  );

  const addChildCallback = useCallback(() => {
    addChild(task.id);
  }, [addChild, task.id]);

  return (
    <>
      <div
        ref={refDropReparent}
        className={` border-2 border-white hover:border-dotted hover:border-emerald-800 ${
          isOverReparent ? "bg-indigo-300" : "bg-white"
        } ${isSelected ? "font-bold" : ""}`}
      >
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
                onDoubleClick={enableEdit}
                className="flex space-x-1 items-center"
              >
                {task.hasChildren ? (
                  <TaskModeIndicator mode={task.mode} />
                ) : null}
                <h1
                  className={`text-md  ${task.isComplete ? "line-through text-gray-600" : "text-gray-800"}`}
                >
                  {task.name}
                </h1>
              </div>
              <h2 className="flex items-center space-x-1">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-gray-200 rounded-full py-1 px-2"
                  >
                    {tag}
                  </span>
                ))}
              </h2>
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
                    <label className="flex space-x-1">
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
                    allTags={tags}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                  />
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex-0 flex space-x-2 items-center">
            <IconButton icon={PlusIcon} onClick={addChildCallback} />
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
