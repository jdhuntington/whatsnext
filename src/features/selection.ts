import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TaskId } from "../types";

interface SelectionState {
  selectedTaskIds: TaskId[];
  cursorPosition: number;
}

const initialState: SelectionState = {
  selectedTaskIds: [],
  cursorPosition: 0,
};

export const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    reset: (state) => {
      state.selectedTaskIds = [];
      state.cursorPosition = 0;
    },
    cursorDown: (state) => {
      state.cursorPosition++;
    },
    cursorUp: (state) => {
      state.cursorPosition--;
    },
    toggleSelection: (state, action: PayloadAction<TaskId>) => {
      const index = state.selectedTaskIds.indexOf(action.payload);
      if (index === -1) {
        state.selectedTaskIds.push(action.payload);
      } else {
        state.selectedTaskIds.splice(index, 1);
      }
    },
  },
});
