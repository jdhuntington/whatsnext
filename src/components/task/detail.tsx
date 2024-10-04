import { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { TaskId, TaskSet } from "../../types";

export const Detail: React.FC = () => {
  const docUrl = useAppSelector((s) => s.configuration.documentId);
  if (!docUrl) {
    return null;
  }
  return <DetailInner docUrl={docUrl} />;
};

interface Props {
  docUrl: AutomergeUrl;
}
const DetailInner: React.FC<Props> = (props) => {
  const { docUrl } = props;
  const [doc] = useDocument<TaskSet>(docUrl);
  const { taskId } = useParams<{ taskId: TaskId }>();
  if (!doc || !taskId || !doc.tasks[taskId]) {
    return null;
  }
  const task = doc.tasks[taskId];

  return <pre>{JSON.stringify(task, null, 2)}</pre>;
};
