export function isNil<TType>(
  value: TType | null | undefined,
): value is null | undefined {
  return value === null || value === undefined;
}
