import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { TaskSet } from "./types";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useRootTask = () => {
  const docUrl = useAppSelector((s) => s.configuration.documentId);
  if (!docUrl) {
    throw new Error("No document URL found");
  }
  return useDocument<TaskSet>(docUrl);
};
