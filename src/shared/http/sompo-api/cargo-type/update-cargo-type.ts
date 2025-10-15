import { sompoApiWithoutToken } from "@/shared/config/api";
import { CargoType, CargoTypeUpdate } from "@/shared/interfaces/areas/cargo-type.interface";

export const updateCargoType = async (id: number, data: CargoTypeUpdate): Promise<CargoType> => {
  const response = await sompoApiWithoutToken.put<CargoType>(`/cargo_types/${id}`, data);
  return response.data;
};
