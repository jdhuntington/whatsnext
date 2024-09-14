import { memo, useEffect, useRef, useState } from "react";
import { useRootTask } from "../../hooks";
import { ClearCompleted } from "../clear/clear";
import {
  Stage,
  StageContent,
  StageHeader,
} from "./../../components/shell/stage";
import { IsoDate, TaskSet } from "./../../types";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

type changeFn = (fn: (d: TaskSet) => void) => void;

export const Debug: React.FC = () => {
  const [doc, changeDoc] = useRootTask();
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
      <StageContent>
        <EditableDiv />
        {Object.values(doc?.tasks ?? {}).map((task) => (
          <MemoizedDebugTask task={task} changeDoc={changeDoc} key={task.id} />
        ))}
      </StageContent>
    </Stage>
  );
};

function EditableDiv() {
  const [content, setContent] = useState("This is editable text");
  const divRef = useRef(null);

  // Save the cursor position before the update
  const saveSelection = () => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    return {
      startOffset: range.startOffset,
      endOffset: range.endOffset,
    };
  };

  // Restore the cursor position after the update
  const restoreSelection = (startOffset, endOffset) => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(divRef.current.childNodes[0], startOffset);
    range.setEnd(divRef.current.childNodes[0], endOffset);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleInput = () => {
    const cursorPos = saveSelection(); // Save cursor position
    const plainText = divRef.current.textContent;
    setContent(plainText);
    restoreSelection(cursorPos.startOffset, cursorPos.endOffset); // Restore cursor position
  };

  useEffect(() => {
    // Ensure cursor remains at correct position after re-renders
    if (divRef.current) {
      const contentLength = content.length;
      restoreSelection(contentLength, contentLength); // Move cursor to the end
    }
  }, [content]);

  return (
    <div
      ref={divRef}
      contentEditable
      onInput={handleInput}
      suppressContentEditableWarning={true}
    >
      {content}
    </div>
  );
}

export default EditableDiv;

const DebugTask: React.FC<{
  task: TaskSet["tasks"][string];
  changeDoc: changeFn;
}> = (props) => {
  const { task, changeDoc } = props;
  const [name, setName] = useState(task.name);
  const [tags, setTags] = useState(task.tags);
  const [parentId, setParentId] = useState(task.parentId);
  const [completed, setCompleted] = useState(task.completedAt);

  const updateTask = () => {
    changeDoc((d) => {
      d.tasks[task.id].name = name;
      d.tasks[task.id].tags = tags;
      d.tasks[task.id].parentId = parentId;
      d.tasks[task.id].completedAt = completed;
    });
  };

  return (
    <div className="space-y-1">
      <div className="flex space-x-4 items-center">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={updateTask}
        />
        <Input
          type="text"
          value={tags.join(", ")}
          onChange={(e) => setTags(e.target.value.split(","))}
          onBlur={updateTask}
        />
        <Input
          type="text"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          onBlur={updateTask}
        />
        <Checkbox
          type="checkbox"
          checked={!!completed}
          onChange={(e) =>
            setCompleted(
              e.target.checked ? (new Date().toISOString() as IsoDate) : null
            )
          }
          onBlur={updateTask}
        />
      </div>
      <pre className="text-xs">{JSON.stringify(task, null, 2)}</pre>
    </div>
  );
};

const MemoizedDebugTask = memo(DebugTask);
