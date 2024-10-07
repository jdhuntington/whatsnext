import { useCallback, useMemo, useState } from "react";
import { genId, Tag, TaskSet } from "../../types";
import { Input } from "../ng-ui/input";
import { useAppSelector } from "../../hooks";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { Code } from "../ng-ui/text";

interface Props {
  selectedTags: Tag[];
  onAddTag: (tag: Tag) => void;
  onRemoveTag: (tag: Tag) => void;
}

export const Tags = ({ selectedTags, onAddTag, onRemoveTag }: Props) => {
  const myListId = useMemo(() => genId(), []);
  const [inputValue, setInputValue] = useState("");
  const addTagCallback = useCallback(() => {
    if (inputValue.trim() !== "") {
      onAddTag(inputValue as Tag);
      setInputValue("");
    }
  }, [inputValue, onAddTag]);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTagCallback();
      }
    },
    [addTagCallback]
  );
  const allTags = useAllTags();
  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {selectedTags.map((tag) => (
          <div
            key={tag}
            className={`px-4 py-1 text-sm rounded-full bg-emerald-500 text-white flex items-center space-x-2`}
          >
            <div>{tag}</div>
            <button onClick={() => onRemoveTag(tag)}>x</button>
          </div>
        ))}
      </div>
      <div>
        <Input
          onKeyDown={handleKeyDown}
          placeholder="add tag"
          list={myListId}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <datalist id={myListId}>
          {allTags.map((tag) =>
            selectedTags.includes(tag) ? null : <option key={tag} value={tag} />
          )}
        </datalist>
        <Code>{JSON.stringify(allTags, null, 2)}</Code>
      </div>
    </div>
  );
};

const useAllTags = () => {
  const docUrl = useAppSelector((s) => s.configuration.documentId);
  const [doc] = useDocument<TaskSet>(docUrl!); // the `!` isn't actually correct, but it works through testing when docUrl is null
  return useMemo(() => {
    if (!doc) {
      return [];
    }
    const allTags = new Set<Tag>();
    Object.values(doc.tasks).forEach((task) => {
      task.tags.forEach((tag) => allTags.add(tag as Tag));
    });
    return Array.from(allTags).sort((a, b) =>
      a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())
    );
  }, [doc]);
};
