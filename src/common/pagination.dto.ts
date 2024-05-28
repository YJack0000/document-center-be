import { ApiProperty } from '@nestjs/swagger';

export class PaginationReqDto {
  @ApiProperty({ default: 1 })
  page: number = 1;

  @ApiProperty({ default: 10 })
  limit: number = 10;
}

export class PaginationResDto<T> {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  data: T[];
}
