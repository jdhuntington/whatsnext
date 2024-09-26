type ClassNameSegment = string | [string, boolean];

export const classNames = (classNameSegments: ClassNameSegment[]): string => {
  return classNameSegments
    .map((segment) => {
      if (Array.isArray(segment)) {
        return segment[1] ? segment[0] : "";
      }
      return segment;
    })
    .join(" ");
};
