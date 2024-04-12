import { useDrag, useDrop } from "react-dnd";
import { Task } from "../../lib/models/task";
import { DraggableItemTypes, UUID } from "../../types";

export function TaskShow({
  task,
  reparent,
  indentLevel = 0,
}: {
  indentLevel: number;
  task: Task;
  reparent: (taskId: UUID, newParentId: UUID) => void;
}) {
  return (
    <div>
      <RenderIndividualTask
        task={task}
        reparent={reparent}
        indentLevel={indentLevel}
      />
      {task.children.length > 0 ? (
        <ul className="pl-2">
          {task.children.map((child) => (
            <li key={child.id}>
              <TaskShow
                task={child}
                reparent={reparent}
                indentLevel={indentLevel + 1}
              />
            </li>
          ))}
        </ul>
      ) : null}
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
  reparent,
}: {
  indentLevel: number;
  task: Task;
  reparent: (taskId: UUID, newParentId: UUID) => void;
}) {
  const [{ isOver }, refDrop] = useDrop(
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
    [task, reparent]
  );
  const [{ isDragging }, refDrag] = useDrag(() => ({
    type: DraggableItemTypes.TASK,
    end: (_item, monitor) => {
      if (monitor.didDrop()) {
        reparent(task.id, (monitor.getDropResult() as { id: UUID }).id);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <div
      ref={refDrag}
      className={
        isDragging
          ? "bg-red-300 opacity-35"
          : backgroundByIndentLevel[
              indentLevel % backgroundByIndentLevel.length
            ]
      }
    >
      <div ref={refDrop} className={isOver ? "bg-indigo-300" : ""}>
        <div className="p-1">
          <h1 className="text-md">{task.name}</h1>
          <div className="flex space-x-2 items-center text-sm">
            <div>{task.createdAt}</div>
            <div>{task.tags.join(", ")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
