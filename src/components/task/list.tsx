import { Dayjs } from "dayjs";
import { Task } from "../../lib/models/task";
import { UUID } from "../../types";
import { TaskShow } from "./show";

interface Props {
  task: Task;
  reparent: (taskId: UUID, newParentId: UUID) => void;
  reorder: (taskId: UUID, afterId: UUID) => void;
  onChange: (taskId: UUID, values: Partial<Task>) => void;
  addChild: (parentId: UUID) => void;
  hideBefore: Dayjs;
}
export const TaskList: React.FC<Props> = (props) => {
  const { task, reparent, reorder, onChange, addChild, hideBefore } = props;
  // const onKeyDown = useCallback(
  //   (e: KeyboardEvent) => {
  //     const target = e.target as HTMLElement;
  //     if (
  //       target.tagName === "INPUT" ||
  //       target.tagName === "TEXTAREA" ||
  //       target.tagName === "SELECT"
  //     ) {
  //       return;
  //     }
  //     if (e.key === "ArrowDown" || e.key === "j") {
  //       setSelectedIndex((i) => Math.min(i + 1, maxSelectedIndex));
  //     }
  //     if (e.key === "ArrowUp" || e.key === "k") {
  //       setSelectedIndex((i) => Math.max(i - 1, 0));
  //     }
  //     if (e.key === "Space") {
  //       setSelectedTaskIds((ids) => {
  //         if (ids.includes(selectedTaskId)) {
  //           return ids.filter((id) => id !== task.id);
  //         }
  //         return [...ids, selectedTaskId];
  //       });
  //     }
  //   },
  //   [maxSelectedIndex, task, selectedTaskId]
  // );

  // useEffect(() => {
  //   window.addEventListener("keydown", onKeyDown);
  //   return () => {
  //     window.removeEventListener("keydown", onKeyDown);
  //   };
  // }, [onKeyDown]);

  return (
    <div>
      <TaskShow
        task={task}
        reparent={reparent}
        reorder={reorder}
        indentLevel={0}
        onChange={onChange}
        tags={task.allTags}
        addChild={addChild}
        hideBefore={hideBefore}
      />
    </div>
  );
};
