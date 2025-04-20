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

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  HIDE = "HIDE",
}

export const S3_FOLDERS = {
  ASSETS: "assets",
  IMAGES: "images",
} as const;

export type S3FolderType = (typeof S3_FOLDERS)[keyof typeof S3_FOLDERS];