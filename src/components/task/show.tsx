import { Task } from "../../lib/models/task";

export function TaskShow({ task }: { task: Task }) {
  return (
    <div>
      <RenderIndividualTask task={task} />
      {task.children.length > 0 ? (
        <ul className="pl-1">
          {task.children.map((child) => (
            <li key={child.id}>
              <TaskShow task={child} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function RenderIndividualTask({ task }: { task: Task }) {
  return (
    <div>
      <h1 className="text-md">{task.name}</h1>
      <div className="flex space-x-2 items-center text-sm">
        <div>{task.createdAt}</div>
        <div>{task.tags.join(", ")}</div>
      </div>
    </div>
  );
}
