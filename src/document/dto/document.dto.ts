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

export class UpdateDocumentStatusDto {
	@ApiProperty()
	status: 'edit' | 'pass' |'reject' | 'review';
}

export class PublicDocumentDto {
	@ApiProperty()
	ownerId: string;
	@ApiProperty()
	title: string;
	@ApiProperty()
	content: string;
	@ApiProperty()
	public: boolean;
}
