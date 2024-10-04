import { useCallback, useMemo, useState } from "react";
import { genId, Tag } from "../../types";
import { Input } from "../ng-ui/input";

interface Props {
  allTags: Tag[];
  selectedTags: Tag[];
  onAddTag: (tag: Tag) => void;
  onRemoveTag: (tag: Tag) => void;
}

export const Tags = ({
  allTags,
  selectedTags,
  onAddTag,
  onRemoveTag,
}: Props) => {
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
      </div>
    </div>
  );
};
