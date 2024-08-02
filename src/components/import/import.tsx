import { ChangeFn } from "@automerge/automerge";
import { TaskSet } from "../../types";
import { useState } from "react";

interface Props {
  changeDoc: (fn: ChangeFn<TaskSet>) => void;
}

export const Import: React.FC<Props> = (props) => {
  const { changeDoc } = props;
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    changeDoc((doc) => {
      doc.tasks = JSON.parse(inputValue);
    });
    setInputValue("");
    setVisible(false);
  };
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
          Import
        </a>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="space-y-2">
      <div>
        <textarea
          rows={50}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="rounded bg-gray-100 text-sm font-monospace w-full"
        />
      </div>
      <div>
        <button>Import</button>
      </div>
      <div>
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
    </form>
  );
};
