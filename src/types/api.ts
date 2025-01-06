// src/types/api.ts
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  success: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

export interface ApiError {
  message: string;
  code?: string;
  status: number;
}

export type ApiRequest<T> = {
  body?: T;
  query?: Record<string, string | string[]>;
  params?: Record<string, string>;
};
