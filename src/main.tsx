import React from "react";
import ReactDOM from "react-dom/client";
import { BroadcastChannelNetworkAdapter } from "@automerge/automerge-repo-network-broadcastchannel";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import "./index.css";
import { TaskSet } from "./types.ts";
import { universalRootTask } from "./lib/models/task.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Debug } from "./components/debug/debug.tsx";
import { NextActions } from "./components/next-actions/next-actions.tsx";
import { Shell } from "./components/shell/shell.tsx";
import { Settings } from "./components/settings/settings.tsx";
import { Provider } from "react-redux";
import { persistedStore, store } from "./store.ts";
import { configurationSlice } from "./features/configuration.ts";
import { Home } from "./components/home/home.tsx";
import { Repo } from "@automerge/automerge-repo";
import { PersistGate } from "redux-persist/integration/react";
import { EventMediator } from "./components/event-mediator/event-mediator.tsx";
import { NeedsAttention } from "./components/needs-attention/needs-attention.tsx";

const repo = new Repo({
  network: [
    new BroadcastChannelNetworkAdapter(),
    new BrowserWebSocketClientAdapter("ws://localhost:6010"),
  ],
  storage: new IndexedDBStorageAdapter(),
});

const buildInitialDoc = () => {
  const handle = repo.create<TaskSet>();
  handle.change((d) => {
    d.tasks = {
      [universalRootTask.id]: universalRootTask.serialize(),
    };
  });
  return handle;
};

const persistInitialDocument = () => {
  const state = store.getState();
  if (!state.configuration.documentId) {
    const newDoc = buildInitialDoc();
    store.dispatch(configurationSlice.actions.setDocId(newDoc.url));
  }
};
store.subscribe(persistInitialDocument);
persistInitialDocument();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Shell />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/wn", element: <NextActions /> },
      { path: "/fix", element: <NeedsAttention /> },
      { path: "/debug", element: <Debug /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <EventMediator />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <RepoContext.Provider value={repo}>
          <RouterProvider router={router} />
        </RepoContext.Provider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
