import { AutomergeUrl } from "@automerge/automerge-repo";
import { Task } from "../../lib/models/task";
import { Tag, TaskSet, UUID } from "../../types";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useCallback, useMemo, useState } from "react";
import { StandaloneTask } from "../task/standalone";
import { useAppSelector } from "../../hooks";
import dayjs from "dayjs";
import { Stage, StageContent, StageHeader } from "../shell/stage";
import { ClearCompleted } from "../clear/clear";
import { Section } from "../shell/section";
import { Button } from "../ui/button";

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

  const tags = rootTask.allTags;
  const [visibleTags, setVisibleTags] = useState<Tag[]>(tags);
  const tasks = rootTask
    .availableActionsSince(cutoffTime)
    .filter((t) => t.tags.some((tag) => visibleTags.includes(tag)));
  return (
    <Stage>
      <StageHeader>
        <ClearCompleted />
      </StageHeader>
      <StageContent>
        <div className="space-y-1 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-2">
          <div>
            <Section>
              <h2 className="text-lg font-semibold">Tags</h2>
              <ul className="grid grid-cols-3 gap-3">
                <li>
                  <Button primary onClick={() => setVisibleTags(tags)}>
                    All
                  </Button>
                </li>
                <li>
                  <Button primary onClick={() => setVisibleTags([])}>
                    None
                  </Button>
                </li>
                {tags.map((tag) => (
                  <li key={tag}>
                    <Button
                      className="text-sm"
                      onClick={() =>
                        setVisibleTags((prev) => {
                          if (prev.includes(tag)) {
                            return prev.filter((t) => t !== tag);
                          }
                          return [...prev, tag];
                        })
                      }
                    >
                      {visibleTags.includes(tag) ? (
                        <span>{tag}</span>
                      ) : (
                        <span className={`line-through`}>{tag}</span>
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
          <Section className="col-span-3">
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  <StandaloneTask
                    fullPath
                    task={task}
                    onChange={onChange}
                    tags={tags}
                  />
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </StageContent>
    </Stage>
  );
};
