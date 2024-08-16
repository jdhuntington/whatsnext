import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { nextActionsSlice } from "./features/next-actions";
import { configurationSlice } from "./features/configuration";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
  nextActions: nextActionsSlice.reducer,
  configuration: configurationSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistedStore = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
