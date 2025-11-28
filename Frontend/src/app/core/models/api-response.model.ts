export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

export interface ErrorResponse {
  message: string;
  errors?: string[];
}
