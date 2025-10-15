import { sompoApiWithoutToken } from "@/shared/config/api";
import { CargoType } from "@/shared/interfaces/areas/cargo-type.interface";

export const getCargoTypeById = async (id: number): Promise<CargoType> => {
  const { data } = await sompoApiWithoutToken.get<CargoType>(`/cargo_types/${id}`);
  return data;
};
