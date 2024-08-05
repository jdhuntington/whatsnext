import { Outlet } from "react-router-dom";
import { Navigation } from "../navigation/nagivation";

export const Shell: React.FC = () => {
  return (
    <div className="space-y-1 p-1">
      <div className="flex justify-between items-center border-b border-indigo-200 border-solid p-1 -m-1">
        <h1 className="font-mono font-bold uppercase text-xs tracking-wide">
          What&apos;s Next?
        </h1>
        <Navigation />
        <div />
      </div>
      <Outlet />
    </div>
  );
};
