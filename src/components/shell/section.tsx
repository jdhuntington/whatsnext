interface Props {
  children: React.ReactNode;
}

export const Section: React.FC<Props> = (props) => {
  return (
    <section className="rounded bg-white shadow p-1 lg:p-2">
      {props.children}
    </section>
  );
};
