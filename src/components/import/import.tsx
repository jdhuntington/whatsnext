import { ChangeFn } from "@automerge/automerge";
import { TaskSet } from "../../types";
import { useState } from "react";
import { Task } from "../../lib/models/task";

interface Props {
  changeDoc: (fn: ChangeFn<TaskSet>) => void;
  addTask: (task: Task) => void;
}

export const Import: React.FC<Props> = (props) => {
  const { changeDoc, addTask } = props;
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [lineByLine, setLineByLine] = useState(false);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lineByLine) {
      inputValue
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => {
          const task = new Task();
          task.name = line;
          return task;
        })
        .forEach((task) => addTask(task));
      setInputValue("");
      setVisible(false);
    } else {
      changeDoc((doc) => {
        doc.tasks = JSON.parse(inputValue);
      });
      setInputValue("");
      setVisible(false);
    }
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
        <label>
          <input
            type="checkbox"
            checked={lineByLine}
            onChange={(e) => setLineByLine(e.target.checked)}
          />
          Line by line
        </label>
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
