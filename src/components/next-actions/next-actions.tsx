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
import { Stage, StageContent, StageHeader } from "../shell/stage";

export const NextActions: React.FC = () => {
  const docUrl = useAppSelector((s) => s.configuration.documentId);
  if (!docUrl) {
    return null;
  }
  return <NextActionsInner docUrl={docUrl} />;
};

interface Props {
  docUrl: AutomergeUrl;
}
const NextActionsInner: React.FC<Props> = (props) => {
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
    <Stage>
      <StageHeader>
        <Button onClick={clearCompleted}>Clear completed items</Button>
      </StageHeader>
      <StageContent>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <StandaloneTask task={task} onChange={onChange} tags={tags} />
            </li>
          ))}
        </ul>
      </StageContent>
    </Stage>
  );
};
