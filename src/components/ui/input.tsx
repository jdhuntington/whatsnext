import React from "react";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, className, ...rest } = props;
  return (
    <input
      type={type ?? "text"}
      ref={ref}
      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-emerald-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
      {...rest}
    />
  );
});

Input.displayName = "Input";
export { Input };
