import { sompoApiWithoutToken } from '@/shared/config/api';

type CriticalSegment = {
  segment_index: number;
  latitude: number;
  longitude: number;
  risk_level: number;
  risk_percentage: number;
};

type RouteRiskResponse = {
  risk_score: number;
  base_risk: number;
  cargo_factor: number;
  cargo_type: string;
  spatial_risk_avg: number;
  spatial_risk_max: number;
  temporal_multiplier: number;
  risk_category: 'BAIXO' | 'MÉDIO' | 'ALTO' | 'CRÍTICO';
  critical_segments: CriticalSegment[];
  route_length_km: number;
  departure_datetime: string;
};

type Props = {
  route: (number)[][];
  expected_hour: number;
  weekday: number;
  cargo_type: string;
};

export const assessRiskOnRoute = async ({
  route,
  expected_hour,
  weekday,
  cargo_type
}: Props): Promise<RouteRiskResponse> => {
  const response = await sompoApiWithoutToken.post<RouteRiskResponse>('/risk/route/assessment', {
    route,
    expected_hour,
    weekday,
    cargo_type,
  });

  return response.data;
};
