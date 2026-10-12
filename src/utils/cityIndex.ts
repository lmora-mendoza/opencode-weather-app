export function nextDefaultIndexAfterRemove(
  remainingCount: number,
  defaultIndex: number | null,
  removedIndex: number,
): number | null {
  if (remainingCount === 0) return null;
  if (defaultIndex === null) return null;
  if (defaultIndex === removedIndex) return 0;
  if (defaultIndex > removedIndex) return defaultIndex - 1;
  return defaultIndex;
}
