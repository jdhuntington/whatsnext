import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { isValidAutomergeUrl, Repo } from "@automerge/automerge-repo";
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

const repo = new Repo({
  network: [
    new BroadcastChannelNetworkAdapter(),
    new BrowserWebSocketClientAdapter("ws://localhost:6010"),
  ],
  storage: new IndexedDBStorageAdapter(),
});

const rootDocUrl = `${document.location.hash.substring(1)}`;
let handle;
if (isValidAutomergeUrl(rootDocUrl)) {
  handle = repo.find(rootDocUrl);
} else {
  handle = repo.create<TaskSet>();
  handle.change((d) => {
    d.tasks = {
      [universalRootTask.id]: universalRootTask.serialize(),
    };
  });
}
const docUrl = (document.location.hash = handle.url);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Shell />,
    children: [
      { path: "/", element: <App docUrl={docUrl} /> },
      { path: "/wn", element: <NextActions docUrl={docUrl} /> },
      { path: "/debug", element: <Debug /> },
      { path: "/settings", element: <Settings docUrl={docUrl} /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RepoContext.Provider value={repo}>
      <RouterProvider router={router} />
    </RepoContext.Provider>
  </React.StrictMode>
);
