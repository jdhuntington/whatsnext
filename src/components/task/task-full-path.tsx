import { Fragment, useMemo } from "react";
import { Task } from "../../lib/models/task";

interface Props {
  task: Task;
}

export const TaskFullPath: React.FC<Props> = (props) => {
  const { task } = props;
  const filteredAncestors = useMemo(
    () => task.ancestors.filter((t) => !t.isRoot),
    [task],
  );
  return (
    <div className="space-x-1 flex items-center">
      {filteredAncestors.map((ancestor, index) => (
        <Fragment key={ancestor.id}>
          <div key={ancestor.id}>{ancestor.name}</div>
          {index < filteredAncestors.length - 1 && (
            <div
              className="text-gray-400 text-sm"
              key={`${ancestor.id}-separator `}
            >
              /
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};
