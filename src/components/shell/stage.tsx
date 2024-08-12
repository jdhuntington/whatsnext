interface ChildrenProps {
  children: React.ReactNode;
}

export const Stage: React.FC<ChildrenProps> = ({ children }) => {
  return <div className="flex-grow flex flex-col">{children}</div>;
};

export const StageHeader: React.FC<ChildrenProps> = ({ children }) => {
  return (
    <div className="bg-white border-b border-gray-300 flex-0 p-1 lg:px-4 lg:py-2">
      {children}
    </div>
  );
};

export const StageContent: React.FC<ChildrenProps> = ({ children }) => {
  return <div className="p-1 bg-gray-100 flex-grow">{children}</div>;
};
