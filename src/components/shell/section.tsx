interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<Props> = (props) => {
  return <section>{props.children}</section>;
};
