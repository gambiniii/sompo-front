import { sompoApiWithoutToken } from '@/shared/config/api';

export interface MonthlyAccident {
  month: string;
  count: number;
}

export const getMonthlyAccidents = async (): Promise<MonthlyAccident[]> => {
  const { data } = await sompoApiWithoutToken.get<MonthlyAccident[]>(
    `/cargo_accidents/monthly_summary`,
  );
  return data;
};
