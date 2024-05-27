import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
}

export class UpdateDocumentDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
}
