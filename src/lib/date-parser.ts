import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  IsoDate,
  LocalDate,
  OptionalIsoDate,
  OptionalLocalDate,
  OptionalUtcDate,
  UtcDate,
} from "../types";

dayjs.extend(utc);
dayjs.extend(timezone);
const userTimezone = dayjs.tz.guess();

export const parseDate = (input: string, now: Dayjs = dayjs()): LocalDate => {
  if (input.startsWith("+")) {
    const match = input.match(/^\+(\d+)(\D+)$/);
    if (!match) {
      throw new Error(`Invalid date string: ${input}`);
    }
    const [, amount, unit] = match;
    return utcToLocal(
      now.add(Number(amount), unit as dayjs.ManipulateType) as UtcDate
    );
  }
  throw new Error(`Invalid date string: ${input}`);
};

export const utcToLocal = (utcDate: UtcDate): LocalDate => {
  return utcDate.tz(userTimezone) as LocalDate;
};

export const localToUtc = (localDate: LocalDate): UtcDate =>
  localDate.utc() as UtcDate;

export const now = (): LocalDate => utcToLocal(dayjs() as UtcDate);

export const formattedDate = (date: LocalDate): string =>
  date.format("YYYY-MM-DD HH:mm");

export const toOptionalIsoDate = (
  date: OptionalLocalDate | OptionalUtcDate
): OptionalIsoDate => (date ? (date.toISOString() as OptionalIsoDate) : null);

export const toIsoDate = (date: LocalDate | UtcDate): IsoDate =>
  date.toISOString() as IsoDate;

export const parseOptionalIsoDate = (
  input: OptionalIsoDate
): OptionalLocalDate => (input ? utcToLocal(dayjs(input) as UtcDate) : null);

export const parseIsoDate = (input: IsoDate): LocalDate =>
  utcToLocal(dayjs(input) as UtcDate);
