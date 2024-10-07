import { TaskMode } from "../../types";
import { Badge } from "../ng-ui/badge";

export const TaskModeIndicator: React.FC<{ mode: TaskMode }> = ({ mode }) => {
  if (mode === "serial") {
    return <Badge>serial</Badge>;
  }
  if (mode === "parallel") {
    return <Badge>parallel</Badge>;
  }
  const _exhaustiveCheck: never = mode;
  throw new Error(`Unhandled mode: ${_exhaustiveCheck}`);
};
