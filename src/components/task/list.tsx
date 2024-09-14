import { Dayjs } from "dayjs";
import { Task } from "../../lib/models/task";
import { TaskId, UUID } from "../../types";
import { TaskShow } from "./show";

interface Props {
  task: Task;
  reparent: (taskId: UUID, newParentId: UUID) => void;
  reorder: (taskId: UUID, afterId: UUID) => void;
  onChange: (taskId: UUID, values: Partial<Task>) => void;
  addChild: (parentId: UUID) => void;
  hideBefore: Dayjs;
  selectTask: (taskId: TaskId) => void;
}
export const TaskList: React.FC<Props> = (props) => {
  const {
    task,
    reparent,
    reorder,
    selectTask,
    onChange,
    addChild,
    hideBefore,
  } = props;

  return (
    <div>
      <TaskShow
        selectTask={selectTask}
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
