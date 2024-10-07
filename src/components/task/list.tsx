import { Dayjs } from "dayjs";
import { Task } from "../../lib/models/task";
import { TaskId } from "../../types";
import { TaskShow } from "./show";

interface Props {
  task: Task;
  reparent: (taskId: TaskId, newParentId: TaskId) => void;
  reorder: (taskId: TaskId, afterId: TaskId) => void;
  onChange: (taskId: TaskId, values: Partial<Task>) => void;
  addChild: (parentId: TaskId) => void;
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
        addChild={addChild}
        hideBefore={hideBefore}
      />
    </div>
  );
};
