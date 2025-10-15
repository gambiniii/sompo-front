import { sompoApiWithoutToken } from "@/shared/config/api";
import { CargoType, CargoTypeParams } from "@/shared/interfaces/areas/cargo-type.interface";

export const getCargoTypes = async (params?: CargoTypeParams): Promise<CargoType[]> => {
  const queryParams = new URLSearchParams();

  if (params) {
    if (params.categoria) queryParams.append('categoria', params.categoria);
    if (params.descricao) queryParams.append('descricao', params.descricao);
    if (params.min_risco_roubo !== undefined) queryParams.append('min_risco_roubo', params.min_risco_roubo.toString());
    if (params.max_risco_roubo !== undefined) queryParams.append('max_risco_roubo', params.max_risco_roubo.toString());
    if (params.min_risco_acidente !== undefined) queryParams.append('min_risco_acidente', params.min_risco_acidente.toString());
    if (params.max_risco_acidente !== undefined) queryParams.append('max_risco_acidente', params.max_risco_acidente.toString());
    if (params.impacto_ambiental) queryParams.append('impacto_ambiental', params.impacto_ambiental);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
  }

  const queryString = queryParams.toString();
  const url = `/cargo_types${queryString ? `?${queryString}` : ''}`;

  const { data } = await sompoApiWithoutToken.get<CargoType[]>(url);
  return data;
};
