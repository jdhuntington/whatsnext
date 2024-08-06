import { configureStore } from "@reduxjs/toolkit";
import { nextActionsSlice } from "./features/next-actions";
import { configurationSlice } from "./features/configuration";

export const store = configureStore({
  reducer: {
    nextActions: nextActionsSlice.reducer,
    configuration: configurationSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
