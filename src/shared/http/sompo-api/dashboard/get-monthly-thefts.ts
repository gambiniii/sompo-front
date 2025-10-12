import { sompoApiWithoutToken } from '@/shared/config/api';

export interface MonthlyCargoTheft {
  month: string;
  count: number;
}

export const getMonthlyThefts = async (): Promise<MonthlyCargoTheft[]> => {
  const { data } = await sompoApiWithoutToken.get<MonthlyCargoTheft[]>(
    `/cargo_thefts/summary/monthly`,
  );
  return data;
};
