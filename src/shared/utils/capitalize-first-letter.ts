export const capitalizeFirstLetter = (text: string): string => {
  if (text.length === 0) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
};
