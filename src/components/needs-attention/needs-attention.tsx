import { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useCallback, useMemo } from "react";
import { useAppSelector } from "../../hooks";
import { Task } from "../../lib/models/task";
import { TaskSet, UUID } from "../../types";
import { Section } from "../shell/section";
import { Stage, StageContent, StageHeader } from "../shell/stage";
import { StandaloneTask } from "../task/standalone";
import { TaskShow } from "../task/show";
import dayjs from "dayjs";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export const NeedsAttention: React.FC = () => {
  const docUrl = useAppSelector((s) => s.configuration.documentId);
  if (!docUrl) {
    return null;
  }
  return <NeedsAttentionInner docUrl={docUrl} />;
};

interface Props {
  docUrl: AutomergeUrl;
}
const epoch = dayjs("1970-01-01");

const NeedsAttentionInner: React.FC<Props> = (props) => {
  const { docUrl } = props;
  const [doc, changeDoc] = useDocument<TaskSet>(docUrl);
  const rootTask = useMemo(() => Task.deserializeTasks(doc?.tasks), [doc]);
  const addTask = useCallback(
    (task: Task) => {
      changeDoc((d) => {
        d.tasks[task.id] = task.serialize();
      });
    },
    [changeDoc]
  );
  const addChild = useCallback(
    (parentId: UUID) => {
      const task = new Task();
      task.name = `...`;
      task.parentId = parentId;
      addTask(task);
    },
    [addTask]
  );
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
  const noop = useCallback(() => {}, []);
  const tags = useMemo(() => rootTask.allTags, [rootTask]);
  const tasks = rootTask.needsAttention();
  return (
    <Stage>
      <StageHeader />
      <StageContent>
        <div className="space-y-1 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-2">
          <Section className="col-span-4">
            <DndProvider backend={HTML5Backend}>
              <ul>
                {tasks.map((task) => (
                  <li key={task.id}>
                    <TaskShow
                      indentLevel={0}
                      reorder={noop}
                      reparent={noop}
                      task={task}
                      onChange={onChange}
                      tags={tags}
                      addChild={addChild}
                      hideBefore={epoch}
                    />
                  </li>
                ))}
              </ul>
            </DndProvider>
          </Section>
        </div>
      </StageContent>
    </Stage>
  );
};
