import { sompoApiWithoutToken } from '@/shared/config/api';

export interface CargoTheft {
  id: number;
  date: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  cargo_type?: string;
  estimated_loss?: number;
}

export const getThefts = async (limit = 100) => {
  const { data } = await sompoApiWithoutToken.get<CargoTheft[]>(`/cargo_thefts?limit=${limit}`);
  return data;
};
