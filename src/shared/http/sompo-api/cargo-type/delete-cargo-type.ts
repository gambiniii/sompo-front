import { sompoApiWithoutToken } from "@/shared/config/api";

export const deleteCargoType = async (id: number): Promise<void> => {
  await sompoApiWithoutToken.delete(`/cargo_types/${id}`);
};
