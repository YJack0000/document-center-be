import { ApiProperty } from "@nestjs/swagger";

export class CreateDocumentDto {
	@ApiProperty()
  ownerId: string;
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