import { sompoApiWithoutToken } from "@/shared/config/api";
import { CargoType, CargoTypeCreate } from "@/shared/interfaces/areas/cargo-type.interface";

export const createCargoType = async (data: CargoTypeCreate): Promise<CargoType> => {
  const response = await sompoApiWithoutToken.post<CargoType>('/cargo_types', data);
  return response.data;
};
