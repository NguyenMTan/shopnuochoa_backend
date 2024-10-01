import { IsNumber, IsString } from 'class-validator';

export class ParamPaginationDto {
  page: number;

  limit: number;

  sort: string;

  keyword: string;
}
