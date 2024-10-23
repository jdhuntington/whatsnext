import { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../hooks";
import { now } from "../../lib/date-parser";
import { Task } from "../../lib/models/task";
import { OptionalLocalDate, Tag, TaskId, TaskSet } from "../../types";
import { ClearCompleted } from "../clear/clear";
import { Checkbox, CheckboxField } from "../ng-ui/checkbox";
import { Label } from "../ng-ui/fieldset";
import { Heading } from "../ng-ui/heading";
import { PageHeader } from "../shell/page-header";
import { Section } from "../shell/section";
import { StandaloneTask } from "../task/standalone";
import { Button } from "../ui/button";
import { useSelection } from "../../lib/selection-manager";
import { off, on } from "../../lib/events";
import { ChevronRightIcon } from "@heroicons/react/16/solid";

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
    (taskId: TaskId, values: Partial<Task>) => {
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
    useState<OptionalLocalDate>(now());
  const toggleAvailableBefore = useCallback(
    (val: boolean) => setAvailableBefore(val ? now() : null),
    []
  );
  const tasks = useMemo(
    () =>
      rootTask
        .availableActionsSince(cutoffTime)
        .filter(
          (t) =>
            ((showUntagged && t.tags.length === 0) ||
              t.tags.some((tag) => visibleTags.includes(tag))) &&
            (availableBefore === null || t.isAvailableBefore(availableBefore))
        ),
    [rootTask, cutoffTime, showUntagged, visibleTags, availableBefore]
  );
  const { state, moveCursorDown, moveCursorUp, toggleSelection, setItems } =
    useSelection<Task>(tasks);

  useEffect(() => {
    on("moveCursorDown", moveCursorDown);
    return () => off("moveCursorDown", moveCursorDown);
  }, [moveCursorDown]);

  useEffect(() => {
    on("moveCursorUp", moveCursorUp);
    return () => off("moveCursorUp", moveCursorUp);
  }, [moveCursorUp]);

  useEffect(() => {
    on("toggleSelection", toggleSelection);
    return () => off("toggleSelection", toggleSelection);
  }, [toggleSelection]);

  useEffect(() => setItems(tasks), [setItems, tasks]);

  return (
    <>
      <PageHeader>
        <Heading>What's Next?</Heading>
        <div className="flex items-center gap-2 lg:gap-4">
          <CheckboxField>
            <Checkbox
              checked={!!availableBefore}
              onChange={toggleAvailableBefore}
            />
            <Label>Hide deferred tasks</Label>
          </CheckboxField>
          <ClearCompleted />
        </div>
      </PageHeader>
      <div>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
      <div>
        <div>
          <Section>
            <h2 className="text-lg font-semibold">Tags</h2>
            <ul className="flex flex-wrap items-center gap-2">
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
          </Section>
        </div>
        <div>
          <ul>
            {tasks.map((task, idx) => (
              <li key={task.id} className="flex items-center space-x-1">
                <div className="w-4">
                  {idx === state.cursorPosition ? (
                    <div className="dark:text-white dark:data-[slot=icon]:*:fill-zinc-400 data-[slot=icon]:*:fill-zinc-500">
                      <ChevronRightIcon data-slot="icon" className="w-4" />
                    </div>
                  ) : null}
                </div>
                <StandaloneTask
                  fullPath
                  task={task}
                  onChange={onChange}
                  isSelected={state.selectedItemIds.includes(task.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
