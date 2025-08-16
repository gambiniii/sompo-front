export const reduceText = (
  text: string,
  limit: number,
  unavailableMessage: string
): string => {
  if (text) return text.length > limit ? text.slice(0, limit) + "..." : text;
  return unavailableMessage;
};
