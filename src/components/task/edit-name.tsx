import React, {
  useState,
  ChangeEvent,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { Input } from "../ng-ui/input";
import { Button } from "../ng-ui/button";

interface EditableInputProps {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

export const EditableInput: React.FC<EditableInputProps> = ({
  initialValue,
  onSave,
  onCancel,
}) => {
  const [value, setValue] = useState<string>(initialValue);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, inputRef.current.value.length);
    }
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSave = useCallback(() => {
    onSave(value);
  }, [value, onSave]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleSave();
      }
      if (event.key === "Escape") {
        onCancel();
      }
    },
    [handleSave, onCancel]
  );

  return (
    <div className="gap-1 flex items-center">
      <div className="flex-1">
        <Input
          type="text"
          ref={inputRef}
          onKeyDown={handleKeyDown}
          value={value}
          onChange={handleChange}
        />
      </div>
      <Button onClick={handleSave}>Save</Button>
      <Button outline onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
};
