import React from "react";

export const baseClasses =
  "inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400 disabled:text-gray-200";

export const primaryClasses =
  "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500";

export const defaultClasses =
  "text-gray-800 bg-gray-200 hover:bg-gray-300 hover:text-black focus:ring-gray-500";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }
>((props, ref) => {
  const { primary, className, ...rest } = props;
  const extendedClassName = `${className ?? ""} ${baseClasses} ${primary ? primaryClasses : defaultClasses}`;
  return <button ref={ref} className={extendedClassName} {...rest} />;
});

Button.displayName = "Button";
export { Button };

type IconProps = {
  className?: string;
};

const IconButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.ComponentType<IconProps>;
  }
>((props, ref) => {
  const { icon: Icon, ...rest } = props;
  return (
    <button
      ref={ref}
      {...rest}
      className="w-4 h-4 text-gray-800 bg-gray-200 hover:text-black hover:bg-gray-400 rounded"
    >
      <Icon />
    </button>
  );
});

IconButton.displayName = "IconButton";
export { IconButton };
