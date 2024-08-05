import { Doc } from "@automerge/automerge";
import { TaskSet } from "../../types";

interface Props {
  doc?: Doc<TaskSet>;
}

export const Export: React.FC<Props> = (props) => {
  const { doc } = props;
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
      <button onClick={handleExport}>Export</button>
    </div>
  );
};
