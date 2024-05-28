import { ApiProperty } from '@nestjs/swagger';
import { PaginationReqDto } from 'src/common/pagination.dto';

export class CreateCommentDto {
  @ApiProperty()
  documentId: string;
  @ApiProperty()
  content: string;
}

export class GetCommentDto extends PaginationReqDto {
	@ApiProperty()
	documentId: string;
}
