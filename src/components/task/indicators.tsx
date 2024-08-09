import { TaskMode } from "../../types";

export const TaskModeIndicator: React.FC<{ mode: TaskMode }> = ({ mode }) => {
  if (mode === "serial") {
    return (
      <span className="inline-flex items-center rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
        serial
      </span>
    );
  }
  if (mode === "parallel") {
    return (
      <span className="inline-flex items-center rounded-md bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-700">
        parallel
      </span>
    );
  }
  const _exhaustiveCheck: never = mode;
  throw new Error(`Unhandled mode: ${_exhaustiveCheck}`);
};
