import { Outlet } from "react-router-dom";
import { Navigation } from "../navigation/nagivation";
import { Provider } from "react-redux";
import { store } from "../../store";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";

export const Shell: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="space-y-1 p-1">
        <div className="flex justify-between items-center bg-emerald-500 p-1 -m-1">
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
        <Outlet />
      </div>
    </Provider>
  );
};
