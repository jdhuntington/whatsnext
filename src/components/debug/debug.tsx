import { useState } from "react";
import { Tags } from "../tags/tags";
import { Tag } from "../../types";

export const Debug: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>(["foo" as Tag, "bar" as Tag]);
  const addMessage = (message: string) => {
    setMessages([...messages, message]);
  };
  return (
    <div>
      <h1 className="text-xl">Debug</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addMessage("Submitted form");
        }}
      >
        <Tags
          onAddTag={(t) => addMessage(`Added tag ${t}`)}
          onRemoveTag={(t) => addMessage(`Removed tag ${t}`)}
          selectedTags={tags}
          allTags={["foo" as Tag, "bar" as Tag, "baz" as Tag]}
        />
        <ul>
          {messages.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </form>
    </div>
  );
};
