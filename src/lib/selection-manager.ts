import { useReducer, useCallback } from "react";
import { TaskId } from "../types";

type Item = {
  id: TaskId;
};

type SelectionState = {
  itemIds: TaskId[];
  selectedItemIds: TaskId[];
  cursorPosition: number;
  itemCount: number;
};

type SelectionAction<T extends Item> =
  | { type: "SET_ITEMS"; payload: T[] }
  | { type: "MOVE_CURSOR_UP" }
  | { type: "MOVE_CURSOR_DOWN" }
  | { type: "TOGGLE_SELECTION"; payload: T };

function selectionReducer<T extends Item>(
  state: SelectionState,
  action: SelectionAction<T>
): SelectionState {
  switch (action.type) {
    case "SET_ITEMS":
      return {
        ...state,
        itemIds: action.payload.map((item) => item.id),
        cursorPosition: Math.min(
          state.cursorPosition,
          action.payload.length - 1
        ),
        selectedItemIds: state.selectedItemIds.filter((item) =>
          action.payload.some((newItem) => newItem.id === item.id)
        ),
      };
    case "MOVE_CURSOR_UP":
      return {
        ...state,
        cursorPosition: Math.max(0, state.cursorPosition - 1),
      };
    case "MOVE_CURSOR_DOWN":
      return {
        ...state,
        cursorPosition: Math.min(
          state.itemIds.length - 1,
          state.cursorPosition + 1
        ),
      };
    case "TOGGLE_SELECTION": {
      const isSelected = state.selectedItemIds.some(
        (itemId) => itemId === action.payload.id
      );
      return {
        ...state,
        selectedItemIds: isSelected
          ? state.selectedItemIds.filter(
              (itemId) => itemId !== action.payload.id
            )
          : [...state.selectedItemIds, action.payload.id],
      };
    }
    default:
      return state;
  }
}

export function useSelection<T extends Item>(initialItems: T[] = []) {
  const [state, dispatch] = useReducer(selectionReducer<T>, {
    itemIds: initialItems.map((item) => item.id),
    selectedItemIds: [],
    cursorPosition: 0,
    itemCount: initialItems.length,
  });

  const setItems = useCallback((items: T[]) => {
    dispatch({ type: "SET_ITEMS", payload: items });
  }, []);

  const moveCursorUp = useCallback(() => {
    dispatch({ type: "MOVE_CURSOR_UP" });
  }, []);

  const moveCursorDown = useCallback(() => {
    dispatch({ type: "MOVE_CURSOR_DOWN" });
  }, []);

  const toggleSelection = useCallback((item: T) => {
    dispatch({ type: "TOGGLE_SELECTION", payload: item });
  }, []);

  return {
    state,
    setItems,
    moveCursorUp,
    moveCursorDown,
    toggleSelection,
  };
}