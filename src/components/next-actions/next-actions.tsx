import { AutomergeUrl } from "@automerge/automerge-repo";
import { Task } from "../../lib/models/task";
import { TaskSet, UUID } from "../../types";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useCallback, useMemo } from "react";
import { StandaloneTask } from "../task/standalone";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Button } from "../ui/button";
import { nextActionsSlice } from "../../features/next-actions";
import dayjs from "dayjs";

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
  const cutoffTimeIsoDate = useAppSelector(
    (s) => s.nextActions.completedItemsCutoffTime
  );
  const cutoffTime = useMemo(
    () => dayjs(cutoffTimeIsoDate),
    [cutoffTimeIsoDate]
  );
  const appDispatch = useAppDispatch();
  const clearCompleted = useCallback(() => {
    appDispatch(nextActionsSlice.actions.setCutoff(dayjs()));
  }, [appDispatch]);

  const tags = rootTask.allTags;
  const tasks = rootTask.availableActionsSince(cutoffTime);
  return (
    <div className="space-y-1">
      <h2>Next Actions</h2>
      <div>
        <Button onClick={clearCompleted}>Clear completed items</Button>
        <pre>
          {JSON.stringify({ cutoffTime, type: typeof cutoffTime }, null, 2)}
        </pre>
      </div>
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
