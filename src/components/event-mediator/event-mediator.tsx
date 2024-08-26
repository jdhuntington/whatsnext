import { useCallback, useEffect } from "react";
import { emit } from "../../lib/events";

export const EventMediator: React.FC = () => {
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT"
    ) {
      return;
    }
    if (e.key === "ArrowDown" || e.key === "j") {
      e.preventDefault();
      emit("moveCursorDown");
    }
    if (e.key === "ArrowUp" || e.key === "k") {
      e.preventDefault();
      emit("moveCursorUp");
    }
    if (e.key === "Space" || e.key === "x") {
      e.preventDefault();
      emit("toggleSelection");
    }
    if (e.key === "i") {
      e.preventDefault();
      emit("insertAbove");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);
  return null;
};
