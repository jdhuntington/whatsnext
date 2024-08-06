import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AutomergeDocId } from "../types";

interface ConfigurationState {
  documentId: AutomergeDocId | null;
}

const initialState: ConfigurationState = {
  documentId: null,
};

export const configurationSlice = createSlice({
  name: "configuration",
  initialState,
  reducers: {
    setDocId: (state, action: PayloadAction<AutomergeDocId>) => {
      state.documentId = action.payload;
    },
  },
});
