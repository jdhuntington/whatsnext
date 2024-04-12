import { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { TaskSet } from "./types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
import { Task } from "./lib/models/task";
import { PrimaryButton } from "./components/ui/button";
import { TaskShow } from "./components/task/show";

function App({ docUrl }: { docUrl: AutomergeUrl }) {
  const [doc, changeDoc] = useDocument<TaskSet>(docUrl);
  const [docChangedCount, setDocChangedCount] = useState(0);
  useEffect(() => {
    setDocChangedCount((c) => c + 1);
  }, [doc]);
  const rootTask = useMemo(() => Task.deserializeTasks(doc?.tasks), [doc]);
  const addNewTask = useCallback(() => {
    const task = new Task();
    task.name = `${faker.hacker.adjective()} ${faker.hacker.noun()} ${faker.hacker.verb()} ${faker.hacker.ingverb()} ${faker.hacker.adjective()} ${faker.hacker.noun()} ${faker.hacker.verb()} ${faker.hacker.ingverb()}`;
    task.tags = [
      faker.hacker.verb(),
      faker.hacker.ingverb(),
      faker.science.chemicalElement().symbol,
    ];
    changeDoc((d) => {
      d.tasks[task.id] = task.serialize();
    });
  }, [changeDoc]);

  return (
    <div className="space-y-1">
      <div>
        <h1>
          Doc changed count: <code>{docChangedCount}</code>
        </h1>
      </div>
      <PrimaryButton onClick={addNewTask}>Add Task</PrimaryButton>
      <TaskShow task={rootTask} />
    </div>
  );
}

export default App;
