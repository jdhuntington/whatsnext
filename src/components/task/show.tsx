import { ConnectDragSource, useDrag, useDrop } from "react-dnd";
import { Task } from "../../lib/models/task";
import { DraggableItemTypes, UUID } from "../../types";
import { Bars4Icon } from "@heroicons/react/16/solid";
import { useCallback } from "react";

export function TaskShow({
  task,
  reparent,
  indentLevel,
  onChange,
}: {
  indentLevel: number;
  task: Task;
  reparent: (taskId: UUID, newParentId: UUID) => void;
  onChange: (taskId: UUID, values: Partial<Task>) => void;
}) {
  const [{ isDragging }, refDrag, refPreview] = useDrag(() => ({
    type: DraggableItemTypes.TASK,
    end: (_item, monitor) => {
      if (monitor.didDrop()) {
        const newParentId = (monitor.getDropResult() as { id: UUID }).id;
        if (newParentId === task.id) return;
        reparent(task.id, newParentId);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <div ref={refPreview} className={isDragging ? "bg-red-300 opacity-35" : ""}>
      <div>
        <RenderIndividualTask
          onChange={onChange}
          dragHandle={refDrag}
          task={task}
          indentLevel={indentLevel}
          isSelected={false}
        />
        {task.children.length > 0 ? (
          <ul className="pl-2">
            {task.children.map((child) => (
              <li key={child.id}>
                <TaskShow
                  onChange={onChange}
                  task={child}
                  reparent={reparent}
                  indentLevel={indentLevel + 1}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

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

function RenderIndividualTask({
  indentLevel,
  task,
  dragHandle,
  isSelected,
  onChange,
}: {
  indentLevel: number;
  task: Task;
  dragHandle: ConnectDragSource;
  isSelected: boolean;
  onChange: (taskId: UUID, values: Partial<Task>) => void;
}) {
  const [{ isOver: isOverReorder }, refDropReorder] = useDrop(
    () => ({
      accept: DraggableItemTypes.TASK,
      canDrop: () => true,
      drop: () => {
        return { id: task.id };
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
        return { id: task.id };
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

  return (
    <>
      <div
        ref={refDropReparent}
        className={`${
          isOverReparent
            ? "bg-indigo-300"
            : backgroundByIndentLevel[
                indentLevel % backgroundByIndentLevel.length
              ]
        } ${isSelected ? "font-bold" : ""}`}
      >
        <div className="p-1 flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-md">{task.name}</h1>
            <div className="flex space-x-2 items-center text-sm">
              <div>{task.createdAt}</div>
              <div>{task.tags.join(", ")}</div>
            </div>
            <input type="text" value={task.name} onChange={handleNameChange} />
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
}
