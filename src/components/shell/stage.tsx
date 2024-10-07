interface ChildrenProps {
  children?: React.ReactNode;
}

export const Stage: React.FC<ChildrenProps> = ({ children }) => {
  return <div>{children}</div>;
};

export const StageHeader: React.FC<ChildrenProps> = ({ children }) => {
  return <div>{children}</div>;
};

export const StageContent: React.FC<ChildrenProps> = ({ children }) => {
  return <div>{children}</div>;
};
