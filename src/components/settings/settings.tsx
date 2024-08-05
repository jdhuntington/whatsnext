import { AutomergeUrl } from "@automerge/automerge-repo";
import { Task } from "../../lib/models/task";
import { TaskSet } from "../../types";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useCallback } from "react";
import { Export } from "../export/export";
import { Import } from "../import/import";

interface Props {
  docUrl: AutomergeUrl;
}
export const Settings: React.FC<Props> = (props) => {
  const { docUrl } = props;
  const [doc, changeDoc] = useDocument<TaskSet>(docUrl);

  const addTask = useCallback(
    (task: Task) => {
      changeDoc((d) => {
        d.tasks[task.id] = task.serialize();
      });
    },
    [changeDoc]
  );
  return (
    <div>
      <h1>Settings</h1>
      <Export doc={doc} />
      <Import changeDoc={changeDoc} addTask={addTask} />
    </div>
  );
};
