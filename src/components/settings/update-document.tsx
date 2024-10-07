import { AutomergeUrl } from "@automerge/automerge-repo";
import { useRepo } from "@automerge/automerge-repo-react-hooks";
import { useEffect, useState } from "react";
import { configurationSlice } from "../../features/configuration";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { universalRootTask } from "../../lib/models/task";
import { TaskSet } from "../../types";
import { Button } from "../ng-ui/button";
import { Field, Label } from "../ng-ui/fieldset";
import { Input } from "../ng-ui/input";

export const UpdateDocument: React.FC = () => {
  const upstreamDocUrl = useAppSelector(
    (s) => s.configuration.documentId ?? ""
  );
  const dispatch = useAppDispatch();
  const [docUrl, setDocUrl] = useState<string>(upstreamDocUrl);
  useEffect(() => {
    setDocUrl(upstreamDocUrl);
  }, [upstreamDocUrl]);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(configurationSlice.actions.setDocId(docUrl as AutomergeUrl));
  };
  const repo = useRepo();
  return (
    <>
      <Button
        onClick={() => {
          const newRepo = repo.create<TaskSet>();
          newRepo.change((d) => {
            d.tasks = {
              [universalRootTask.id]: universalRootTask.serialize(),
            };
          });
          setDocUrl(newRepo.url);
        }}
      >
        Generate new URL
      </Button>
      <form className="space-y-2" onSubmit={onSubmit}>
        <div>
          <Field>
            <Label>Document URL</Label>
            <Input value={docUrl} onChange={(e) => setDocUrl(e.target.value)} />
          </Field>
        </div>
        <div>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </>
  );
};
