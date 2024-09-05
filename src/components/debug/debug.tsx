import { useEffect, useState } from "react";
import { useRootTask } from "../../hooks";
import { ClearCompleted } from "../clear/clear";
import { Stage, StageHeader } from "./../../components/shell/stage";
import { TaskSet } from "./../../types";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";

type changeFn = (fn: (d: TaskSet) => void) => void;

export const Debug: React.FC = () => {
  const [doc, changeDoc] = useDocument<TaskSet>(
    "automerge:8uoqTxieeMd6rAvJSjcJfvR6Z1A" as AnyDocumentId
  );
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
    </Stage>
  );
};
