import React from "react";

export const primaryClasses =
  "twoverride inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 " +
  "hover:bg-indigo-700 " +
  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:text-gray-200";

const PrimaryButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  const { className, ...rest } = props;
  const extendedClassName = `${className ?? ""} ${primaryClasses}`;
  return <button ref={ref} className={extendedClassName} {...rest} />;
});

PrimaryButton.displayName = "PrimaryButton";
export { PrimaryButton };
