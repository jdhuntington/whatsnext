import { useCallback, useEffect, useMemo, useState } from "react";
import { Task } from "../../lib/models/task";
import { UUID } from "../../types";
import { TaskShow } from "./show";

export function TaskList({
  task,
  reparent,
}: {
  task: Task;
  reparent: (taskId: UUID, newParentId: UUID) => void;
}) {
  const [selectedTaskIds, setSelectedTaskIds] = useState<UUID[]>([]);
  const maxSelectedIndex = task.totalNodes - 1;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedTaskId = useMemo(
    () => task.getNthNode(selectedIndex).id,
    [selectedIndex, task]
  );
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      ) {
        return;
      }
      if (e.key === "ArrowDown" || e.key === "j") {
        setSelectedIndex((i) => Math.min(i + 1, maxSelectedIndex));
      }
      if (e.key === "ArrowUp" || e.key === "k") {
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Space") {
        setSelectedTaskIds((ids) => {
          if (ids.includes(selectedTaskId)) {
            return ids.filter((id) => id !== task.id);
          }
          return [...ids, selectedTaskId];
        });
      }
    },
    [maxSelectedIndex, task, selectedTaskId]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <div>
      <pre>
        {JSON.stringify(
          { selectedTaskIds, selectedIndex, selectedTaskId, maxSelectedIndex },
          null,
          2
        )}
      </pre>
      <TaskShow
        cursorOffset={selectedIndex}
        task={task}
        reparent={reparent}
        indentLevel={0}
        selectedTaskIds={selectedTaskIds}
      />
    </div>
  );
}
