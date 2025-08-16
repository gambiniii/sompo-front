import { format } from "date-fns";

export const formatDateStringToDayMonthYear = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy");
};
