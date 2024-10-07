import { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { Tag, TaskId, TaskSet } from "../../types";
import { Heading } from "../ng-ui/heading";
import { TaskFullPath } from "./task-full-path";
import { Task } from "../../lib/models/task";
import { Button } from "../ng-ui/button";
import { useCallback, useState } from "react";
import { now, toIsoDate } from "../../lib/date-parser";
import { EditableInput } from "./edit-name";
import { Tags } from "../tags/tags";
import { Code } from "../ng-ui/text";
import { PageHeader } from "../shell/page-header";

export const Detail: React.FC = () => {
  const docUrl = useAppSelector((s) => s.configuration.documentId);
  if (!docUrl) {
    return null;
  }
  return <DetailInner docUrl={docUrl} />;
};

interface Props {
  docUrl: AutomergeUrl;
}
const DetailInner: React.FC<Props> = (props) => {
  const { docUrl } = props;
  const [doc, changeDoc] = useDocument<TaskSet>(docUrl);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const { taskId } = useParams<{ taskId: TaskId }>();

  const markComplete = useCallback(() => {
    changeDoc((d) => {
      if (!taskId) {
        return;
      }
      const targetTask = d.tasks[taskId];
      if (!targetTask) {
        return;
      }
      d.tasks[taskId].completedAt = toIsoDate(now());
    });
  }, [changeDoc, taskId]);

  const markIncomplete = useCallback(() => {
    changeDoc((d) => {
      if (!taskId) {
        return;
      }
      const targetTask = d.tasks[taskId];
      if (!targetTask) {
        return;
      }
      d.tasks[taskId].completedAt = null;
    });
  }, [changeDoc, taskId]);

  const enableNameEdit = useCallback(() => setIsEditingHeader(true), []);
  const disableNameEdit = useCallback(() => setIsEditingHeader(false), []);
  const onNameChange = useCallback(
    (value: string) => {
      changeDoc((d) => {
        if (!taskId) {
          return;
        }
        const targetTask = d.tasks[taskId];
        if (!targetTask) {
          return;
        }
        d.tasks[taskId].name = value;
      });
      disableNameEdit();
    },
    [changeDoc, taskId, disableNameEdit]
  );

  const handleAddTag = useCallback(
    (newTag: Tag) => {
      changeDoc((d) => {
        if (!taskId) {
          return;
        }
        const targetTask = d.tasks[taskId];
        if (!targetTask) {
          return;
        }
        const tags = [...d.tasks[taskId].tags, newTag];
        d.tasks[taskId].tags = tags;
      });
    },
    [changeDoc, taskId]
  );

  const handleRemoveTag = useCallback(
    (oldTag: Tag) => {
      changeDoc((d) => {
        if (!taskId) {
          return;
        }
        const targetTask = d.tasks[taskId];
        if (!targetTask) {
          return;
        }
        const tags = targetTask.tags.filter((t) => t !== oldTag);
        d.tasks[taskId].tags = tags;
      });
    },
    [changeDoc, taskId]
  );

  if (!doc || !taskId || !doc.tasks[taskId]) {
    return null;
  }
  const task = doc.tasks[taskId];
  const instantiatedTask = Task.deserializeTasks(doc.tasks, taskId);
  const isComplete = !!task.completedAt;

  return (
    <>
      <PageHeader>
        {isEditingHeader ? (
          <EditableInput
            initialValue={task.name}
            onSave={onNameChange}
            onCancel={disableNameEdit}
          />
        ) : (
          <Heading
            className="hover:bg-sky-100 dark:hover:bg-sky-800"
            onClick={enableNameEdit}
          >
            <TaskFullPath task={instantiatedTask} />
          </Heading>
        )}

        <div className="flex items-center gap-1">
          {isComplete ? (
            <Button onClick={markIncomplete}>Mark incomplete</Button>
          ) : (
            <Button onClick={markComplete}>Mark complete</Button>
          )}
        </div>
      </PageHeader>
      <div className="mt-4">
        <Tags
          selectedTags={task.tags as Tag[]}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
      </div>
      <Code>
        <pre>{JSON.stringify(task, null, 2)}</pre>
      </Code>
    </>
  );
};
