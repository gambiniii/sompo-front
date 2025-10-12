import { sompoApiWithoutToken } from '@/shared/config/api';

export interface H3Cell {
  h3_id: string;
  count: number;
  intensity: number;
  type: string;
}

export interface H3HeatmapResponse {
  cells: H3Cell[];
  total_cells: number;
  total_points: number;
  resolution: number;
}

export const getAccidentsHeatmap = async (limit: number = 10000): Promise<H3HeatmapResponse> => {
  const response = await sompoApiWithoutToken.get<H3HeatmapResponse>(
    `/cargo_accidents/heatmap?limit=${limit}`,
  );

  return response.data;
};
