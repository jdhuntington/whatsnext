interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<Props> = (props) => {
  const { className } = props;
  return (
    <section className={`rounded bg-white shadow p-1 lg:p-2 ${className}`}>
      {props.children}
    </section>
  );
};
