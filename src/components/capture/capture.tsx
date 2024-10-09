import { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { TaskSet } from "./../../types";
import { useCallback, useEffect, useRef, useState } from "react";
import { Task } from "./../../lib/models/task";
import { Button } from "../ng-ui/button";
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
  const hide = useCallback(() => {
    setCaptureText("");
    setShowCapture(false);
    document.body.focus();
  }, [setCaptureText, setShowCapture]);
  const handleSubmit = useCallback(() => {
    addNewTask(captureText);
    hide();
  }, [addNewTask, captureText, hide]);

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

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
      if (event.key === "Escape") {
        hide();
      }
    },
    [handleSubmit, hide]
  );

  if (!shouldShowCapture) {
    return null;
  }
  return (
    <div className="flex items-center gap-1 lg:gap-2">
      <Input
        onKeyDown={handleKeyDown}
        ref={inputRef}
        type="text"
        value={captureText}
        onChange={(e) => setCaptureText(e.target.value)}
      />
      <Button onClick={handleSubmit}>Add</Button>
      <Button outline onClick={hide}>
        Cancel
      </Button>
    </div>
  );
};
