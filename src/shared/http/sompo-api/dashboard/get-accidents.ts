import { sompoApiWithoutToken } from "@/shared/config/api";

// Interface ajustada conforme a entidade CargoAccidents
export interface Accident {
  id: number;
  date: string; // data do acidente
  state: string; 
  city: string;
  highway: string;
  kilometer: number;
  accident_cause: string;
  accident_type: string;
  accident_classification: string;
  day_period: string;
  road_direction: string;
  weather_condition: string;
  road_type: string;
  road_layout: string;
  land_use: string;
  people: number;
  deaths: number;
  minor_injuries: number;
  serious_injuries: number;
  unharmed: number;
  unknown: number;
  injured: number;
  vehicles: number;
  latitude: number;
  longitude: number;
}

// Função para buscar acidentes
export const getAccidents = async (limit = 100) => {
  const { data } = await sompoApiWithoutToken.get<Accident[]>(`/cargo_accidents?limit=${limit}`);
  return data;
};
