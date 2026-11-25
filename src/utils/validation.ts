import { AppError } from "./AppError.js";

export const parseEnum = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  field: string,
): T => {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new AppError(`not vaild data`);
  }

  return value as T;
};

export const parseDate = (
  value: unknown,
  field: string,
  boundary: "start" | "end",
): Date => {
  if (typeof value !== "string") {
    throw new AppError(`${field} must be a valid date`);
  }

  let dateString = value;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    dateString += boundary === "start" ? "T00:00:00.000Z" : "T23:59:59.999Z";
  } else if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/.test(
      value,
    )
  ) {
    throw new AppError(`${field} must be a valid date`);
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(`${field} must be a valid date`);
  }

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new AppError(`${field} must be a valid date`);
  }

  return date;
};
