import { NavLink } from "react-router-dom";

const InternalNavLink: React.FC<{
  to: string;
  children: React.ReactNode;
}> = ({ to, children }) => {
  return (
    <li>
      <NavLink
        className={(cb) =>
          `py-1 px-3 rounded-full hover:bg-emerald-800 hover:text-white hover:shadow text-sm ${cb.isActive ? "shadow-inner bg-emerald-200 text-emerald-900" : "bg-emerald-600 text-emerald-100"}`
        }
        to={to}
      >
        {children}
      </NavLink>
    </li>
  );
};

export const Navigation: React.FC = () => {
  return (
    <ul className="flex space-x-2 items-center">
      <InternalNavLink to="/">Home</InternalNavLink>
      <InternalNavLink to="/wn">What&apos;s Next?</InternalNavLink>
      <InternalNavLink to="/fix">Needs Attention</InternalNavLink>
      <InternalNavLink to="/debug">Debug</InternalNavLink>
      <InternalNavLink to="/settings">Settings</InternalNavLink>
    </ul>
  );
};
