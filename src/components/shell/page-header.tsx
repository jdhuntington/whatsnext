import React from "react";

type PageHeaderProps = React.PropsWithChildren;

export const PageHeader: React.FC<PageHeaderProps> = (props) => {
  return (
    <header className="flex items-end justify-between gap-4">
      {props.children}
    </header>
  );
};
