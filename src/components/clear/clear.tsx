import { useAppDispatch } from "../../hooks";
import { Button } from "../ui/button";
import { nextActionsSlice } from "../../features/next-actions";
import { useCallback } from "react";
import dayjs from "dayjs";

export const ClearCompleted: React.FC = () => {
  const appDispatch = useAppDispatch();

  const clearCompleted = useCallback(() => {
    appDispatch(nextActionsSlice.actions.setCutoff(dayjs()));
  }, [appDispatch]);
  return <Button onClick={clearCompleted}>Clear completed items</Button>;
};
