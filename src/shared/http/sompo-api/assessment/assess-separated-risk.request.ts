import { sompoApiWithoutToken } from '@/shared/config/api';

type CriticalSegment = {
  segment_index: number;
  latitude: number;
  longitude: number;
  risk_level: number;
  risk_percentage: number;
};

type TheftRiskResponse = {
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

type AccidentRiskResponse = {
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
  weather_condition: string;
  weather_multiplier: number;
};

type CargoMapping = {
  theft_cargo: string;
  accident_cargo: string;
  note: string;
};

export type SeparatedRiskResponse = {
  theft_risk: TheftRiskResponse;
  accident_risk: AccidentRiskResponse;
  overall_risk_score: number;
  overall_risk_category: 'BAIXO' | 'MÉDIO' | 'ALTO' | 'CRÍTICO';
  recommendations: string[];
  cargo_mapping: CargoMapping;
};

type Props = {
  route: number[][];
  expected_hour: number;
  weekday: number;
  cargo_type: string; // Usa nomenclatura de ROUBO
  weather_condition?: string;
};

export const assessSeparatedRisk = async ({
  route,
  expected_hour,
  weekday,
  cargo_type,
  weather_condition,
}: Props): Promise<SeparatedRiskResponse> => {
  const response = await sompoApiWithoutToken.post<SeparatedRiskResponse>(
    '/separated-risk/route/assessment',
    {
      route,
      expected_hour,
      weekday,
      cargo_type,
      weather_condition,
    },
  );

  return response.data;
};
