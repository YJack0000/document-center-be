import { ApiProperty } from '@nestjs/swagger';
import { PaginationReqDto } from 'src/common/pagination.dto';

export class UpdatePublicDocumentStatusDto {
  @ApiProperty()
  isPublic: boolean;
}

export class PublicDocumentQueryDto extends PaginationReqDto {
  @ApiProperty({ required: false })
  search?: string;
}
