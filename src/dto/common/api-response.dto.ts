export class ApiResponseDto<T = any> {
  success!: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class PaginationDto {
  page!: number;
  limit!: number;
  total!: number;
  totalPages!: number;
}

export class PaginatedResponseDto<T> {
  data!: T[];
  pagination!: PaginationDto;
}
