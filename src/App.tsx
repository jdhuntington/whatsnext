import { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument, useRepo } from "@automerge/automerge-repo-react-hooks";
import { Tag, TaskSet, UUID } from "./types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
import { Task } from "./lib/models/task";
import { PrimaryButton } from "./components/ui/button";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TaskList } from "./components/task/list";
import { Export } from "./components/export/export";
import { Import } from "./components/import/import";

function App({ docUrl }: { docUrl: AutomergeUrl }) {
  const [doc, changeDoc] = useDocument<TaskSet>(docUrl);
  const repo = useRepo();
  const [docChangedCount, setDocChangedCount] = useState(0);
  useEffect(() => {
    setDocChangedCount((c) => c + 1);
  }, [doc]);
  const rootTask = useMemo(() => Task.deserializeTasks(doc?.tasks), [doc]);
  const addNewTask = useCallback(() => {
    const task = new Task();
    task.name = `${faker.hacker.adjective()} ${faker.hacker.noun()} ${faker.hacker.verb()} ${faker.hacker.ingverb()} ${faker.hacker.adjective()} ${faker.hacker.noun()} ${faker.hacker.verb()} ${faker.hacker.ingverb()}`;
    task.tags = [faker.hacker.verb() as Tag, faker.hacker.ingverb() as Tag];
    changeDoc((d) => {
      d.tasks[task.id] = task.serialize();
    });
  }, [changeDoc]);
  const reparent = useCallback(
    (sourceId: UUID, newParent: UUID) => {
      changeDoc((d) => {
        d.tasks[sourceId].parentId = newParent;
      });
    },
    [changeDoc]
  );
  const reorder = useCallback(
    (sourceId: UUID, afterId: UUID) => {
      changeDoc((d) => {
        const targetTask = d.tasks[sourceId];
        const newOrderValue = d.tasks[afterId].order + 1;
        console.log("making order for", targetTask.name, "to", newOrderValue);
        Object.values(d.tasks)
          .filter(
            (t) =>
              t.parentId === targetTask.parentId && t.order >= newOrderValue
          )
          .forEach((t) => {
            console.log("incrementing order for", t.name);
            t.order += 1;
          });
        targetTask.order = newOrderValue;
      });
    },
    [changeDoc]
  );

  const onChange = useCallback(
    (taskId: UUID, values: Partial<Task>) => {
      changeDoc((d) => {
        const task = d.tasks[taskId];
        Object.assign(task, values);
      });
    },
    [changeDoc]
  );

  const [search, setSearch] = useState("");

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div className="space-y-1 p-2">
          <div className="flex space-x-1">
            <h1>
              Doc changed count: <code>{docChangedCount}</code>
            </h1>
            <pre>{JSON.stringify(repo.peers, null, 2)}</pre>
          </div>
          <div>
            <label>
              Search:
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  e.stopPropagation();
                  setSearch(e.target.value);
                }}
              />
            </label>
          </div>
          <div className="space-x-2">
            <PrimaryButton onClick={addNewTask}>Add Task</PrimaryButton>
          </div>
          <TaskList
            onChange={onChange}
            task={rootTask}
            reparent={reparent}
            reorder={reorder}
          />
        </div>
      </DndProvider>
      <Export doc={doc} />
      <Import changeDoc={changeDoc} />
    </div>
  );
}

export default App;
