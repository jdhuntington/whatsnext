import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AutomergeUrl } from "@automerge/automerge-repo";

interface ConfigurationState {
  documentId: AutomergeUrl | null;
}

const initialState: ConfigurationState = {
  documentId: null,
};

export const configurationSlice = createSlice({
  name: "configuration",
  initialState,
  reducers: {
    setDocId: (state, action: PayloadAction<AutomergeUrl>) => {
      state.documentId = action.payload;
    },
  },
});
