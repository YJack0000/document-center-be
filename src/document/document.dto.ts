import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { PaginationReqDto } from 'src/common/pagination.dto';

export class CreateDocumentDto {
  @ApiProperty()
  @IsString()
  @Length(5)
  title: string;
  @ApiProperty()
  @IsString()
  @Length(10)
  content: string;
}

export class UpdateDocumentDto {
  @ApiProperty()
  @IsString()
  @Length(5)
  title: string;
  @ApiProperty()
  @IsString()
  @Length(10)
  content: string;
}

export class UpdateStatusDto {
  @ApiProperty({ enum: ['edit', 'review', 'reject', 'pass'] })
  status: string;
}

export class DocumentQueryDto extends PaginationReqDto {
  @ApiProperty({ required: false })
  search?: string;
}
