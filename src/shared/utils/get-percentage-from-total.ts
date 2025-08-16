export const getPercentageFromTotal = (
  partial: number,
  total: number
): number => {
  return Number(((partial / total) * 100).toFixed(2));
};
