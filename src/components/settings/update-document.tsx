import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Section } from "../shell/section";
import { Button } from "../ui/button";
import { configurationSlice } from "../../features/configuration";
import { AutomergeUrl } from "@automerge/automerge-repo";
import { Input } from "../ui/input";

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
  return (
    <Section>
      <form className="space-y-2" onSubmit={onSubmit}>
        <div>
          <label>
            Document URL
            <br />
            <Input value={docUrl} onChange={(e) => setDocUrl(e.target.value)} />
          </label>
        </div>
        <div>
          <Button primary>Save</Button>
        </div>
      </form>
    </Section>
  );
};
