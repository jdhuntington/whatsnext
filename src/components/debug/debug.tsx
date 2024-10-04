import { memo, useEffect, useState } from "react";
import { useRootTask } from "../../hooks";
import { ClearCompleted } from "../clear/clear";
import { Checkbox } from "../ng-ui/checkbox";
import { Input } from "../ng-ui/input";
import {
  Stage,
  StageContent,
  StageHeader,
} from "./../../components/shell/stage";
import { IsoDate, TaskSet } from "./../../types";

type changeFn = (fn: (d: TaskSet) => void) => void;

export const Debug: React.FC = () => {
  const [doc, changeDoc] = useRootTask();
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount((c) => c + 1);
  }, [changeDoc]);

  return (
    <Stage>
      <StageHeader>
        <div className="flex space-x-4 items-center">
          <ClearCompleted />
          <h1 className="font-bold ">{count}</h1>
        </div>
      </StageHeader>
      <StageContent>
        {Object.values(doc?.tasks ?? {}).map((task) => (
          <MemoizedDebugTask task={task} changeDoc={changeDoc} key={task.id} />
        ))}
      </StageContent>
    </Stage>
  );
};

const DebugTask: React.FC<{
  task: TaskSet["tasks"][string];
  changeDoc: changeFn;
}> = (props) => {
  const { task, changeDoc } = props;
  const [name, setName] = useState(task.name);
  const [tags, setTags] = useState(task.tags);
  const [parentId, setParentId] = useState(task.parentId);
  const [completed, setCompleted] = useState(task.completedAt);

  const updateTask = () => {
    changeDoc((d) => {
      d.tasks[task.id].name = name;
      d.tasks[task.id].tags = tags;
      d.tasks[task.id].parentId = parentId;
      d.tasks[task.id].completedAt = completed;
    });
  };

  return (
    <div className="space-y-1">
      <div className="flex space-x-4 items-center">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={updateTask}
        />
        <Input
          type="text"
          value={tags.join(", ")}
          onChange={(e) => setTags(e.target.value.split(","))}
          onBlur={updateTask}
        />
        <Input
          type="text"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          onBlur={updateTask}
        />
        <Checkbox
          checked={!!completed}
          onChange={(e) => {
            console.log("click", e);
            setCompleted(e ? (new Date().toISOString() as IsoDate) : null);
          }}
          onBlur={updateTask}
        />
      </div>
      <pre className="text-xs">{JSON.stringify(task, null, 2)}</pre>
    </div>
  );
};

const MemoizedDebugTask = memo(DebugTask);
