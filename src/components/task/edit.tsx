import { Task } from "../../lib/models/task";

export function TaskEdit({
  task,
  onChange,
}: {
  task: Task;
  onChange: (task: Task) => void;
}) {
  return (
    <div>
      <label>
        Name
        <input
          type="text"
          value={task.name}
          onChange={(e) => onChange({ ...task, name: e.target.value })}
        />
      </label>
      <label>
        Tags
        <input
          type="text"
          value={task.tags.join(",")}
          onChange={(e) =>
            onChange({ ...task, tags: e.target.value.split(",") })
          }
        />
      </label>
    </div>
  );
}
