import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  documentId: string;
  @ApiProperty()
  content: string;
}

export class GetCommentDto {
	@ApiProperty()
	documentId: string;
}
