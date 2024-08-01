import { useCallback, useMemo, useState } from "react";
import { genId, Tag } from "../../types";

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
  const addTagCallback = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onAddTag(inputValue as Tag);
      setInputValue("");
    },
    [inputValue, onAddTag]
  );
  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {selectedTags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              if (selectedTags.includes(tag)) {
                onRemoveTag(tag);
              }
            }}
            className={`px-2 py-1 rounded-full ${
              selectedTags.includes(tag)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div>
        <form onSubmit={addTagCallback}>
          <input
            type="text"
            placeholder="add tag"
            list={myListId}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <datalist id={myListId}>
            {allTags.map((tag) =>
              selectedTags.includes(tag) ? null : (
                <option key={tag} value={tag} />
              )
            )}
          </datalist>
        </form>
      </div>
    </div>
  );
};
