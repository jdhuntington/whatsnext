import { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { TaskSet } from "./../../types";
import { useCallback, useEffect, useRef, useState } from "react";
import { Task } from "./../../lib/models/task";
import { Button } from "./../../components/ui/button";
import { useAppSelector } from "../../hooks";
import { off, on } from "../../lib/events";
import { Input } from "../ng-ui/input";

export const Capture: React.FC = () => {
  const docUrl = useAppSelector((s) => s.configuration.documentId);
  if (!docUrl) {
    return null;
  }
  return <CaptureInner docUrl={docUrl} />;
};

const CaptureInner: React.FC<{ docUrl: AutomergeUrl }> = (props) => {
  const { docUrl } = props;
  const [, changeDoc] = useDocument<TaskSet>(docUrl);
  const addTask = useCallback(
    (task: Task) => {
      changeDoc((d) => {
        d.tasks[task.id] = task.serialize();
      });
    },
    [changeDoc]
  );
  const addNewTask = useCallback(
    (name: string) => {
      const task = new Task();
      task.name = name;
      addTask(task);
    },
    [addTask]
  );
  const [shouldShowCapture, setShowCapture] = useState(false);
  const [captureText, setCaptureText] = useState("");
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      addNewTask(captureText);
      setCaptureText("");
      setShowCapture(false);
      document.body.focus();
    },
    [addNewTask, captureText]
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const showCapture = useCallback(() => {
    setShowCapture(true);
  }, [setShowCapture]);

  useEffect(() => {
    if (shouldShowCapture) {
      inputRef.current?.focus();
    }
  }, [shouldShowCapture]);

  useEffect(() => {
    on("insertAbove", showCapture);
    return () => off("insertAbove", showCapture);
  }, [showCapture]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`${shouldShowCapture ? "block" : "hidden"}`}
    >
      <Input
        ref={inputRef}
        type="text"
        value={captureText}
        onChange={(e) => setCaptureText(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
};
