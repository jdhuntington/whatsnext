import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import dayjs, { Dayjs } from "dayjs";
import { IsoDate } from "../types";

interface NextActionsState {
  completedItemsCutoffTime: IsoDate;
}

const initialState: NextActionsState = {
  completedItemsCutoffTime: dayjs().toISOString() as IsoDate,
};

export const nextActionsSlice = createSlice({
  name: "nextActions",
  initialState,
  reducers: {
    setCutoff: (state, action: PayloadAction<Dayjs>) => {
      state.completedItemsCutoffTime = action.payload.toISOString() as IsoDate;
    },
  },
});
