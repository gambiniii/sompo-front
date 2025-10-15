export interface CargoType {
  id: number;
  categoria: string;
  risco_roubo_percentual: number;
  risco_acidente_percentual: number;
  descricao: string;
  exemplos?: string;
  riscos_principais?: string;
  impacto_ambiental?: string;
}

export interface CargoTypeCreate {
  categoria: string;
  risco_roubo_percentual: number;
  risco_acidente_percentual: number;
  descricao: string;
  exemplos?: string;
  riscos_principais?: string;
  impacto_ambiental?: string;
}

export interface CargoTypeUpdate {
  categoria?: string;
  risco_roubo_percentual?: number;
  risco_acidente_percentual?: number;
  descricao?: string;
  exemplos?: string;
  riscos_principais?: string;
  impacto_ambiental?: string;
}

export interface CargoTypeParams {
  categoria?: string;
  descricao?: string;
  min_risco_roubo?: number;
  max_risco_roubo?: number;
  min_risco_acidente?: number;
  max_risco_acidente?: number;
  impacto_ambiental?: string;
  limit?: number;
  offset?: number;
}
