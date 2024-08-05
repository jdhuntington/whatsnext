import { Outlet } from "react-router-dom";
import { Navigation } from "../navigation/nagivation";

export const Shell: React.FC = () => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <h1>Shell</h1>
        <Navigation />
        <div />
      </div>
      <Outlet />
    </div>
  );
};
