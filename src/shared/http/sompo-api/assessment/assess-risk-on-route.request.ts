import { sompoApiWithoutToken } from '@/shared/config/api';

type Props = {
  route: (number)[][];
  expected_hour: number;
  weekday: number;
};

export const assessRiskOnRoute = async ({ route, expected_hour, weekday }: Props): Promise<any> => {
  const response = await sompoApiWithoutToken.post<any>('/risk/route/assessment', {
    route,
    expected_hour,
    weekday,
  });

  return response.data;
};
