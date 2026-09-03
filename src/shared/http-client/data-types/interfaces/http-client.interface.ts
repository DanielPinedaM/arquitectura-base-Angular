/**
 * Contrato que define el tipo de dato con el que responden todas las APIs */
export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}
