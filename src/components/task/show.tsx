import { useDrag } from "react-dnd";
import { Task, universalRootTaskId } from "../../lib/models/task";
import { DraggableItemTypes, Tag, TaskId, UUID } from "../../types";
import { RenderIndividualTask } from "./individual";
import { useCallback, useState } from "react";
import { Dayjs } from "dayjs";

type DropResult = { id: UUID; action: "reorder" | "reparent" };

interface Props {
  indentLevel: number;
  task: Task;
  reparent: (taskId: UUID, newParentId: UUID) => void;
  reorder: (taskId: UUID, afterId: UUID) => void;
  onChange: (taskId: UUID, values: Partial<Task>) => void;
  tags: Tag[];
  addChild: (parentId: UUID) => void;
  hideBefore: Dayjs;
  selectTask: (taskId: TaskId) => void;
}

export const TaskShow: React.FC<Props> = (props) => {
  const {
    selectTask,
    hideBefore,
    task,
    reparent,
    indentLevel,
    onChange,
    reorder,
    tags,
    addChild,
  } = props;
  const [isExpanded, setIsExpanded] = useState(task.id === universalRootTaskId);
  const toggleExpanded = useCallback(() => setIsExpanded((v) => !v), []);
  const [{ isDragging }, refDrag, refPreview] = useDrag(() => ({
    type: DraggableItemTypes.TASK,
    end: (_item, monitor) => {
      if (monitor.didDrop()) {
        const result = monitor.getDropResult() as DropResult;
        if (result.action === "reorder") {
          const afterId = result.id;
          if (afterId === task.id) return;
          reorder(task.id, afterId);
        } else if (result.action === "reparent") {
          const newParentId = result.id;
          if (newParentId === task.id) return;
          reparent(task.id, newParentId);
        } else {
          console.error("unknown action", result.action);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const addChildCallback = useCallback(() => {
    addChild(task.id);
    setIsExpanded(true);
  }, [addChild, task.id]);
  if (task.completedAt && hideBefore.isAfter(task.completedAt)) {
    return null;
  }
  return (
    <div ref={refPreview} className={isDragging ? "bg-red-300 opacity-35" : ""}>
      <div>
        <div className="flex items-center space-x-1">
          <div
            className="rounded-full text-base font-bold bg-grey-200 text-grey-600 flex-0 w-6"
            onClick={toggleExpanded}
          >
            {task.children.length === 0 ? " " : isExpanded ? "-" : "+"}
          </div>
          <div className="flex-1">
            <RenderIndividualTask
              selectTask={selectTask}
              onChange={onChange}
              dragHandle={refDrag}
              task={task}
              indentLevel={indentLevel}
              isSelected={false}
              tags={tags}
              addChild={addChildCallback}
            />
          </div>
        </div>
        {task.children.length > 0 && isExpanded ? (
          <ul className="pl-3">
            {task.sortedChildren.map((child) => (
              <li key={child.id}>
                <TaskShow
                  selectTask={selectTask}
                  onChange={onChange}
                  task={child}
                  reparent={reparent}
                  reorder={reorder}
                  indentLevel={indentLevel + 1}
                  tags={tags}
                  addChild={addChild}
                  hideBefore={hideBefore}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};
