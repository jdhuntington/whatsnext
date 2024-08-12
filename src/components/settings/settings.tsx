import { Export } from "../export/export";
import { Import } from "../import/import";
import { Stage, StageContent, StageHeader } from "../shell/stage";
import { useAppSelector } from "../../hooks";
import { UpdateDocument } from "./update-document";

export const Settings: React.FC = () => {
  const docUrl = useAppSelector((s) => s.configuration.documentId);

  return (
    <Stage>
      <StageHeader>
        <div className="flex space-x-4 items-center">
          {docUrl ? <Export docUrl={docUrl} /> : null}
        </div>
      </StageHeader>
      <StageContent>
        <div className="space-y-2">
          <UpdateDocument />
          {docUrl ? <Import docUrl={docUrl} /> : null}
        </div>
      </StageContent>
    </Stage>
  );
};
