import { ConnectDragSource, useDrop } from "react-dnd";
import { Task } from "../../lib/models/task";
import { DraggableItemTypes, Tag, UUID } from "../../types";
import { Bars4Icon } from "@heroicons/react/16/solid";
import { useCallback, useState } from "react";
import { Tags } from "../tags/tags";

const backgroundByIndentLevel = [
  "bg-red-200",
  "bg-green-200",
  "bg-blue-200",
  "bg-yellow-200",
  "bg-pink-200",
  "bg-purple-200",
  "bg-indigo-200",
  "bg-gray-200",
];

interface Props {
  indentLevel: number;
  task: Task;
  dragHandle: ConnectDragSource;
  isSelected: boolean;
  onChange: (taskId: UUID, values: Partial<Task>) => void;
  tags: Tag[];
}

export const RenderIndividualTask: React.FC<Props> = (props) => {
  const { indentLevel, task, dragHandle, isSelected, onChange, tags } = props;
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
        console.log("dropped", task.id, "over reorder");
        return { id: task.id, action: "reorder" };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [task]
  );
  const [{ isOver: isOverReparent, isDragging }, refDropReparent] = useDrop(
    () => ({
      accept: DraggableItemTypes.TASK,
      canDrop: () => true,
      drop: () => {
        console.log("dropped", task.id, "over reparent");
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

  return (
    <>
      <div
        ref={refDropReparent}
        className={`border-2 border-white hover:border-dotted hover:border-purple-800 ${
          isOverReparent
            ? "bg-indigo-300"
            : backgroundByIndentLevel[
                indentLevel % backgroundByIndentLevel.length
              ]
        } ${isSelected ? "font-bold" : ""}`}
      >
        <div className="p-1 flex justify-between items-center">
          <div className="flex-1">
            <div className="flex space-x-1 items-center">
              <h1 className="text-md" onDoubleClick={enableEdit}>
                {task.name}
              </h1>
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
                  <form onSubmit={disableEdit}>
                    <label>
                      Description
                      <br />
                      <input
                        type="text"
                        value={task.name}
                        onChange={handleNameChange}
                      />
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
          <div className="flex-0 flex items-center">
            <div ref={dragHandle}>
              <Bars4Icon className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      {isDragging ? (
        <div
          ref={refDropReorder}
          className={`h-8 ${isOverReorder ? "bg-indigo-600" : ""} `}
        />
      ) : null}
    </>
  );
};
