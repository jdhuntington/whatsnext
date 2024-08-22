import { useCallback, useState } from "react";
import { Stage, StageContent, StageHeader } from "../shell/stage";
import { RelativeDateInput } from "../ui/relative-date-input";
import { OptionalLocalDate } from "../../types";
import { now } from "../../lib/date-parser";

export const Debug: React.FC = () => {
  const [upstreamValue, setUpstreamValue] = useState<OptionalLocalDate>(now());
  const [messages, setMessages] = useState<string[]>([]);
  const addMessage = useCallback((message: string) => {
    setMessages((m) => [...m, message]);
  }, []);
  const onChangeComplete = useCallback(
    (d: OptionalLocalDate) => {
      addMessage(`OnComplete: ${d ? d.toISOString() : "null"}`);
      setUpstreamValue(d);
    },
    [addMessage, setUpstreamValue],
  );

  return (
    <Stage>
      <StageHeader />
      <StageContent>
        <label>
          RelativeDateInput
          <br />
          <RelativeDateInput
            onChangeComplete={onChangeComplete}
            initial={upstreamValue}
          />
        </label>
        <ul>
          {messages.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </StageContent>
    </Stage>
  );
};
