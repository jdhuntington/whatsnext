import { AutomergeUrl } from "@automerge/automerge-repo";
import { Task } from "../../lib/models/task";
import { OptionalLocalDate, Tag, TaskSet, UUID } from "../../types";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useCallback, useMemo, useState } from "react";
import { StandaloneTask } from "../task/standalone";
import { useAppSelector } from "../../hooks";
import dayjs from "dayjs";
import { Stage, StageContent, StageHeader } from "../shell/stage";
import { ClearCompleted } from "../clear/clear";
import { Section } from "../shell/section";
import { Button } from "../ui/button";
import { now } from "../../lib/date-parser";
import { Checkbox } from "../ui/checkbox";

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
        const task = Task.deserializeTasks(d.tasks, taskId);
        Object.keys(values).forEach((key) => {
          const typedKey = key as keyof Task;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          task[typedKey as any] = values[typedKey]!;
        });
        const serialized = task.serialize();
        Object.keys(values).forEach((key) => {
          d.tasks[taskId][key] = serialized[key];
        });
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

  const tags = useMemo(
    () =>
      rootTask.allTags
        .slice()
        .sort((a, b) =>
          a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())
        ),
    [rootTask.allTags]
  );
  const [visibleTags, setVisibleTags] = useState<Tag[]>(tags);
  const [showUntagged, setShowUntagged] = useState(true);
  const [availableBefore, setAvailableBefore] =
    useState<OptionalLocalDate>(null);
  const toggleAvailableBefore = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setAvailableBefore(e.target.checked ? now() : null),
    []
  );
  const tasks = rootTask
    .availableActionsSince(cutoffTime)
    .filter(
      (t) =>
        ((showUntagged && t.tags.length === 0) ||
          t.tags.some((tag) => visibleTags.includes(tag))) &&
        (availableBefore === null || t.isAvailableBefore(availableBefore))
    );
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
                <li>
                  <Button
                    primary
                    onClick={() => setShowUntagged((prev) => !prev)}
                  >
                    {showUntagged ? "Hide" : "Show"} untagged
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
              <h2 className="text-lg font-semibold mt-2 mt-4">Other</h2>
              <label className="flex space-x-1">
                <Checkbox
                  onChange={toggleAvailableBefore}
                  checked={!!availableBefore}
                />
                <div>Hide deferred tasks</div>
              </label>
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
