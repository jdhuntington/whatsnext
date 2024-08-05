import { NavLink } from "react-router-dom";

export const Navigation: React.FC = () => {
  return (
    <ul className="flex space-x-2 items-center">
      <li>
        <NavLink
          className={(cb) =>
            `py-1 px-2 rounded font-bold hover:underline ${cb.isActive ? "bg-yellow-200 text-yellow-800" : "bg-white text-gray-800"}`
          }
          to="/"
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          className={(cb) =>
            `py-1 px-2 rounded font-bold hover:underline ${cb.isActive ? "bg-yellow-200 text-yellow-800" : "bg-white text-gray-800"}`
          }
          to="/wn"
        >
          What&apos;s Next?
        </NavLink>
      </li>
      <li>
        <NavLink
          className={(cb) =>
            `py-1 px-2 rounded font-bold hover:underline ${cb.isActive ? "bg-yellow-200 text-yellow-800" : "bg-white text-gray-800"}`
          }
          to="/debug"
        >
          Debug
        </NavLink>
      </li>
    </ul>
  );
};
