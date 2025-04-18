export type TlinkTarget = "_blank" | "_self" | "_parent" | "_top";

export type TPaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ActionResponse = {
  success: boolean;
  data?: any;
  error?: string;
};