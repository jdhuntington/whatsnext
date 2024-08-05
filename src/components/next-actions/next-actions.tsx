import { AutomergeUrl } from "@automerge/automerge-repo";
import { Task } from "../../lib/models/task";
import { TaskSet, UUID } from "../../types";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useCallback, useMemo } from "react";
import { StandaloneTask } from "../task/standalone";

interface Props {
  docUrl: AutomergeUrl;
}
export const NextActions: React.FC<Props> = (props) => {
  const { docUrl } = props;
  const [doc, changeDoc] = useDocument<TaskSet>(docUrl);
  const rootTask = useMemo(() => Task.deserializeTasks(doc?.tasks), [doc]);
  const onChange = useCallback(
    (taskId: UUID, values: Partial<Task>) => {
      changeDoc((d) => {
        const task = d.tasks[taskId];
        Object.assign(task, values);
      });
    },
    [changeDoc]
  );
  const tags = rootTask.allTags;
  const tasks = rootTask.nextActions;
  return (
    <div>
      <h2>Next Actions</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <StandaloneTask task={task} onChange={onChange} tags={tags} />
          </li>
        ))}
      </ul>
    </div>
  );
};
