import React from "react";

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, className, ...rest } = props;
  return (
    <input
      type="checkbox"
      ref={ref}
      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
      {...rest}
    />
  );
});

Checkbox.displayName = "Checkbox";
export { Checkbox };
