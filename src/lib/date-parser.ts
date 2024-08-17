import dayjs, { Dayjs } from "dayjs";

export const parseDate = (input: string, now: Dayjs = dayjs()): Dayjs => {
  if (input.startsWith("+")) {
    const match = input.match(/^\+(\d+)(\D+)$/);
    if (!match) {
      throw new Error(`Invalid date string: ${input}`);
    }
    const [, amount, unit] = match;
    return now.add(Number(amount), unit as dayjs.ManipulateType);
  }
  throw new Error(`Invalid date string: ${input}`);
};
