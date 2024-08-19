import { useCallback, useState } from "react";
import { Stage, StageContent, StageHeader } from "../shell/stage";
import { RelativeDateInput } from "../ui/relative-date-input";
import dayjs, { Dayjs } from "dayjs";

export const Debug: React.FC = () => {
  const [upstreamValue, setUpstreamValue] = useState<Dayjs | null>(dayjs());
  const [messages, setMessages] = useState<string[]>([]);
  const addMessage = useCallback((message: string) => {
    setMessages((m) => [...m, message]);
  }, []);
  const onChangeComplete = useCallback(
    (d: Dayjs | null) => {
      addMessage(`OnComplete: ${d ? d.toISOString() : "null"}`);
      setUpstreamValue(d);
    },
    [addMessage, setUpstreamValue]
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
          <li>
            <pre>{JSON.stringify({ upstreamValue }, null, 2)}</pre>
          </li>
          {messages.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </StageContent>
    </Stage>
  );
};
