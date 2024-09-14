import { Outlet } from "react-router-dom";
import { Navigation } from "../navigation/nagivation";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import { Capture } from "../capture/capture";

export const Shell: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-0 justify-between items-center bg-emerald-500 p-1 lg:px-4 lg:py-2">
        <div className="flex items-center space-x-2 lg:space-x-8">
          <div className="flex items-center space-x-2 text-white">
            <ChatBubbleBottomCenterTextIcon className="w-7 h-7" />
            <h1 className="font-bold text-2xl tracking-narrow">
              What&apos;s Next?
            </h1>
          </div>
          <Navigation />
        </div>
        <div />
      </div>
      <Capture />
      <div className="flex-grow flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};
