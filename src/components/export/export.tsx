import { TaskSet } from "../../types";
import { Button } from "../ui/button";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AutomergeUrl } from "@automerge/automerge-repo";

interface Props {
  docUrl: AutomergeUrl;
}

export const Export: React.FC<Props> = (props) => {
  const { docUrl } = props;
  const [doc] = useDocument<TaskSet>(docUrl);
  const handleExport = () => {
    const json = JSON.stringify(doc?.tasks, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "whatsnext.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <div>
      <Button onClick={handleExport}>Export</Button>
    </div>
  );
};
