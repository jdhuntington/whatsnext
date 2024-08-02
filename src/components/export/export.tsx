import { Doc } from "@automerge/automerge";
import { TaskSet } from "../../types";
import { useState } from "react";

interface Props {
  doc?: Doc<TaskSet>;
}

export const Export: React.FC<Props> = (props) => {
  const { doc } = props;
  const [visible, setVisible] = useState(false);
  if (!visible) {
    return (
      <div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setVisible(true);
          }}
        >
          Export
        </a>
      </div>
    );
  }
  return (
    <div>
      <pre className="p-4 text-xs bg-gray-100">
        {JSON.stringify(doc, null, 2)}
      </pre>
      <button
        className="mt-2"
        onClick={(e) => {
          e.preventDefault();
          setVisible(false);
        }}
      >
        Close
      </button>
    </div>
  );
};
